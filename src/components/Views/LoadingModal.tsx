import React, { useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, View, Dimensions, Text, TouchableOpacity, TextInput, PixelRatio, ToastAndroid } from 'react-native';
import Video from 'react-native-video';
import AnimatedScreenWrapper from './AnimatedScreenWrapper';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LoadingScreenProps {
  route: {
    params: {
      base64Data: string;
      check: string;
      source?: string;
      documentId?: string;

      // Optional overrides you can pass when navigating
      table?: string;
      pkName?: string;
      collectionId?: string;
      userId?: string; // if you namespace configs per user
    };
  };
  navigation: any;
}

const { width, height } = Dimensions.get('window');

function sp(size: number) {
  return PixelRatio.getFontScale() * size;
}

/** ========= API config ========= */
const API_BASE = 'https://uqj2wa6v80.execute-api.us-east-2.amazonaws.com/dev';
/** Default fallbacks if user storage is empty/corrupt */
const FALLBACK_COLLECTION_ID = 'adamo-prod-collection';
const FALLBACK_TABLE = 'cmgroupoko';
const FALLBACK_PK_NAME = 'cmgroupoko';
/** ============================= */

/** remove "data:image/...;base64," prefix if present */
function stripDataUrlPrefix(b64: string) {
  const idx = b64.indexOf('base64,');
  return idx >= 0 ? b64.slice(idx + 'base64,'.length) : b64;
}

/** Robust fetch that normalizes API Gateway/Lambda proxy response */
async function postJSON(url: string, payload: any, timeoutMs = 15000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    const httpStatus = res.status;

    // Try parse JSON; fall back to text->JSON
    const outer = await res.json().catch(async () => {
      const txt = await res.text();
      try { return JSON.parse(txt); } catch { return { raw: txt }; }
    });

    // Lambda proxy: outer = { statusCode, body }
    let body = outer?.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch { /* leave as string */ }
    }

    return { httpStatus, outer, body };
  } finally {
    clearTimeout(timeout);
  }
}

/** ===== Multi-tenant config loader =====
 * We’ll try, in order:
 * 1) route.params overrides
 * 2) AsyncStorage 'user' JSON blob:
 *    - direct keys: { table, pkName, collectionId }
 *    - or nested:  { tenant: { table, pkName, collectionId } }
 *    - or per-user namespace: AsyncStorage.getItem(`tenant:${userId}`)
 * 3) fallbacks
 */
type TenantConfig = { table: string; pkName: string; collectionId: string };

async function loadTenantConfig(params: LoadingScreenProps['route']['params']): Promise<TenantConfig> {
  const { table: pTable, pkName: pPk, collectionId: pCol, userId } = params || {};

  // 1) if explicit overrides provided via params, prefer them (when valid)
  if (typeof pTable === 'string' && pTable && typeof pPk === 'string' && pPk) {
    return {
      table: pTable,
      pkName: pPk,
      collectionId: (typeof pCol === 'string' && pCol) ? pCol : FALLBACK_COLLECTION_ID,
    };
  }

  // 2a) try namespaced tenant config first if userId provided
  if (userId) {
    try {
      const raw = await AsyncStorage.getItem(`tenant:${userId}`);
      if (raw) {
        const obj = JSON.parse(raw);
        const table = typeof obj?.table === 'string' && obj.table ? obj.table : undefined;
        const pkName = typeof obj?.pkName === 'string' && obj.pkName ? obj.pkName : undefined;
        const collectionId = typeof obj?.collectionId === 'string' && obj.collectionId ? obj.collectionId : undefined;
        if (table && pkName) {
          return {
            table,
            pkName,
            collectionId: collectionId || FALLBACK_COLLECTION_ID,
          };
        }
      }
    } catch {/* continue */}
  }

  // 2b) fall back to generic 'user' blob
  try {
    const raw = await AsyncStorage.getItem('user'); // YOUR app decides what this contains
    if (raw) {
      const obj = JSON.parse(raw);

      // Accept several shapes:
      // A) flat
      let table = typeof obj?.table === 'string' && obj.table ? obj.table : undefined;
      let pkName = typeof obj?.pkName === 'string' && obj.pkName ? obj.pkName : undefined;
      let collectionId = typeof obj?.collectionId === 'string' && obj.collectionId ? obj.collectionId : undefined;

      // B) nested under tenant/org/customer, e.g. obj.tenant.{table,pkName,collectionId}
      if (!table || !pkName) {
        const t = obj?.tenant || obj?.org || obj?.customer || obj?.company;
        if (t && typeof t === 'object') {
          table = typeof t.table === 'string' && t.table ? t.table : table;
          pkName = typeof t.pkName === 'string' && t.pkName ? t.pkName : pkName;
          collectionId = typeof t.collectionId === 'string' && t.collectionId ? t.collectionId : collectionId;
        }
      }

      if (table && pkName) {
        return {
          table,
          pkName,
          collectionId: collectionId || FALLBACK_COLLECTION_ID,
        };
      }
    }
  } catch {/* continue */}

  // 3) final fallback
  return {
    table: FALLBACK_TABLE,
    pkName: FALLBACK_PK_NAME,
    collectionId: FALLBACK_COLLECTION_ID,
  };
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ route, navigation }) => {
  const [apiCallError, setApiCallError] = useState(false);
  const [documentId, setDocumentId] = useState('');

  useEffect(() => {
    const processData = async () => {
      const { source, base64Data, check, documentId: docIdParam } = route.params;

      try {
        if (!source || source === 'camera') {
          // 🔑 Load tenant-specific config (strings only)
          const cfg = await loadTenantConfig(route.params);

          // Build payload expected by your Lambda
          const payload = {
            image: stripDataUrlPrefix(base64Data),
            table: cfg.table,
            pkName: cfg.pkName,
            collectionId: cfg.collectionId,
          };

          const { httpStatus, body } = await postJSON(`${API_BASE}/compare-face`, payload);
          const matches = body?.matches;

          if (httpStatus !== 200 || !Array.isArray(matches)) {
            navigation.replace('Unverified', { check });
            return;
          }

          switch (matches.length) {
            case 0:
              navigation.replace('Unverified', { check });
              break;
            case 1:
              navigation.replace('Verified', { payload: matches, check });
              break;
            case 2:
              navigation.replace('Verified2', { payload: matches, check });
              break;
            case 3:
              navigation.replace('Verified3', { payload: matches, check });
              break;
            default:
              navigation.replace('Verified', { payload: matches, check });
              break;
          }
        } else if (source === 'unverified' && docIdParam) {
          // your existing unverified flow
          const response = await fetch('https://adamocheckback-ult.up.railway.app/api/logs/unverified', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ identification: docIdParam }),
          });

          const result = await response.json();

          if (response.ok) {
            let payload;
            if (Array.isArray(result) && result[0]?.employee) {
              payload = {
                id: result[0].employee.idNumber,
                name: result[0].employee.name,
                lastname: result[0].employee.lastname,
              };
            } else if (result.idNumber) {
              payload = {
                id: result.idNumber,
                name: result.name,
                lastname: result.lastname,
              };
            } else {
              navigation.replace('Unverified', { check });
              return;
            }
            navigation.replace('Verified', { payload: [payload], check });
          } else {
            console.error('Error fetching employee:', result?.message);
            navigation.replace('Unverified', { check });
          }
        }
      } catch (error) {
        console.log('API call error: ', error);
        setApiCallError(true);
      }
    };

    processData();
  }, [route.params, navigation]);

  return (
    <AnimatedScreenWrapper>
      <SafeAreaView style={styles.container}>
        <View style={styles.videoWrapper}>
          <Video
            source={require('./assets/gif/eye.mp4')}
            style={styles.videoContainer}
            resizeMode="contain"
            repeat
            paused={false}
            disableFocus
          />
        </View>

        {apiCallError && (
          <View style={{ top: '-10%', alignItems: 'center' }}>
            <Text style={{ fontSize: sp(35), fontWeight: '500', color: 'red', textAlign: 'center' }}>
              There seems to be a latency failure.{'\n'}Please retry or type your ID.
            </Text>

            <View>
              <TouchableOpacity
                style={{ marginTop: 20, padding: 10, backgroundColor: '#000', borderRadius: 5 }}
                onPress={() => navigation.navigate('InitialScreen')}
              >
                <Text style={{ fontSize: sp(25), fontWeight: '400', color: 'white', textAlign: 'center' }}>
                  Retry
                </Text>
              </TouchableOpacity>

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Your ID Here"
                  placeholderTextColor="#d1d1d1"
                  keyboardType="numeric"
                  maxLength={15}
                  textAlign="center"
                  value={documentId}
                  onChangeText={setDocumentId}
                />
              </View>

              <TouchableOpacity
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#2bbfed',
                  borderRadius: 10,
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                }}
                onPress={() => [
                  ToastAndroid.show('Your ID is stored for today', ToastAndroid.SHORT),
                  navigation.navigate('InitialScreen'),
                ]}
              >
                <Text style={{ fontSize: sp(25), color: '#000', alignSelf: 'center' }}>Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </SafeAreaView>
    </AnimatedScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', width: '100%', height: '100%' },
  videoWrapper: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF', width: '100%', height: '100%' },
  videoContainer: { width: width * 0.6, height: height * 0.6, alignSelf: 'center' },
  inputContainer: { marginTop: 20, width: '50%' },
  input: {
    display: 'flex',
    alignContent: 'center',
    justifyContent: 'center',
    paddingHorizontal: '10%',
    paddingVertical: '3%',
    borderWidth: 2, borderColor: '#FFF', borderRadius: 35,
    shadowColor: '#000', fontWeight: '500', fontSize: sp(30),
  },
});

export default LoadingScreen;