import React, { useEffect, useState, useRef} from 'react';
import moment from 'moment';
import {
  ImageBackground,
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  BackHandler,
  Animated,
  Dimensions,
} from 'react-native';
import {
  scaleFontSize,
  scaleHeightSize,
  scaleWidthSize,
} from '@/utils/scaleUtils';
import AnimatedScreenWrapper from './AnimatedScreenWrapper';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SoundPlayer from 'react-native-sound-player';


const VerifiedNew = ({ route, navigation }) => {
  const { payload, check } = route.params;
  const { width } = Dimensions.get('window');

  console.log({payload, check});
  var name = payload[0].name;
  var lastName = payload[0].lastname;
  var id = payload[0].id;

  const firstSlideAnim = useRef(new Animated.Value(-width)).current;
  const firstFadeAnim = useRef(new Animated.Value(0)).current;
  
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
      const belongsTo = await AsyncStorage.getItem('key');
      const logData = {
        day: formattedDate,
        identification: id,
        name: `${name} ${lastName}`,
        checkin: check === 'in' ? formattedTime : null,
        checkout: check === 'out' ? formattedTime : null,
        checkType: check,
        belongsTo
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
        } else if (response.status === 201 || response.status === 202 || response.status === 203) {
          console.log("Already something: ",  result);
          setShouldRender(true);
        } else {
          console.error('Error creating log 1:', result.message);
        }
      } catch (error) {
        console.error('Error creating log 2:', error);
      }
    };

    createLog();

    const timer = setTimeout(() => {
      navigation.navigate('InitialScreen');
    }, 3000000000000000000000000); // 3000 milliseconds = 3 seconds

    return () => clearTimeout(timer);

  }, []);

  const soundRelease = () => {
      try {
          // El primer parámetro es el nombre del archivo (sin extensión)
          // El segundo parámetro es la extensión del archivo
          SoundPlayer.playSoundFile('confetti2', 'mp3');
      } catch (e) {
          console.log(`No se pudo reproducir el sonido: ${e}`);
      }
  };

  if (shouldRender) {
    Animated.parallel([
      Animated.timing(firstSlideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(firstFadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start();
  }
  
  if (!shouldRender) {
    return null;
  }

  return (
    <ImageBackground source={require('../../assets/img/backgroundStaff.png')}
        style={styles.background}>
    <AnimatedScreenWrapper style={{flex: 1}}>
        
        <Animated.View
            style={[
              styles.container,
              { 
                opacity: firstFadeAnim,
                transform: [{ translateX: firstSlideAnim }] 
              }
            ]}
        >
          <View>
            {result.statusCode !== 200  ? (
              <></>
            ) : result?.birthday && check === 'in' ? (
              <>
              {soundRelease()}
              <View>
                <View style={[{display: 'flex', flexDirection: 'row', justifyContent: 'center', aling: 'center', marginTop: '18%'}]}>
                  <Image 
                    source={require('../../assets/img/confetti.png')}
                    style={[{resizeMode: "contain", width: scaleWidthSize(70), alignSelf: 'center'}]}
                  />
                  <Text style={[styles.title, {textAlign: 'left'}]}>
                    Happy Birthday!
                  </Text>
                </View>
                <View style={[styles.containerContent, {width: '70%', marginTop: '5%',}]}>
                  <View>
                      <Image
                        source={require('../../assets/img/birthday.png')} 
                        style={[{position: 'absolute', top: scaleHeightSize(-25), resizeMode: "contain", width: scaleWidthSize(100), height: scaleWidthSize(100), alignSelf: 'center'}]}
                      />
                    </View>
                  <View style={[styles.card, {padding: 0, borderColor: 'transparent', marginTop: '30%'}]}>
                    
                    <View style={styles.name}>
                      <Text style={styles.textName}>{name}</Text>
                      <Text style={styles.textLastName}>{lastName}</Text>
                    </View>

                    <View style={{ height: 2, width: '95%', backgroundColor: '#78910F', alignSelf: 'center', marginVertical: '3%' }} />
                    <Text style={styles.textCheers}>Cheers to another year of success & happiness!</Text>
                  </View>
                  <Image
                    source={require('../../assets/img/adamoByHBPO.png')} 
                    style={[{resizeMode: "contain", width: scaleWidthSize(120), alignSelf: 'center', marginTop: '10%'}]}
                    />
                </View>
              </View>
              </>
            ) : !result?.lastLog ? (
              <View>
                <View style={[{display: 'flex', alignItems: 'center', marginTop: '18%'}]}>
                  <Text style={check === "in" ? (styles.title) : ([styles.title, {fontSize: scaleFontSize(35)}])}>
                    {check === 'in' ? 'Welcome!' : 'That’s a Wrap!!'}
                  </Text>
                  <Text style={styles.subTitle}>
                    {check === 'in'
                      ? `You're securely signed in.`
                      : `Enjoy your time off.`}
                  </Text>
                </View>
                <View style={[styles.containerContent]}>
                  <View
                    style={[
                      styles.card,
                      check === "out" &&
                         { borderColor: '#D48F21' }
                      ]}
                  >
                      <View style={[styles.containerTime , check === "out" && {backgroundColor: '#503B0F'}]}>
                        <TouchableOpacity
                          onPress={() => navigation.navigate('InitialScreen')}>
                          <Image 
                            source={
                              check === "in"
                                ? require('@/assets/img/check.png')
                                : require('@/assets/img/checkOutChecked.png')
                            }
                            style={styles.check}
                          />
                        </TouchableOpacity>
  
                        {check === 'in' ? (
                          <View style={[styles.timeBlock]}>
                            <Text style={styles.timeLabel}>Checked in at</Text>
                            <Text style={styles.timeValue}>{result?.log?.checkin ?? 'N/A'}</Text>
                          </View>
                        ) : (
                          <View style={[styles.timeBlock]}>
                            <Text style={styles.timeLabel}>Checked out at</Text>
                            <Text style={styles.timeValueOut}>{result?.log?.checkout ?? 'N/A'}</Text>
                          </View>
                        )}
                      </View>
  
                    <View style={{ marginVertical: '10%' }}>
                      <View style={styles.name}>
                        <Text style={styles.textName}>{name}</Text>
                        <Text style={styles.textLastName}>{lastName}</Text>
                      </View>
  
                      <View style={{ height: 2, width: '80%', backgroundColor: '#78910F', alignSelf: 'center' }} />
  
                      <View>
                        <Text style={styles.textRole}>{result?.role}</Text>
                      </View>
  
                      <View style={styles.identication}>
                        <Image
                          source={require('../../assets/img/idCard.png')}
                          style={[{resizeMode: "contain", width: scaleWidthSize(20), alignSelf: 'center'}]}
                        />
                        <Text style={{textAlign:'center', fontSize: scaleFontSize(23), fontWeight:'400', color:'#78910F'}}> ID: <Text style={{color: '#323232'}}>{id}</Text></Text>
                      </View>
                    </View>
                  </View>
                  <Image
                    source={require('../../assets/img/adamoByHBPO.png')}
                    style={[{resizeMode: "contain", width: scaleWidthSize(120), alignSelf: 'center', marginTop: '20%'}]}
                    />
                </View>
              </View>
            ) : (
              <View>
                <View style={[{display: 'flex', alignItems: 'center', marginTop: '18%'}]}>
                  <Text style={[styles.title, {fontSize: scaleFontSize(40)}]}>
                    {check === 'in' ? 'Welcome back!' : 'That’s a Wrap!!'}
                  </Text>
                  <Text style={styles.subTitle}>
                    {check === 'in'
                      ? `You’ve started a new shift here.`
                      : `Enjoy your time off.`}
                  </Text>
                </View>
                <View style={[styles.containerContent]}>
                  <View
                    style={[
                      styles.card,
                      check === "out" ?(
                         { borderColor: '#D48F21', padding: 0 }) : ( { borderColor: '#D48F21', padding: 0})
                      ]}
                  >
                      <View style={[styles.containerTime, check === "out" && {backgroundColor: '#503B0F'}]}>
                        <TouchableOpacity
                          onPress={() => navigation.navigate('InitialScreen')}>
                          <Image 
                              source={
                                check === "in"
                                  ? require('@/assets/img/check.png')
                                  : require('@/assets/img/checkOutChecked.png')
                              }
                            style={styles.check}
                          />
                        </TouchableOpacity>

                        {check === 'in' ? (
                          <View style={styles.timeBlock}>
                            <Text style={styles.timeLabel}>Checked in at</Text>
                            <Text style={styles.timeValue}>{result?.log?.checkin ?? 'N/A'}</Text>
                          </View>
                        ) : (
                          <View style={styles.timeBlock}>
                            <Text style={styles.timeLabel}>Check out at</Text>
                            <Text style={styles.timeValue}>{result?.log?.checkout ?? 'N/A'}</Text>
                          </View>
                        )}
                      </View>

                    <View style={{ marginVertical: '10%' }}>
                      <View style={styles.name}>
                        <Text style={styles.textName}>{name}</Text>
                        <Text style={styles.textLastName}>{lastName}</Text>
                      </View>

                      <View style={{ height: 2, width: '80%', backgroundColor: '#78910F', alignSelf: 'center' }} />
                    </View>
                    <View>
                      <Text style={[styles.textRole, {marginTop: "-5%"}]}>{result?.role}</Text>
                    </View>

                    <View style={styles.identication}>
                      <Image
                        source={require('../../assets/img/idCard.png')}
                        style={[{resizeMode: "contain", width: scaleWidthSize(20), alignSelf: 'center'}]}
                      />
                      <Text style={{textAlign:'center', fontSize: scaleFontSize(23), fontWeight:'400', color:'#78910F'}}> ID: <Text style={{color: '#323232'}}>{id}</Text></Text>
                    </View>
                    <View style={styles.containerLastCheck}>
                      <View style={styles.containerLastCheckIn}>
                        <Image
                          source={require('../../assets/img/checkin.png')}
                          style={styles.iconCheckLastLog}
                        />
                        <View>
                          <Text style={styles.textLastCheck}>Last check-in</Text>
                          <Text style={styles.timelastCheckIn}>{result?.lastLog?.checkin ?? ''}</Text>
                        </View>
                      </View>
                      <View style={styles.containerLastCheckOut}>
                        <Image
                          source={require('../../assets/img/checkout.png')}
                          style={styles.iconCheckLastLog}
                        />
                        <View>
                          <Text style={styles.textLastCheck}>Last check-out</Text>
                          <Text style={styles.timelastCheckOut}>{result?.lastLog?.checkout ?? ''}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  <Image
                    source={require('../../assets/img/adamoByHBPO.png')} 
                    style={[{resizeMode: "contain", width: scaleWidthSize(120), alignSelf: 'center', marginTop: '5%'}]}
                    />
                </View>
              </View>
            )}

          {result.message === "You are already checked in" && (
              <View style={styles.alreadyChecked}>
                <View style={styles.whitened}>
                  <Text style={styles.textChecked}>You are already {'\n'} <Text style={{fontWeight:'700'}}>checked in!</Text> </Text>
                </View>
              </View>
            )}

            {result.statusCode === 203 && (
              <View style={styles.alreadyChecked}>
                <View style={styles.whitened}>
                  <Text style={styles.textChecked}>You already {'\n'} <Text style={{fontWeight:'700'}}>checked out!</Text> </Text>
                </View>
              </View>
            )}
            
            {result.statusCode === 202 && (
              <View style={styles.alreadyChecked}>
                <View style={styles.whitened}>
                  <Text style={styles.textChecked}>You are not {'\n'} <Text style={{fontWeight:'700'}}>checked in!</Text> </Text>
                </View>
              </View>
            )}

          </View>
        </Animated.View>
    </AnimatedScreenWrapper>
      </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  title: {
    fontFamily: 'Sora-ExtraBold',
    fontSize: scaleFontSize(50),
    color: '#EBF3CB',
    alignSelf: 'center', 
    textAlign: 'center'
  },
  subTitle: {
    fontSize: scaleFontSize(15),
    color: '#EBF3CB',
    marginTop: '2%',
  },
  containerContent: {
    width: '80%',
    height: '100%',
    display: 'flex',
    alignSelf: 'center',
    backgroundColor: '#EBF3CB',
    borderRadius: 40,
    marginTop: '15%',
    padding: '3%', 
  },
  card: {
    borderWidth: 2,
    borderColor: '#78910F',
    borderRadius: 40,
    padding: '3%',
  },
  cardOut: {
    borderWidth: 4,
    borderColor: '#78910F',
    borderRadius: 40,
    padding: '3%',
  },
  containerTime: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'row',
    transform: [{ translateY: - scaleHeightSize(30) }],
    alignSelf: 'center',
    backgroundColor: '#4A5714',
    borderRadius: 999,
    overflow: 'visible',
    left: '25%',
    paddingVertical: '0.5%'
  },
  check: {
    position: 'absolute',
    left: -85,
    top: scaleHeightSize(0),
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
  timeValueOut: {
    fontSize: scaleFontSize(27),
    fontWeight: '700',
    color: '#FFBB4D',
    marginTop: '-8%',
    alignSelf: 'center',
  },
  textName: {
    textAlign:'center',
    fontSize: scaleFontSize(30),
    fontWeight:'600',
    color:'#323232',
  },
  textLastName: {
    textAlign:'center',
    fontSize: scaleFontSize(23),
    fontWeight:'300',
    color:'#323232'
  },
  textRole: {
    textAlign:'center',
    fontSize: scaleFontSize(19),
    fontWeight:'600',
    color:'#819843'
  },
  textID: {
    textAlign:'center',
    fontSize: scaleFontSize(23),
    fontWeight:'400',
    color:'#323232'
  },
  identication: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textCheers: {
    fontFamily: 'Poppins-Regular',
    fontSize: scaleFontSize(15),
    color: '#4A5714',
    textAlign: 'center',
    fontStyle: 'italic'
  },
  alreadyChecked: {
    position: 'relative',
    flexDirection: 'column',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '50%'
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
  containerLastCheck: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: 100
  },
  containerLastCheckIn: {
    width: "50%",
    height: "100%",
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#617316',
    borderBottomLeftRadius: 38,
    paddingLeft: '3%',
    gap: 10
  },
  containerLastCheckOut: {
    width: "50%",
    height: "100%",
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#735616',
    borderBottomRightRadius: 38,
    paddingLeft: '3%',
    gap: 10
  },
  iconCheckLastLog: {
    resizeMode: 'contain',
    width: scaleWidthSize(30),
    height: scaleHeightSize(25)
  },
  textLastCheck: {
    fontFamily: 'Octarine-Bold',
    color: '#EBF3CB',
    fontSize: scaleFontSize(7),
    alignSelf: 'center'
  },
  timelastCheckIn: {
    color: '#DCF576',
    fontSize: scaleFontSize(15),
    fontWeight: '900',
  },
  timelastCheckOut : {
    color: '#FFBB4D',
    fontSize: scaleFontSize(15),
    fontWeight: '900'
  },
  textChecks: {
    alignSelf: 'center',
    fontFamily: 'Octarine-Bold',
    color: '#323232',
    fontSize: scaleFontSize(15),
  },
});

export default VerifiedNew;
