import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { ImageBackground, StyleSheet, View, Image, Text, SafeAreaView, PixelRatio, TouchableOpacity, BackHandler} from 'react-native';
import { scaleFontSize, scaleHeightSize, scaleWidthSize } from '@/utils/scaleUtils';
import AnimatedScreenWrapper from './AnimatedScreenWrapper';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function sp(size) {
  return PixelRatio.getFontScale() * size;
}

const Verified = ({ route, navigation }) => {
  const { payload, check } = route.params;
  
  console.log({payload, check});
  var name = payload[0].name;
  var lastName = payload[0].lastname;
  var id = payload[0].id;

  var currentDate = new Date();
  var formattedDate = moment(currentDate).format('DD-MM-20YY');
  var formattedTime = moment(currentDate).format('h:mm A');

  const [shouldRender, setShouldRender] = useState(false);
  const [result, setResult] = useState(null);

  useFocusEffect(
  React.useCallback(() => {
    const onBackPress = () => {
      navigation.navigate('InitialScreen');
      return true; // Prevents default back behavior
    };

    BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
  }, [navigation])
);

  useEffect(() => {
    const createLog = async () => {
      const logData = {
        day: formattedDate,
        identification: id,
        name: `${name} ${lastName}`,
        checkin: check === 'in' ? formattedTime : null,
        checkout: check === 'out' ? formattedTime : null,
        checkType: check,
        belongsTo: await AsyncStorage.getItem('key')
      };
      try {
        const response = await fetch('https://adamocheckback-ult.up.railway.app/api/logs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(logData),
        });

        const result = await response.json();

        setResult(result);

        console.log('Result', response);
        if (response.status === 200) {
          console.log('Log created successfully:', result);
          setShouldRender(true);
        } else if (response.status === 201 || response.status === 202) {
          console.log("Already something: ",  result);
          setShouldRender(true);
        } else {
          console.error('Error creating log:', result.message);
        }
      } catch (error) {
        console.error('Error creating log:', error);
      }
    };

    createLog();

    const timer = setTimeout(() => {
      navigation.navigate('InitialScreen');
    }, 3400); // 3000 milliseconds = 3 seconds

    return () => clearTimeout(timer);

  }, []);

  if (!shouldRender) {
    return null;
  }

  return (
    <AnimatedScreenWrapper>
      <SafeAreaView style={styles.container}>
        <ImageBackground
          source={require('@/assets/img/backGround.png')}
          style={styles.background}>
          <View style={styles.header}>
            <Text style={styles.title}>adamo</Text>
            <Text style={[styles.title, { opacity: 0.4 }]}>check</Text>
          </View>
          {result.statusCode !== 200 ? (<></>) : (
          <View style={styles.textContainer}>
            <Text style={styles.welcome}>
              {check === 'in' ? 'Welcome!' : 'Farewell!'}
            </Text>
            <Text style={styles.name}>
              {name}
              {'\n'}
              {lastName}
            </Text>
            <View style={styles.identi}>
              <Image
                source={require('@/assets/img/logoCheck.png')}
                style={styles.ico}
              />
              <Text style={styles.idS}>{id}</Text>
            </View>
            <View style={styles.identi}>
              <Image
                source={require('@/assets/img/user-role.png')}
                style={styles.ico}
              />
              <Text style={styles.idS}>{result?.role}</Text>
            </View>
            <View style={styles.identi}>
              <Image
                source={require('@/assets/img/working-time.png')}
                style={styles.ico}
              />
              {check === 'in' ?
                <Text style={styles.idS}> Check In: {result?.log.checkin ?? "N/A"} </Text> : 
                <Text style={styles.idS}> Check Out: {result?.log.checkout ?? "N/A"}</Text>
              }
            </View>
          </View>)}


          {result.message === "You are already checked in" && (
            <View style={styles.alreadyChecked}>
              <TouchableOpacity style={styles.footer} onPress={() => navigation.navigate('InitialScreen')}>
                <Image
                  source={require('@/assets/img/check.png')}
                  style={{ width: scaleWidthSize(50), height: scaleWidthSize(50) }}
                />
              </TouchableOpacity>
              <View style={styles.whitened}>
                <Text style={styles.textChecked}>You are already {'\n'} <Text style={{fontWeight:'700'}}>checked in!</Text> </Text>
              </View>
            </View>
          )  
          }

          {result.message === "Already checked out / Not checked in" && (
            <View style={styles.alreadyChecked}>
              <TouchableOpacity style={styles.footer} onPress={() => navigation.navigate('InitialScreen')}>
                <Image
                  source={require('@/assets/img/check.png')}
                  style={{ width: scaleWidthSize(50), height: scaleWidthSize(50) }}
                />
              </TouchableOpacity>
              <View style={styles.whitened}>
                <Text style={styles.textChecked}>You already  {'\n'} <Text style={{fontWeight:'700'}}>checked out!</Text> </Text>
              </View>
            </View>
          )}

        </ImageBackground>
      </SafeAreaView>
    </AnimatedScreenWrapper>
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
  textContainer: {
    alignSelf: 'center',
    paddingHorizontal: '10%',
  },
  content: {
    marginLeft: '10%',
  },
  welcome: {
    color: '#FFF',
    marginTop: '10%',
    fontSize: scaleFontSize(40),
  },
  name: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: scaleFontSize(30),
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
    fontFamily: 'Octarine-Bold',
    color: '#FFF',
    fontSize: scaleFontSize(15),
    marginLeft: 10,
  },
  footer: {
    display: 'flex',
    marginBottom: 10,
  },
  check: {
    width: '15%',
    resizeMode: 'contain',
    alignSelf: 'flex-end',
    right: '15%',
  },
  alreadyChecked:{
    position: 'relative',
    flexDirection: 'column',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    top: '25%',
  },
  whitened:{
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

export default Verified;