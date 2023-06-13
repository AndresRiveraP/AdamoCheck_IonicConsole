import React from 'react'

import {ImageBackground,StyleSheet,View, Image,Text,SafeAreaView} from 'react-native'

const Verified = () => {

  var picture = '../../../assets/img/picutre.jpg';
  var welcoming = 'Bienvenido';
  var name = 'Handsome Smiling Man.png';
  var id= '1004166666'
  return (
    <SafeAreaView style={styles.container}>
        <ImageBackground
            source={require('../../../assets/img/imgBG02.png')}
            style={styles.background}
        >

            <Image 
                source={require(picture)}
                style={styles.picture}
            />

            <View style={styles.welcomingText}>
                <Text style={styles.welcome}>¡{welcoming}!</Text>
                <Text style={styles.name}>{name}</Text>
            </View>

            <View style={styles.identi}>
                <Image 
                    source={require('../../../assets/img/verified.png')}
                    style={styles.ico}
                />
                <Text style={styles.idS}>{id}</Text>
            </View>
            <Image 
                source={require('../../../assets/img/check.png')}
                style={styles.check}
            />
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
    picture:{
        marginTop: 100,
        width: 200,
        height: 200,
        resizeMode: 'cover',
        borderWidth: 15,
        borderColor: '#FFF',
        borderRadius: 120,
    },
    welcomingText:{
        marginTop: 30,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    welcome:{
        color:"#FFF",
        fontSize: 30,
    },
    name:{
        marginTop: 10,
        color:"#FFF",
        fontSize: 18,
    },
    identi:{
        marginTop: 60,
        backgroundColor: '#80d2ea',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
        justifyContent : 'space-around',
        padding : 20
    },
    ico:{
        alignSelf:'flex-start',
        width:100,
        height: 100,
        resizeMode: 'contain',
    },
    idS:{
        color:'#FFF',
        fontSize: 26,
    },
    check:{
        width: 35,
        height: 35,
        marginTop: 20,
    },
})
export default Verified