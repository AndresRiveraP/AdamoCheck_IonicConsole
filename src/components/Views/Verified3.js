import React, { useEffect, useState, useRef } from 'react';
import moment from 'moment';
import { ImageBackground, StyleSheet, View, Image, Text, SafeAreaView, PixelRatio, TouchableOpacity, Animated, Dimensions } from 'react-native';
import Toast from 'react-native-toast-message';
import { scaleFontSize, scaleHeightSize, scaleWidthSize } from '@/utils/scaleUtils';
import AnimatedScreenWrapper from './AnimatedScreenWrapper';

const {width} = Dimensions.get('window');

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

  useEffect(() => {
    const createLog = async () => {
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
        },
        {
          day: formattedDate,
          identification: id2,
          name: `${name2} ${lastName2}`,
          checkin: check === 'in' ? formattedTime : null,
          checkout: check === 'out' ? formattedTime : null,
          checkType: check,
        },
        {
          day: formattedDate,
          identification: id3,
          name: `${name3} ${lastName3}`,
          checkin: check === 'in' ? formattedTime : null,
          checkout: check === 'out' ? formattedTime : null,
          checkType: check,
        }
      ];

      try {
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
    }, 200); 

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
    }, 1000);
  }

    const timer = setTimeout(() => {
      navigation.navigate('InitialScreen');
    }, 4000000000);

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
            <Text style={styles.idS}> Check In: {result[0]?.log.checkin ?? "N/A"} </Text> : 
            <Text style={styles.idS}> Check Out: {result[0]?.log.checkout ?? "N/A"}</Text>
          }
        
        </View>
          
        <Animated.View 
            style={[styles.textContainer, { opacity: secondFadeAnim,transform: [{ translateX: secondSlideAnim }]}]}>
          <View style={styles.salut}>
            {result[0].statusCode !== 200 ? (<></>) : (
              <Text style={styles.welcome}>
                  {check === 'in' ? 'Hi!' : 'Farewell!'}
              </Text>
            )}
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
              </>)}

          {result[0].message === "You are already checked in" && (
            <View style={styles.alreadyChecked}>
              <TouchableOpacity style={styles.footer} onPress={() => navigation.navigate('InitialScreen')}>
                <Image
                  source={require('@/assets/img/check.png')}
                  style={{ width: scaleWidthSize(20), height: scaleWidthSize(20) }}
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
                  style={{ width: scaleWidthSize(20), height: scaleWidthSize(20) }}
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
            style={[
              styles.textContainer, 
              { 
                opacity: thirdFadeAnim,
                transform: [{ translateX: thirdSlideAnim }] 
              }
            ]}>
          <View style={styles.salut}>
            {result[1].statusCode !== 200 ? (<></>) : (
              <Text style={styles.welcome}>
                  {check === 'in' ? 'Hi!' : 'Farewell!'}
              </Text>
            )}
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
              </>)}

          {result[1].message === "You are already checked in" && (
            <View style={styles.alreadyChecked}>
              <TouchableOpacity style={styles.footer} onPress={() => navigation.navigate('InitialScreen')}>
                <Image
                  source={require('@/assets/img/check.png')}
                  style={{ width: scaleWidthSize(20), height: scaleWidthSize(20) }}
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
                  style={{ width: scaleWidthSize(20), height: scaleWidthSize(20) }}
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
          style={[
            styles.textContainer, 
            { 
              opacity: thirdFadeAnim,
              transform: [{ translateX: thirdSlideAnim }] 
            }
        ]}>
          <View style={styles.salut}>
            {result[2].statusCode !== 200 ? (<></>) : (
              <Text style={styles.welcome}>
                  {check === 'in' ? 'Hi!' : 'Farewell!'}
              </Text>
            )}
              <Image
                source={require('@/assets/img/logoCheck.png')}
                style={styles.ico1}
              />
          </View>
          
          <Text style={styles.name}>
            {name3}
            {'\n'}
            {lastName3}
          </Text>
           {result[2].statusCode === 200 && ( <>
              <View style={styles.identi}>
                <Image
                  source={require('@/assets/img/logoCheck.png')}
                  style={styles.ico}
                />
                <Text style={styles.idS}>{id3}</Text>
              </View>
              </>)}

          {result[2].message === "You are already checked in" && (
            <View style={styles.alreadyChecked}>
              <TouchableOpacity style={styles.footer} onPress={() => navigation.navigate('InitialScreen')}>
                <Image
                  source={require('@/assets/img/check.png')}
                  style={{ width: scaleWidthSize(20), height: scaleWidthSize(20) }}
                />
              </TouchableOpacity>
              <View style={styles.whitened}>
                <Text style={styles.textChecked}>You are already {'\n'} <Text style={{fontWeight:'700'}}>checked in!</Text> </Text>
              </View>
            </View>
          )  
        }
  
          {result[2].message === "Already checked out / Not checked in" && (
            <View style={styles.alreadyChecked}>
              <TouchableOpacity style={styles.footer} onPress={() => navigation.navigate('InitialScreen')}>
                <Image
                  source={require('@/assets/img/check.png')}
                  style={{ width: scaleWidthSize(20), height: scaleWidthSize(20) }}
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
    marginTop: '3%',
    fontSize: scaleFontSize(35),
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
    marginTop: '1%',
  },
  identi: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    top: "4%"
  },
  icoCheck:{
    width: scaleWidthSize(35),
    height: scaleWidthSize(35),
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