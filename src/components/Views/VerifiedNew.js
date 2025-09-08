import React, {useEffect, useState} from 'react';
import moment from 'moment';
import {
  ImageBackground,
  StyleSheet,
  View,
  Image,
  Text,
  SafeAreaView,
  PixelRatio,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import {
  scaleFontSize,
  scaleHeightSize,
  scaleWidthSize,
} from '@/utils/scaleUtils';
import AnimatedScreenWrapper from './AnimatedScreenWrapper';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const VerifiedNew = ({route, navigation}) => {
  var name = 'andres';
  var lastName = 'rivera piedrahita';
  var id = '1089933857';

  var currentDate = new Date();
  var formattedDate = moment(currentDate).format('DD-MM-20YY');
  var formattedTime = moment(currentDate).format('h:mm A');

  var check = 'in';
  var result = {
    statusCode: 200,
    message: 'You are already checked in',
    role: 'Software Developer',
    name: name,
    lastName: lastName,
    identification: id,
    checkin: formattedTime,
    checkout: null,
    checkType: check,
  };
  return (
    <AnimatedScreenWrapper style={{flex: 1}}>
      <ImageBackground
        source={require('../../assets/img/backgroundStaff.png')}
        style={styles.background}>
        <View style={[styles.container]}>
          {result.statusCode !== 200 ? (
            <></>
          ) : (
            <View>
              <View style={[{display: 'flex', alignItems: 'center', marginTop: '25%'}]}>
                <Text style={styles.title}>
                  {check === 'in' ? 'Welcome!' : 'Farewell!'}
                </Text>
                <Text style={styles.subTitle}>
                  {check === 'in'
                    ? `You're securely signed in`
                    : `You're securely signed out`}
                </Text>
              </View>
              <View style={styles.containerContent}>
                <View style={styles.containerTime}>
                  {check === 'in' ? (
					<View>
						<Text style={{textAlign: 'center', fontSize: scaleFontSize(23), fontWeight: '300', color: '#EBF3CB'}}>Check in at</Text>
						<Text style={{textAlign: 'center', fontSize: scaleFontSize(30), fontWeight: '400', color: '#EBF3CB'}}>
						{result.checkin ?? 'N/A'}{' '}
						</Text>
					</View>
                  ) : (
                    <Text style={styles.idS}>
                      Check out at: {result.checkout ?? 'N/A'}
                    </Text>
                  )}
                </View>
				<View style={{marginVertical: '10%'}}>
					<View style={styles.name}>
					<Text style={{textAlign: 'center', fontSize: scaleFontSize(30), fontWeight: '600', color: '#323232'}}>{name}</Text>
					<Text style={{textAlign: 'center', fontSize: scaleFontSize(23), fontWeight: '300', color: '#323232'}}>{lastName}</Text>
					</View>
					<View style={{height:1, width:'70%', backgroundColor: '#78910F', marginVertical: '3%'}}></View>
					<View style={styles.identi}>
					<Text style={{textAlign: 'center', fontSize: scaleFontSize(23), fontWeight: '400', color: '#323232'}}>{result?.role}</Text>
					</View>
					<View style={styles.identi}>
					<Text style={{textAlign: 'center', fontSize: scaleFontSize(23), fontWeight: '400', color: '#323232'}}>{id}</Text>
					</View>
				</View>
              </View>
            </View>
          )}
        </View>
      </ImageBackground>
    </AnimatedScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    display: 'flex',
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  title: {
    fontFamily: 'Sora-ExtraBold',
    fontSize: scaleFontSize(50),
    color: '#EBF3CB',
    marginBottom: 0,
  },
  subTitle: {
    fontSize: scaleFontSize(15),
    color: '#EBF3CB',
    marginTop: '-5%',
  },
  containerTime: {
	position: 'absolute',
	top: '-10%',                  
	alignSelf: 'center',
	backgroundColor: '#4A5714',
	borderRadius: 20,
	paddingHorizontal: '12%',
	paddingVertical: '5%',
  },
  idS:{
	color: '#EBF3CB',
  },
  containerContent: {
    position: 'relative',
    backgroundColor: '#EBF3CB',
    borderRadius: 30,
    display: 'flex',
    alignItems: 'center',
	marginTop: '20%',
	justifyContent: 'center'
  },
  name: {
	textAlign: 'center',
  },
  identi: {
	display: 'flex',
	paddingTop:5
  },
  check: {
    width: '15%',
    resizeMode: 'contain',
    alignSelf: 'flex-end',
    right: '15%',
  },
  alreadyChecked: {
    position: 'relative',
    flexDirection: 'column',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    top: '25%',
  },
  whitened: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    padding: scaleHeightSize(20),
    borderRadius: scaleWidthSize(10),
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textChecked: {
    color: '#FFF',
    fontSize: scaleFontSize(25),
    alignSelf: 'center',
    textAlign: 'center',
  },
});

export default VerifiedNew;
