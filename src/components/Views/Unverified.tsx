import Toast from 'react-native-toast-message';
import React, {useState} from 'react'

import {ImageBackground,StyleSheet,View, Image,Text,SafeAreaView, PixelRatio, TextInput, TouchableOpacity,BackHandler, Pressable, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform} from 'react-native'
import { scaleFontSize, scaleHeightSize, scaleWidthSize } from '@/utils/scaleUtils';
import AnimatedScreenWrapper from './AnimatedScreenWrapper';
import { useFocusEffect } from '@react-navigation/native';

function sp(size: number) {
    return PixelRatio.getFontScale() * size;
}

interface UnverifiedProps {
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

const Unverified : React.FC<UnverifiedProps> = ({ route, navigation }) => {
    const {check} = route.params;
    const [user, setUser] = React.useState('');

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
            source: 'unverified',
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
    <AnimatedScreenWrapper>
        <SafeAreaView style={{flex: 1}}>
            <ImageBackground source={require('../../assets/img/backgroundStaff.png')} style={styles.background}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex: 1}}>
                
                        <View style={[styles.container]}>
                            <View style={[styles.containerTitle]}>
                                <Image
                                source={require('../../assets/img/logo.png')}
                                style={[styles.image, {resizeMode: 'contain'}]}
                                />
                                <View
                                    style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingTop:'10%'
                                    }}>
                                    <Text 
                                        style={[styles.title,{color: '#fff'} ]}>
                                        adamo
                                    </Text>
                                    <Text 
                                        style={[styles.title, {color: '#bcc988'}]}>
                                        check
                                        </Text>
                                </View>
                            </View>

                            <View style={[styles.containerContent, {backgroundColor: '#EBF3CB'}]}>
                                <View style={{alignItems: 'center', marginTop: '10%'}}>
                                    <Text style={[{color: '#78910F', fontSize: scaleFontSize(55), fontFamily:'Sora-ExtraBold'}]}>
                                        Hello!
                                    </Text>
                                    <Text style={styles.subtitileHello}>
                                        Ready to start?
                                    </Text>
                                </View>

                                <View style={styles.containerForm}>
                                    <Text style={[{color: '#4C4C4C', fontSize: scaleFontSize(15), fontWeight: '200'}]}>
                                        Enter your ID bellow:
                                    </Text>
                                    <View style={styles.inputContainer}>
                                        <Image
                                        source={require('../../assets/img/user.png')} 
                                        style={[styles.icon, {resizeMode: "contain"}]}
                                        />

                                            {user.length === 0 && (
                                                <Text style={styles.fakePlaceholder}>    -  -  -  -  -  -  -  -  -   </Text>
                                            )}
                                            <TextInput
                                                value={user}
                                                onChangeText={setUser}
                                                style={styles.input}
                                                placeholder=""  
                                                textAlign="left"
                                            />
                                    </View>          
                                </View>               

                                <View style={{ flexDirection: 'row'}}>
                                    <Pressable
                                        style={({ pressed }) => ([
                                                {
                                                width: scaleWidthSize(150),
                                                height: scaleHeightSize(45),
                                                borderRadius: 40,
                                                overflow: 'hidden',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                backgroundColor: '#9EBE1A',
                                                top: '10%'
                                                },
                                                pressed && { opacity: 0.7 } 
                                            ])}
                                            
                                            android_ripple={{ color: 'rgba(255, 255, 255, 0.1)', borderless: false }}
                                            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                                            accessibilityRole="button"
                                            accessibilityLabel="Login"
                                            onPress={() => {VerifyWithId(user)}}   >
                                        <Text style={[{color: '#fff', fontSize: scaleFontSize(15), fontFamily:'Sora-ExtraBold'}]}>CHECK IN</Text>
                                    </Pressable>
                                </View>
                                <Image
                                    source={require('../../assets/img/adamoByHBPO.png')} 
                                    style={[{resizeMode: "contain", width: scaleWidthSize(120), marginTop: '15%'}]}
                                />
                                
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </TouchableWithoutFeedback>
            </ImageBackground>
        </SafeAreaView>
    </AnimatedScreenWrapper>
  )
}

const styles = StyleSheet.create({
    background:{
        flex:1,
        resizeMode: 'contain',
        alignItems : 'center',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        display: 'flex',
        marginTop: '10%',
      },
    containerTitle: {
        display: 'flex',
        alignItems: 'center',
        top: '12%',
    },
    containerContent: {
        position: 'absolute',
        marginTop: '15%',
        bottom: 0,
        backgroundColor: '#EBF3CB',
        borderRadius: 40,
        display: 'flex',
        alignItems: 'center'
    },
    subtitileHello: {
      
      color: '#78910F',
      fontSize: scaleFontSize(14),
      fontWeight:'normal',
      letterSpacing: 5,
      marginTop: '-3%',
    },
    containerForm: {
        marginTop: '10%',
        display: 'flex',
        alignItems: 'center'
    },
    icon: {
        width: scaleWidthSize(24),
        height: scaleHeightSize(22),
        marginRight: "5%",
        marginLeft: '2%',
    },
    inputContainer: {
        width: scaleWidthSize(200),
        height: scaleHeightSize(45),
        alignSelf: 'center',
        position: 'relative',        
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EBF3CB',
        borderRadius: 50,
        borderWidth: 0.5,
        borderColor: '#4A5714',
        marginTop: '5%',
        paddingHorizontal: '4%',
        marginHorizontal: '10%',
    },
    fakePlaceholder: {
        position: 'absolute',        
        left: 0,
        right: 0,
        textAlign: 'center',         
        color: '#4C4C4C',           
        fontSize: scaleFontSize(15),                
        opacity: 0.8,                
    },
    input: {
        flex: 1,
        color: '#4C4C4C',
        fontSize: scaleFontSize(15),
        textAlign: 'left',
    },
    title: {
        fontFamily: 'Guitar-Acoustic',
        fontSize: scaleFontSize(40),
        top: '-22%',
    },
    image: {
        width: scaleWidthSize(80),
        height: scaleHeightSize(70),
        marginBottom: '10%',
    },
})
export default Unverified