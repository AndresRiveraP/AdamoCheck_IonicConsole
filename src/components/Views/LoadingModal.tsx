import React, { useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, View, Dimensions, Text, TouchableOpacity, TextInput, PixelRatio, ToastAndroid } from 'react-native';
import Video from 'react-native-video';
import AnimatedScreenWrapper from './AnimatedScreenWrapper';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LoadingScreenProps {
  route: {
    params: {
      base64Data: string;
      check: string;
      source?: string;
      documentId?: string;
    };
  };
  navigation: any;
}

const { width, height } = Dimensions.get('window');

function sp(size: number) {
    return PixelRatio.getFontScale() * size;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ route, navigation }) => {
  const [user, setUser] = useState<string | null>(null);
  const [apiCallError, setApiCallError] = useState(false);
  const [documentId, setDocumentId] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      setUser(storedUser);
    };

    fetchUser();

    const processData = async () => {
      const { source, base64Data, check, documentId } = route.params;

      try {
        if (!source || source === 'camera') {

          // console.log('User being sent:', user);

          const response = await fetch(
            'https://uqj2wa6v80.execute-api.us-east-2.amazonaws.com/dev/compare-face',
            {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                image: base64Data,
                user: user,
              }),
            },
          );
          
          const data = await response.text();
          const res = JSON.parse(data);

          console.log('API response:', res);
          
          if (res.statusCode !== 200) {
            navigation.replace('Unverified', { check });
          } else if (res.statusCode === 200 && res.body.matches.length > 0) {
            const payload = res.body.matches;
            switch (payload.length) {
              case 1:
                navigation.replace('VerifiedNew', {payload, check});
                break;
              case 2:
                navigation.replace('Verified2New', { payload, check });
                break;
              case 3:
                navigation.replace('Verified3New', { payload, check });
                break;
              default:
                navigation.replace('Verified', { payload, check });
                break;
            }
          } else {
            navigation.replace('Unverified', { check });
          }
        } else if (source === 'unverified' && documentId) {
          const response = await fetch('https://adamocheckback-ult.up.railway.app/api/logs/unverified', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({identification: documentId}),
          });
          
          const result = await response.json();
          
          if (response.ok) {
            console.log('Employee fetched successfully:', result);

            let payload;
            
            if (Array.isArray(result) && result[0]?.employee) {
              payload = {
                id: result[0].employee.idNumber,
                name: result[0].employee.name,
                lastname: result[0].employee.lastname,
              };
            } else if (result.idNumber) {
              payload = {
                id: result.idNumber,
                name: result.name,
                lastname: result.lastname,
              };
            } else {
              navigation.replace('Unverified', { check });
              return;
            }

            navigation.replace('VerifiedNew', { payload: [payload], check });
          } else {
            console.error('Error fetching employee:', result.message);
            navigation.replace('Unverified', { check });
          }
        }
      } catch (error) {
        console.log('API call error: ', error);
        setApiCallError(true);
      }
    };

    processData();
  }, [route.params, navigation]);

  return (
    <AnimatedScreenWrapper>
        <SafeAreaView style={styles.container}>
          <View style={styles.videoWrapper}>
            <Video
              source={require('./assets/gif/eye.mp4')}
              style={styles.videoContainer}
              resizeMode="contain"
              repeat={true}
              paused={false}
              disableFocus={true}
            />
          </View>

          {apiCallError && (
            <>
              <View style={{top:'-10%' , alignItems: 'center' }}>
                <Text style={{ fontSize: sp(35), fontWeight: '500', color: 'red', textAlign: 'center' }}>There seems to be a latency failure. {'\n'} Please retry or type your ID.</Text>
                <View>
                  <TouchableOpacity style={{ marginTop: 20, padding: 10, backgroundColor: '#000', borderRadius: 5 }} onPress={() => navigation.navigate('InitialScreen')}>
                    <Text style={{ fontSize: sp(25), fontWeight: '400', color: 'white', textAlign: 'center' }}>Retry</Text>
                  </TouchableOpacity>

                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      placeholder='Your ID Here'
                      placeholderTextColor='#d1d1d1'
                      keyboardType='numeric'
                      maxLength={15}
                      textAlign='center'
                      value={documentId}
                      onChangeText={setDocumentId}
                    />
                  </View>     

                    <TouchableOpacity 
                      style={{
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        backgroundColor: '#2bbfed', 
                        borderRadius: 10,
                        paddingVertical: 10, 
                        paddingHorizontal: 20 
                      }}  
                      onPress={() => [ToastAndroid.show('Your ID is stored for today', ToastAndroid.SHORT), navigation.navigate('InitialScreen')]}
                    >
                      <Text style={{ fontSize: sp(25), color: '#000', alignSelf: "center" }}>Continue</Text>
                    </TouchableOpacity>
                    </View>
                </View>
            </>
            )}
        </SafeAreaView>
    </AnimatedScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    width: '100%',
    height: '100%',
  },
  videoWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF', 
    width: '100%',
    height: '100%',
  },
  videoContainer: {
    width: width * 0.6,
    height: height * 0.6, 
    alignSelf: 'center',
  },
  inputContainer: {
    marginTop: 20,
    width: '50%',
  },
  input: {
    display: 'flex',
    alignContent: 'center',
    justifyContent: 'center',
    paddingHorizontal: '10%',
    paddingVertical: '3%',
    borderWidth: 2,
    borderColor: '#FFF',
    borderRadius: 35,
    shadowColor: '#000',
    fontWeight: '500',
    fontSize: sp(30),
  },
});

export default LoadingScreen;