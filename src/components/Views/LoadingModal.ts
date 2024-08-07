import React from 'react'
import { StyleSheet } from 'react-native';
import Video from 'react-native-video';

const LoadingModal = () => {
  return (
    <Video
        source={require('../../assets/gif/eye.mp4')} 
        style={styles.videoContainer}
        resizeMode="contain"
        repeat={true}
        paused={false}
    />
  )
}

const styles = StyleSheet.create({
    videoContainer: {
        zIndex: 1,
        width:'60%',
        height: '100%',
        alignSelf: 'center',
        backgroundColor: '#fff'
    },
})

export default LoadingModal