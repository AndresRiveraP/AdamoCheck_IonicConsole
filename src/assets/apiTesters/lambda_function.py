import boto3
import json
import base64
import logging
import re
from PIL import Image
import io
from boto3.dynamodb.conditions import Attr

rekognition_client = boto3.client('rekognition')
dynamodb = boto3.resource('dynamodb')
s3_client = boto3.client('s3', region_name='us-east-2')

collection_id = 'adamo-prod-collection'
# Keeping a default for backwards compatibility; you can ignore it if you always pass tables in the event

DEFAULT_TABLE = 'FacesData'
bucket_name = 'adamo-faces-v2'


SAFE_TABLE_RE = re.compile(r'^[A-Za-z0-9._-]{1,255}$')

def _ensure_list_of_tables(event) -> list:
    """Accepts 'table' (str) or 'tables' (list[str]) in the event. Returns a de-duplicated list."""
    tables = []
    if isinstance(event, dict):
        if 'tables' in event and isinstance(event['tables'], list):
            tables.extend([t for t in event['tables'] if isinstance(t, str)])
        if 'table' in event and isinstance(event['table'], str):
            tables.append(event['table'])

    if not tables:
        tables = [DEFAULT_TABLE]

    # sanitize
    clean = []
    for t in tables:
        if not SAFE_TABLE_RE.match(t):
            raise ValueError(f"Invalid table name: {t}")
        clean.append(t)
    # de-dupe, preserve order
    seen = set()
    ordered = []
    for t in clean:
        if t not in seen:
            seen.add(t)
            ordered.append(t)
    return ordered

def _dynamo_table(name: str):
    return dynamodb.Table(name)

def _get_item_by_faceid_any_table(face_id: str, table_names: list):
    """
    Try to find a record with this FaceId in the given tables.
    We use a Scan + FilterExpression so it works even if FaceId is not the PK.
    Returns (item, table_name) or (None, None).
    """
    for tname in table_names:
        table = _dynamo_table(tname)
        scan_kwargs = {
            "FilterExpression": Attr('FaceId').eq(face_id)
        }
        last_evaluated_key = None
        while True:
            if last_evaluated_key:
                scan_kwargs['ExclusiveStartKey'] = last_evaluated_key
            resp = table.scan(**scan_kwargs)
            items = resp.get('Items', [])
            if items:
                # if multiple, take the first; FaceId should be unique across your collection
                item = items[0]
                item['_source_table'] = tname
                return item, tname
            last_evaluated_key = resp.get('LastEvaluatedKey')
            if not last_evaluated_key:
                break
    return None, None

def generate_presigned_url(image_key):
    try:
        return s3_client.generate_presigned_url(
            'get_object',
            Params={'Bucket': bucket_name, 'Key': image_key},
            ExpiresIn=900
        )
    except Exception as e:
        return str(e)

def create_response(status_code, body_dict):
    return {
        'statusCode': status_code,
        'body': body_dict,  # leave as dict, like your original
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
    }

# ---------- handlers ----------

def lambda_handler(event, context):
    try:
        print("EVENT:", json.dumps(event))

        # Choose the operation by hinting keys, but keep your previous default to compare_face
        op = event.get('op') or event.get('operation')  # optional
        if op == 'list_faces_multi':
            return list_faces_multi(event)
        elif op == 'list_faces':  # legacy single-table list
            return list_faces(event)
        elif op == 'add_face':
            return add_face(event)  # unchanged behavior; see note below
        elif op == 'delete_face':
            return delete_face(event)
        else:
            # default behavior: compare_face
            return compare_face(event)

    except Exception as e:
        print("ERROR:", str(e))
        return create_response(500, {
            "message": "Internal server error",
            "error": str(e)
        })

def add_face(event):
    """
    NOTE: Kept essentially the same as your original.
    If you want to write into a *specific* table, pass event['table'] = '<table_name>'
    and ensure that table's key schema accepts your item. If the table requires a
    different partition key (e.g., a constant or group key), add it to the Item here.
    """
    print("Adding new face...")
    data = json.loads(event['body'])
    image_b64 = data['image']
    image_bytes = base64.b64decode(image_b64)

    response = rekognition_client.index_faces(
        CollectionId=collection_id,
        Image={'Bytes': image_bytes}
    )

    if not response['FaceRecords']:
        return create_response(400, 'No se pudo indexar la cara')

    face_id = response['FaceRecords'][0]['Face']['FaceId']
    nombre = data.get('name')
    apellido = data.get('lastname')
    dni = data.get('id')

    image_key = f'faces/{face_id}/{dni}.jpg'
    s3_client.put_object(Bucket=bucket_name, Key=image_key, Body=image_bytes, ContentType='image/jpeg')

    # choose table (defaults to DEFAULT_TABLE)
    table_name = (json.loads(event['body']).get('table') 
                  if 'body' in event else None) or DEFAULT_TABLE
    if not SAFE_TABLE_RE.match(table_name):
        return create_response(400, {'message': f'Invalid table name: {table_name}'})
    table = _dynamo_table(table_name)

    item = {
        'FaceId': face_id,
        'name': nombre,
        'lastname': apellido,
        'id': dni,
        'ImageS3Key': image_key
    }
    # If your target tables require a partition key named after the table (as in your screenshot),
    # add it here; for example:
    # item[table_name] = table_name

    table.put_item(Item=item)

    return create_response(200, {'message': 'Usuario guardado', 'FaceId': face_id, 'table': table_name})

def compare_face(event):
    print("Comparing face...")
    try:
        image_b64 = event['image']
        tables = _ensure_list_of_tables(event)  # NEW: multi-table support

        print(f"Tables to search: {tables}")
        print(f"Image base64 length: {len(image_b64) if image_b64 else 0}")
        if image_b64.startswith('data:image'):
            image_b64 = image_b64.split(',')[1]
            print("Removed data URL prefix from image")

        image_bytes = base64.b64decode(image_b64)

        # Validate via PIL and normalize to JPEG bytes if needed
        try:
            pil_image = Image.open(io.BytesIO(image_bytes))
            if pil_image.mode != 'RGB':
                pil_image = pil_image.convert('RGB')
                buf = io.BytesIO()
                pil_image.save(buf, format='JPEG', quality=95)
                image_bytes = buf.getvalue()
        except Exception as pil_error:
            return create_response(400, {'message': f'Error validating image: {str(pil_error)}'})

    except Exception as e:
        return create_response(400, {'message': f'Error procesando la imagen: {str(e)}'})

    threshold = 75

    # detect faces first
    try:
        detect_response = rekognition_client.detect_faces(
            Image={'Bytes': image_bytes},
            Attributes=['DEFAULT']
        )
    except Exception as rekognition_error:
        return create_response(400, {'message': f'Rekognition error: {str(rekognition_error)}'})

    face_details = detect_response.get('FaceDetails', [])
    if not face_details:
        return create_response(400, {
            'message': 'No se detectaron caras en la imagen',
            'detected_faces_count': 0
        })

    image = Image.open(io.BytesIO(image_bytes))
    width, height = image.size
    matched_users = []

    for face in face_details:
        box = face['BoundingBox']
        left = int(box['Left'] * width)
        top = int(box['Top'] * height)
        right = int((box['Left'] + box['Width']) * width)
        bottom = int((box['Top'] + box['Height']) * height)
        cropped_image = image.crop((left, top, right, bottom))

        buf = io.BytesIO()
        cropped_image.save(buf, format="JPEG")
        cropped_bytes = buf.getvalue()

        # Check cropped
        detect_cropped = rekognition_client.detect_faces(Image={'Bytes': cropped_bytes}, Attributes=['DEFAULT'])
        if not detect_cropped.get('FaceDetails'):
            continue

        # Search in collection
        search_response = rekognition_client.search_faces_by_image(
            CollectionId=collection_id,
            Image={'Bytes': cropped_bytes},
            MaxFaces=10,
            FaceMatchThreshold=threshold
        )

        for match in search_response.get('FaceMatches', []):
            face_id = match['Face']['FaceId']
            similarity = match['Similarity']

            # NEW: try to find this FaceId in any of the provided tables
            item, found_in = _get_item_by_faceid_any_table(face_id, tables)
            if not item:
                continue

            matched_users.append({
                'FaceId': face_id,
                'name': item.get('name'),
                'lastname': item.get('lastname'),
                'id': item.get('id'),
                'similarity': similarity,
                'profile': generate_presigned_url(item.get('ImageS3Key')),
                'table': found_in
            })

    if not matched_users:
        return create_response(404, {
            'message': 'No se encontraron coincidencias',
            'detected_faces_count': len(face_details),
            'matches': []
        })

    return create_response(200, {
        'message': 'Success',
        'faces_count': len(face_details),
        'matches': matched_users
    })

def list_faces(event):
    """
    Legacy single-table list based on your original signature.
    """
    table_name = event.get('table') or DEFAULT_TABLE
    if not SAFE_TABLE_RE.match(table_name):
        return create_response(400, {'message': f'Invalid table name: {table_name}'})
    table = _dynamo_table(table_name)

    # Straight scan (lists all people in the table)
    faces_info = []
    last_evaluated_key = None
    while True:
        kwargs = {}
        if last_evaluated_key:
            kwargs['ExclusiveStartKey'] = last_evaluated_key
        resp = table.scan(**kwargs)
        faces_info.extend(resp.get('Items', []))
        last_evaluated_key = resp.get('LastEvaluatedKey')
        if not last_evaluated_key:
            break

    return create_response(200, {'table': table_name, 'Faces': faces_info})

def list_faces_multi(event):
    """
    NEW: list across multiple tables at once.
    Request example:
      { "op": "list_faces_multi", "tables": ["cmgroupoko", "another_table"] }
    """
    tables = _ensure_list_of_tables(event)
    all_faces = []

    for tname in tables:
        table = _dynamo_table(tname)
        last_evaluated_key = None
        while True:
            kwargs = {}
            if last_evaluated_key:
                kwargs['ExclusiveStartKey'] = last_evaluated_key
            resp = table.scan(**kwargs)
            items = resp.get('Items', [])
            for it in items:
                it['table'] = tname
            all_faces.extend(items)
            last_evaluated_key = resp.get('LastEvaluatedKey')
            if not last_evaluated_key:
                break

    return create_response(200, {
        'message': 'Success',
        'tables': tables,
        'count': len(all_faces),
        'Faces': all_faces
    })

def delete_face(event):
    """
    Unchanged flow, but you can optionally pass 'table' to select which table to delete from.
    If omitted, uses DEFAULT_TABLE.
    """
    data = json.loads(event['body'])
    face_id = data['faceId']
    table_name = data.get('table') or DEFAULT_TABLE
    if not SAFE_TABLE_RE.match(table_name):
        return create_response(400, {'message': f'Invalid table name: {table_name}'})
    table = _dynamo_table(table_name)

    # Try to find the record by FaceId (scan) to get the full key
    item, _ = _get_item_by_faceid_any_table(face_id, [table_name])
    if not item:
        return create_response(404, {'message': 'FaceId no encontrado'})

    # If your table uses a custom PK (not FaceId), you need to pass the correct key here.
    # Assuming FaceId is the key in your target table; if not, adjust accordingly.
    table.delete_item(Key={'FaceId': face_id})

    # Optionally also delete from Rekognition
    rekognition_client.delete_faces(CollectionId=collection_id, FaceIds=[face_id])

    return create_response(200, {'message': "Usuario borrado", 'table': table_name})
