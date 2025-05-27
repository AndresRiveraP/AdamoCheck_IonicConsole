import React, { useState, useRef, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  Text,
  Dimensions,
} from 'react-native';
import { RNCamera, TakePictureResponse } from 'react-native-camera';
import LoadingModal from './LoadingModal';
import oneFaceData from '../../assets/apiTesters/1face.json'; // Import the JSON file
import twoFacesData from '../../assets/apiTesters/2facesR.json'; 

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface CameraScreenProps {
  route: {
    params: {
      check: string;
    };
  };
  navigation: {
    navigate: (
      screen: string,
      params?: { payload?: any; check?: string },
    ) => void;
  };
}

const CameraScreen: React.FC<CameraScreenProps> = ({ route, navigation }) => {
  const check = route.params.check;
  const cameraRef = useRef<RNCamera>(null);
  const [cameraView, setCameraView] = useState<boolean>(true);
  const [showLoading, setShowLoading] = useState<boolean>(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isTestMode, setIsTestMode] = useState<boolean>(false);
  
  let payload: any = null;

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isTestMode) {
        setCameraView(false);
        setShowLoading(true);
        gotoAPIResponse(twoFacesData.image); 
      } else {
        takePicture();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [isTestMode]);

  const takePicture = async () => {
    if (cameraRef.current) {
        const options = { 
        quality: 0.75, 
        base64: true,
        width: undefined, 
        height: undefined,
        fixOrientation: true,
        forceUpOrientation: true
      };

      try {
        const data: TakePictureResponse = await cameraRef.current.takePictureAsync(options);
        setCapturedImage(data.uri);
        const base64String = data.base64 ?? '';

        setTimeout(() => {
          setCameraView(false);
          setShowLoading(true);
          gotoAPIResponse(base64String);
        }, 1000);
      } catch (error) {
        console.log('Error taking picture: ', error);
      }
    }
  };

  const toggleTestMode = () => {
    setIsTestMode(!isTestMode);
  };

  const verifyResponse = (res: any) => {
    console.log('Response from API:\n\n', res);

    if (res.statusCode !== 200) {
      navigation.navigate('Unverified', { check });
    } else if (res.statusCode === 200 && res.body.matches.length > 0) {
      console.log("Payload Sent: ", res.body.matches);
      payload = res.body.matches;
      switch (payload.length) {
        case 1:
          navigation.navigate('Verified', {payload, check });
          break;
        case 2:
          navigation.navigate('Verified2', { payload, check });
          break;
        case 3: 
          navigation.navigate('Verified3', { payload, check });
          break;
        default:
          navigation.navigate('Verified', {payload, check });
          break;
      }
    } else {
      console.log(`${res['message']}`);
    }
  };

  const gotoAPIResponse = async (base64Data: string) => {
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
      setShowLoading(false);
      const res = JSON.parse(data);
      verifyResponse(res);
    } catch (error) {
      console.log('API call error: ', error);
    }
  };

  return (
    <View style={styles.container}>
      {cameraView ? (
        <SafeAreaView style={styles.container}>
          <RNCamera
            ref={cameraRef}
            style={styles.camera}
            type={RNCamera.Constants.Type.front}
            captureAudio={false}
            ratio="16:9"
            defaultVideoQuality={RNCamera.Constants.VideoQuality["1080p"]}
            >
            <View style={styles.top}>
              <Image
                source={require('../../assets/img/topC.png')}
                style={styles.topC}
              />
              <Image
                source={require('../../assets/img/logoCheck.png')}
                style={styles.logoAID}
              />
              <Text style={styles.checkText}>
                {check === 'in' ? 'Check In' : 'Check Out'}
              </Text>
            </View>

            <View style={styles.bottom}>
              <Image
                source={require('../../assets/img/bottomC.png')}
                style={styles.bottomC}
              />

              <TouchableOpacity
                style={styles.touchableCamera}
                onPress={toggleTestMode}>
                <View style={styles.cameraBtn}>
                  <Image
                    source={require('../../assets/gif/elipsis.gif')}
                    style={styles.cameraAID}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </RNCamera>
        </SafeAreaView>
      ) : (
        <View>
          {showLoading && (
            <Modal animationType="slide" style={styles.modalLoading}>
              <LoadingModal />
            </Modal>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  top: {
    display: 'flex',
    flexDirection: 'column',
    height: '25%',
    width: '100%',
  },
  topC: {
    position: 'absolute',
    top: 0,
    resizeMode: 'contain',
    zIndex: -1,
  },
  logoAID: {
    position: 'relative',
    width: '50%',
    height: '50%',
    resizeMode: 'contain',
    marginTop: '10%',
    alignSelf: 'center',
  },
  checkText: {
    color: '#fff',
    fontFamily: 'Guitar-Acoustic',
    textAlign: 'center',
    fontSize: 50,
  },
  gif: {
    alignSelf: 'center',
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
  },
  bottom: {
    position: 'absolute',
    bottom: 0,
    height: '25%',
    width: '100%',
  },
  bottomC: {
    position: 'absolute',
    bottom: 0,
    resizeMode: 'contain',
    zIndex: -2,
  },
  touchableCamera: {
    position: 'relative',
    maxHeight: '30%',
    marginTop: '15%',
  },
  cameraAID: {
    width: '125%',
    height: '125%',
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  cameraBtn: {
    alignItems: 'center',
  },
  button: {
    position: 'absolute',
    bottom: 30,
    borderColor: 'white',
    borderWidth: 5,
    alignSelf: 'center',
    padding: 25,
    borderRadius: 100,
    width: '15%',
    height: '10%',
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  coutdownText: {
    fontSize: 34,
    fontWeight: 'bold',
  },
  modalLoading: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default CameraScreen;