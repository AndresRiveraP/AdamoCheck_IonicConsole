import {StyleSheet, Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');

const baseWidth = 768;
const baseHeight = 1024; // You can set a base height if needed

const calculateWidth = size => {
  return size * (width / baseWidth);
};

const calculateHeight = size => {
  return size * (height / baseHeight);
};

const calculateFontSize = size => {
  return size * (width / baseWidth);
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
    width: calculateWidth(0.8 * baseWidth), // 52% of base width
    height: calculateHeight(0.4 * baseHeight), // 52% of base height
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  boton: {
    width: '60%',
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 50,
    padding: 20,
    marginTop: '5%',
  },
  boton2: {
    width: '60%',
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
    fontSize: calculateFontSize(15),
    paddingHorizontal: 40,
  },
  label2: {
    color: '#000',
    textAlign: 'center',
    fontSize: calculateFontSize(16),
    fontFamily: 'Noto Sans, sans-serif',
  },
});
