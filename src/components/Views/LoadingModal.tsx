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
      table?: string;
      pkName?: string;
      collectionId?: string;
    };
  };
  navigation: any;
}

const { width, height } = Dimensions.get('window');

function sp(size: number) {
  return PixelRatio.getFontScale() * size;
}

const API_BASE = 'https://uqj2wa6v80.execute-api.us-east-2.amazonaws.com/dev';
const DEFAULT_COLLECTION_ID = 'adamo-prod-collection';
const DEFAULT_TABLE = AsyncStorage.getItem('user');
const DEFAULT_PK_NAME = AsyncStorage.getItem('user');

function stripDataUrlPrefix(b64: string) {
  const idx = b64.indexOf('base64,');
  return idx >= 0 ? b64.slice(idx + 'base64,'.length) : b64;
}

async function postJSON(url: string, payload: any, timeoutMs = 15000) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    const httpStatus = res.status;

    const outer = await res.json().catch(async () => {
      const txt = await res.text();
      try { return JSON.parse(txt); } catch { return { raw: txt }; }
    });

    // Normalize: body may be a JSON string or already an object
    let normalizedBody: any = outer?.body;
    if (typeof normalizedBody === 'string') {
      try { normalizedBody = JSON.parse(normalizedBody); } catch { /* leave as string */ }
    }
    return { httpStatus, outer, body: normalizedBody };
  } finally {
    clearTimeout(t);
  }
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ route, navigation }) => {
  const [apiCallError, setApiCallError] = useState(false);
  const [documentId, setDocumentId] = useState('');

  useEffect(() => {
    const processData = async () => {
      const {
        source,
        base64Data,
        check,
        documentId: docIdParam,
        table,
        pkName,
        collectionId,
      } = route.params;

      try {
        if (!source || source === 'camera') {
          const payload = {
            image: stripDataUrlPrefix(base64Data),
            table: table || DEFAULT_TABLE,
            pkName: pkName || DEFAULT_PK_NAME,
            collectionId: collectionId || DEFAULT_COLLECTION_ID,
          };

          const { httpStatus, body } = await postJSON(`${API_BASE}/compare-face`, payload);

          // body should be something like:
          // { message: 'Success', faces_count: n, matches: [...] }
          const matches = body?.matches;

          if (httpStatus !== 200 || !Array.isArray(matches)) {
            navigation.replace('Unverified', { check });
            return;
          }

          // route based on number of matches (keeping your existing logic)
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
          // (unchanged) fall-back path using your other API
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
  container: {
    flex: 1,
    backgroundColor: '#fff',
    width: '100%',
    height: '100%',
  },
  videoWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    width: '100%',
    height: '100%',
  },
  videoContainer: {
    width: width * 0.6,
    height: height * 0.6,
    alignSelf: 'center',
  },
  inputContainer: {
    marginTop: 20,
    width: '50%',
  },
  input: {
    display: 'flex',
    alignContent: 'center',
    justifyContent: 'center',
    paddingHorizontal: '10%',
    paddingVertical: '3%',
    borderWidth: 2,
    borderColor: '#FFF',
    borderRadius: 35,
    shadowColor: '#000',
    fontWeight: '500',
    fontSize: sp(30),
  },
});

export default LoadingScreen;