import React, {useState,useRef } from 'react';
import { SafeAreaView, View, TouchableOpacity, StyleSheet,Image, Modal, Text, ImageBackground} from 'react-native';
import { RNCamera } from 'react-native-camera';

import LoadingModal from './LoadingModal';

const CameraScreen = ({route,navigation}) => {
  const check = route.params.check;
  const cameraRef = useRef(null);
  const [cameraView,setCameraView] = useState(true)
  const [capturedImage, setCapturedImage] = useState('');
  const [countdown, setCountdown] = useState(3);
  const [countdownColor, setCountdownColor] = useState('white');
  const [showLoading, setShowLoading] = useState(false);
  var payload = null;

  const startCountdown = () => {
    setCountdownColor('#FE9228');
    const timer = setInterval(() => {
      setCountdown((prevCount) => prevCount - 1);
    }, 800);

    setTimeout(() => {
      clearInterval(timer);
      takePicture();
    }, 3000);
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      const options = { quality: 0.5, base64: true };
      const data = await cameraRef.current.takePictureAsync(options);
      setCapturedImage(data.uri);
      
      setTimeout(() => {
        setCameraView(false)
        setShowLoading(true);
        gotoAPIResponse(data.base64);
      }, 1000);
  };

  const verifyResponse = (res) =>{
    if(res["message"] == 'Not Found'){
      navigation.navigate('Unverified')
    }
    else if(res["message"] == 'Ok'){
      payload = res["payload"]
      navigation.navigate('Verified', {payload,check});
    }
    else{
      console.log(res["message"])
    }
  }

  const gotoAPIResponse = async (base64Data) => {
    //Respuesta de la API
    //console.log(base64Data);
    try{
        fetch('https://adamo-onboarding-qa.limboteams.com/onboarding-processes/get-user-details-by-face', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "faceImage" : base64Data
        }),
      })
      .then(response => response.text())
      .then((data) => {
        setShowLoading(false);
        console.log(data)
        const res = JSON.parse(data)
        verifyResponse(res);
      });
    }
    catch(error){
      console.log(error)
    }
  };

}

  return (
    <SafeAreaView style={styles.container}>
      {cameraView ? (
        <View style={styles.container}>
          
          <RNCamera
            ref={cameraRef}
            style={styles.camera}
            type={RNCamera.Constants.Type.front}
            captureAudio={false}
          >
            <ImageBackground
              source={require('../../assets/img/topcamera1.png')}
              style={styles.topC}
            >
              <Image
               source={require('../../assets/img/ic_white_c.png')}
                style={styles.logoAID}
              />
            </ImageBackground>

          </RNCamera>
        </View>
      ):(
        <View>
          {showLoading && (
            <Modal
              animationType='slide'
              style={styles.modalLoading}
            >
              <LoadingModal/>
            </Modal>
          )}
          
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  topC :{
    top: 0,
    resizeMode: 'cover',
  },
  bottomC:{
    bottom: 0,
  },
  logoAID:{
    position: 'absolute',
    width : '30%',
    resizeMode: 'contain',
    alignSelf: 'center'
  },
  button: {
    position: 'absolute',
    bottom: 30,
    borderColor : 'white',
    borderWidth : 5,
    alignSelf: 'center',
    padding: 25,
    borderRadius: 100,
    width:'15%',
    height: '10%',
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height :'100%',
    resizeMode: 'cover',
  },
  coutdownText : {
    fontSize: 34, 
    fontWeight: 'bold', 
  },
  modalLoading:{
    flex:1,
    justifyContent: 'center',
  },
});

export default CameraScreen;
