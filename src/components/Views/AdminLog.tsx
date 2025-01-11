import React, { useState } from 'react';
import { SafeAreaView, TextInput, Image, StyleSheet, View, Text, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback, TouchableOpacity, Modal} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

import LoadingModal from './LoadingModal';

import {
  scaleFontSize,
} from '../../utils/scaleUtils';

const AdminLog = ({ navigation }: { navigation: NavigationProp<any> }) => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(false);


  const validateForm = (): boolean => {
    if (id === '' || password === '') {
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      setError('Please fill all fields');
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please fill all fields',
        position: 'top',
        visibilityTime: 3000,
      });
      return;
    }
    try {
      setIsLoading(true);
      const response = await fetch('https://adamocheckback.up.railway.app/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, password }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Login failed: ${response.status} ${JSON.stringify(errorData)}`);
      }
  
      const data = await response.json();
      await AsyncStorage.setItem('user', JSON.stringify(data.user));
      
      setIsLoading(false);
      navigation.navigate('AdminScreen');
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Login successful',
        position: 'top',
        visibilityTime: 1000,
      });
    } catch (error) {
      setIsLoading(false);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error instanceof Error ? error.message : 'An unknown error occurred',
        position: 'top',
        visibilityTime: 3000,
      });
      console.error('Login error:', error);
    }
};
  const keyboardGone = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={keyboardGone}>
      <SafeAreaView style={styles.admon}>
        <KeyboardAvoidingView style={styles.keyboardAvoidingContainer} behavior="position">
          <View style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: '20%'}}>
            <Image
              source={require('../../assets/img/logoCheck.png')}
              style={{width: '40%', height: '40%', resizeMode: 'contain'}}
            />
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text
                style={{
                  fontFamily: 'Guitar-Acoustic',
                  fontSize: scaleFontSize(40),
                  color: '#fff',
                }}>
                adamo
              </Text>
              <Text
                style={{
                  fontFamily: 'Guitar-Acoustic',
                  fontSize: scaleFontSize(40),
                  color: '#fff',
                  opacity: 0.4,
                }}>
                check
              </Text>
            </View>
          </View>

          <View style={styles.fieldsC}>
            <View style={styles.field}>
              <Image source={require('../../assets/img/id.png')} style={styles.ico} />
              <TextInput
                placeholder="ID"
                placeholderTextColor="#000"
                style={styles.tInput}
                onChangeText={(text) => setId(text)}
              />
            </View>
            <View style={styles.field}>
              <Image source={require('../../assets/img/pass.png')} style={styles.ico} />
              <TextInput
                placeholder="Password"
                placeholderTextColor="#000"
                secureTextEntry
                style={styles.tInput}
                onChangeText={(text) => setPassword(text)}
              />
            </View>
            <View style={styles.fieldBoton}>
              <TouchableOpacity style={styles.boton} onPress={handleLogin}>
                <Image source={require('../../assets/img/enter.png')} style={styles.ico} />
                <Text style={styles.label}>Log In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>

        {isLoading && (
          <Modal animationType="fade" style={styles.modalLoading}>
            <LoadingModal />
          </Modal>
        )}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  admon: {
    flex: 1,
    backgroundColor: '#7bb0bf',
    fontFamily: 'Octarine-Bold',
  },
  keyboardAvoidingContainer: {
    flex: 1,
    alignItems: 'center',
  },
  fieldsC: {
    width: '70%',
    marginTop: '10%',
    justifyContent: 'center',
    alignContent: 'center',
  },
  image: {
    width: 212,
    height: 414,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  field: {
    flexDirection: 'row',
    alignContent: 'flex-start',
    alignItems: 'center',
    borderWidth: 2,
    paddingVertical: 10,
    marginBottom: 15,
    borderRadius: 10,
    borderColor: '#000',
    justifyContent: 'flex-start',
  },
  tInput: {
    flex: 0.9,
    color: "#000"
  },
  fieldBoton: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: '#000',
    backgroundColor: '#b9e4f4',
  },
  boton: {
    flexDirection: 'row',
    width: '100%',
  },
  ico: {
    alignSelf: 'flex-start',
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  label: {
    color: '#000',
    alignSelf: 'center',
  },
  modalLoading: {
    flex: 1,
    zIndex: 2,
    justifyContent: 'center',
  },
});

export default AdminLog;
