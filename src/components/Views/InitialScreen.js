import React, {useState} from 'react'
import { ImageBackground,TouchableWithoutFeedback,View, Image, Text,Modal,Animated,TouchableOpacity} from 'react-native'


import AdminLog from './AdminLog';
import styles from '../../styles/globStyles.js'


const InitialScreen = ({navigation}) => {
  const [modalAdminLog, setModalAdminLog] = useState(false)
  const [animacionBotones] = useState(new Animated.Value(1));
  var check = null;

  const pressing = () =>{
    Animated.spring(animacionBotones, {
        toValue: 0.8,
        useNativeDriver: true
    }).start();
  }

  const unpressing = () =>{
    Animated.spring(animacionBotones,{
        toValue:1,
        friction: 4,
        tension: 10,
        useNativeDriver: true
    }).start();
  }

  const btnAnimation = {
    transform: [{ scale: animacionBotones }]
    }

  const handleCamera = () => {
    navigation.navigate('CameraScreen', {check})
  }

  const handleAdmin = () =>{
    setModalAdminLog(true)
  }

  return (
    <ImageBackground
        source={require('../../assets/img/imgBG01.png')}
        style={styles.background}
    >

        <TouchableWithoutFeedback
            onPressIn={ () => pressing() }
            onPressOut={ () => {unpressing(),handleAdmin()}}
        >
            <Animated.View
                style={[styles.botonAdmin,btnAnimation]}
            >
                <Text style={styles.label2}>Admin Log In</Text>
            </Animated.View>
        </TouchableWithoutFeedback>

        <View style={styles.container}>
            <Image 
                source={require('../../assets/img/ic_white_c.png')}
                style={styles.logoA}
            />

            <TouchableOpacity 
                style={[styles.boton]}
                onPress={() => {check='in', handleCamera()}}
            >

                <Image 
                    source={require('../../assets/img/profi.png')}
                    style={styles.profi}
                />
                <Text style={styles.label}> Check In </Text>
                <Image 
                    source={require('../../assets/img/profi.png')}
                    style={styles.profi}
                />
            </TouchableOpacity>

            <TouchableOpacity 
                style={[styles.boton2]}
                onPress={() => {check='out', handleCamera()}}
            >

                <Image 
                    source={require('../../assets/img/profi.png')}
                    style={styles.profi}
                />
                <Text style={styles.label}>Check Out</Text>
                <Image 
                    source={require('../../assets/img/profi.png')}
                    style={styles.profi}
                />
            </TouchableOpacity>
        
            
        </View>


        {modalAdminLog && (
            <Modal
                animationType='slide'
                visible = {modalAdminLog}
                onRequestClose={() =>{setModalAdminLog(!modalAdminLog)}}
            >
                <AdminLog/>

            </Modal>
        )}
    </ImageBackground>
  )
}

export default InitialScreen