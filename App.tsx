import React, {useState, useEffect} from 'react';

//Apollo
import client from './config/apollo';
import {ApolloProvider} from '@apollo/client';

import {
  Image,
  View,
  Animated,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Text,
} from 'react-native';

import Navigator from './src/components/Views/Navigator';

const {width} = Dimensions.get('window');

const scaleFontSize = (size: number) => {
  const guidelineBaseWidth = 350;
  return (width / guidelineBaseWidth) * size;
};

const SplashScreen = () => (
  <View style={styles.container}>
    <Image
      source={require('./src/assets/img/logoCheck.png')}
      style={styles.image}
    />
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        top: '-10%',
      }}>
      <Text
        style={{
          fontFamily: 'Guitar-Acoustic',
          fontSize: scaleFontSize(50),
          color: '#fff',
        }}>
        adamo
      </Text>
      <Text
        style={{
          fontFamily: 'Guitar-Acoustic',
          fontSize: scaleFontSize(50),
          color: '#fff',
          opacity: 0.4,
        }}>
        check
      </Text>
    </View>
  </View>
);

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const fadeAnim = new Animated.Value(1);

  useEffect(() => {
    const fadeOut = Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 30000,
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
    <ApolloProvider client={client}>
      <SafeAreaView style={styles.container}>
        {showSplash ? (
          <Animated.View style={[styles.container, {opacity: fadeAnim}]}>
            <SplashScreen />
          </Animated.View>
        ) : (
          <Navigator />
        )}
      </SafeAreaView>
    </ApolloProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, //DON'T TOUCH
    backgroundColor: '#1f1f1f',
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'center',
    justifyContent: 'center',
  },
  image: {
    top: '-10%',
    width: '40%',
    height: '40%',
    resizeMode: 'contain',
    alignSelf: 'center',
    justifyContent: 'center',
  },
});

export default App;
