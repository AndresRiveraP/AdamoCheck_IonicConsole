import React from 'react';
import { ImageBackground, StyleSheet, View, Image, Text, BackHandler,} from 'react-native';
import { scaleFontSize, scaleHeightSize, scaleWidthSize } from '@/utils/scaleUtils';
import AnimatedScreenWrapper from './AnimatedScreenWrapper';
import {useFocusEffect} from '@react-navigation/native';

const VerifiedBirthday = ({ route, navigation }) => {


  var name = "Andres Felipe";
  var lastName = "Rivera Piedrahita";
	useFocusEffect(
	React.useCallback(() => {
		const onBackPress = () => {
			navigation.navigate('InitialScreen');
			return true; // Prevents default back behavior
		};

		BackHandler.addEventListener('hardwareBackPress', onBackPress);
		return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
	}, [navigation])
);
return (
    <AnimatedScreenWrapper style={{flex: 1}}>
      <ImageBackground
        source={require('../../assets/img/backgroundStaff.png')}
        style={styles.background}>
        <View style={[styles.container]}>
					<View style={[{display: 'flex', flexDirection: 'row', alignItems:  'center', marginTop: scaleHeightSize(70), alignSelf: 'center'}]}>
						<Image
							source={require('@/assets/img/confetti.png')}
							style={styles.confetti}
						/>
						<View>
							<Text style={styles.title}>
								Happy <Text>Birthday!</Text>
							</Text>
						</View>
					</View>
					<View style={[styles.containerContent]}>
							<View style={{ marginTop: '25%' }}>
								<View style={styles.name}>
									<Text style={styles.textName}>{name}</Text>
									<Text style={styles.textLastName}>{lastName}</Text>
								</View>
								<View style={{ height: 2, width: '90%', backgroundColor: '#78910F', alignSelf: 'center' }}/>
							</View>
						
							<Image
								source={require('../../assets/img/adamoByHBPO.png')} 
								style={[{resizeMode: "contain", width: scaleWidthSize(120), alignSelf: 'center', marginTop: '45%'}]}
							/>
					</View>
				</View>
      </ImageBackground>
    </AnimatedScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  title: {
    fontFamily: 'Sora-ExtraBold',
    fontSize: scaleFontSize(45),
    color: '#EBF3CB',
  },
	confetti: {
		height: scaleHeightSize(55),
		width: scaleWidthSize(55),
	},
  containerContent: {
    width: '65%',
    height: '100%',
    display: 'flex',
    alignSelf: 'center',
    backgroundColor: '#EBF3CB',
    borderRadius: 40,
    marginTop: '5%', 
  },
  textName: {
    textAlign:'center',
    fontSize: scaleFontSize(30),
    fontWeight:'600',
    color:'#323232',
  },
  textLastName: {
    textAlign:'center',
    fontSize: scaleFontSize(23),
    fontWeight:'300',
    color:'#323232'
  },
});
export default VerifiedBirthday;