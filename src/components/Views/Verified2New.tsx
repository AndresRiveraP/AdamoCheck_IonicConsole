import React, { useEffect, useState, useRef } from 'react';
import moment from 'moment';
import { ImageBackground, StyleSheet, View, Image, Text, TouchableOpacity, Animated, Dimensions, BackHandler } from 'react-native';
import Toast from 'react-native-toast-message';
import { scaleFontSize, scaleHeightSize, scaleWidthSize } from '@/utils/scaleUtils';
import AnimatedScreenWrapper from './AnimatedScreenWrapper';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

interface VerifiedProps {
  route: {
    params: {
      payload: Array<{
        name: string;
        lastname: string;
        id: string;
      }>;
      check: 'in' | 'out';
    };
  };
  navigation: {
    navigate: (screen: string) => void;
  };
}

interface LogResponse {
  statusCode: number;
  message?: string;
  lastLog?: {
    checkin?: string;
    checkout?: string;
  };
  role?: string;
  log?: {
    checkin?: string;
    checkout?: string;
  };
}

const Verified2New: React.FC<VerifiedProps> = ({ route, navigation }) => {
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        navigation.navigate('InitialScreen');
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [navigation]),
  );

  const { payload, check } = route.params;

  var name1 = payload[0]?.name;
  var lastName1 = payload[0]?.lastname;
  var id1 = payload[0]?.id;

  var name2 = payload[1]?.name;
  var lastName2 = payload[1]?.lastname;
  var id2 = payload[1]?.id;

  var currentDate = new Date();
  var formattedDate = moment(currentDate).format('DD-MM-20YY');
  var formattedTime = moment(currentDate).format('h:mm A');

  const [shouldRender, setShouldRender] = useState<boolean>(false);
  const [result, setResult] = useState<LogResponse[] | null>(null);

  const apiCallMade = useRef<boolean>(false);

  const firstSlideAnim = useRef(new Animated.Value(-width)).current;
  const firstFadeAnim = useRef(new Animated.Value(0)).current;
  const secondSlideAnim = useRef(new Animated.Value(-width)).current;
  const secondFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const createLog = async (): Promise<void> => {
      const belongsTo = await AsyncStorage.getItem('key');
      const organizationId = await AsyncStorage.getItem('id');
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
          belongsTo,
          organizationId,
        },
        {
          day: formattedDate,
          identification: id2,
          name: `${name2} ${lastName2}`,
          checkin: check === 'in' ? formattedTime : null,
          checkout: check === 'out' ? formattedTime : null,
          checkType: check,
          belongsTo,
          organizationId,
        },
      ];

      try {
        const response = await fetch('https://adamocheckback.up.railway.app/api/logs/create2Logs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ logs }),
        });

        const result: LogResponse[] = await response.json();
        setResult(result);

        if (response.ok) {
          setShouldRender(true);
        } else if (response.status === 400) {
          Toast.show({
            type: 'warning',
            text1: 'Warning',
            text2: response.statusText,
            position: 'top',
            visibilityTime: 3000,
          });
          navigation.navigate('InitialScreen');
        } else {
          console.error('Error creating log:', response.statusText);
        }
      } catch (error) {
        console.error('Error creating log:', error);
      }
    };

    createLog();

    if (shouldRender) {
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
      }, 400);
    }

    const timer = setTimeout(() => {
      navigation.navigate('InitialScreen');
    }, 4000);

    return () => clearTimeout(timer);
  }, [shouldRender]);

  if (!shouldRender) {
    return null;
  }

  return (
    <AnimatedScreenWrapper>
      <ImageBackground
        source={require('@/assets/img/backgroundStaff.png')}
        style={styles.background}>

        <View style={[{ display: 'flex', alignItems: 'center', marginTop: '18%' }]}>
          <Text style={check === 'in' ? (styles.title) : ([styles.title, { fontSize: scaleFontSize(35) }])}>
            {check === 'in' ? 'Welcome!' : 'That’s a Wrap!!'}
          </Text>
          <Text style={styles.subTitle}>
            {check === 'in'
              ? `You're securely signed in.`
              : `Enjoy your time off.`}
          </Text>
        </View>

        <View style={[styles.containerContent]}>
          <View style={[styles.containerTime, check === 'out' && { backgroundColor: '#503B0F' }]}>
            <TouchableOpacity
              style={{ position: 'absolute', left: '-25%', zIndex: 10 }}
              onPress={() => navigation.navigate('InitialScreen')}>
              <Image
                source={
                  check === 'in'
                    ? require('@/assets/img/check.png')
                    : require('@/assets/img/checkOutChecked.png')
                }
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
                <Text style={styles.timeValueOut}>{formattedTime ?? 'N/A'}</Text>
              </View>
            )}
          </View>

          <Animated.View
            style={[
              styles.card,
              check === 'out' && { borderColor: '#D48F21' },
              {
                opacity: firstFadeAnim,
                transform: [{ translateX: firstSlideAnim }],
              },
            ]}
          >
            <View>
              <Text style={styles.textName}>{name1}</Text>
              <Text style={styles.textLastName}>{lastName1}</Text>
            </View>
            <View style={{ height: 2, width: '80%', backgroundColor: '#78910F', alignSelf: 'center' }} />
            {result?.[0]?.statusCode === 200 && (
              <>
                {result?.[0]?.lastLog ? (
                  <View style={{ alignItems: 'center' }}>
                    <Text style={styles.textkWelcomeAgain}>Welcome Back</Text>
                    <Image
                      source={require('@/assets/img/check.png')}
                      style={styles.checkWelcomeAgain}
                    />
                  </View>

                ) : (
                  <>
                    <View>
                      <Text style={styles.textRole}>{result?.[0]?.role}</Text>
                    </View>
                    <View style={styles.identication}>
                      <Image
                        source={require('../../assets/img/idCard.png')}
                        style={[{ resizeMode: 'contain', width: scaleWidthSize(20), alignSelf: 'center' }]}
                      />
                      <Text style={styles.textID}> ID: <Text style={{ color: '#323232' }}>{id1}</Text></Text>
                    </View>
                  </>
                )}

              </>
            )}

            {result?.[0]?.message === 'You are already checked in' && (
              <View style={styles.alreadyChecked}>
                <View style={styles.whitened}>
                  <Text style={styles.textChecked}>You are already {'\n'} <Text style={{ fontWeight: '700' }}>checked in!</Text> </Text>
                </View>
              </View>
            )}

            {result?.[0]?.statusCode === 203 && (
              <View style={styles.alreadyChecked}>
                <View style={styles.whitened}>
                  <Text style={styles.textChecked}>You already {'\n'} <Text style={{ fontWeight: '700' }}>checked out!</Text> </Text>
                </View>
              </View>
            )}

            {result?.[0]?.statusCode === 202 && (
              <View style={styles.alreadyChecked}>
                <View style={styles.whitened}>
                  <Text style={styles.textChecked}>You are not {'\n'} <Text style={{ fontWeight: '700' }}>checked in!</Text> </Text>
                </View>
              </View>
            )}

          </Animated.View>

          <Animated.View
            style={[styles.card,
            check === 'out' && { borderColor: '#D48F21' },
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
            <View style={{ height: 2, width: '80%', backgroundColor: '#78910F', alignSelf: 'center' }} />
            {result?.[1]?.statusCode === 200 && (
              <>
                {result?.[1]?.lastLog ? (
                  <View style={{ alignItems: 'center' }}>
                    <Text style={styles.textkWelcomeAgain}>Welcome Back</Text>
                    <Image
                      source={require('@/assets/img/check.png')}
                      style={styles.checkWelcomeAgain}
                    />
                  </View>

                ) : (
                  <>
                    <View>
                      <Text style={styles.textRole}>{result?.[1]?.role}</Text>
                    </View>
                    <View style={styles.identication}>
                      <Image
                        source={require('../../assets/img/idCard.png')}
                        style={[{ resizeMode: 'contain', width: scaleWidthSize(20), alignSelf: 'center' }]}
                      />
                      <Text style={styles.textID}> ID: <Text style={{ color: '#323232' }}>{id2}</Text></Text>
                    </View>
                  </>
                )}

              </>
            )}

            {result?.[1]?.message === 'You are already checked in' && (
              <View style={styles.alreadyChecked}>
                <View style={styles.whitened}>
                  <Text style={styles.textChecked}>You are already {'\n'} <Text style={{ fontWeight: '700' }}>checked in!</Text> </Text>
                </View>
              </View>
            )}

            {result?.[1]?.statusCode === 203 && (
              <View style={styles.alreadyChecked}>
                <View style={styles.whitened}>
                  <Text style={styles.textChecked}>You already {'\n'} <Text style={{ fontWeight: '700' }}>checked out!</Text> </Text>
                </View>
              </View>
            )}

            {result?.[1]?.statusCode === 202 && (
              <View style={styles.alreadyChecked}>
                <View style={styles.whitened}>
                  <Text style={styles.textChecked}>You are not {'\n'} <Text style={{ fontWeight: '700' }}>checked in!</Text> </Text>
                </View>
              </View>
            )}

          </Animated.View>

          <Image
            source={require('../../assets/img/adamoByHBPO.png')}
            style={[{ resizeMode: 'contain', width: scaleWidthSize(95), height: scaleHeightSize(45), alignSelf: 'center' }]}
          />
        </View>
      </ImageBackground>
    </AnimatedScreenWrapper>
  );
}

const styles = StyleSheet.create({
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
    marginTop: '-1%',
  },
  containerContent: {
    width: '80%',
    height: '100%',
    display: 'flex',
    alignSelf: 'center',
    backgroundColor: '#EBF3CB',
    borderRadius: 50,
    marginTop: '15%',
    padding: '3%',
    gap: 10
  },
  containerTime: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'row',
    transform: [{ translateY: - scaleHeightSize(50) }],
    alignSelf: 'center',
    backgroundColor: '#4A5714',
    borderRadius: 999,
    overflow: 'visible',
    left: '30%',
    paddingVertical: '0.5%'
  },
  check: {
    position: 'absolute',
    width: scaleHeightSize(80),
    height: scaleHeightSize(80),
    resizeMode: 'contain',
  },
  textkWelcomeAgain: {
    textAlign: 'center',
    fontSize: scaleFontSize(19),
    fontWeight: '400',
    color: '#323232',
    marginTop: '5%'
  },
  checkWelcomeAgain: {
    width: scaleHeightSize(35),
    height: scaleHeightSize(35),
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
  card: {
    borderWidth: 1,
    borderColor: '#78910F',
    borderRadius: 50,
    padding: '3%',
  },
  textName: {
    textAlign: 'center',
    fontSize: scaleFontSize(22),
    fontWeight: '600',
    color: '#323232'
  },
  textLastName: {
    textAlign: 'center',
    fontSize: scaleFontSize(15),
    fontWeight: '300',
    color: '#323232'
  },
  textRole: {
    alignSelf: 'center',
    width: "85%",
    marginTop: '1%',
    marginBottom: '-2%',
    textAlign: 'center',
    fontSize: scaleFontSize(13),
    color: '#819842',
    fontFamily: 'Poppins-SemiBold'
  },
  textID: {
    textAlign: 'center', 
    fontSize: scaleFontSize(13),
    color: '#78910F',
    fontFamily: 'Poppins-Regular'
  },
  identication: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    maxHeight: 60
  },
  alreadyChecked: {
    position: 'relative',
    flexDirection: 'column',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  whitened: {
    borderRadius: scaleWidthSize(10),
    width: '98%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textChecked: {
    color: '#323232',
    fontSize: scaleFontSize(18),
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: '2%'
  },
});

export default Verified2New;
