import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { ImageBackground, StyleSheet, View, Image, Text, SafeAreaView, ActivityIndicator, PixelRatio} from 'react-native';
import { scaleFontSize, scaleHeightSize, scaleWidthSize } from '@/utils/scaleUtils';

function sp(size) {
  return PixelRatio.getFontScale() * size;
}

const Verified = ({route, navigation}) => {
  const {payload, check} = route.params;
  console.log(payload);

  var name = payload.name;
  var lastName = payload.lastname;
  var id = payload.id;

  var objectID = null;
  var currentDate = new Date();
  var formattedDate = moment(currentDate).format('DD-MM-20YY');
  var formattedTime = moment(currentDate).format('h:mm A');

  /*useEffect(() => {
    if (!loading && !error) {
      if (check == 'in') {
        addingLog();
      } else {
        objectID = data.checkLog;
        console.log(objectID);
        updatingLog();
      }
    }
  }, []);*/


  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('@/assets/img/backGround.png')}
        style={styles.background}>
        <View style={styles.header}>
          <Text style={styles.title}>adamo</Text>
          <Text style={[styles.title, {opacity: 0.4}]}>check</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.welcome}>
            {check === 'in' ? 'Welcome' : 'Farewell'}
          </Text>
          <Text style={styles.name}>
            {name}
            {'\n'}
            {lastName + '!'}
          </Text>
          <View style={styles.identi}>
            <Image
              source={require('@/assets/img/logoCheck.png')}
              style={styles.ico}
            />
            <Text style={styles.idS}>{id}</Text>
          </View>
        </View>
        <View style={styles.footer}>
          <Image
            source={require('@/assets/img/check.png')}
            style={styles.check}
          />
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    resizeMode: 'contain',
  },

  // BLOQUE SUPERIOR
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    height: scaleHeightSize(80),
    marginLeft: '10%',
    marginTop: '10%',
  },
  title: {
    fontFamily: 'Guitar-Acoustic',
    fontSize: scaleFontSize(30),
    color: '#fff',
  },

  // BLOQUE CENTRAL
  textContainer:{
    alignSelf: 'center'
  },
  content: {
    marginLeft: '10%',
  },
  welcome: {
    color: '#FFF',
    fontSize: scaleFontSize(40),
  },
  name: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: scaleFontSize(40),
  },
  identi: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ico: {
    width: scaleWidthSize(20),
    height: scaleWidthSize(20),
    resizeMode: 'contain',
  },
  idS: {
    color: '#FFF',
    fontSize: scaleFontSize(15),
    marginLeft: 10,
  },

  footer: {
    marginBottom: 10,
  },
  check: {
    width: '8%',
    resizeMode: 'contain',
  },
});

export default Verified;