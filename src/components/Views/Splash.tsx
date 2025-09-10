import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect } from "react";
import {Image,View, Animated, StyleSheet, Dimensions, Text,} from 'react-native';
import Navigator from './Navigator';
import { NavigationProp } from "@react-navigation/native";


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
  var initialRoute = "";

	useEffect(() => {
			const fetchData = async () => {
			const user = await AsyncStorage.getItem("user");
			const key = await AsyncStorage.getItem("key");
			initialRoute = (user && key) ? 'InitialScreen' : 'InternalLogin'
			};
			fetchData()
			
			const fadeOut = Animated.timing(fadeAnim, {
			toValue: 0,
			duration: 1000,
			useNativeDriver: true,
			});

			setTimeout(() => {
			fadeOut.start(() => {
					navigation.navigate(initialRoute as never);
			});
			}, 1500);
			
			return () => {
				fadeOut.stop();
			};
}, []);
			return(
				<Animated.View style={[styles.container, {opacity: fadeAnim}]}>
					<View style={styles.container}>
						<Image
							source={require('../../assets/img/logoCheck.png')}
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
									styles.title,{color: '#fff'},
								]}>
								adamo
							</Text>
							<Text style={[styles.title, {color: '#2bbfed'}]}>check</Text>
						</View>
					</View>
				</Animated.View>
			)
			

}

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


export default Splash;