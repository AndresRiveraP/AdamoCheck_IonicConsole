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
        <View style={styles.field}>
            <Pressable
                style={styles.boton}
                onPress={() => console.log('Presionado')}
            >
                <Image 
                    source={require('../../../assets/img/enter.png')}
                    style={styles.ico}
                />
                <Text style={styles.label}>Log In</Text>
            </Pressable>
        </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    admon:{
        alignItems:'center'
    },
    image: {
        maxWidth: 212,
        resizeMode: 'contain',
        alignSelf: 'center',
    },
    field:{
        flexDirection:'row',
        width:'70%',
        alignContent:'flex-start',
        alignItems:'flex-start',
        borderWidth : 2,
        borderRadius: 10,
        borderColor: '#EAEAEA',
        justifyContent: 'flex-start'
    },
    ico:{
        alignSelf:'flex-start',
        width:50,
        height: 50,
        resizeMode: 'contain'
    },
})

export default AdminLog