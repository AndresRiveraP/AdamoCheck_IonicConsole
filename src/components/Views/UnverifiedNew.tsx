import Toast from 'react-native-toast-message';
import React, {useState} from 'react'

import {ImageBackground,StyleSheet,View, Image,Text,SafeAreaView, PixelRatio, TextInput, TouchableOpacity,BackHandler, Pressable, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform} from 'react-native'
import { scaleFontSize, scaleHeightSize, scaleWidthSize } from '@/utils/scaleUtils';
import AnimatedScreenWrapper from './AnimatedScreenWrapper';
import { useFocusEffect } from '@react-navigation/native';

function sp(size: number) {
    return PixelRatio.getFontScale() * size;
}

interface UnverifiedNewProps {
    route: {
      params: {
        check: string;
      };
    };
    navigation: {
      navigate: (
        screen: string,
        params?: { payload?: any; check?: string; documentId?: string; source?: string; base64Data?: string },
      ) => void;
      reset: (state: { index: number; routes: { name: string; params?: any }[] }) => void;
    };
  }

const UnverifiedNew : React.FC<UnverifiedNewProps> = ({ route, navigation }) => {
  let check: string | null = null;
  const [user, setUser] = React.useState('');

  const handleCamera = () => {
    // navigation.navigate('CameraScreen',  check );
  };
  
  const VerifyWithId = async (documentId: string) => {
    if (documentId.length < 6) {
      Toast.show({
      type: 'warning',
      text1: 'Warning',
      text2: "Please enter a valid identification number",
      position: 'top',
      visibilityTime: 3000,
      });
    } else {
      navigation.navigate('LoadingScreen', {
        // check,
        documentId,
        source: 'UnverifiedNew',
        base64Data: '' // Empty string as it's not needed for this flow
      });
    }
    }

    useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        navigation.navigate('InitialScreen');
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [navigation])
  );

  return (
    <ImageBackground source={require('../../assets/img/backgroundStaff.png')} style={styles.background}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={[styles.container]}>
              <View style={[styles.containerTitle]}>
                <Image
                  source={require('../../assets/img/unverified.png')}
                  style={[styles.image, {resizeMode: 'contain'}]}
                />
                <View style={{flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <Text 
                    style={[styles.title,{color: '#fff'} ]}>
                    Oops!
                  </Text>
                  <Text style={[{fontSize: scaleFontSize(17), color: '#fff', marginBottom: '5%'}]}>
                    Your face(s) couldn't be detected
                  </Text>
                  <Text style={[{fontSize: scaleFontSize(15), color: '#fff'}]}>
                    Please, try again
                  </Text>
                </View>
              </View>
              <View style={styles.containerButtons}>
                <TouchableOpacity
                  style={[styles.boton]}
                  onPress={() => {
                    check = 'in';
                    handleCamera();
                  }}>
                  <Image
                    source={require('../../assets/img/checkin.png')}
                    style={styles.iconBoton}
                  />
                  <Text style={styles.label}>CHECK IN</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.boton, {backgroundColor: '#735616'}]}
                  onPress={() => {
                    check = 'out';
                    handleCamera();
                  }}>
                  <Image
                    source={require('../../assets/img/checkout.png')}
                    style={styles.iconBoton}
                  />
                  <Text style={[styles.label, {color:'#FFBB4D'}]}>CHECK OUT</Text>
                </TouchableOpacity>

                  
              </View>

              <View style={{ height: 2, width: '60%', backgroundColor: '#78910F', alignSelf: 'center', marginTop: '5%' }}/>

              <View style={styles.containerForm}>
                  <View style={styles.inputContainer}>
                    <Image
                    source={require('../../assets/img/idCardNew.png')} 
                    style={[styles.icon, {resizeMode: "contain"}]}
                    />
                      {user.length === 0 && (
                          <Text style={styles.fakePlaceholder}>or enter your ID number here</Text>
                      )}
                      <TextInput
                          value={user}
                          onChangeText={setUser}
                          style={styles.input}
                          placeholder=""  
                          textAlign="left"
                      />
                  </View>
              
                  <View>
                    <Pressable
                      style={({ pressed }) => ([
                          {
                          width: scaleWidthSize(75),
                          height: scaleHeightSize(40),
                          borderRadius: 50,
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: '#78910F'
                          },
                          pressed && { opacity: 0.7 } 
                        ])}
                        
                        android_ripple={{ color: 'rgba(255, 255, 255, 0.1)', borderless: false }}
                        
                        onPress={() => {VerifyWithId(user)}}   >
                      <Text style={[{color: '#DCF576', fontSize: scaleFontSize(15)}]}>Verify</Text>
                    </Pressable>
                  </View>
              </View>
          </View>
      </TouchableWithoutFeedback>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  background:{
    flex:1,
    resizeMode: 'cover',
    alignItems : 'center',
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: -1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    marginTop: '10%',
    width: '100%'
  },
  containerTitle: {
    display: 'flex',
    alignItems: 'center',
  },
  containerButtons: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    marginTop: '5%'
  },
  boton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#617316',
    borderRadius: 70,
    width: scaleWidthSize(135),
    height: scaleHeightSize(50),
    paddingLeft: '5%'
  },
  iconBoton: {
    width: scaleWidthSize(20),
    height: scaleWidthSize(20),
    resizeMode: 'contain',
  },
  label: {
    color: '#DCF576',
    fontSize: scaleFontSize(13),
    paddingHorizontal: scaleWidthSize(5),
    fontFamily: 'Sora-ExtraBold',
    textAlign: "center",
    marginBottom: '1%'
  },
  containerForm: {
    flexDirection: 'row',
    gap: 10,
    marginTop: '10%'
  },
  inputContainer: {
    width: scaleWidthSize(180),
    height: scaleHeightSize(40),
    alignSelf: 'center',
    position: 'relative',        
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: 50,
    borderWidth: 0.5,
    borderColor: '#4A5714',
  },
  icon: {
    width: scaleWidthSize(13),
    height: scaleWidthSize(13),
    marginRight: "1%",
    marginLeft: '10%',
  },
  fakePlaceholder: {
    position: 'absolute',        
    left: 0,
    right: 0,
    textAlign: 'center',
    alignSelf: 'center',    
    color: 'rgba(74, 87, 20, 0.50)',           
    fontSize: scaleFontSize(8),                
    // opacity: 0.8,                
  },
  input: {
    flex: 1,
    textAlign: 'left',
    color: '#4C4C4C',
    fontSize: scaleFontSize(8),
  },
  title: {
    fontFamily: 'Sora-ExtraBold',
    fontSize: scaleFontSize(40),
  },
  image: {
    width: scaleWidthSize(80),
    height: scaleWidthSize(80),
  },
})
export default UnverifiedNew