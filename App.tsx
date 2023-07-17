import React, {useState,useEffect} from 'react';

import {
  Image,
  View,
  StyleSheet,
  Animated,
  SafeAreaView,
} from 'react-native';

import Navigator from './src/components/Views/Navigator'

const SplashScreen = () => (
  <View style={styles.container}>
    <Image
      source={require('./src/assets/img/ic.png')}
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
    }, 1500); 

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
        <Navigator />
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

