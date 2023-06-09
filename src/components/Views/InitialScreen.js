import React, {useState} from 'react'
import { ImageBackground,StyleSheet,View, Image, Pressable, Text,Modal} from 'react-native'
import { ViewPropTypes } from 'deprecated-react-native-prop-types';

import CameraScreen from './CameraScreen'
import AdminLog from './AdminLog';
import styles from '../../styles/InitialScreenStyles.js'

const InitialScreen = () => {
  const [modalCamera, setModalCamera] = useState(false)
  const [modalAdminLog, setModalAdminLog] = useState(false)
  
  const handleCamera = () => {
    setModalCamera(true)
  }

  const handleAdmin = () =>{
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
                    <Text style={styles.label}>Check In</Text>
                    <Image 
                        source={require('../../../assets/img/profi.png')}
                        style={styles.profi}
                    />
                </Pressable>
                <Pressable
                    style={styles.boton2}
                    onPress={() => handleCamera()}
                >
                    <Image 
                        source={require('../../../assets/img/profi.png')}
                        style={styles.profi}
                    />
                    <Text style={styles.label}>Check Out</Text>
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

export default InitialScreen