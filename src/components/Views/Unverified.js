import React from 'react'

import {ImageBackground,StyleSheet,View, Image,Text,SafeAreaView, PixelRatio} from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'

function dp(sizeInDp) {
    const scale = PixelRatio.get();
    return sizeInDp * scale;
}

const Unverified = ({navigation}) => {
  return (
    <SafeAreaView style={styles.container}>
        <ImageBackground
            source={require('../../assets/img/imgBG02.png')}
            style={styles.background}
        >
            <Image 
                source={require('../../assets/img/eye.png')}
                style={styles.eye}
            />

            <View style={styles.warning}>
                <Text style={styles.Atention}>¡Atención!</Text>
                <Text style={styles.AtentionP}>No te hemos encontrado registrado en AdamoID</Text>
            </View>

            <View style={styles.redirectioning} >
                <Text style={styles.nonBolded}>Puedes iniciar tu proceso de registro <Text style={styles.bolded}>en el siguiente enlace:{'\n'}</Text></Text>
                <Image 
                    source={require('../../assets/img/QR.png')}
                    resizeMode="contain"
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
    eye:{
        resizeMode: 'contain',
        height: '25%',
        width: '25%'
    },
    warning:{
        width: '80%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    Atention:{
        color: '#FFF',
        fontSize: dp(40),
        marginBottom: 15,
    },
    AtentionP:{
        color: '#FFF',
        fontSize: dp(20),
        textAlign: 'center',
        marginBottom: 20,
    },
    redirectioning:{
        flex: 1,
        backgroundColor: '#99dcec',
        borderRadius: 20,
        padding: 20,
        marginTop: 20,
        marginBottom: 60,
        width:'80%',
        alignItems: 'center',  
    },
    nonBolded: {
        fontSize: dp(20),
        color:'#FFF',
        textAlign: 'center'
    },
    bolded:{
        fontWeight:'bold',
    },
    qr:{
        width: '80%',
        height: '80%',
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
        fontSize: dp(16),
    }
})
export default Unverified