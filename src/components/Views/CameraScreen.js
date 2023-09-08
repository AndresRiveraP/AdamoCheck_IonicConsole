import React, {useState,useRef } from 'react';
import { View, TouchableOpacity, StyleSheet,Image, Modal} from 'react-native';
import { RNCamera } from 'react-native-camera';

import LoadingModal from './LoadingModal';

const CameraScreen = ({route,navigation}) => {
  const check = route.params.check;
  const cameraRef = useRef(null);
  const [cameraView,setCameraView] = useState(true)
  const [capturedImage, setCapturedImage] = useState('');
  const [imageDisplay,setImageDisplay] = useState(false);

  const [showLoading, setShowLoading] = useState(false);
  var payload = null;

  const takePicture = async () => {
    if (cameraRef.current) {
      const options = { quality: 0.5, base64: true };
      const data = await cameraRef.current.takePictureAsync(options);
      setCapturedImage(data.uri);
      setCameraView(false)
      setImageDisplay(true)

      setTimeout(() => {
        setImageDisplay(false);
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
            {/* Capture button UI */}
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
              <LoadingModal/>
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
});

export default CameraScreen;
