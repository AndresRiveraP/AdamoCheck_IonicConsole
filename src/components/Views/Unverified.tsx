import Toast from 'react-native-toast-message';
import React, {useState} from 'react'

import {ImageBackground,StyleSheet,View, Image,Text,SafeAreaView, PixelRatio, TextInput, TouchableOpacity,BackHandler} from 'react-native'
import { scaleFontSize } from '@/utils/scaleUtils';
import AnimatedScreenWrapper from './AnimatedScreenWrapper';
import { useFocusEffect } from '@react-navigation/native';

function sp(size: number) {
    return PixelRatio.getFontScale() * size;
}

interface UnverifiedProps {
    route: {
      params: {
        check: string;
      };
    };
    navigation: {
      navigate: (
        screen: string,
        params?: { payload?: any; check?: string; documentId?: string; source?: string; base64Data?: string },
      ) => void;
      reset: (state: { index: number; routes: { name: string; params?: any }[] }) => void;
    };
  }

const Unverified : React.FC<UnverifiedProps> = ({ route, navigation }) => {
    const {check} = route.params;
    const [documentId, setDocumentId] = useState('');

    const VerifyWithId = async (documentId: string) => {
    if (documentId.length < 6) {
        Toast.show({
        type: 'warning',
        text1: 'Warning',
        text2: "Please enter a valid identification number",
        position: 'top',
        visibilityTime: 3000,
        });
    } else {
        navigation.navigate('LoadingScreen', {
            check,
            documentId,
            source: 'unverified',
            base64Data: '' // Empty string as it's not needed for this flow
        });
    }
    }

    useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        navigation.navigate('InitialScreen');
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [navigation])
  );

    const handleRetry = () => {
    console.log('Retry pressed, check value:', check);
    navigation.reset({
        index: 0,
        routes: [
            { name: 'CameraScreen', params: { check } }
        ],
    });
};

  return (
    <AnimatedScreenWrapper>
        <SafeAreaView style={styles.container}>
            <ImageBackground
            source={require('../../assets/img/imgBG02.png')}
            style={styles.background}
            >
            
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: '10%' }}>
                <Text style={[ styles.title,{ color: '#fff'}]}>adamo</Text>
                <Text style={[styles.title, {color: '#2bbfed'}]}>check</Text>
            </View>

            <View style={styles.warning}>
                <Image
                    source={require('../../assets/img/face_check.png')}
                    style={styles.cuteFace}
                    />
                <Text style={styles.Atention}>FACE NOT DETECTED</Text>
                <Text style={styles.AtentionP}>Please enter your ID number or retry</Text>
            </View>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder='Your ID'
                    placeholderTextColor='#FFF'
                    keyboardType='numeric'
                    maxLength={15}
                    textAlign='center'
                    value={documentId}
                    onChangeText={setDocumentId}
                />
            </View>           


            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center',marginTop: '-2%' , gap: 15 }}>
                <TouchableOpacity
                style={[styles.botonV]}
                onPress={() => {VerifyWithId(documentId)}}   >
                    <Text style={styles.labelV}>Verify</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.botonW]}
                    onPress={handleRetry}
                >
                    <Text style={styles.labelB}>Retry</Text>
                </TouchableOpacity>
            </View>
        

            <TouchableOpacity
                style={[styles.botonR]}
                onPress={() => {navigation.navigate('InitialScreen')}}
            >
                <Text style={styles.labelU}>Return</Text>
            </TouchableOpacity>
        </ImageBackground>
        </SafeAreaView>
    </AnimatedScreenWrapper>
  )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
    },
    background:{
        flex:1,
        resizeMode: 'contain',
        alignItems : 'center',
    },
    cuteFace:{
        width: '30%',
        height: '30%',
        resizeMode: 'contain',
        marginTop: '10%',
        alignSelf: 'center',
    },
    warning:{
        width: '80%',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '-9%',
    },
    Atention:{
        color: '#FFF',
        fontSize: sp(40),
        fontWeight: '700',
        fontFamily: 'Octarine',
        marginBottom: '5%',
    },
    AtentionP:{
        color: '#FFF',
        fontSize: sp(35 ),
        textAlign: 'center',
        fontWeight: '500',
        marginBottom: 15,
    },
    botonV:{
        position: 'relative',
        alignSelf:'center',
        backgroundColor: '#029941',
        borderRadius: 40,
        paddingVertical: '1%',
        paddingHorizontal: '7%',
        marginTop: '5%',
    },
    botonW:{
        position: 'relative',
        alignSelf:'center',
        backgroundColor: '#FFF',
        borderRadius: 40,
        paddingVertical: '1%',
        paddingHorizontal: '7%',
        marginTop: '5%',
    },
    labelV:{
        color: "#FFF",
        fontWeight: '600',
        fontFamily: 'Octarine',
        fontSize: sp(35),
    },
    labelB:{
        color: "#2bbfed",
        fontWeight: '600',
        fontFamily: 'Octarine',
        fontSize: sp(35),
    },
    labelU:{
        color : '#FFF',
        fontWeight: '600',
        fontFamily: 'Octarine',
        fontSize: sp(35),
    },
    botonR:{
        position: 'relative',
        alignSelf:'center',
        alignItems: 'center',
        backgroundColor: '#000',
        borderRadius: 40,
        paddingVertical: '1%',
        paddingHorizontal: '5%',
        marginTop: '5%',
        width: '55%',
    },
    inputContainer: {
        width: '50%',
        top: '-4%'
    },
    input: {
        display: 'flex',
        alignContent: 'center',
        justifyContent: 'center',
        paddingHorizontal: '10%',
        paddingVertical: '3%',
        borderWidth: 2,
        borderColor: '#FFF',
        borderRadius: 35,
        shadowColor: '#000',
        fontSize: sp(20),
    },
    modalLoading: {
        flex: 1,
        justifyContent: 'center',
      },
    title: {
        fontFamily: 'Guitar-Acoustic',
        fontSize: scaleFontSize(35),
    },
})
export default Unverified