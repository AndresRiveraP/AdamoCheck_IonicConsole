import React from 'react';

import {View,  StyleSheet,Dimensions,Platform, StatusBar} from 'react-native';
import Navigator from './src/components/Views/Navigator';
import Toast from 'react-native-toast-message';
import toastConfig from './src/config/toastConfig'; 

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
const App = () => {  
  return (
      <>
        {Platform.OS === 'ios' && (
          <StatusBar 
            barStyle="light-content" 
            backgroundColor="transparent" 
            translucent={true}
            hidden={false}
          />
        )}
        <View style={styles.container}>
          <Navigator initialRouteName='UnverifiedNew' />
          <Toast config={toastConfig} />
        </View>
      </>
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

//FQ I'm proud of you