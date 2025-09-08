import { scaleFontSize, scaleHeightSize, scaleWidthSize } from '@/utils/scaleUtils';
import React from 'react';
import { View, Text, StyleSheet, ImageBackground, Image, TextInput, Pressable, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView, Platform  } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

const InternalLogin = ({ navigation }: { navigation: NavigationProp<any> }) => {
    const [user, setUser] = React.useState('');
    const [password, setPassword] = React.useState('');

    const handleLogin = async () => {
        try {
            const response = await fetch(
                'https://adamocheckback-ult.up.railway.app/api/organizations/loginOrganizations',
                {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: user,
                    password: password
                }),
                },
            );
            const data = await response.text();
            const res = JSON.parse(data);
            const organization = res.organization

            if(res.message === "Logged in successfully"){
                await AsyncStorage.setItem('user', organization.user);
                await AsyncStorage.setItem('key', organization.key);
                Toast.show({
                    type: 'success',
                    text1: 'Login successful',
                    text2: 'Welcome!',
                });
                navigation.navigate('InitialScreen');
            } else if (res.status !== 200) {
                Toast.show({
                    type: 'error',
                    text1: 'Login failed',
                    text2: res.message || 'Invalid credentials',
                });
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error instanceof Error ? error.message : 'Unknown error',
            });
            if (error instanceof Error) {
                console.error(error.message);
            } else {
                console.error(error);
            }
        }
    }
    
    return (
        <ImageBackground source={require('../../assets/img/backgroundStaff.png')} style={styles.background}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex: 1}}>
                    <View style={[styles.container]}>
                        <View style={[{ alignItems:'center', marginBottom:'5%', zIndex: 2, top:'-30%'}]}>
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
                                <View style={styles.inputContainer}>
                                    <Image
                                    source={require('../../assets/img/user.png')} 
                                    style={[styles.icon, {resizeMode: "contain"}]}
                                    />

                                        {user.length === 0 && (
                                            <Text style={styles.fakePlaceholder}>Username</Text>
                                        )}
                                        <TextInput
                                            value={user}
                                            onChangeText={setUser}
                                            style={styles.input}
                                            placeholder=""  
                                            textAlign="left"
                                        />
                                </View>

                                <View style={styles.inputContainer}>                                
                                    <Image
                                    source={require('../../assets/img/password.png')} 
                                    style={[styles.icon, {resizeMode: "contain"}]}
                                    />
                                        {password.length === 0 && (
                                            <Text style={styles.fakePlaceholder}>Password</Text>
                                        )}
                                        <TextInput
                                            value={password}
                                            onChangeText={setPassword}
                                            secureTextEntry={true}                                
                                            style={styles.input}
                                            placeholder=""  
                                            textAlign="left"
                                        />
                                </View>
                            </View>
                                <Pressable
                                    onPress={() => handleLogin()}
                                    style={({ pressed }) => ([
                                        {
                                        width: scaleWidthSize(150),
                                        height: scaleHeightSize(45), 
                                        borderRadius: 40,
                                        overflow: 'hidden',      
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: '#9EBE1A',
                                        top: '5%'
                                        },
                                        pressed && { opacity: 0.7 } 
                                    ])}
                                    
                                    android_ripple={{ color: 'rgba(255, 255, 255, 0.1)', borderless: false }}
                                    hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                                    accessibilityRole="button"
                                    accessibilityLabel="Login"
                                    >
                                    <Text style={[{color: '#fff', fontSize: scaleFontSize(15), fontFamily:'Sora-ExtraBold'}]}>LOGIN</Text>
                                </Pressable>
                                <Image
                                    source={require('../../assets/img/adamoByHBPO.png')} 
                                    style={[{resizeMode: "contain", width: scaleWidthSize(120), marginTop: '15%'}]}
                                    />
                            </View>
                        </View>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        marginTop: '10%',
      },
    background: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'space-around',
    },
    containerContent: {
        position: 'absolute',
        top: '25%',
        bottom: '-100%',
        backgroundColor: '#EBF3CB',
        borderRadius: 40,
        display: 'flex',
        alignItems: 'center'
    },
    image: {
        width: scaleWidthSize(80),
        height: scaleHeightSize(70),
        marginBottom: '10%',
    },
    title: {
        fontFamily: 'Guitar-Acoustic',
        fontSize: scaleFontSize(40),
        top: '-22%',
    },
    subtitileHello: {
      fontFamily: 'inter',
      color: '#78910F',
      fontSize: scaleFontSize(14),
      fontWeight:'normal',
      letterSpacing: 5,
      marginTop: '-3%',
    },
    containerForm: {
        marginTop: '10%',
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

});

export default InternalLogin;