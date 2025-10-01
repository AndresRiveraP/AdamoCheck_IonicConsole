import { scaleFontSize, scaleHeightSize, scaleWidthSize } from "@/utils/scaleUtils";
import React from "react";
import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface NoDataProps {
  navigation: any;
}

const NoData: React.FC<NoDataProps> = ({ navigation }) => {




  return (
    <ImageBackground source={require('../../assets/img/backgroundStaff.png')} style={styles.background}>
      <View style={[styles.container]}>
        <View style={styles.containerBack}>
          <TouchableOpacity
              style={[styles.botonBack]}
              onPress={() => { navigation.navigate('InitialScreen')
              }}>
              <Image
                source={require('../../assets/img/arrowBack.png')}
                style={styles.iconBack}
              />
            </TouchableOpacity>
        </View>
          <View style={[styles.containerTitle]}>
            <Image
              source={require('../../assets/img/iconGhost.png')}
              style={[styles.image, {resizeMode: 'contain'}]}
            />
            <View style={{flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <Text 
                style={[styles.title,{color: '#EBF3CB'} ]}>
                Well...
              </Text>
              <Text style={[{fontSize: scaleFontSize(15), color: '#EBF3CB', fontFamily: 'Poppins-SemiBold', textAlign: 'center'}]}>
                It seems like you’re not in
              </Text>
              <Text style={[{fontSize: scaleFontSize(15), color: '#EBF3CB', fontFamily: 'Poppins-SemiBold', textAlign: 'center'}]}>
                our database, but don’t worry!
              </Text>
            </View>
          </View>

          <View style={{ height: 2, width: '50%', backgroundColor: '#78910F', alignSelf: 'center', marginVertical: '3%' }}/>

          <View>
              <Text style={{color: '#4A5714', fontSize: scaleFontSize(13), fontFamily: 'Poppins-Regular'}}>
                  You can start your <Text style={{fontFamily:'Poppins-Bold'}}>sign up process</Text>
              </Text>
              <Text style={{color: '#4A5714', fontSize: scaleFontSize(13), fontFamily: 'Poppins-Regular'}}>
                  by scanning the following <Text style={{fontFamily:'Poppins-Bold'}}>QR Code:</Text>
              </Text>
          </View>
          <View style={{marginTop: '3%'}}>
            <Image 
              source={require('../../assets/img/QR.png')} 
              style={{ resizeMode: 'contain', width: scaleWidthSize(100), height: scaleWidthSize(100), alignSelf: 'center'}}/>
          </View>
            <Image 
              source={require('../../assets/img/adamoByHBPO.png')} 
              style={{ resizeMode: 'contain', width: scaleWidthSize(120), alignSelf: 'center', marginTop: '10%'}}/>
      </View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  background:{
    flex:1,
    resizeMode: 'cover',
    alignItems : 'center',
    width: '100%',
    height: '100%', 
    position: 'relative'
  },
  container: {
    flex: 1,
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    marginTop: '20%',
    width: '100%'
  },
  containerBack: {
    position: 'absolute',
    left: 0,
    top: '-5%',
    width: scaleWidthSize(45),
  },
  botonBack: {
    alignItems: 'center',
    backgroundColor: '#4A5714',
    borderTopRightRadius: 40,
    borderBottomEndRadius: 40
  },
  iconBack:{
    width: scaleWidthSize(30),
    height: scaleWidthSize(20),
    resizeMode: 'contain',
    margin: '15%',
    marginBottom: '20%',
    marginLeft: 0
  },
  containerTitle: {
    display: 'flex',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Sora-ExtraBold',
    fontSize: scaleFontSize(40),
  },
  image: {
    width: scaleWidthSize(70),
    height: scaleWidthSize(70),
  },
})
export default NoData