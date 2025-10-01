import Toast from 'react-native-toast-message';
import React from 'react'

import {ImageBackground,StyleSheet,View, Image,Text, PixelRatio, TextInput, TouchableOpacity,BackHandler, Pressable,TouchableWithoutFeedback, Keyboard, ScrollView} from 'react-native'
import { scaleFontSize, scaleHeightSize, scaleWidthSize } from '@/utils/scaleUtils';

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
  let {check} = route.params;
  const [user, setUser] = React.useState('');

  const handleCamera = () => {
    navigation.navigate('CameraScreen', { check } );
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
        check,
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
    <ScrollView 
      contentContainerStyle={{ flexGrow: 1 }} 
      keyboardShouldPersistTaps="handled"
    >  
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <ImageBackground source={require('../../assets/img/backgroundStaff.png')} style={styles.background}>

            <View style={[styles.container]}>
              <View style={styles.containerBack}>
                <TouchableOpacity
                    style={[styles.botonBack]}
                    onPress={() => { navigation.navigate('InitialScreen')
                    }}>
                    <Image
                      source={require('../../assets/img/arrowBack.png')}
                      style={styles.iconBack}
                    />
                  </TouchableOpacity>
              </View>
                <View style={[styles.containerTitle]}>
                  <Image
                    source={require('../../assets/img/unverified.png')}
                    style={[styles.image, {resizeMode: 'contain'}]}
                  />
                  <View style={{flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <Text 
                      style={[styles.title,{color: '#EBF3CB'} ]}>
                      Oops!
                    </Text>
                    <Text style={[{fontSize: scaleFontSize(15), color: '#EBF3CB', fontFamily: 'Poppins-SemiBold'}]}>
                      Your face(s) couldn't be detected
                    </Text>
                    <Text style={[{fontSize: scaleFontSize(13), color: '#EBF3CB', marginTop: '4%', fontFamily: 'Poppins-Regular'}]}>
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

                <View style={{ height: 2, width: '50%', backgroundColor: '#78910F', alignSelf: 'center', marginVertical: '5%' }}/>

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
                        <Text style={[{color: '#DCF576',fontFamily: 'Poppins-Bold', fontSize: scaleFontSize(13)}]}>Verify</Text>
                      </Pressable>
                    </View>
                </View>
                <Image 
                  source={require('../../assets/img/adamoByHBPO.png')} 
                  style={{ resizeMode: 'contain', width: scaleWidthSize(120), alignSelf: 'center', marginTop: '15%'}}/>
            </View>
      
          </ImageBackground>
      </TouchableWithoutFeedback>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  background:{
    flex:1,
    resizeMode: 'cover',
    alignItems : 'center',
    width: '100%',
    height: '100%', 
    position: 'relative'
  },
  container: {
    flex: 1,
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    marginTop: '25%',
    width: '100%'
  },
  containerBack: {
    position: 'absolute',
    left: 0,
    top: '-10%',
    width: scaleWidthSize(45),
  },
  botonBack: {
    alignItems: 'center',
    backgroundColor: '#4A5714',
    borderTopRightRadius: 40,
    borderBottomEndRadius: 40
  },
  iconBack:{
    width: scaleWidthSize(30),
    height: scaleWidthSize(20),
    resizeMode: 'contain',
    margin: '15%',
    marginBottom: '20%',
    marginLeft: 0
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
    left: '12%',
    right: 0,
    textAlign: 'center',
    alignSelf: 'center',    
    color: 'rgba(74, 87, 20, 0.50)',           
    fontSize: scaleFontSize(9),                
    fontFamily: 'Poppins-Regular'
  },
  input: {
    flex: 1,
    textAlign: 'left',
    color: '#4C4C4C',
    fontSize: scaleFontSize(9),
  },
  title: {
    fontFamily: 'Sora-ExtraBold',
    fontSize: scaleFontSize(40),
  },
  image: {
    width: scaleWidthSize(70),
    height: scaleWidthSize(70),
  },
})
export default UnverifiedNew