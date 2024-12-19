import {StyleSheet, Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');


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
    width: width * 0.52, // 52% of base width
    height: height * 0.52, // 52% of base height
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  boton: {
    width: '60%',
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 50,
    padding: '5%',
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
    fontSize: height * 0.02,
    paddingHorizontal: 40,
    fontFamily: "Octarine-BoldOblique",
  },
  label2: {
    color: '#000',
    textAlign: 'center',
    fontSize: height * 0.02,
    fontFamily: 'Octarine-BoldOblique',
  },
});
