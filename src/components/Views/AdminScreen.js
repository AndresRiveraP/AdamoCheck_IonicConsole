import React, {useState} from 'react'
import {SafeAreaView,ImageBackground, Text,View, StyleSheet,Image,Pressable} from 'react-native'

const AdminScreen = () => {
  const [buttonOpacity, setButtonOpacity] = useState(1);

  const handleModalTable = () => {
    setTimeout(() => {
        console.log('Showing Modal Table');
        setButtonOpacity(1);
    }, 100)
  }
  
  return (
    <SafeAreaView style={styles.container}>
        <ImageBackground
            source={require('../../../assets/img/imgBG02.png')}
            style={styles.background}
        >
            <Image 
                source={require('../../../assets/img/ic_white_c.png')}
                 style={styles.logoA}
            />

            <View style={styles.adminMethods}>
                <Pressable
                    style={styles.boton}
                    onPress={() => console.log('Selecting Date...')}
                >
                    <Image
                        source={require('../../../assets/img/calendar.png')}
                        style={styles.ico}
                    />
                    <Text style={styles.modalLabel}>Select a Date</Text>
                </Pressable>

                <Pressable
                    style={styles.boton}
                    onPress={() => console.log('Downloading .csv...')}
                >

                    <Image
                        source={require('../../../assets/img/csvicon.png')}
                        style={styles.ico}
                    />
                    <Text style={styles.modalLabel}>Download as .csv</Text>

                </Pressable>
                <Pressable
                    style={[styles.botonShow,{opacity:buttonOpacity}]}
                    onPress={() => {setButtonOpacity(0.4), handleModalTable()}}
                >
                    <Image
                        source={require('../../../assets/img/table.png')}
                        style={styles.ico}
                    />
                    <Text style={styles.modalLabel}>Show Modal Table</Text>
                </Pressable>
            </View>


        </ImageBackground>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
    },
    background:{
        flex:1,
        resizeMode: 'cover',
        alignItems : 'center'
    },
    logoA :{
        maxWidth: '50%',
        maxHeight: '50%',
        resizeMode: 'contain',
        alignSelf : 'center'
    },
    adminMethods:{
        backgroundColor: "#FFF",
        width: '100%',
        height: '50%',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    boton:{
        width: '80%',
        flexDirection:'row',
        alignContent:'flex-start',
        alignItems:'center',
        borderWidth : 2,
        paddingVertical: 10,
        marginBottom: 15,
        borderRadius: 10,
        borderColor: '#b4b4ac',
        justifyContent: 'flex-start'
    },
    botonShow:{
        width: '80%',
        flexDirection:'row',
        alignContent:'flex-start',
        alignItems:'center',
        borderWidth : 2,
        paddingVertical: 10,
        marginBottom: 15,
        borderRadius: 10,
        borderColor: '#b4b4ac',
        backgroundColor: '#b9e4f4',
        justifyContent: 'flex-start'
    },
    ico:{
        alignSelf:'flex-start',
        width:50,
        height: 50,
        resizeMode: 'contain'
    },
    modalLabel:{
        marginLeft: 20,
    }
})

export default AdminScreen