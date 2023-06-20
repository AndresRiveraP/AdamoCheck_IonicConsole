import React, {useState} from 'react'
import {SafeAreaView,ImageBackground, Text,View, StyleSheet,Image,Modal, TouchableOpacity} from 'react-native'
import DateTimePickerModal from "react-native-modal-datetime-picker";

const AdminScreen = () => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    console.warn("A date has been picked: ", date);
    console.log(date.toLocaleDateString());
    hideDatePicker();
  };

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
                <TouchableOpacity
                    style={styles.boton}
                    onPress={() => showDatePicker()}
                >
                    <Image
                        source={require('../../../assets/img/calendar.png')}
                        style={styles.ico}
                    />
                    <Text style={styles.modalLabel}>Select a Date</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.boton}
                    onPress={() => console.log('Downloading .csv...')}
                >

                    <Image
                        source={require('../../../assets/img/csvicon.png')}
                        style={styles.ico}
                    />
                    <Text style={styles.modalLabel}>Download as .csv</Text>

                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.botonShow]}
                    onPress={() => {console.log('Showing Modal Table')}}
                >
                    <Image
                        source={require('../../../assets/img/table.png')}
                        style={styles.ico}
                    />
                    <Text style={styles.modalLabel}>Show Modal Table</Text>
                </TouchableOpacity>

                <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                    onConfirm={handleConfirm}
                    onCancel={hideDatePicker}
                />
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
        width: '90%',
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
        borderColor: '#eeeee4',
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
        borderColor: '#9d927c',
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