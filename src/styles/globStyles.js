import {StyleSheet, Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');

const guidelineBaseWidth = 350;
const guidelineBaseHeight = 680;

const scaleWidthSize = size => {
  return (width / guidelineBaseWidth) * size;
};

const scaleHeightSize = size => {
  return (height / guidelineBaseHeight) * size;
};

export default StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'space-around',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoA: {
    width: scaleWidthSize(100),
    height: scaleHeightSize(100),
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  boton: {
    width: scaleWidthSize(180),
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 50,
    padding: 20,
    marginTop: '5%',
  },
  boton2: {
    width: scaleWidthSize(180),
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 50,
    padding: 20,
    marginTop: '8%',
  },
  botonAdmin: {
    width: '30%',
    marginTop: 40,
    marginRight: '8%',
    alignSelf: 'flex-end',
    backgroundColor: '#FFF',
    borderRadius: 35,
    paddingVertical: 10,
  },
  profi: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  label: {
    color: '#FFF',
    fontSize: height * 0.02,
    paddingHorizontal: 40,
    fontFamily: 'Octarine-Light',
  },
  label2: {
    color: '#000',
    textAlign: 'center',
    fontSize: height * 0.02,
    fontFamily: 'Octarine-Light',
  },
});
