import React, { useState,useRef } from 'react';
import { View, TouchableOpacity, StyleSheet,Image} from 'react-native';
import axios from 'axios';
import { RNCamera } from 'react-native-camera';

const CameraScreen = ({check}) => {
  const cameraRef = useRef(null);
  const [cameraView,setCameraView] = useState(true)
  const [capturedImage, setCapturedImage] = useState(null);
  const [response, setResponse] = useState(null);

  const takePicture = async () => {
    if (cameraRef.current) {
      const options = { quality: 0.5, base64: true };
      const data = await cameraRef.current.takePictureAsync(options);
      console.log(data.uri); // The captured image URI
      setCapturedImage(data.uri);
      setCameraView(false)
    }
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
          <Image source={{ uri: capturedImage }} style={{width: '100%', height: '100%',resizeMode:'cover'}} />
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
    width: 200,
    height: 200,
    resizeMode: 'cover',
    bottom: '30%',
    left: '25%'
  },
});

export default CameraScreen;
