import React, {useState} from 'react'
import { ImageBackground,View, Image, Text,Modal,TouchableOpacity} from 'react-native'


import AdminLog from './AdminLog';
import styles from '../../styles/globStyles.js'


const InitialScreen = ({navigation}) => {
  const [modalAdminLog, setModalAdminLog] = useState(false)
  var check = null;

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
        <TouchableOpacity
            onPress={ () => {handleAdmin()}}
            style={styles.botonAdmin}
        >
            <Text style={styles.label2}>Admin {'\n'}<Text style={{ fontWeight: 'bold' }}>Log In</Text></Text>
        </TouchableOpacity>

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