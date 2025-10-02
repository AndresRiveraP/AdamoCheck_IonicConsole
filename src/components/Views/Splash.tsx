import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useRef } from "react";
import {Image,View, Animated, StyleSheet, Dimensions,} from 'react-native';
import { NavigationProp } from "@react-navigation/native";
import Video from "react-native-video";


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

const Splash = ({ navigation }: { navigation: NavigationProp<any> }) => {
  const fadeAnim = new Animated.Value(1);
  const enterAnim = useRef(new Animated.Value(0)).current;
  var initialRoute = "";

  useEffect(() => {
    
    Animated.timing(enterAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    const fetchData = async () => {
      const user = await AsyncStorage.getItem("user");
      const key = await AsyncStorage.getItem("key");
      initialRoute = (user && key) ? 'InitialScreen' : 'InternalLogin';
    };
    fetchData();
    
    const fadeOut = Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
    });

    setTimeout(() => {
      fadeOut.start(() => {
        navigation.navigate(initialRoute as never);
      });
    }, 2000);
    
    return () => {
      fadeOut.stop();
    };
  }, []);


  const frontStyle = {
    opacity: enterAnim,
    transform: [
      {
        scale: enterAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [1.3, 1],
        }),
      },
    ],
  };

  return(
    <Animated.View style={[styles.container, {opacity: fadeAnim}]}>
      <View style={styles.container}>
        
          <Animated.Image
            source={require('../../assets/img/backgroundTop.png')}
            style={[styles.topDecoration, frontStyle]}
          />
        

        <Video
          source={require('../../assets/check2.mp4')}
          style={styles.image}
          resizeMode="contain"
          controls={false}
          paused={false}
          repeat={false}
          muted={true}
          onBuffer={(e) => console.log('buffering', e)}
          onError={(e) => console.log('error', e)}
          ignoreSilentSwitch="ignore"
        />

        <View>
          <Animated.Image
            source={require('../../assets/img/AdamoByHBPO2.png')}
            style={[styles.logo, frontStyle]}
          />
          <Animated.Image
            source={require('../../assets/img/backgroundBottonDecoration2.png')}
            style={[styles.bottonDecoration, frontStyle]}
          />
        </View>
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#78910F',
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
  topDecoration: {
    position: 'absolute',
    width: '100%',
    height: '30%',
    top: 0,
    left: 0
  },
  logo: {
    position: 'absolute',
    resizeMode: 'contain',
    width: '30%',
    height: scaleHeightSize(50),
    bottom: 0,
    marginBottom: '10%',
    alignSelf: 'center'
  },
  bottonDecoration: {
    position: 'absolute',
    width: '50%',
    height: scaleHeightSize(200),
    bottom: 0,
    left: 0
  },
  image: {
    width: '300%',
    height: '100%',
    resizeMode: 'contain',
    alignSelf: 'center',
    justifyContent: 'center',
    zIndex: -1
  },
  title: {
    fontFamily: 'Guitar-Acoustic',
    fontSize: scaleFontSize(50),
    top: '-10%',
  },
});

export default Splash;