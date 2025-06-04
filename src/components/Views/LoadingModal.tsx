import React, { useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, View, Dimensions, Text, TouchableOpacity, TextInput, PixelRatio } from 'react-native';
import Video from 'react-native-video';
import AnimatedScreenWrapper from './AnimatedScreenWrapper';

interface LoadingScreenProps {
  route: {
    params: {
      base64Data: string;
      check: string;
    };
  };
  navigation: any;
}

const { width, height } = Dimensions.get('window');

function sp(size: number) {
    return PixelRatio.getFontScale() * size;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ route, navigation }) => {
  const { base64Data, check } = route.params;
  const [apiCallError, setApiCallError] = useState(false);
  const [documentId, setDocumentId] = useState('');

  useEffect(() => {
    const processData = async () => {
      try {
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
            }),
          },
        );
        const data = await response.text();
        const res = JSON.parse(data);
        
        if (res.statusCode !== 200) {
          navigation.replace('Unverified', { check });
        } else if (res.statusCode === 200 && res.body.matches.length > 0) {
          const payload = res.body.matches;
          switch (payload.length) {
            case 1:
              navigation.replace('Verified', { payload, check });
              break;
            case 2:
              navigation.replace('Verified2', { payload, check });
              break;
            case 3:
              navigation.replace('Verified3', { payload, check });
              break;
            default:
              navigation.replace('Verified', { payload, check });
              break;
          }
        } else {
          navigation.replace('Unverified', { check });
        }
      } catch (error) {
        console.log('API call error: ', error);
        setApiCallError(true);
      }
    };

    processData();
  }, [base64Data, check, navigation]);

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
                <Text style={{ fontSize: 16, fontWeight: '500', color: 'red', textAlign: 'center' }}>There seems to be a connection failure. {'\n'} Please retry or type your ID.</Text>
                <View>
                  <TouchableOpacity style={{ marginTop: 20, padding: 10, backgroundColor: '#000', borderRadius: 5 }}>
                    <Text style={{ fontSize: 16, fontWeight: '300', color: 'white', textAlign: 'center' }} onPress={() => navigation.navigate('CameraScreen')}>Retry</Text>
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

                    <TouchableOpacity style={{display: 'flex', alignItems: 'center', backgroundColor: '#'}}  onPress={() => navigation.navigate('InitialScreen')}>
                    <Text style={{ fontSize: 16, color: '#000', marginTop: 20 }}>Continue</Text>
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
      width: '50%',
      border: '1px solid rgb(110, 110, 110)',
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
    fontSize: sp(20),
  },
});

export default LoadingScreen;