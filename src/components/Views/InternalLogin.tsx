import { scaleFontSize, scaleHeightSize, scaleWidthSize } from '@/utils/scaleUtils';
import React from 'react';
import { View, Text, StyleSheet, ImageBackground, Image, TextInput, Pressable, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView, Platform  } from 'react-native';


const InternalLogin: React.FC = () => {
    const [user, setUser] = React.useState('');
    const [password, setPassword] = React.useState('');

    const handleLogin = async () => {
        
    }
    
    return (
        <ImageBackground source={require('../../assets/img/backgroundStaff.png')} style={styles.background}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex: 1}}>
                <View style={styles.container}>
                    <View style={[{flexDirection: 'column', alignItems:'center', paddingBottom:'10%'}]}>
                        <Image
                        source={require('../../assets/img/logoCheck.png')}
                        style={[styles.image, {resizeMode: 'contain'}]}
                        />
                        <View
                            style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingTop:'10%'
                            }}>
                            <Text style={[styles.title,{color: '#fff'} ]}>
                                adamo
                            </Text>
                            <Text style={[styles.title, {color: '#c3e5f3'}]}>check</Text>
                        </View>
                    </View>

                    <View style={{alignItems: 'center', top: '-10%' }}>
                        <Text style={[{color: '#fff', fontSize: scaleFontSize(18)}]}>
                            Internal <Text style={[{fontWeight: 'bold'}]}>login</Text>
                        </Text>
                        <Text style={[{color: '#fff', fontSize: scaleFontSize(18)}]}>
                            <Text style={[{fontWeight: 'bold'}]}>Staff</Text> credentials required.
                        </Text>
                    </View>
                    <Image 
                    source={require('../../assets/img/staff.png')}
                    style={[styles.image, {top: '-5%', width: scaleWidthSize(60), height: scaleHeightSize(55),}]}
                    />
                    
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
                            source={require('../../assets/img/locker.png')} 
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
                    
                        <Pressable
                        onPress={() => handleLogin()}
                        style={({ pressed }) => ([
                            {
                            width: '15%',            
                            aspectRatio: 1,          
                            borderRadius: 999,       
                            overflow: 'hidden',      
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'transparent',
                            top: '10%',
                            left: '30%'
                            },
                            pressed && { opacity: 0.7 } 
                        ])}
                        
                        android_ripple={{ color: 'rgba(255, 255, 255, 0.1)', borderless: false }}
                        hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                        accessibilityRole="button"
                        accessibilityLabel="Abrir perfil"
                        >
                        <Image
                            source={require('../../assets/img/arroyLogin.png')}
                            style={{ width: '100%', height: '100%' }}
                            resizeMode="contain"      
                        />
                        </Pressable>
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
    },
    background: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'space-around',
    },
    image: {
        top: '-13%',
        width: scaleWidthSize(82),
        height: scaleHeightSize(80),
    },
    title: {
        fontFamily: 'Guitar-Acoustic',
        fontSize: scaleFontSize(50),
        top: '-20%',
        
    },
    wrapper: {
        width: scaleWidthSize(240),
        alignSelf: 'center',
    },
    icon: {
        width: scaleWidthSize(20),
        height: scaleHeightSize(18),
        marginRight: "5%",
        marginLeft: '2%',
    },
    inputContainer: {
        width: scaleWidthSize(250),
        height: scaleHeightSize(50),
        alignSelf: 'center',
        position: 'relative',        
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#c1e7f4',
        borderRadius: 999,
        borderWidth: 1,
        borderColor: '#FFFFFF',
        marginTop: '7%',
        paddingVertical: '2%',
        paddingHorizontal: '4%',
    },
    fakePlaceholder: {
        position: 'absolute',        
        left: 0,
        right: 0,
        textAlign: 'center',         
        color: '#FFFFFF',           
        fontSize: scaleFontSize(15),                
        opacity: 0.8,                
    },
    input: {
        flex: 1,
        color: '#FFFFFF',
        fontSize: scaleFontSize(15),
        textAlign: 'left',
    },


});

export default InternalLogin;