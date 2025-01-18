import Toast from 'react-native-toast-message';
import React, {useState} from 'react'

import {ImageBackground,StyleSheet,View, Image,Text,SafeAreaView, PixelRatio, TextInput, Modal} from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import LoadingModal from './LoadingModal';

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
        params?: { payload?: any; check?: string },
      ) => void;
    };
  }

const Unverified : React.FC<UnverifiedProps> = ({ route, navigation }) => {
    const {check} = route.params;

    const [documentId, setDocumentId] = useState('');
    const [showLoading, setShowLoading] = useState<boolean>(false);

    const VerifyWithId = async (documentId: string | any[]) => {

        if (documentId.length < 5) {
          Toast.show({
            type: 'warning',
            text1: 'Warning',
            text2: "Please enter a valid identification number",
            position: 'top',
            visibilityTime: 3000,
          });
        } else{
            try {
                setShowLoading(true);
                const response = await fetch('https://adamocheckback.up.railway.app/api/logs/unverified', {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({identification : documentId}),
                });
        
                const result = await response.json();
        
                if (response.ok) {
                    //console.log('Employee fetched successfully:', result);
                    const payload = {
                        id: result.idNumber,
                        name: result.name,
                        lastname: result.lastname,
                      };

                    setShowLoading(false);
                    navigation.navigate('Verified', {payload :payload,  check});
                } else {
                    console.error('Error fetching employeee:', result.message);
                }
            } catch (error) {
            console.error('Error fetching employee:', error);
            }
        }
    }

  return (
    <View style={styles.container}>
    {showLoading ?  (
    <View>
        <Modal animationType="slide" style={styles.modalLoading}>
            <LoadingModal />
        </Modal>
    </View>
    ) : (
        <SafeAreaView style={styles.container}>
            <ImageBackground
            source={require('../../assets/img/imgBG02.png')}
            style={styles.background}
            >
            <Image 
                source={require('../../assets/img/eye.png')}
                style={styles.eye}
            />

            <View style={styles.warning}>
                <Text style={styles.Atention}>Warning!</Text>
                <Text style={styles.AtentionP}>We could not find you registered in the Adamo ID database</Text>
            </View>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder='Your Identification Number'
                    placeholderTextColor='#FFF'
                    keyboardType='numeric'
                    maxLength={15}
                    textAlign='center'
                    value={documentId}
                    onChangeText={setDocumentId}
                />
            </View>           


            <TouchableOpacity
                style={[styles.botonV]}
                onPress={() => {VerifyWithId(documentId)}}    
            >
                <Text style={styles.labelV}>Verify</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.botonR]}
                onPress={() => {navigation.navigate('InitialScreen')}}
            >
                <Text style={styles.labelU}>Return</Text>
            </TouchableOpacity>
        </ImageBackground>
        
    </SafeAreaView>
    )}
    </View>
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
    eye:{
        resizeMode: 'contain',
        height: '30%',
        width: '30%'
    },
    warning:{
        width: '80%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    Atention:{
        color: '#FFF',
        fontSize: sp(45),
        fontFamily: 'Octarine-Bold',
        marginBottom: 15,
    },
    AtentionP:{
        color: '#FFF',
        fontSize: sp(25),
        textAlign: 'center',
        fontWeight: '400',
        marginBottom: 20,
    },
    botonV:{
        position: 'relative',
        alignSelf:'center',
        backgroundColor: '#029941',
        borderRadius: 40,
        bottom: 20,
        paddingVertical: '1%',
        paddingHorizontal: '5%',
        marginTop: '10%',
        width: '50%',
    },
    labelV:{
        color: "#FFF",
        fontWeight: '500',
        fontFamily: 'Octarine-Light',
        fontSize: sp(36),
    },
    botonR:{
        position: 'relative',
        alignSelf:'center',
        backgroundColor: '#FFF',
        borderRadius: 40,
        bottom: 20,
        paddingVertical: '1%',
        paddingHorizontal: '5%',
        marginTop: '5%',
        width: '50%',
    },
    inputContainer: {
        marginTop: '4%'
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
    labelU:{
        color : '#000',
        fontWeight: '500',
        fontFamily: 'Octarine-Light',
        fontSize: sp(34),
    },
    modalLoading: {
        flex: 1,
        justifyContent: 'center',
      },
})
export default Unverified