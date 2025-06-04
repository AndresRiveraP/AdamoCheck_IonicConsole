import {StyleSheet} from 'react-native';

import {
  scaleWidthSize,
  scaleHeightSize,
  scaleFontSize,
} from '../utils/scaleUtils';

export default StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'space-around',
  },

  container: {
    marginTop: '10%',
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
    width: scaleWidthSize(200),
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 50,
    padding: 20,
    marginTop: '5%',
  },
  boton2: {
    width: scaleWidthSize(200),
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 50,
    padding: 20,
    marginTop: '8%',
  },
  profi: {
    width: scaleWidthSize(20),
    height: scaleHeightSize(20),
    resizeMode: 'contain',
  },
  profi2: {
    width: scaleWidthSize(20),
    height: scaleHeightSize(20),
    marginLeft: '10%',
    marginRight: '5%',
  },
  label: {
    color: '#FFF',
    fontSize: scaleFontSize(12),
    paddingHorizontal: 40,
    fontFamily: 'Octarine-Light',
  },
  label2: {
    color: '#fff',
    textAlign: 'center',
    fontSize: scaleFontSize(10),
    fontFamily: 'Octarine-Light',
    fontWeight: 'bold',
  },
});
