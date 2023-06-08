import React, {useState,useEffect,useRef} from 'react';

import {
  Image,
  View,
  StyleSheet,
  ImageBackground,
  Animated,
  SafeAreaView,
} from 'react-native';

import InitialScreen from './src/components/Views/InitialScreen.js';
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
  const [showSplash, setShowSplash] = useState(true);
  const fadeAnim = new Animated.Value(1);

  useEffect(() => {
    const fadeOut = Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
    });

    setTimeout(() => {
      fadeOut.start(() => {
        setShowSplash(false);
      });
    }, 2000); 

    return () => {
      fadeOut.stop();
    };
  }, []);


  return (
    <SafeAreaView style={styles.container}>
      {showSplash ? (
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
          <SplashScreen />
        </Animated.View>
      ):(
        <InitialScreen />
      )}
      
    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor :'#FFF'
  },
  image: {
    top: '20%',
    maxWidth: 212,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
});

export default App;

