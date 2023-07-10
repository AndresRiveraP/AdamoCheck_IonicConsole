import React from 'react'

import {ImageBackground,StyleSheet,View, Image,Text,SafeAreaView} from 'react-native'

const Unverified = ({navigation}) => {
  return (
    <SafeAreaView style={styles.container}>
        <ImageBackground
            source={require('../../../assets/img/imgBG02.png')}
            style={styles.background}
        >
        <Image 
            source={require('../../../assets/img/eye.png')}
            style={[{marginTop:40}]}
        />

        <View style={styles.warning}>
            <Text style={styles.Atention}>¡Atención!</Text>
            <Text style={styles.AtentionP}>No te hemos encontrado registrado en AdamoID</Text>
        </View>

        <View style={styles.redirectioning} >
            <Text style={styles.nonBolded}>Puedes iniciar tu proceso de registro <Text style={styles.bolded}>en el siguiente enlace:</Text></Text>
            <Image 
                source={require('../../../assets/img/Captura.png')}
                style={styles.qr}
            />
        </View>

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
        fontSize: 40,
        marginVertical : 10
    },
    AtentionP:{
        color: '#FFF',
        fontSize: 25,
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
    }
})
export default Unverified