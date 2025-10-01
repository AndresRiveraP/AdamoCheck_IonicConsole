import React, { useState, useRef, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  Text,
} from 'react-native';
import { RNCamera, TakePictureResponse } from 'react-native-camera';

import oneFaceData from '../../assets/apiTesters/1face.json'; 
import twoFacesData from '../../assets/apiTesters/2faces.json'; 
import threeFacesData from '../../assets/apiTesters/3faces.json'; 

import oneFaceCMData from '../../assets/apiTesters/1faceCM.json';
import twoFacesCMData from '../../assets/apiTesters/2facesCM.json';
import threeFacesCMData from '../../assets/apiTesters/3facesCM.json';

interface CameraScreenProps {
  route: {
    params: {
      check: string;
    };
  };
  navigation: {
    navigate: (
      screen: string,
      params?: { payload?: any; check?: string; base64Data?: string; source?: string },
    ) => void;
    replace: (
      screen: string,
      params?: { payload?: any; check?: string; base64Data?: string; source?: string },
    ) => void;
  };
}

const CameraScreen: React.FC<CameraScreenProps> = ({ route, navigation }) => {
  const check = route.params.check;
  const cameraRef = useRef<RNCamera>(null);
  const [isTestMode, setIsTestMode] = useState<boolean>(true);
  const hasNavigated = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isTestMode) {
        if (!hasNavigated.current) {
          hasNavigated.current = true;
          navigation.replace('LoadingScreen', { 
            check,
            base64Data: oneFaceData.image,
            source: 'camera'
          });
        }
      } else {
        takePicture();
      }
    }, 1000);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTestMode, navigation, check]);

  const takePicture = async () => {
    if (hasNavigated.current) return;
    if (cameraRef.current) {
      const options = { 
        quality: 0.8,
        base64: true,
        fixOrientation: true,
        forceUpOrientation: true
      };

      try {
        const data: TakePictureResponse = await cameraRef.current.takePictureAsync(options);
        const base64String = data.base64 ?? '';
        hasNavigated.current = true;
        navigation.replace('LoadingScreen', {
          check,
          base64Data: base64String,
          source: 'camera'
        });
      } catch (error) {
        hasNavigated.current = true;
        navigation.replace('Unverified', { check });
      }
    } else {
      hasNavigated.current = true;
      navigation.replace('Unverified', { check });
    }
  };

  const toggleTestMode = () => {
    setIsTestMode(!isTestMode);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.container}>
        <RNCamera
          ref={cameraRef}
          style={styles.camera}
          type={RNCamera.Constants.Type.front}
          captureAudio={false}
          flashMode={RNCamera.Constants.FlashMode.off}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          ratio="16:9"
          defaultVideoQuality={RNCamera.Constants.VideoQuality["1080p"]}
          >
          <View style={styles.top}>
            <Image
              source={require('../../assets/img/topC.png')}
              style={styles.topC}
            />
            <Image
              source={require('../../assets/img/logoCheck.png')}
              style={styles.logoAID}
            />
            <Text style={styles.checkText}>
              {check === 'in' ? 'Check In' : 'Check Out'}
            </Text>
          </View>

          <View style={styles.bottom}>
            <Image
              source={require('../../assets/img/bottomC.png')}
              style={styles.bottomC}
            />

            <TouchableOpacity
              style={styles.touchableCamera}
              onPress={toggleTestMode}>
              <View style={styles.cameraBtn}>
                <Image
                  source={require('./assets/gif/elipsis.gif')}
                  style={styles.cameraAID}
                />
              </View>
            </TouchableOpacity>
          </View>
        </RNCamera>
      </SafeAreaView>
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
    display: 'flex',
    flexDirection: 'column',
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
    position: 'relative',
    width: '50%',
    height: '50%',
    resizeMode: 'contain',
    marginTop: '10%',
    alignSelf: 'center',
  },
  checkText: {
    color: '#fff',
    fontFamily: 'Guitar-Acoustic',
    textAlign: 'center',
    fontSize: 50,
  },
  gif: {
    alignSelf: 'center',
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
  },
  bottom: {
    position: 'absolute',
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
    width: '125%',
    height: '125%',
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
});

export default CameraScreen;