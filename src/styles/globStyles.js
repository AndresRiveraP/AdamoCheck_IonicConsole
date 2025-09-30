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
  },
  container: {
    marginTop: '25%',
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
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#617316',
    borderRadius: 70,
    width: scaleWidthSize(210),
    height: scaleHeightSize(70),
    // padding: 20,
    // paddingVertical: 20,
    marginTop: '13%',
    paddingLeft: '5%'
  },
  boton2: {
    width: scaleWidthSize(210),
    height: scaleHeightSize(70),
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#735616',
    borderRadius: 70,
    // padding: 20,
    marginTop: '5%',
    paddingLeft: '5%'
  },
  profi: {
    width: scaleWidthSize(20),
    height: scaleWidthSize(20),
    resizeMode: 'contain',
  },
  profi2: {
    width: scaleWidthSize(20),
    height: scaleWidthSize(20),
    resizeMode: 'contain',
    marginLeft: '1%'
  },
  label: {
    color: '#DCF576',
    fontSize: scaleFontSize(20),
    paddingHorizontal: scaleWidthSize(20),
    fontFamily: 'Sora-ExtraBold',
    textAlign: "center",
    marginBottom: '1%'
  },
  label2: {
    color: '#FFBB4D',
    fontSize: scaleFontSize(20),
    paddingHorizontal: scaleWidthSize(12),
    fontFamily: 'Sora-ExtraBold',
    marginLeft: '-1%',
    textAlign: "center",    
    marginBottom: '1%'
  },
  logoFooter: {
    width: scaleWidthSize(120),
    height: scaleHeightSize(30),
    resizeMode: 'contain',
    marginTop: '15 %'
  },
});
