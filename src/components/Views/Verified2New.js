import React, { useEffect, useState, useRef } from 'react';
import moment from 'moment';
import { ImageBackground, StyleSheet, View, Image, Text, SafeAreaView, PixelRatio, TouchableOpacity, Animated, Dimensions, BackHandler} from 'react-native';
import Toast from 'react-native-toast-message';
import { scaleFontSize, scaleHeightSize, scaleWidthSize } from '@/utils/scaleUtils';
import AnimatedScreenWrapper from './AnimatedScreenWrapper';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');


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

  var name1 = 'Andres Felipe';
  var lastName1 = 'Rivera Piedrahita';
  var id1 = '1089933857';

  var name2 = 'Juan Felipe';
  var lastName2 = 'Quintero';
  var id2 = '1088264756';

  var currentDate = new Date();
  var formattedDate = moment(currentDate).format('DD-MM-20YY');
  var formattedTime = moment(currentDate).format('h:mm A');

  const [shouldRender, setShouldRender] = useState(true);
  //const [result, setResult] = useState(null);
 

  const apiCallMade = useRef(false);

  const firstSlideAnim = useRef(new Animated.Value(-width)).current;
  const firstFadeAnim = useRef(new Animated.Value(0)).current;
  const secondSlideAnim = useRef(new Animated.Value(-width)).current;
  const secondFadeAnim = useRef(new Animated.Value(0)).current;


  var check = 'in';
  var result = [
    {
    statusCode: 210,
    message: 'Log created successfully',
    role: 'Developer',
    name: name1,
    lastName: lastName1,
    identification: id1,
    checkin: formattedTime,
    checkout: null,
    checkType: check,
    },
    {
    statusCode: 200,
    message: 'Log created successfully',
    role: 'Software Developer',
    name: name2,
    lastName: lastName2,
    identification: id2,
    checkin: formattedTime,
    checkout: null,
    checkType: check,
    }
  ];
  
  console.log(result[0])
  console.log(result[1])


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
              <View style={styles.card}> 
                <View style={styles.containerTime}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('InitialScreen')}
                    >
                    <Image
                      source={require('@/assets/img/check.png')}
                      style={styles.check}
                    />
                  </TouchableOpacity>

                  {check === 'in' ? (
                    <View style={styles.timeBlock}>
                      <Text style={styles.timeLabel}>Checked in at</Text>
                      <Text style={styles.timeValue}>{result[0]?.checkin ?? 'N/A'}</Text>
                    </View>
                  ) : (
                    <View style={styles.timeBlock}>
                      <Text style={styles.timeLabel}>Check out at</Text>
                      <Text style={styles.timeValue}>{result[0].checkin ?? 'N/A'}</Text>
                    </View>
                  )}
                </View>

                <View>
                  <Text style={{textAlign:'center', fontSize: scaleFontSize(20), fontWeight:'600', color:'#323232'}}>{name1}</Text>
                  <Text style={{textAlign:'center', fontSize: scaleFontSize(15), fontWeight:'300', color:'#323232'}}>{lastName1}</Text>
                </View>
                <View style={{ height: 2, width: '80%', backgroundColor: '#78910F', alignSelf: 'center' }}/>
                {result[0].statusCode === 200 && ( <>
                <View>
                  <Text style={{textAlign:'center', fontSize: scaleFontSize(19), fontWeight:'400', color:'#323232'}}>{result[0]?.role}</Text>
                </View>

                <View style={styles.identication}>
                  <Image
                    source={require('../../assets/img/idCard.png')} 
                    style={[{resizeMode: "contain", width: scaleWidthSize(20), alignSelf: 'center'}]}
                  />
                  <Text style={{textAlign:'center', fontSize: scaleFontSize(23), fontWeight:'400', color:'#323232'}}>{id1}</Text>
                </View>
                </>)}

                {result[0].message === "You are already checked in" && (
                  <View style={styles.alreadyChecked}>
                    <View style={styles.whitened}>
                      <Text style={styles.textChecked}>You are already {'\n'} <Text style={{fontWeight:'700'}}>checked in!</Text> </Text>
                    </View>
                  </View>
                )  
                }
        
                {result[0].message === "Already checked out / Not checked in" && (
                  <View style={styles.alreadyChecked}>
                    <View style={styles.whitened}>
                      <Text style={styles.textChecked}>You already  {'\n'} <Text style={{fontWeight:'700'}}>checked out!</Text> </Text>
                    </View>
                  </View>
                )}


              </View>

            
              <View style={[styles.card, {marginTop: '1%'}]}>

                <View>
                  <Text style={{textAlign:'center', fontSize: scaleFontSize(20), fontWeight:'600', color:'#323232'}}>{name2}</Text>
                  <Text style={{textAlign:'center', fontSize: scaleFontSize(15), fontWeight:'300', color:'#323232'}}>{lastName2}</Text>
                </View>
                <View style={{ height: 2, width: '80%', backgroundColor: '#78910F', alignSelf: 'center' }}/>
                {result[1].statusCode === 200 && ( <>
                <View>
                  <Text style={{textAlign:'center', fontSize: scaleFontSize(19), fontWeight:'400', color:'#323232'}}>{result[1]?.role}</Text>
                </View>

                <View style={styles.identication}>
                  <Image
                    source={require('../../assets/img/idCard.png')} 
                    style={[{resizeMode: "contain", width: scaleWidthSize(20), alignSelf: 'center'}]}
                  />
                  <Text style={{textAlign:'center', fontSize: scaleFontSize(23), fontWeight:'400', color:'#323232'}}>{id2}</Text>
                </View>
                  </>
                )}
              
                {result[1].message === "You are already checked in" && (
                  <View style={styles.alreadyChecked}>
                    <View style={styles.whitened}>
                      <Text style={styles.textChecked}>You are already {'\n'} <Text style={{fontWeight:'700'}}>checked in!</Text> </Text>
                    </View>
                  </View>
                )  
                }
        
                {result[1].message === "Already checked out / Not checked in" && (
                  <View style={styles.alreadyChecked}>
                    <View style={styles.whitened}>
                      <Text style={styles.textChecked}>You already  {'\n'} <Text style={{fontWeight:'700'}}>checked out!</Text> </Text>
                    </View>
                  </View>
                )}
              </View>
              <Image
                source={require('../../assets/img/adamoByHBPO.png')} 
                style={[{resizeMode: "contain", width: scaleWidthSize(120), alignSelf: 'center'}]}
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
    borderRadius: 30,
    marginTop: '15%',
    padding: '3%', 
  },
  containerTime: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'row',
    transform: [{ translateY: - scaleHeightSize(50) }],
    alignSelf: 'center',
    backgroundColor: '#4A5714',
    borderRadius: 999,
    paddingVertical: '0.5%'
  },
  check: {
    position: 'absolute',
    left: -85,
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
    borderWidth: 4,
    borderColor: '#78910F',
    borderRadius: 30,
    padding: '3%',
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
    flexDirection: 'column',
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

  identication: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
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
  },
});



export default Verified2;