import React, {useState,useEffect,useRef} from 'react';

import {
  Image,
  View,
  StyleSheet,
  ImageBackground,
  Animated,
  SafeAreaView,
} from 'react-native';
import { Easing } from 'react-native-reanimated';

import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = () => (
  <View style={styles.container}>
    <Image
      source={require('./assets/img/ic.png')}
      style={styles.image}
    />
  </View>
);

const App = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setShowSplash(false);
    }, 2500); 
  }, []);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000, 
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {showSplash ? (
        <SplashScreen />
      ):(
        <ImageBackground
          source={require('./assets/img/imgBG01.png')}
          style={[styles.background,{opacity : fadeAnim}]}
        >

        </ImageBackground>
      )}
      
    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor :'#FFF'
  },
  background:{
    flex:1,
    resizeMode: 'cover',
    justifyContent:'center',
  },
  image: {
    maxHeight: 200,
    maxWidth: 200,
    top: '40%',
    resizeMode: 'contain',
    alignSelf: 'center'
  },
});

export default App;

