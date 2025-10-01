import React, { useState, useRef, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Image,
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
  const [isTestMode, setIsTestMode] = useState<boolean>(false);
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
              source={require('../../assets/img/backgroudnTop.png')}
              style={styles.topC}
            />
          </View>

          <View style={styles.bottom}>
            <Image
              source={require('../../assets/img/backgroundBottom.png')}
              style={styles.bottomC}
            />
          </View>

          <View style={styles.cameraBtn}>
            <Image
              source={require('../../assets/img/adamocheck.png')}
              style={styles.cameraAID}
            />
          </View>
        </RNCamera>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  camera: { 
    flex: 1,
    position: 'relative' 
  },
  top: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '25%',
  },
  topC: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  bottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '35%',
    width: '100%',
  },
  bottomC: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    zIndex: -2,
  },
  cameraBtn: {
    alignItems: 'center',
    top: '75%'
  },
    cameraAID: {
    width: '50%',
    height: '50%',
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});

export default CameraScreen;