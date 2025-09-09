import React, {useEffect, useState} from 'react';
import moment from 'moment';
import {
  ImageBackground,
  StyleSheet,
  View,
  Image,
  Text,
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

const VerifiedNew = ({ route, navigation }) => {
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
    <AnimatedScreenWrapper style={{flex: 1}}>
      <ImageBackground
        source={require('../../assets/img/backgroundStaff.png')}
        style={styles.background}>
        <View style={[styles.container]}>
          {result.statusCode !== 200 ? (
            <></>
          ) : (
            <View>
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
                <View style={styles.card}>
                    <View style={styles.containerTime}>
                      <TouchableOpacity
                        onPress={() => navigation.navigate('InitialScreen')}>
                        <Image
                          source={require('@/assets/img/check.png')}
                          style={styles.check}
                        />
                      </TouchableOpacity>

                      {check === 'in' ? (
                        <View style={styles.timeBlock}>
                          <Text style={styles.timeLabel}>Checked in at</Text>
                          <Text style={styles.timeValue}>{result?.log.checkin ?? 'N/A'}</Text>
                        </View>
                      ) : (
                        <View style={styles.timeBlock}>
                          <Text style={styles.timeLabel}>Check out at</Text>
                          <Text style={styles.timeValue}>{result?.log.checkin ?? 'N/A'}</Text>
                        </View>
                      )}
                    </View>

                  <View style={{ marginVertical: '10%' }}>
                    <View style={styles.name}>
                      <Text style={{textAlign:'center', fontSize: scaleFontSize(30), fontWeight:'600', color:'#323232'}}>{name}</Text>
                      <Text style={{textAlign:'center', fontSize: scaleFontSize(23), fontWeight:'300', color:'#323232'}}>{lastName}</Text>
                    </View>

                    <View style={{ height: 2, width: '80%', backgroundColor: '#78910F', alignSelf: 'center' }} />

                    <View style={styles.identi}>
                      <Text style={{textAlign:'center', fontSize: scaleFontSize(19), fontWeight:'400', color:'#323232'}}>{result?.role}</Text>
                    </View>

                    <View style={styles.identication}>
                      <Image
                        source={require('../../assets/img/idCard.png')} 
                        style={[{resizeMode: "contain", width: scaleWidthSize(20), alignSelf: 'center'}]}
                      />
                      <Text style={{textAlign:'center', fontSize: scaleFontSize(23), fontWeight:'400', color:'#323232'}}>{id}</Text>
                    </View>
                  </View>
                </View>
                <Image
                  source={require('../../assets/img/adamoByHBPO.png')} 
                  style={[{resizeMode: "contain", width: scaleWidthSize(120), alignSelf: 'center', marginTop: '20%'}]}
                  />
              </View>
            </View>
          )}

        {result.message === "You are already checked in" && (
          <View style={styles.alreadyChecked}>
            <TouchableOpacity onPress={() => navigation.navigate('InitialScreen')}>
              <Image
                source={require('@/assets/img/check.png')}
                style={{ width: scaleWidthSize(50), height: scaleWidthSize(50) }}
              />
            </TouchableOpacity> 
            <View style={styles.whitened}>
              <Text style={styles.textChecked}>You are already {'\n'} <Text style={{fontWeight:'700'}}>checked in!</Text> </Text>
            </View>
            <Image
                  source={require('../../assets/img/adamoByHBPO.png')} 
                  style={[{resizeMode: "contain", width: scaleWidthSize(120), alignSelf: 'center', marginTop: '45%'}]}
                  />
          </View>
          
        )}

        {result.message === "Already checked out / Not checked in" && (
          <View style={styles.alreadyChecked}>
            <TouchableOpacity onPress={() => navigation.navigate('InitialScreen')}>
              <Image
                source={require('@/assets/img/check.png')}
                style={{ width: scaleWidthSize(50), height: scaleWidthSize(50) }}
              />
            </TouchableOpacity>
            <View style={styles.whitened}>
              <Text style={styles.textChecked}>You already  {'\n'} <Text style={{fontWeight:'700'}}>checked out!</Text> </Text>
            </View>
            <Image
                  source={require('../../assets/img/adamoByHBPO.png')} 
                  style={[{resizeMode: "contain", width: scaleWidthSize(120), alignSelf: 'center', marginTop: '45%'}]}
                  />
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
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
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
    borderRadius: 30,
    marginTop: '15%',
    padding: '3%', 
  },
  card: {
    borderWidth: 4,
    borderColor: '#78910F',
    borderRadius: 30,
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
  identication: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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
