import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { ImageBackground, StyleSheet, View, Image, Text, SafeAreaView, PixelRatio, TouchableOpacity } from 'react-native';
import Toast from 'react-native-toast-message';
import { scaleFontSize, scaleHeightSize, scaleWidthSize } from '@/utils/scaleUtils';

function sp(size) {
  return PixelRatio.getFontScale() * size;
}

const Verified = ({ route, navigation }) => {
  const { payload, check } = route.params;
  
  console.log({payload, check});
  var name = payload.name;
  var lastName = payload.lastname;
  var id = payload.id;

  var currentDate = new Date();
  var formattedDate = moment(currentDate).format('DD-MM-20YY');
  var formattedTime = moment(currentDate).format('h:mm A');

  const [shouldRender, setShouldRender] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const createLog = async () => {
      const logData = {
        day: formattedDate,
        identification: id,
        name: `${name} ${lastName}`,
        checkin: check === 'in' ? formattedTime : null,
        checkout: check === 'out' ? formattedTime : null,
        checkType: check,
      };
      try {
        const response = await fetch('https://adamocheckback.up.railway.app/api/logs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(logData),
        });

        const result = await response.json();
        setResult(result);

        if (response.ok) {
          console.log('Log created successfully:', result);
          setShouldRender(true);
        } else if (response.status === 400) {
          console.log('Error creating log:', result.message);
          Toast.show({
            type: 'warning',
            text1: 'Warning',
            text2: result.message,
            position: 'top',
            visibilityTime: 3000,
          });
          navigation.navigate('InitialScreen');
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
    }, 400000);

    return () => clearTimeout(timer);

  }, []);

  if (!shouldRender) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('@/assets/img/backGround.png')}
        style={styles.background}>
        {/*<View style={styles.header}>
          <Text style={styles.title}>adamo</Text>
          <Text style={[styles.title, { opacity: 0.4 }]}>check</Text>
        </View>}*/}

        <View style={styles.textContainer}>
          <View style={styles.salut}>
            <Text style={styles.welcome}>
                {check === 'in' ? 'Hi!' : 'Bye!'}
            </Text>
            <Image
              source={require('@/assets/img/logoCheck.png')}
              style={styles.ico1}
            />
          </View>
          
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
        </View>

        <View style={styles.franx}></View>

        <View style={styles.textContainer}>
          <View style={[styles.salut, {width: '80%'}]}>
            <Text style={styles.welcome}>
                {check === 'in' ? 'Hi!' : 'Bye!'}
            </Text>
            <Image
              source={require('@/assets/img/logoCheck.png')}
              style={styles.ico1}
            />
            <TouchableOpacity style={styles.footer} onPress={() => navigation.navigate('InitialScreen')}>
                <Image
                source={require('@/assets/img/check.png')}
                style={styles.check}
                />
            </TouchableOpacity>
          </View>
          
          

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
    height: '50%',
    alignSelf: 'center',
    paddingHorizontal: '10%',
  },
  content: {
    marginLeft: '10%',
  },
  welcome: {
    color: '#FFF',
    fontWeight: 'bold',
    marginTop: '10%',
    fontSize: scaleFontSize(40),
    lineHeight: scaleFontSize(40)
  },
  name: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: scaleFontSize(20),
  },
  salut:{
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: '10%',
  },
  franx:{
    height: 2,
    backgroundColor: '#FFF',
  },
  ico1:{
    alignSelf: 'center',
    width: scaleWidthSize(40),
    height: scaleHeightSize(40),
    resizeMode: 'contain',
    marginLeft: '5%',
    marginTop: '4%',
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
    alignSelf: 'flex-end',
    alignItems: 'center',
    right: '-60%',
    width: scaleWidthSize(57),
    height: scaleHeightSize(57),
  },
  check: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    zIndex: 3,
  },
});

export default Verified;