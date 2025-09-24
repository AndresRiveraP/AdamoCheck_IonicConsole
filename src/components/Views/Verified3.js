import React, { useEffect, useState, useRef } from 'react';
import moment from 'moment';
import { ImageBackground, StyleSheet, View, Image, Text, SafeAreaView, PixelRatio, TouchableOpacity, Animated, Dimensions, BackHandler } from 'react-native';
import Toast from 'react-native-toast-message';
import { scaleFontSize, scaleHeightSize, scaleWidthSize } from '@/utils/scaleUtils';
import { useFocusEffect } from '@react-navigation/native';
import AnimatedScreenWrapper from './AnimatedScreenWrapper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

function sp(size) {
  return PixelRatio.getFontScale() * size;
}

const Verified3 = ({ route, navigation }) => {
  const { payload, check } = route.params;
  
  var name1 = payload[0].name;
  var lastName1 = payload[0].lastname;
  var id1 = payload[0].id;

  var name2 = payload[1].name;
  var lastName2 = payload[1].lastname;
  var id2 = payload[1].id;

  var name3 = payload[2].name;
  var lastName3 = payload[2].lastname;
  var id3 = payload[2].id;

  var currentDate = new Date();
  var formattedDate = moment(currentDate).format('DD-MM-20YY');
  var formattedTime = moment(currentDate).format('h:mm A');

  const [shouldRender, setShouldRender] = useState(false);
  const [result, setResult] = useState(null);

  // Add API call tracking ref
  const apiCallMade = useRef(false);
  
  // Add animation refs for all three containers
  const firstSlideAnim = useRef(new Animated.Value(-width)).current;
  const firstFadeAnim = useRef(new Animated.Value(0)).current;
  const secondSlideAnim = useRef(new Animated.Value(-width)).current;
  const secondFadeAnim = useRef(new Animated.Value(0)).current;
  const thirdSlideAnim = useRef(new Animated.Value(-width)).current;
  const thirdFadeAnim = useRef(new Animated.Value(0)).current;

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
      const belongsTo = await AsyncStorage.getItem('key');
      console.log("Belongs to: ", belongsTo);
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
        },
        {
          day: formattedDate,
          identification: id3,
          name: `${name3} ${lastName3}`,
          checkin: check === 'in' ? formattedTime : null,
          checkout: check === 'out' ? formattedTime : null,
          checkType: check,
          belongsTo
        }
      ];

      try {
        const response = await fetch('https://unchidden-mica-pockily.ngrok-free.dev/api/logs/create2Logs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({logs}),
        });

        const result = await response.json();
        setResult(result);

        console.log('Result:::::::::::::::::::::::::', result);
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

    // Second container animation with delay
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
    }, 300); 

    // Third container animation with longer delay
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(thirdSlideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(thirdFadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    }, 600);
  }

    const timer = setTimeout(() => {
      navigation.navigate('InitialScreen');
    }, 400000);

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

        <View style={styles.identi}>
          <Image
            source={require('@/assets/img/working-time.png')}
            style={styles.icoCheck}
          />
          {check === 'in' ?
            <Text style={styles.idS}> Check In: {formattedTime ?? "N/A"} </Text> : 
            <Text style={styles.idS}> Check Out: {formattedTime ?? "N/A"}</Text>
          }
        
        </View>
          
        <Animated.View 
          style={[
            styles.textContainer, 
            { 
              opacity: firstFadeAnim,
              transform: [{ translateX: firstSlideAnim }] 
            }
        ]}>
          <View style={styles.salut}>
            {result[0]?.statusCode !== 200 ? (
              <></>
            ) : result[0]?.lastLog === null ? (
              <View style={styles.dataContainer}>
                <Text style={styles.welcome}>
                  {check === 'in' ? 'Welcome!' : 'Farewell!'}
                </Text>
                <Text style={styles.name}>
                  {name1}
                  {'\n'}
                  {lastName1}
                </Text>
                <View style={styles.identi}>
                  <Image
                    source={require('@/assets/img/logoCheck.png')}
                    style={styles.ico}
                  />
                  <Text style={styles.idS}>{id1}</Text>
                </View>
              </View>
            ) : (
              <View style={{alignContent: 'center', gap: 15}}>
                <Text style={styles.welcome}>
                  {check === 'in' ? 'Welcome again!' : 'Farewell!'}
                </Text>
                <Text style={[styles.name, {}]}>
                  {name1}
                  {'\n'}
                  {lastName1}
                </Text>
                <View style={styles.identi}>
                  <Image
                    source={require('@/assets/img/logoCheck.png')}
                    style={styles.ico}
                  />
                  <Text style={styles.idS}>{id1}</Text>
                </View>
              </View>
            )}
            </View>


            {result[0].message === "You are already checked in" && (
              <><View>
                <Text style={[styles.name, {}]}>
                  {name1}
                  {'\n'}
                  {lastName1}
                </Text>
                </View>
              <View style={styles.alreadyChecked}>
                <View style={styles.whitened}>
                  <Text style={styles.textChecked}>You are already {'\n'} <Text style={{fontWeight:'700'}}>checked in!</Text> </Text>
                </View>
              </View></>
            )  
            }
    
            {result[0].statusCode === 203 && (
              <><View>
                <Text style={[styles.name, {}]}>
                  {name1}
                  {'\n'}
                  {lastName1}
                </Text>
                </View>
              <View style={styles.alreadyChecked}>
                <View style={styles.whitened}>
                  <Text style={styles.textChecked}>You already {'\n'} <Text style={{fontWeight:'700'}}>checked out!</Text> </Text>
                </View>
              </View></>
            )}
  
            {result[0].statusCode === 202 && (
              <><View>
                <Text style={[styles.name, {}]}>
                  {name1}
                  {'\n'}
                  {lastName1}
                </Text>
                </View>
              <View style={styles.alreadyChecked}>
                <View style={styles.whitened}>
                  <Text style={styles.textChecked}>You are not {'\n'} <Text style={{fontWeight:'700'}}>checked in!</Text> </Text>
                </View>
              </View></>
            )}
        
        </Animated.View>

        <View style={styles.franx}></View>

       <Animated.View 
          style={[
            styles.textContainer, 
            { 
              opacity: secondFadeAnim,
              transform: [{ translateX: secondSlideAnim }] 
            }
          ]}>
          <View style={styles.salut}>
            {result[1]?.statusCode !== 200 ? (
              <></>
            ) : result[1]?.lastLog === null ? (
              <View style={styles.dataContainer}>
                <Text style={styles.welcome}>
                  {check === 'in' ? 'Welcome!' : 'Farewell!'}
                </Text>
                <Text style={styles.name}>
                  {name2}
                  {'\n'}
                  {lastName2}
                </Text>
                <View style={styles.identi}>
                  <Image
                    source={require('@/assets/img/logoCheck.png')}
                    style={styles.ico}
                  />
                  <Text style={styles.idS}>{id2}</Text>
                </View>
              </View>
            ) : (
              <View style={{alignContent: 'center', gap: 15}}>
                <Text style={styles.welcome}>
                  {check === 'in' ? 'Welcome again!' : 'Farewell!'}
                </Text>
                <Text style={[styles.name, {}]}>
                  {name2}
                  {'\n'}
                  {lastName2}
                </Text>
                <View style={styles.identi}>
                  <Image
                    source={require('@/assets/img/logoCheck.png')}
                    style={styles.ico}
                  />
                  <Text style={styles.idS}>{id2}</Text>
                </View>
              </View>
            )}
            
            </View>

            {result[1].message === "You are already checked in" && (
              <>
              <View>
                <Text style={[styles.name, {}]}>
                  {name2}
                  {'\n'}
                  {lastName2}
                </Text>
              </View>
              <View style={styles.alreadyChecked}>
                <View style={styles.whitened}>
                  <Text style={styles.textChecked}>You are already {'\n'} <Text style={{fontWeight:'700'}}>checked in!</Text> </Text>
                </View>
              </View></>
            )  
            }
    
            {result[1].statusCode === 203 && (
              <><View>
                <Text style={[styles.name, {}]}>
                  {name2}
                  {'\n'}
                  {lastName2}
                </Text>
                </View>
                <View style={styles.alreadyChecked}>
                  <View style={styles.whitened}>
                    <Text style={styles.textChecked}>You already {'\n'} <Text style={{ fontWeight: '700' }}>checked out!</Text> </Text>
                  </View>
                </View></>
            )}
  
            {result[1].statusCode === 202 && (
              <><View>
                <Text style={[styles.name, {}]}>
                  {name2}
                  {'\n'}
                  {lastName2}
                </Text>
                </View>
              <View style={styles.alreadyChecked}>
                <View style={styles.whitened}>
                  <Text style={styles.textChecked}>You are not {'\n'} <Text style={{fontWeight:'700'}}>checked in!</Text> </Text>
                </View>
              </View></>
            )}
        
        </Animated.View>


        <View style={styles.franx}></View>

       <Animated.View 
          style={[
            styles.textContainer, 
            { 
              opacity: thirdFadeAnim,
              transform: [{ translateX: thirdSlideAnim }] 
            }
        ]}>
          <View style={styles.salut}>
            {result[2]?.statusCode !== 200 ? (
              <></>
            ) : result[2]?.lastLog === null ? (
              <View style={styles.dataContainer}>
                <Text style={styles.welcome}>
                  {check === 'in' ? 'Welcome!' : 'Farewell!'}
                </Text>
                <Text style={styles.name}>
                  {name3}
                  {'\n'}
                  {lastName3}
                </Text>
                <View style={styles.identi}>
                  <Image
                    source={require('@/assets/img/logoCheck.png')}
                    style={styles.ico}
                  />
                  <Text style={styles.idS}>{id3}</Text>
                </View>
              </View>
            ) : (
              <View style={{alignContent: 'center', gap: 15}}>
                <Text style={styles.welcome}>
                  {check === 'in' ? 'Welcome again!' : 'Farewell!'}
                </Text>
                <Text style={[styles.name, {}]}>
                  {name3}
                  {'\n'}
                  {lastName3}
                </Text>
                <View style={styles.identi}>
                  <Image
                    source={require('@/assets/img/logoCheck.png')}
                    style={styles.ico}
                  />
                  <Text style={styles.idS}>{id3}</Text>
                </View>
              </View>
            )}
            </View>
            {result[2].message === "You are already checked in" && (
              <><View>
                <Text style={[styles.name, {}]}>
                  {name3}
                  {'\n'}
                  {lastName3}
                </Text>
                </View>
              <View style={styles.alreadyChecked}>
                <View style={styles.whitened}>
                  <Text style={styles.textChecked}>You are already {'\n'} <Text style={{fontWeight:'700'}}>checked in!</Text> </Text>
                </View>
              </View></>
            )  
            }
    
            {result[2].statusCode === 203 && (
              <><View>
                <Text style={[styles.name, {}]}>
                  {name3}
                  {'\n'}
                  {lastName3}
                </Text>
                </View>
              <View style={styles.alreadyChecked}>
                <View style={styles.whitened}>
                  <Text style={styles.textChecked}>You already {'\n'} <Text style={{fontWeight:'700'}}>checked out!</Text> </Text>
                </View>
              </View></>
            )}
  
            {result[2].statusCode === 202 && (
              <><View>
                <Text style={[styles.name, {}]}>
                  {name3}
                  {'\n'}
                  {lastName3}
                </Text>
                </View>
              <View style={styles.alreadyChecked}>
                <View style={styles.whitened}>
                  <Text style={styles.textChecked}>You are not {'\n'} <Text style={{fontWeight:'700'}}>checked in!</Text> </Text>
                </View>
              </View></>
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
    flex: 1,
    alignSelf: 'center',
    alignItems: 'center',   // Add this to center child elements
    justifyContent: 'center',
    gap: 30
  },
  dataContainer: {
    flex: 1,
    alignSelf: 'center',
    alignItems: 'center',   // Add this to center child elements
    paddingHorizontal: '10%',
    gap: 2
  },
  content: {
    marginLeft: '10%',
  },
  welcome: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: scaleFontSize(30),
    lineHeight: scaleFontSize(35)
  },
  name: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: scaleFontSize(15),
    textAlign: 'center',  
    width: '100%',  
  },
  salut:{
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 90
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
    marginTop: '1%',
  },
  identi: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    top: "4%"
  },
  icoCheck:{
    width: scaleWidthSize(40),
    height: scaleWidthSize(40),
    resizeMode: 'contain',
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
  },
  check: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    zIndex: 3,
  },
  alreadyChecked:{
    position: 'relative',
    flexDirection: 'row',
    width: '70%',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  whitened:{
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    padding: scaleHeightSize(14),
    borderRadius: scaleWidthSize(6),
    width: '98%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textChecked: {
    color: '#FFF',
    fontSize: scaleFontSize(14),
    alignSelf: 'center',
    textAlign: 'center',
  },
});

export default Verified3;