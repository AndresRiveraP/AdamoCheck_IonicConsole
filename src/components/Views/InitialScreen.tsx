import React, {useCallback, useEffect} from 'react';
import { ImageBackground, View, Image, Text, TouchableOpacity, Platform, PermissionsAndroid, Alert, PixelRatio, BackHandler} from 'react-native';

import { scaleFontSize} from '@/utils/scaleUtils';
import styles from '@/styles/globStyles';

import { NavigationProp, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const sp = (size: number) => {
  return size * PixelRatio.getFontScale();
}

const InitialScreen = ({ navigation }: { navigation: NavigationProp<any> }) => {
  let check: string | null = null;

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        navigation.navigate('InitialScreen');
        return true;
      };
 
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [navigation]),
  );
  
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
    const loadData= async () => {
      const user = await AsyncStorage.getItem("user");
      const key = await AsyncStorage.getItem("key");
      console.log(user)
      console.log(key)
    }

    loadData();

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
      source={require('../../assets/img/backgorundNew.png')}
      style={styles.background}>


      <View style={styles.container}>
        <View style={{display:'flex', flexDirection: 'row', alignSelf: 'center'}}>
          <Image
            source={require('../../assets/img/logo.png')}
            style={styles.logoA}
          />
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text
            style={{
              fontFamily: 'Guitar-Acoustic',
              fontSize: scaleFontSize(45),
              color: '#fff',
            }}>
            adamo
          </Text>
          <Text
            style={{
              fontFamily: 'Guitar-Acoustic',
              fontSize: scaleFontSize(45),
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
            source={require('../../assets/img/checkin.png')}
            style={styles.profi}
          />
          <Text style={styles.label}>CHECK IN</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.boton2]}
          onPress={() => {
            check = 'out';
            handleCamera();
          }}>
          <Image
            source={require('../../assets/img/checkout.png')}
            style={styles.profi2}
          />
          <Text style={styles.label2}>CHECK OUT</Text>
        </TouchableOpacity>
        <Image
          source={require('../../assets/img/adamoByHBPO.png')}
          style={styles.logoFooter}
        />
      </View>
    </ImageBackground>
  );
};

export default InitialScreen;
