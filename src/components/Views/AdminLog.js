import React, {useState} from 'react'
import {SafeAreaView, Alert,TextInput, Image, StyleSheet, View,Text, KeyboardAvoidingView,Keyboard, TouchableWithoutFeedback,TouchableOpacity, Modal, ToastAndroid} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {gql, useMutation} from '@apollo/client';

import AdminScreen from './AdminScreen';
import LoadingModal from './LoadingModal';

const AUTENTICAR_USUARIO = gql`
    mutation authUser($input: AutenthicateUserInput){
      authUser(input: $input){
        token
      }
    }
`;

const AdminLog = ({navigation}) => {
  const [id,setId] = useState('')
  const [password, setPassword] = useState('')
  const [validLog, setValidLog] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const [authUser] = useMutation(AUTENTICAR_USUARIO);

  const validateForm = () =>{
    if(id == '' || password == ''){
        return false;
    }
    return true;
  }

  const handleLogIn = async (id,password) =>{
    if(!validateForm()){
        Alert.alert('Atención', 'Debe completar todos los campos')
        return;
    }

    setIsLoading(true);
    try {
        const {data} = await authUser({
            variables :{
              input : {
                identification : id,
                password
              }
            }
          });
    
          const {token} = data.authUser;
          console.log(token);
    
          await AsyncStorage.setItem('token', token);
          setValidLog(true);
          setIsLoading(false);
    
    } catch (error) {
        setMessage(error.message.replace('GraphQL error: ', ''));
        console.log(error)
        return;
    }
  }

  const mostrarAlerta = () => {
    setTimeout(() =>{
        ToastAndroid.showWithGravity(
            message,
            ToastAndroid.SHORT,
            ToastAndroid.CENTER
          );
    }, 2000);
  }

  const keyboardGone = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={() => keyboardGone()}>
        <SafeAreaView style={styles.admon}>
            <KeyboardAvoidingView style={styles.keyboardAvoidingContainer} behavior="position">
                <Image
                    source={require('../../assets/img/ic.png')}
                    style={styles.image}
                />

            <View style={styles.fieldsC}>
                <View style={styles.field}>
                    <Image 
                        source={require('../../assets/img/id.png')}
                        style={styles.ico}
                    />
                    <TextInput 
                        placeholder="ID" 
                        placeholderTextColor='#EAEAEA' 
                        style={styles.tInput} 
                        onChangeText={text => setId(text)}
                    />
                </View>
                <View style={styles.field}>
                    <Image 
                        source={require('../../assets/img/pass.png')}
                        style={styles.ico}
                    />
                    <TextInput 
                        placeholder="Password" 
                        placeholderTextColor='#EAEAEA'
                        secureTextEntry  
                        style={styles.tInput} 
                        onChangeText={text => setPassword(text)}
                    />
                </View>
                <View style={styles.fieldBoton}>
                    <TouchableOpacity
                        style={styles.boton}
                        onPress={() => {handleLogIn(id,password)}}
                    >
                        <Image 
                            source={require('../../assets/img/enter.png')}
                            style={styles.ico}
                        />
                        <Text style={styles.label}>Log In</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>

        {isLoading && ( 
            <Modal
                animationType='fade'
                style={styles.modalLoading}
            >
                <LoadingModal/>
           </Modal>
        )}

        {validLog && (
            <Modal
                animationType='fade'
            >
                <AdminScreen/>
            </Modal>
        )}

        {message && mostrarAlerta()}
        </SafeAreaView>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
    admon:{
        flex: 1
    },
    keyboardAvoidingContainer:{
        flex:1,
        alignItems:'center',
    },
    fieldsC:{
        width: '70%',
        justifyContent:'center',
        alignContent:'center',
    },
    image: {
        width: 212,
        height: 414,
        resizeMode: 'contain',
        alignSelf: 'center',
    },
    field:{
        flexDirection:'row',
        alignContent:'flex-start',
        alignItems:'center',
        borderWidth : 2,
        paddingVertical: 10,
        marginBottom: 15,
        borderRadius: 10,
        borderColor: '#b4b4ac',
        justifyContent: 'flex-start'
    },
    tInput:{
        flex:0.9,
    },
    fieldBoton:{
        flexDirection:'row',
        paddingVertical: 8,
        borderWidth : 2,
        borderRadius: 10,
        borderColor: '#b4b4ac',
        backgroundColor:'#b9e4f4',
    },
    boton:{
        flexDirection: 'row',
        width: '100%'
    },
    ico:{
        alignSelf:'flex-start',
        width:50,
        height: 50,
        resizeMode: 'contain'
    },
    label:{
        alignSelf: 'center',
    },
    modalLoading:{
        flex:1,
        zIndex: 2,
        justifyContent: 'center',
      },
})

export default AdminLog