import React, {useState} from 'react'
import {SafeAreaView, TextInput, Image, StyleSheet, View,Pressable,Text, KeyboardAvoidingView} from 'react-native'

const AdminLog = () => {
  const [id,setId] = useState('')
  const [password, setPassword] = useState('')

  const handleLogIn = (id,password) =>{
    console.log('Mandando las credenciales' + [id,password])
  }

  return (
    <SafeAreaView style={styles.admon}>
        <KeyboardAvoidingView style={styles.keyboardAvoidingContainer} behavior="position">
            <Image
                source={require('../../../assets/img/ic.png')}
                style={styles.image}
            />

        <View style={styles.fieldsC}>
            <View style={styles.field}>
                <Image 
                    source={require('../../../assets/img/id.png')}
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
                    source={require('../../../assets/img/pass.png')}
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
                <Pressable
                    style={styles.boton}
                    onPress={() => handleLogIn(id,password)}
                >
                    <Image 
                        source={require('../../../assets/img/enter.png')}
                        style={styles.ico}
                    />
                    <Text style={styles.label}>Log In</Text>
                </Pressable>
            </View>
        </View>
    </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    admon:{
        flex: 1
    },
    keyboardAvoidingContainer:{
        alignItems:'center',
        flex:1
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
})

export default AdminLog