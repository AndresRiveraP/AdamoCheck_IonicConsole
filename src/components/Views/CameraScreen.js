import React, { useEffect,useState,useRef } from 'react';
import { View, TouchableOpacity, StyleSheet,Image, Modal} from 'react-native';
import axios from 'axios';
import { RNCamera } from 'react-native-camera';
import Video from 'react-native-video';


const CameraScreen = ({check,setModalCamera}) => {
  const cameraRef = useRef(null);
  const [cameraView,setCameraView] = useState(true)
  const [capturedImage, setCapturedImage] = useState(null);
  const [imageDisplay,setImageDisplay] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [response, setResponse] = useState(null);

  var checkType = check;
  
  const takePicture = async () => {
    if (cameraRef.current) {
      const options = { quality: 0.5, base64: true };
      const data = await cameraRef.current.takePictureAsync(options);
      console.log(data.uri); // Dirección de imagen capturada
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

  const simulateAPIResponse = () => {
    // Simulate API response after 2 seconds
    setTimeout(() => {
      setShowLoading(false);
      setModalCamera(false);
      setResponse('API response');
    }, 15000);
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
                source={require('../../../assets/gif/LoadingScreen.mp4')} 
                style={styles.videoContainer}
                resizeMode="cover"
                repeat={true}
                paused={false}
              />
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
  videoContainer: {
    flex: 1,
    zIndex: 1,
    width:'100%',
    height: '100%'
  },
});

export default CameraScreen;
