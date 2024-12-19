import React, { useState, useRef } from 'react';
import RNFS from 'react-native-fs';
import {
  SafeAreaView,
  View,
  TouchableHighlight,
  StyleSheet,
  Image,
  Modal,
  Text,
  Dimensions,
  Platform,
  PixelRatio,
} from 'react-native';
import { RNCamera, TakePictureResponse } from 'react-native-camera';
import LoadingModal from './LoadingModal';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface CameraScreenProps {
  route: {
    params: {
      check: string;
    };
  };
  navigation: {
    navigate: (screen: string, params?: { payload?: any; check?: string }) => void;
  };
}

const CameraScreen: React.FC<CameraScreenProps> = ({ route, navigation }) => {
  const check = route.params.check;
  const cameraRef = useRef<RNCamera>(null);
  const [cameraView, setCameraView] = useState<boolean>(true);
  const [capturedImage, setCapturedImage] = useState<string>('');
  const [showLoading, setShowLoading] = useState<boolean>(false);
  let payload: any = null;

  const takePicture = async () => {
    if (cameraRef.current) {
      const options = { quality: 0.5, base64: true };
      try {
        const data: TakePictureResponse = await cameraRef.current.takePictureAsync(options);
        setCapturedImage(data.uri);
        const base64String = data.base64 ?? '';

        setTimeout(() => {
          setCameraView(false);
          setShowLoading(true);
          gotoAPIResponse(base64String);
        }, 1000);
      } catch (error) {
        console.log('Error taking picture: ', error);
      }
    }
  };

  const verifyResponse = (res: any) => {
    if (res["message"] === 'Not Found') {
      navigation.navigate('Unverified');
    } else if (res["message"] === 'Usuario encontrado!') {
      payload = res;
      navigation.navigate('Verified', { payload, check });
    } else {
      console.log(res["message"]);
    }
  };

  const gotoAPIResponse = async (base64Data: string) => {
    console.log(base64Data);

    try {
      const response = await fetch('https://n07j2t4w3c.execute-api.us-east-2.amazonaws.com/Prod/compare-face', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "image": base64Data,
        }),
      });
      const data = await response.text();
      setShowLoading(false);
      console.log(data);
      const res = JSON.parse(data);
      verifyResponse(res);
    } catch (error) {
      console.log('API call error: ', error);
    }
  };

  return (
    <View style={styles.container}>
      {cameraView ? (
        <SafeAreaView style={styles.container}>
          <RNCamera
            ref={cameraRef}
            style={styles.camera}
            type={RNCamera.Constants.Type.front}
            captureAudio={false}
          >
            <View style={styles.top}>
              <Image
                source={require('../../assets/img/topC.png')}
                style={styles.topC}
              />
              <Image
                source={require('../../assets/img/ic_white_c.png')}
                style={styles.logoAID}
              />
            </View>

            <View style={styles.gifC}>
              <Image
                style={styles.gif}
                source={require('../../assets/gif/faceframe.gif')}
              />
            </View>

            <View style={styles.bottom}>
              <Image
                source={require('../../assets/img/bottomC.png')}
                style={styles.bottomC}
              />

              <TouchableHighlight
                style={styles.touchableCamera}
                onPress={takePicture}
              >
                <View style={styles.cameraBtn}>
                  <Image
                    source={require('../../assets/img/camera.png')}
                    style={styles.cameraAID}
                  />
                  <Text style={{ color: 'white', fontSize: 20, fontWeight: '600' }}>Press here</Text>
                </View>
              </TouchableHighlight>
            </View>
          </RNCamera>
        </SafeAreaView>
      ) : (
        <View>
          {showLoading && (
            <Modal animationType="slide" style={styles.modalLoading}>
              <LoadingModal />
            </Modal>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  top: {
    top: 0,
    height: '25%',
    width: '100%',
  },
  topC: {
    position: 'absolute',
    top: 0,
    resizeMode: 'contain',
    zIndex: -1,
  },
  logoAID: {
    position: 'absolute',
    maxWidth: '40%',
    maxHeight: '40%',
    marginTop: '5%',
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  gifC: {
    alignSelf: 'center',
    width: '70%',
    height: '50%',
  },
  gif: {
    alignSelf: 'center',
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
  },
  bottom: {
    bottom: 0,
    height: '25%',
    width: '100%',
  },
  bottomC: {
    position: 'absolute',
    bottom: 0,
    resizeMode: 'contain',
    zIndex: -2,
  },
  touchableCamera: {
    position: 'relative',
    maxHeight: '30%',
    marginTop: '15%',
  },
  cameraAID: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  cameraBtn: {
    alignItems: 'center',
  },
  button: {
    position: 'absolute',
    bottom: 30,
    borderColor: 'white',
    borderWidth: 5,
    alignSelf: 'center',
    padding: 25,
    borderRadius: 100,
    width: '15%',
    height: '10%',
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  coutdownText: {
    fontSize: 34,
    fontWeight: 'bold',
  },
  modalLoading: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default CameraScreen;
