import React, {useState} from 'react'
import { ImageBackground,StyleSheet,View, Image, Pressable, Text,Modal} from 'react-native'
import { ViewPropTypes } from 'deprecated-react-native-prop-types';

import CameraScreen from './CameraScreen'
import AdminLog from './AdminLog';

const InitialScreen = () => {
  const [modalCamera, setModalCamera] = useState(false)
  const [modalAdminLog, setModalAdminLog] = useState(false)
  
  const handleCamera = () => {
    console.log('Setteaado')
    setModalCamera(true)
  }

  const handleAdmin = () =>{
    console.log('To Admin')
    setModalAdminLog(true)
  }

  return (
    <ImageBackground
          source={require('../../../assets/img/imgBG01.png')}
          style={styles.background}
    >

            <Pressable
                style={styles.botonAdmin}
                onPress={() => handleAdmin()}
            >
                <Text style={styles.label2}>Log In As Admin</Text>
            </Pressable>

            <View style={styles.container}>
                <Image 
                source={require('../../../assets/img/ic_white_c.png')}
                 style={styles.logoA}
                />

                <Pressable
                    style={styles.boton}
                    onPress={() => handleCamera()}
                >
                    <Image 
                        source={require('../../../assets/img/profi.png')}
                        style={styles.profi}
                    />
                    <Text style={styles.label}>Check Your ID</Text>
                    <Image 
                        source={require('../../../assets/img/profi.png')}
                        style={styles.profi}
                    />
                </Pressable>
            </View>

            {modalCamera && (
                <Modal
                    animationType='slide'
                    visible = {modalCamera}
                    onRequestClose={() =>{setModalCamera(!modalCamera)}}
                >
                    <CameraScreen/>

                </Modal>
            )}

            {modalAdminLog && (
                <Modal
                    animationType='fade'
                    visible = {modalAdminLog}
                    onRequestClose={() =>{setModalAdminLog(!modalAdminLog)}}
                >
                    <AdminLog/>

                </Modal>
            )}
    </ImageBackground>

  )
}

const styles = StyleSheet.create({
    background:{
        flex:1,
        resizeMode: 'cover',
        justifyContent:'space-around',
    },
    container:{
        justifyContent : 'center',
        alignItems: 'center'
    },
    logoA :{
        maxWidth: '50%',
        maxHeight: '50%',
        resizeMode: 'contain',
        alignSelf : 'center'
    },
    boton:{
        flexDirection : 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#9cd0de',
        borderRadius: 50,
        padding: 20,
        marginTop: 40,
    },
    botonAdmin:{
        alignSelf:'flex-end',
        alignItems: 'flex-end',
        backgroundColor: '#FFF',
        marginHorizontal: 20,
        borderRadius: 50,
        padding: 15,
        right: 10,
    }, 
    profi:{
        maxWidth: 20,
        maxHeight: 20,
        resizeMode: 'contain',
    },
    label:{
        color : '#FFF',
        fontSize: 16,
        paddingHorizontal: 50,
    },
    label2:{
        color : '#000',
        fontSize: 16,
    }
})

export default InitialScreen