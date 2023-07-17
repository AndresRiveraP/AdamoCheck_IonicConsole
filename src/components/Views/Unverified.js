import React from 'react'

import {ImageBackground,StyleSheet,View, Image,Text,SafeAreaView} from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'

const Unverified = ({navigation}) => {
  return (
    <SafeAreaView style={styles.container}>
        <ImageBackground
            source={require('../../assets/img/imgBG02.png')}
            style={styles.background}
        >
            <Image 
                source={require('../../assets/img/eye.png')}
                style={[{marginTop:40}]}
            />

            <View style={styles.warning}>
                <Text style={styles.Atention}>¡Atención!</Text>
                <Text style={styles.AtentionP}>No te hemos encontrado registrado en AdamoID</Text>
            </View>

            <View style={styles.redirectioning} >
                <Text style={styles.nonBolded}>Puedes iniciar tu proceso de registro <Text style={styles.bolded}>en el siguiente enlace:</Text></Text>
                <Image 
                    source={require('../../assets/img/Captura.png')}
                    style={styles.qr}
                />
            </View>

            <TouchableOpacity
                style={[styles.botonR]}
                onPress={() => {navigation.navigate('InitialScreen')}}
            >
                <Text style={styles.labelU}>Return Home</Text>
            </TouchableOpacity>
        </ImageBackground>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
    },
    background:{
        flex:1,
        resizeMode: 'cover',
        alignItems : 'center',
    },
    warning:{
        width: '80%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    Atention:{
        color: '#FFF',
        fontSize: 30,
        marginVertical : 10
    },
    AtentionP:{
        color: '#FFF',
        fontSize: 20,
        textAlign: 'justify'
    },
    redirectioning:{
        marginTop: 20,
        marginBottom: 60,
        width:'80%',
        alignItems: 'center',
        paddingVertical: 60,
        paddingHorizontal:20,
        backgroundColor: '#99dcec',
        borderRadius: 10
    },
    nonBolded: {
        fontSize: 20,
        color:'#FFF',
        textAlign: 'center'
    },
    bolded:{
        fontWeight:'bold',
    },
    qr:{
       marginTop: 40,
       alignSelf:'center' 
    },
    botonR:{
        position: 'relative',
        alignSelf:'center',
        backgroundColor: '#FFF',
        borderRadius: 40,
        bottom: 20,
        paddingVertical: 10,
        paddingHorizontal: 25,
        marginBottom: 20,
    },
    labelU:{
        color : '#000',
        fontWeight: '500',
        fontSize: 18,
    }
})
export default Unverified