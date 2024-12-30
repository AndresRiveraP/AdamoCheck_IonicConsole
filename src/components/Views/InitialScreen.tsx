import React, {useState} from 'react';
import { ImageBackground, View, Image, Text, TouchableOpacity, StyleSheet} from 'react-native';

import { scaleFontSize} from '@/utils/scaleUtils';
import styles from '@/styles/globStyles';

import { NavigationProp } from '@react-navigation/native';


const InitialScreen = ({ navigation }: { navigation: NavigationProp<any> }) => {
  let check: string | null = null;

  const handleCamera = () => {
    navigation.navigate('CameraScreen', { check });
  };

  return (
    <ImageBackground
      source={require('../../assets/img/backGround.png')}
      style={styles.background}>
      <TouchableOpacity onPress={() => navigation.navigate('AdminLog')} style={styles.botonAdmin}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image
            source={require('../../assets/img/profi.png')}
            style={[styles.profi2]}
          />
          <Text style={styles.label2}>
            Admin
            <Text style={{fontWeight: 'normal', color: '#fff'}}> Log In</Text>
          </Text>
        </View>
      </TouchableOpacity>

      <View style={styles.container}>
        <Image
          source={require('../../assets/img/logoCheck.png')}
          style={styles.logoA}
        />
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
