import React, {useEffect} from 'react';
import { ImageBackground, View, Image, Text, TouchableOpacity, Platform, PermissionsAndroid, Alert, PixelRatio} from 'react-native';

import { scaleFontSize} from '@/utils/scaleUtils';
import styles from '@/styles/globStyles';

import { NavigationProp } from '@react-navigation/native';

const sp = (size: number) => {
  return size * PixelRatio.getFontScale();
}

const InitialScreen = ({ navigation }: { navigation: NavigationProp<any> }) => {
  let check: string | null = null;

  const handleCamera = () => {
    navigation.navigate('CameraScreen', { check });
  };

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'This app needs access to your camera to proceed.',
            buttonPositive: 'OK',
            buttonNegative: 'Cancel',
          }
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('Permission Denied', 'Camera access is required to proceed.');
          return false;
        }
        return true;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true
  };

  useEffect(() => {
    const checkPermission = async () => {
      const hasPermission = await requestCameraPermission();
      if (!hasPermission) {
        Alert.alert('Permission Denied', 'Camera access is required to proceed.');
      }
    };
    checkPermission();
  }, []);


  return (
    <ImageBackground
      source={require('../../assets/img/backGround.png')}
      style={styles.background}>


      <View style={styles.container}>
        <View style={{display:'flex', flexDirection: 'row', alignSelf: 'center'}}>
            <Image
            source={require('../../assets/img/logoCheck.png')}
            style={styles.logoA}
          />
          <Text style={{
            fontFamily: 'Guitar-Acoustic',
            textAlign: 'left',
            alignSelf: 'flex-end',
            left: '-25%',
            color: 'white',
            fontSize: sp(50),
            fontWeight: '500',
            transform: [{ rotate: '-30deg' }] 
          }}>
            2.4!
          </Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text
            style={{
              fontFamily: 'Guitar-Acoustic',
              fontSize: scaleFontSize(50),
              color: '#fff',
            }}>
            adamo
          </Text>
          <Text
            style={{
              fontFamily: 'Guitar-Acoustic',
              fontSize: scaleFontSize(50),
              color: '#fff',
              opacity: 0.4,
            }}>
            check
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.boton]}
          onPress={() => {
            check = 'in';
            handleCamera();
          }}>
          <Image
            source={require('../../assets/img/profi.png')}
            style={styles.profi}
          />
          <Text style={styles.label}>Check In</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.boton2]}
          onPress={() => {
            check = 'out';
            handleCamera();
          }}>
          <Image
            source={require('../../assets/img/profi.png')}
            style={styles.profi}
          />
          <Text style={styles.label}>Check Out</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default InitialScreen;
