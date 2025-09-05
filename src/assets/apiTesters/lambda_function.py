import boto3
import json
import base64
import logging
from PIL import Image
import io
    
rekognition_client = boto3.client('rekognition')
dynamodb = boto3.resource('dynamodb')
s3_client = boto3.client('s3', region_name='us-east-2')

collection_id = 'adamo-prod-collection'
table = dynamodb.Table('FacesData')
bucket_name = 'adamo-faces-v2'

def lambda_handler(event, context):
    try:
        print("EVENT:", json.dumps(event))

        # Ejecutar compare_face directamente sin depender de httpMethod o path
        return compare_face(event)

    except Exception as e:
        print("ERROR:", str(e))
        return create_response(500, {
            "message": "Internal server error",
            "error": str(e)
        })

def add_face(event):
    print("Adding new face...")
    data = json.loads(event['body'])
    image_b64 = data['image']
    image_bytes = base64.b64decode(image_b64)

    response = rekognition_client.index_faces(
        CollectionId=collection_id,
        Image={'Bytes': image_bytes}
    )

    if response['FaceRecords']:
        face_id = response['FaceRecords'][0]['Face']['FaceId']
        nombre = data.get('name')
        apellido = data.get('lastname')
        dni = data.get('id')

        image_key = f'faces/{face_id}/{dni}.jpg'
        s3_client.put_object(Bucket=bucket_name, Key=image_key, Body=image_bytes, ContentType='image/jpeg')

        table.put_item(
            Item={
                'FaceId': face_id,
                'name': nombre,
                'lastname': apellido,
                'id': dni,
                'ImageS3Key': image_key
            }
        )
    else:
        return create_response(400, 'No se pudo indexar la cara')

    return create_response(200, {'message': 'Usuario guardado', 'FaceId': response['FaceRecords'][0]['Face']['FaceId']})

def compare_face(event):
    print("Comparing face...")
    try:
        image_b64 = event['image']
        image_bytes = base64.b64decode(image_b64)
    except Exception as e:
        return create_response(400, {'message': f'Error procesando la imagen: {str(e)}'})

    threshold = 72

    detect_response = rekognition_client.detect_faces(Image={'Bytes': image_bytes}, Attributes=['DEFAULT'])
    face_details = detect_response.get('FaceDetails', [])

    detected_faces_count = len(face_details)

    if detected_faces_count == 0:
        return create_response(400, {'message': 'No se detectaron caras en la imagen', 'detected_faces_count': 0})

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

        if cropped_image.mode == 'RGBA':
            cropped_image = cropped_image.convert('RGB')
        
        buffer = io.BytesIO()
        cropped_image.save(buffer, format="JPEG")
        cropped_bytes = buffer.getvalue()

        # Check if the cropped image contains any face
        detect_cropped = rekognition_client.detect_faces(Image={'Bytes': cropped_bytes}, Attributes=['DEFAULT'])
        if len(detect_cropped.get('FaceDetails', [])) == 0:
            print("Warning: Cropped face image does not contain a detectable face. Skipping search_faces_by_image.")
            continue  # skip this face

        # If detected, then search
        search_response = rekognition_client.search_faces_by_image(
            CollectionId=collection_id,
            Image={'Bytes': cropped_bytes},
            MaxFaces=3,
            FaceMatchThreshold=threshold
        )

        for match in search_response.get('FaceMatches', []):
            face_id = match['Face']['FaceId']
            similarity = match['Similarity']

            db_resp = table.get_item(Key={'FaceId': face_id})
            item = db_resp.get('Item', {})

            if item:
                matched_users.append({
                    'FaceId': face_id,
                    'name': item.get('name'),
                    'lastname': item.get('lastname'),
                    'id': item.get('id'),
                    'similarity': similarity,
                    'profile': generate_presigned_url(item.get('ImageS3Key'))
                })

    if not matched_users:
        return create_response(404, {
            'message': 'No se encontraron coincidencias',
            'detected_faces_count': detected_faces_count,
            'matches': []
        })

    #print("Matched users:", matched_users)
    return create_response(200, {
        'message': 'Success',
        'faces_count': detected_faces_count,
        'matches': matched_users
    })

def list_faces(event):
    rekognition_response = rekognition_client.list_faces(CollectionId=collection_id)
    for face in rekognition_response['Faces']:
        print(face['FaceId'])
        
    faces_info = []

    for face in rekognition_response['Faces']:
        face_id = face['FaceId']
        
        dynamodb_response = table.get_item(Key={'FaceId': face_id})
        item = dynamodb_response.get('Item', {})

        faces_info.append(item)

    return create_response(200, {'Faces': faces_info})

def delete_face(event):
    data = json.loads(event['body'])
    face_id = data['faceId']

    # Verificar si el FaceId existe en DynamoDB
    dynamodb_response = table.get_item(
        Key={'FaceId': face_id}
    )
    if 'Item' not in dynamodb_response:
        return create_response(404, { 'message': 'FaceId no encontrado' })

    # Eliminar la cara de Rekognition
    rekognition_client.delete_faces(
        CollectionId=collection_id,
        FaceIds=[face_id]
    )

    # Eliminar el registro de DynamoDB
    table.delete_item(
        Key={'FaceId': face_id}
    )

    combined_response = {
        'message': "Usuario borrado"
    }

    return create_response(200, combined_response)

def generate_presigned_url(image_key):
    try:
        # Generar la URL prefirmada
        url = s3_client.generate_presigned_url('get_object', Params={'Bucket': bucket_name, 'Key': image_key}, ExpiresIn=900)  # 15 minutos
        return url
    except Exception as e:
        return str(e)

def create_response(status_code, body_dict):
    return {
        'statusCode': status_code,
        'body': body_dict,  # sin json.dumps
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
    }
