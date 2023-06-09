import React, {useState} from 'react'
import {SafeAreaView, TextInput, Image, StyleSheet, View,Pressable,Text} from 'react-native'

const AdminLog = () => {
  const [id,setId] = useState('')
  const [password, setPassword] = useState('')

  return (
    <SafeAreaView style={styles.admon}>
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
                onPress={() => console.log('Log In, Then...')}
            >
                <Image 
                    source={require('../../../assets/img/enter.png')}
                    style={styles.ico}
                />
                <Text style={styles.label}>Log In</Text>
            </Pressable>
        </View>
    </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    admon:{
        alignItems:'center'
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
        alignItems:'flex-start',
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