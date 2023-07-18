import React, {useState} from 'react'
import axios from 'axios';
import {SafeAreaView, Alert,TextInput, Image, StyleSheet, View,Text, KeyboardAvoidingView,Keyboard, TouchableWithoutFeedback,TouchableOpacity, Modal} from 'react-native'

import AdminScreen from './AdminScreen';
import LoadingModal from './LoadingModal';

const AdminLog = () => {
  const [id,setId] = useState('')
  const [password, setPassword] = useState('')
  const [validLog, setValidLog] = useState(false)
  const [buttonOpacity, setButtonOpacity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () =>{
    if(id == '' || password == ''){
        return false;
    }
    return true;
  }

  const handleLogIn = async (id,password) =>{
    setButtonOpacity(1);
    if(!validateForm()){
        Alert.alert('Atención', 'Debe completar todos los campos')
        return;
    }

    try {
        setIsLoading(true)
        var url = 'http://192.168.0.24:8010/admins';
        //json-server --host 192.168.0.24 --port 8010 proofdb.json
        const result = await axios.get(url)
        var searchIndex = ((result.data).findIndex((admin) => admin.idNumber==id)) 
        console.log(searchIndex)
        if(searchIndex !== -1){
            url = url+'/'+(searchIndex+1)
            var pass = await axios.get(url)
            if(password == pass.data.password){
                console.log("Correct Login")
                setValidLog(true)
            }
            else{
                console.log("Incorrect Password")
            }
        }
        else{
            console.log("Admin User Not Found")
        }

        setTimeout(() =>{
            setIsLoading(false)
        },3000);

    } catch (error) {
        console.log(error)
        return;
    }
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
                        onChangeText={setId}
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
                        onChangeText={setPassword}
                    />
                </View>
                <View style={styles.fieldBoton}>
                    <TouchableOpacity
                        style={[styles.boton, {opacity:buttonOpacity}]}
                        onPress={() => {setButtonOpacity(0.4),handleLogIn(id,password)}}
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