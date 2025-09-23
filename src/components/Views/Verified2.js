import React, { useEffect, useState, useRef } from 'react';
import moment from 'moment';
import { ImageBackground, StyleSheet, View, Image, Text, SafeAreaView, PixelRatio, TouchableOpacity, Animated, Dimensions, BackHandler} from 'react-native';
import Toast from 'react-native-toast-message';
import { scaleFontSize, scaleHeightSize, scaleWidthSize } from '@/utils/scaleUtils';
import AnimatedScreenWrapper from './AnimatedScreenWrapper';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

function sp(size) {
  return PixelRatio.getFontScale() * size;
}

const Verified2 = ({ route, navigation }) => {

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

  const { payload, check } = route.params;
  
  var name1 = payload[0].name;
  var lastName1 = payload[0].lastname;
  var id1 = payload[0].id;

  var name2 = payload[1].name;
  var lastName2 = payload[1].lastname;
  var id2 = payload[1].id;

  var currentDate = new Date();
  var formattedDate = moment(currentDate).format('DD-MM-20YY');
  var formattedTime = moment(currentDate).format('h:mm A');

  const [shouldRender, setShouldRender] = useState(false);
  const [result, setResult] = useState(null);

  const apiCallMade = useRef(false);

  const firstSlideAnim = useRef(new Animated.Value(-width)).current;
  const firstFadeAnim = useRef(new Animated.Value(0)).current;
  const secondSlideAnim = useRef(new Animated.Value(-width)).current;
  const secondFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const createLog = async () => {
      const belongsTo = await AsyncStorage.getItem('key');
      console.log("Id1:", id1);
      console.log("Id2:", id2);

      if (apiCallMade.current) return;
      
      apiCallMade.current = true;

      const logs = [
        {
          day: formattedDate,
          identification: id1,
          name: `${name1} ${lastName1}`,
          checkin: check === 'in' ? formattedTime : null,
          checkout: check === 'out' ? formattedTime : null,
          checkType: check,
          belongsTo
        },
        {
          day: formattedDate,
          identification: id2,
          name: `${name2} ${lastName2}`,
          checkin: check === 'in' ? formattedTime : null,
          checkout: check === 'out' ? formattedTime : null,
          checkType: check,
          belongsTo
        }
      ];

      try {
        console.log(logs);
        const response = await fetch('https://adamocheckback-ult.up.railway.app/api/logs/create2Logs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({logs}),
        });

        const result = await response.json();
        setResult(result);

        if (response.ok) {
          console.log('Log created successfully: \n\n\n', result);
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

    if (shouldRender) {
      // First container animation
      Animated.parallel([
        Animated.timing(firstSlideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(firstFadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();

      setTimeout(() => {
        Animated.parallel([
          Animated.timing(secondSlideAnim, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(secondFadeAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
        ]).start();
      }, 400); // 300ms delay between animations
    }

    const timer = setTimeout(() => {
      navigation.navigate('InitialScreen');
    }, 4000000);

    return () => clearTimeout(timer);
  }, [shouldRender]);

  if (!shouldRender) {
    return null;
  }

  return (
    <AnimatedScreenWrapper>
      <SafeAreaView style={styles.container}>
        <ImageBackground
          source={require('@/assets/img/backGround.png')}
          style={styles.background}>
            
         <Animated.View 
            style={[
              styles.textContainer, 
              { 
                opacity: firstFadeAnim,
                transform: [{ translateX: firstSlideAnim }] 
              }
            ]}
          >
            <View style={styles.salut}>
              {result[0].statusCode !== 200 ? (<></>) : (
              <Text style={styles.welcome}>
                  {check === 'in' ? 'Hi!' : 'Farewell!'}
              </Text>)}
              <Image
                source={require('@/assets/img/logoCheck.png')}
                style={styles.ico1}
              />
            </View>
            
            
            <Text style={styles.name}>
              {name1}
              {'\n'}
              {lastName1}
            </Text>
            {result[0].statusCode === 200 && ( <>
            <View style={styles.identi}>
              <Image
                source={require('@/assets/img/logoCheck.png')}
                style={styles.ico}
              />
              <Text style={styles.idS}>{id1}</Text>
            </View>
            <View style={styles.identi}>
              <Image
                source={require('@/assets/img/user-role.png')}
                style={styles.ico}
              />
              <Text style={styles.idS}>{result[0]?.role}</Text>
            </View>
            <View style={styles.identi}>
              <Image
                source={require('@/assets/img/working-time.png')}
                style={styles.ico}
              />
              {check === 'in' ?
                <Text style={styles.idS}> Check In: {result[0]?.log.checkin ?? "N/A"} </Text> : 
                <Text style={styles.idS}> Check Out: {result[0]?.log.checkout ?? "N/A"}</Text>
              }
            </View>
            </>)}

            {result[0].message === "You are already checked in" && (
              <View style={styles.alreadyChecked}>
                <TouchableOpacity style={styles.footer} onPress={() => navigation.navigate('InitialScreen')}>
                  <Image
                    source={require('@/assets/img/check.png')}
                    style={{ width: scaleWidthSize(25), height: scaleWidthSize(25) }}
                  />
                </TouchableOpacity>
                <View style={styles.whitened}>
                  <Text style={styles.textChecked}>You are already {'\n'} <Text style={{fontWeight:'700'}}>checked in!</Text> </Text>
                </View>
              </View>
            )  
            }
    
            {result[0].message === "Already checked out / Not checked in" && (
              <View style={styles.alreadyChecked}>
                <TouchableOpacity style={styles.footer} onPress={() => navigation.navigate('InitialScreen')}>
                  <Image
                    source={require('@/assets/img/check.png')}
                    style={{ width: scaleWidthSize(25), height: scaleWidthSize(25) }}
                  />
                </TouchableOpacity>
                <View style={styles.whitened}>
                  <Text style={styles.textChecked}>You already  {'\n'} <Text style={{fontWeight:'700'}}>checked out!</Text> </Text>
                </View>
              </View>
            )}
          
          </Animated.View>

          

          <View style={styles.franx}></View>

          <Animated.View 
            style={[styles.textContainer, { opacity: secondFadeAnim,transform: [{ translateX: secondSlideAnim }] }]}>
            <View style={styles.salut}>
              {result[1].statusCode !== 200 ? (<></>) : (
              <Text style={styles.welcome}>
                  {check === 'in' ? 'Hi!' : 'Farewell!'}
              </Text>)}
              <Image
                source={require('@/assets/img/logoCheck.png')}
                style={styles.ico1}
              />
            </View>
            
            
            <Text style={styles.name}>
              {name2}
              {'\n'}
              {lastName2}
            </Text>
            {result[1].statusCode === 200 && ( <>
            <View style={styles.identi}>
              <Image
                source={require('@/assets/img/logoCheck.png')}
                style={styles.ico}
              />
              <Text style={styles.idS}>{id2}</Text>
            </View>
            <View style={styles.identi}>
              <Image
                source={require('@/assets/img/user-role.png')}
                style={styles.ico}
              />
              <Text style={styles.idS}>{result[1]?.role}</Text>
            </View>
            <View style={styles.identi}>
              <Image
                source={require('@/assets/img/working-time.png')}
                style={styles.ico}
              />
              {check === 'in' ?
                <Text style={styles.idS}> Check In: {result[1]?.log.checkin ?? "N/A"} </Text> : 
                <Text style={styles.idS}> Check Out: {result[1]?.log.checkout ?? "N/A"}</Text>
              }
            </View>
            </>)}

            {result[1].message === "You are already checked in" && (
              <View style={styles.alreadyChecked}>
                <TouchableOpacity style={styles.footer} onPress={() => navigation.navigate('InitialScreen')}>
                  <Image
                    source={require('@/assets/img/check.png')}
                    style={{ width: scaleWidthSize(25), height: scaleWidthSize(25) }}
                  />
                </TouchableOpacity>
                <View style={styles.whitened}>
                  <Text style={styles.textChecked}>You are already {'\n'} <Text style={{fontWeight:'700'}}>checked in!</Text> </Text>
                </View>
              </View>
            )  
            }
    
            {result[1].message === "Already checked out / Not checked in" && (
              <View style={styles.alreadyChecked}>
                <TouchableOpacity style={styles.footer} onPress={() => navigation.navigate('InitialScreen')}>
                  <Image
                    source={require('@/assets/img/check.png')}
                    style={{ width: scaleWidthSize(25), height: scaleWidthSize(25) }}
                  />
                </TouchableOpacity>
                <View style={styles.whitened}>
                  <Text style={styles.textChecked}>You already  {'\n'} <Text style={{fontWeight:'700'}}>checked out!</Text> </Text>
                </View>
              </View>
            )}
          
          </Animated.View>
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
    textAlign: 'center',
  },
  salut:{
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '10%',
  },
  franx:{
    height: 1.5,
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
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    width: scaleWidthSize(57),
    height: scaleHeightSize(57),
    marginTop: 10,
  },
  check: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    zIndex: 3,
  },
  alreadyChecked:{
    position: 'relative',
    flexDirection: 'column',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  whitened:{
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    padding: scaleHeightSize(20),
    borderRadius: scaleWidthSize(10),
    width: '98%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textChecked: {
    color: '#FFF',
    fontSize: scaleFontSize(18),
    alignSelf: 'center',
    textAlign: 'center',
  },
});

export default Verified2;