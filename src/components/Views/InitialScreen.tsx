import React, {useState} from 'react';
import {
  ImageBackground,
  View,
  Image,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import AdminLog from './AdminLog';
import styles from '../../styles/globStyles';

interface InitialScreenProps {
  navigation: {
    navigate: (screen: string, params?: {check: string | null}) => void;
  };
}

const InitialScreen: React.FC<InitialScreenProps> = ({navigation}) => {
  const [modalAdminLog, setModalAdminLog] = useState<boolean>(false);
  let check: string | null = null;

  const handleCamera = () => {
    navigation.navigate('CameraScreen', {check});
  };

  const handleAdmin = () => {
    setModalAdminLog(true);
  };

  return (
    <ImageBackground
      source={require('../../assets/img/backGround.png')}
      style={styles.background}>
      <TouchableOpacity onPress={handleAdmin} style={styles.botonAdmin}>
        <Text style={styles.label2}>
          Admin {'\n'}
          <Text style={{fontWeight: 'bold'}}>Log In</Text>
        </Text>
      </TouchableOpacity>

      <View style={styles.container}>
        <Image
          source={require('../../assets/img/logoCheck.png')}
          style={styles.logoA}
        />
        <Text style={{fontFamily: 'Guitar-Acoustic'}}>adamo<Text>check</Text></Text>

        <TouchableOpacity
          style={[styles.boton]}
          onPress={() => {
            check = 'in';
            handleCamera();
          }}>
          <Image
            source={require('../../assets/img/profi.png')}
            style={styles.profi}
          />
          <Text style={styles.label}>Check In</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.boton2]}
          onPress={() => {
            check = 'out';
            handleCamera();
          }}>
          <Image
            source={require('../../assets/img/profi.png')}
            style={styles.profi}
          />
          <Text style={styles.label}>Check Out</Text>
        </TouchableOpacity>
      </View>

      {modalAdminLog && (
        <Modal
          animationType="slide"
          visible={modalAdminLog}
          onRequestClose={() => setModalAdminLog(!modalAdminLog)}>
          <AdminLog />
        </Modal>
      )}
    </ImageBackground>
  );
};

export default InitialScreen;
