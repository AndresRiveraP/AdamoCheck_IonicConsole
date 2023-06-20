import React, {useState,useRef } from 'react';
import { View, TouchableOpacity, StyleSheet,Image, Modal} from 'react-native';
import { RNCamera } from 'react-native-camera';
import Video from 'react-native-video';

import Verified from './Verified';
import Unverified from './Unverified';

const CameraScreen = ({check,navigation}) => {
  const cameraRef = useRef(null);
  const [cameraView,setCameraView] = useState(true)
  const [capturedImage, setCapturedImage] = useState(null);
  const [imageDisplay,setImageDisplay] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [modalVerified,setModalVerified] = useState(false);
  const [modalUnverified,setModalUnverified] = useState(false);
  const [response, setResponse] = useState(0);

  var answer = null;
  
  const takePicture = async () => {
    if (cameraRef.current) {
      const options = { quality: 0.5, base64: true };
      const data = await cameraRef.current.takePictureAsync(options);
      console.log(data.uri); // Imagen capturada
      setCapturedImage(data.uri);
      setCameraView(false)
      setImageDisplay(true)

      setTimeout(() => {
        setImageDisplay(false);
        setShowLoading(true);
        simulateAPIResponse();
      }, 1500);
    }
  };


  const validVerify = () => {
    if(answer == 0){
      setModalVerified(true);
    }
    else{
      setModalUnverified(true);
    }

    setTimeout(() =>{
      setModalVerified(false)
      setModalUnverified(false)
      navigation.navigate('InitialScreen')
    }, 5000);
  };

  const simulateAPIResponse = () => {
    // Simulamos respuesta de API después de 5 segundos
    setTimeout(() => {
      setShowLoading(false);
      answer = parseInt(Math.floor(Math.random() * 2));
      setResponse(answer);
      console.log(answer);
      validVerify();
    }, 5000);
  };



  return (
    <View style={styles.container}>
      {cameraView ? (
        <View style={styles.container}>
          <RNCamera
            ref={cameraRef}
            style={styles.camera}
            type={RNCamera.Constants.Type.front}
            captureAudio={false}
          />
          <TouchableOpacity style={styles.button} onPress={takePicture}>
            {/* Your capture button UI */}
          </TouchableOpacity>
        </View>
      ):(
        <View>
          {imageDisplay && (
            <Image source={{ uri: capturedImage }} style={styles.image} />
          )}

          {showLoading && (
            <Modal
              animationType='slide'
              style={styles.modalLoading}
            >
              <Video
                source={require('../../../assets/gif/eye.mp4')} 
                style={styles.videoContainer}
                resizeMode="contain"
                repeat={true}
                paused={false}
              />
            </Modal>
          )}

          {modalVerified && (
            <Modal
              animationType='fade'
              onRequestClose={() =>{setModalVerified(!modalVerified)}}
            >
              <Verified/>
            </Modal>
          )}

          {modalUnverified && (
            <Modal
              animationType='fade'
              onRequestClose={() =>{setModalUnverified(!modalUnverified)}}
            >
              <Unverified/>
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
  button: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    padding: 25,
    borderRadius: 32,
    backgroundColor: 'white',
  },
  image: {
    width: '100%',
    height :'100%',
    resizeMode: 'cover',
  },
  modalLoading:{
    flex:1,
    justifyContent: 'center',
  },
  videoContainer: {
    zIndex: 1,
    width:'60%',
    height: '100%',
    alignSelf: 'center',
    backgroundColor: '#fff'
  },
});

export default CameraScreen;
