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
  ImageBackground,
} from 'react-native';

import Navigator from './src/components/Views/Navigator';

const {width, height} = Dimensions.get('window');
const guidelineBaseWidth = 350;
const guidelineBaseHeight = 680;

const scaleWidthSize = (size: number) => {
  return (width / guidelineBaseWidth) * size;
};

const scaleHeightSize = (size: number) => {
  return (height / guidelineBaseHeight) * size;
};

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
        style={[
          styles.title,
          {
            color: '#fff',
          },
        ]}>
        adamo
      </Text>
      <Text style={[styles.title, {color: '#2bbfed'}]}>check</Text>
    </View>
  </View>
);

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const fadeAnim = new Animated.Value(1);

  useEffect(() => {
    const fadeOut = Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 3000,
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
    backgroundColor: '1f1f1f',
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'center',
    justifyContent: 'center',
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'space-around',
  },
  image: {
    top: '-10%',
    width: scaleWidthSize(150),
    height: scaleHeightSize(150),
    resizeMode: 'contain',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'Guitar-Acoustic',
    fontSize: scaleFontSize(50),
    top: '-10%',
  },
});

export default App;
