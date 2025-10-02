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

const Verified3New = ({ route, navigation }) => {
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
    }, 4200);

    return () => clearTimeout(timer);
  }, [shouldRender]);

  if (!shouldRender) {
    return null;
  }

  return(
    <AnimatedScreenWrapper style={styles.container}>
      <ImageBackground
        source={require('@/assets/img/backgroundStaff.png')}
        style={styles.background}>
          
          <View style={[{display: 'flex', alignItems: 'center', marginTop: '18%'}]}>
            <Text style={styles.title}>
              {check === 'in' ? 'Welcome!' : 'Farewell!'}
            </Text>
            <Text style={styles.subTitle}>
              {check === 'in'
                ? `You're securely signed in`
                : `You're securely signed out`}
            </Text>
          </View>
        
          <View style={[styles.containerContent]}>
            <View style={styles.containerTime}>
              <TouchableOpacity
                  style={{left: '-70%'}}
                  onPress={() => navigation.navigate('InitialScreen')}>
                  <Image
                    source={require('@/assets/img/check.png')}
                    style={styles.check}
                  />
                </TouchableOpacity>

                {check === 'in' ? (
                  <View style={styles.timeBlock}>
                    <Text style={styles.timeLabel}>Checked in at</Text>
                    <Text style={styles.timeValue}>{formattedTime ?? 'N/A'}</Text>
                  </View>
                ) : (
                  <View style={styles.timeBlock}>
                    <Text style={styles.timeLabel}>Check out at</Text>
                    <Text style={styles.timeValue}>{formattedTime ?? 'N/A'}</Text>
                  </View>
                )}
              </View>
            <Animated.View 
              style={[styles.card,
                { 
                  opacity: firstFadeAnim,
                  transform: [{ translateX: firstSlideAnim }] 
                }
              ]}
              >
              <View>
                <Text style={styles.textName}>{name1}</Text>
                <Text style={styles.textLastName}>{lastName1}</Text>
              </View>
              <View style={{ height: 2, width: '60%', backgroundColor: '#78910F', alignSelf: 'center' }}/>
              {result[0].statusCode === 200 && ( <>            
                {result[0].lastLog ? (
                  <View style={{display: 'flex', justifyContent: 'center', alignItems: 'center',flexGrow: 1}}>
                    <Text style={styles.textkWelcomeAgain}>Welcome Again</Text>
                  </View>

                ) : (
                <>
                <View>
                  <Text style={styles.textRole}>{result[0]?.role}</Text>
                </View>
                  <View style={styles.identication}>
                    <Image
                      source={require('../../assets/img/idCard.png')} 
                      style={[{resizeMode: "contain", width: scaleWidthSize(20), alignSelf: 'center'}]}
                    />
                    <Text style={styles.textID}>{id1}</Text>
                  </View>
                  </>
                )}
                
                </>)}

              {result[0].message === "You are already checked in" && (
                <View style={styles.alreadyChecked}>
                  <View style={styles.whitened}>
                    <Text style={styles.textChecked}>You are already {'\n'} <Text style={{fontWeight:'700'}}>checked in!</Text> </Text>
                  </View>
                </View>
              )}
      
              {result[0].statusCode === 203 && (
                <View style={styles.alreadyChecked}>
                  <View style={styles.whitened}>
                    <Text style={styles.textChecked}>You already {'\n'} <Text style={{fontWeight:'700'}}>checked out!</Text> </Text>
                  </View>
                </View>
              )}
    
              {result[0].statusCode === 202 && (
                <View style={styles.alreadyChecked}>
                  <View style={styles.whitened}>
                    <Text style={styles.textChecked}>You are not {'\n'} <Text style={{fontWeight:'700'}}>checked in!</Text> </Text>
                  </View>
                </View>
              )}
            </Animated.View>
          
            <Animated.View 
              style={[styles.card,
                { 
                  marginTop: '1%',
                  opacity: secondFadeAnim,
                  transform: [{ translateX: secondSlideAnim }] 
                }
              ]}
            >
              <View>
                <Text style={styles.textName}>{name2}</Text>
                <Text style={styles.textLastName}>{lastName2}</Text>
              </View>
              <View style={{ height: 2, width: '60%', backgroundColor: '#78910F', alignSelf: 'center' }}/>
              {result[1].statusCode === 200 && ( <>            
                {result[1].lastLog ? (
                  <View style={{display: 'flex', justifyContent: 'center', alignItems: 'center',flexGrow: 1}}>
                    <Text style={styles.textkWelcomeAgain}>Welcome Again</Text>
                  </View>

                ) : (
                <>
                <View>
                  <Text style={styles.textRole}>{result[1]?.role}</Text>
                </View>
                  <View style={styles.identication}>
                    <Image
                      source={require('../../assets/img/idCard.png')} 
                      style={[{resizeMode: "contain", width: scaleWidthSize(20), alignSelf: 'center'}]}
                    />
                    <Text style={styles.textID}>{id2}</Text>
                  </View>
                  </>
                )}
                
                </>)}
                
              {result[1].message === "You are already checked in" && (
                <View style={styles.alreadyChecked}>
                  <View style={styles.whitened}>
                    <Text style={styles.textChecked}>You are already {'\n'} <Text style={{fontWeight:'700'}}>checked in!</Text> </Text>
                  </View>
                </View>
              )}
      
              {result[1].statusCode === 203 && (
                <View style={styles.alreadyChecked}>
                  <View style={styles.whitened}>
                    <Text style={styles.textChecked}>You already {'\n'} <Text style={{fontWeight:'700'}}>checked out!</Text> </Text>
                  </View>
                </View>
              )}
    
              {result[1].statusCode === 202 && (
                <View style={styles.alreadyChecked}>
                  <View style={styles.whitened}>
                    <Text style={styles.textChecked}>You are not {'\n'} <Text style={{fontWeight:'700'}}>checked in!</Text> </Text>
                  </View>
                </View>
              )}
            </Animated.View>



            <Animated.View 
              style={[styles.card,
                { 
                  marginTop: '1%',
                  opacity: thirdFadeAnim,
                  transform: [{ translateX: thirdSlideAnim }] 
                }
              ]}
            >
              <View>
                <Text style={styles.textName}>{name3}</Text>
                <Text style={styles.textLastName}>{lastName3}</Text>
              </View>
              <View style={{ height: 2, width: '60%', backgroundColor: '#78910F', alignSelf: 'center' }}/>
              {result[2].statusCode === 200 && ( <>            
                {result[2].lastLog ? (
                  <View style={{display: 'flex', justifyContent: 'center', alignItems: 'center',flexGrow: 1}}>
                    <Text style={styles.textkWelcomeAgain}>Welcome Again</Text>
                  </View>

                ) : (
                <>
                <View>
                  <Text style={styles.textRole}>{result[2]?.role}</Text>
                </View>
                  <View style={styles.identication}>
                    <Image
                      source={require('../../assets/img/idCard.png')} 
                      style={[{resizeMode: "contain", width: scaleWidthSize(20), alignSelf: 'center'}]}
                    />
                    <Text style={styles.textID}>{id3}</Text>
                  </View>
                  </>
                )}
                
                </>)}

              {result[2].message === "You are already checked in" && (
                <View style={styles.alreadyChecked}>
                  <View style={styles.whitened}>
                    <Text style={styles.textChecked}>You are already {'\n'} <Text style={{fontWeight:'700'}}>checked in!</Text> </Text>
                  </View>
                </View>
              )}
      
              {result[2].statusCode === 203 && (
                <View style={styles.alreadyChecked}>
                  <View style={styles.whitened}>
                    <Text style={styles.textChecked}>You already {'\n'} <Text style={{fontWeight:'700'}}>checked out!</Text> </Text>
                  </View>
                </View>
              )}
    
              {result[2].statusCode === 202 && (
                <View style={styles.alreadyChecked}>
                  <View style={styles.whitened}>
                    <Text style={styles.textChecked}>You are not {'\n'} <Text style={{fontWeight:'700'}}>checked in!</Text> </Text>
                  </View>
                </View>
              )}
            </Animated.View>


            <Image 
              source={require('../../assets/img/adamoByHBPO.png')} 
              style={[
                {
                  resizeMode: 'contain',
                  width: scaleWidthSize(120),
                  alignSelf: 'center',
                },
                (result[0]?.statusCode !== 200 && result[1]?.statusCode !== 200 && result[2]?.statusCode !== 200) ? {
                  marginTop: scaleHeightSize(40),
                } : {marginTop: scaleHeightSize(-10)},
              ]}
            />
          </View>
      </ImageBackground>
  </AnimatedScreenWrapper>
)}

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
    fontFamily: 'Sora-ExtraBold',
    fontSize: scaleFontSize(50),
    color: '#EBF3CB',
  },
  subTitle: {
    fontSize: scaleFontSize(15),
    color: '#EBF3CB',
    marginTop: '-5%',
  },
  containerContent: {
    width: '80%',
    height: '100%',
    display: 'flex',
    alignSelf: 'center',
    backgroundColor: '#EBF3CB',
    borderRadius: 60,
    marginTop: '15%',
    padding: '3%', 
  },
  containerTime: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'row',
    transform: [{ translateY: - scaleHeightSize(55) }],
    alignSelf: 'center',
    backgroundColor: '#4A5714',
    borderRadius: 999,
    overflow: 'visible',
    left: '28%',
    paddingVertical: '0.5%'
  },
  check: {
    position: 'absolute',
    width: scaleHeightSize(80),
    height: scaleHeightSize(80),
    resizeMode: 'contain',
  },
  timeBlock: {
    marginHorizontal: scaleWidthSize(20),
    marginLeft: scaleWidthSize(25),
  },
  timeLabel: {
    fontSize: scaleFontSize(15),
    fontWeight: '300',
    color: '#EBF3CB',
    alignSelf: 'center',
  },
  timeValue: {
    fontSize: scaleFontSize(27),
    fontWeight: '700',
    color: '#EBF3CB',
    marginTop: '-8%',
    alignSelf: 'center',
  },
  card: {
    display: "flex",
    flexDirection: 'column',
    borderWidth: 2,
    borderColor: '#78910F',
    borderRadius: 60,
    minHeight: '15%',
  },
  textkWelcomeAgain: {

    alignSelf: 'center',
    fontSize: scaleFontSize(19),
    fontWeight:'500',
    color:'#323232',
  },
  textName: {
    textAlign:'center',
    fontSize: scaleFontSize(15),
    fontWeight:'600',
    color:'#323232'
  },
  textLastName: {
    textAlign:'center',
    fontSize: scaleFontSize(11),
    fontWeight:'300',
    color:'#323232'
  },
  textRole: {
    textAlign:'center',
    fontSize: scaleFontSize(12),
    fontWeight:'400',
    color:'#323232'
  },
  identication: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textID: {
    textAlign:'center',
    fontSize: scaleFontSize(10),
    fontWeight:'400',
    color:'#323232',
    alignSelf: 'center',
    letterSpacing: 2,
  },
  alreadyChecked:{
    position: 'relative',
    flexDirection: 'column',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  whitened:{
    borderRadius: scaleWidthSize(10),
    width: '98%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textChecked: {
    color: '#323232',
    fontSize: scaleFontSize(12),
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: '2%'
  },
});


export default Verified3New;