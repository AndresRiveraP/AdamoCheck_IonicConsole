import React, {useState} from 'react'
import {SafeAreaView,ImageBackground, Text,View, StyleSheet,Image,Modal, TouchableOpacity} from 'react-native'
import DatePicker from 'react-native-datepicker';


const AdminScreen = () => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [calendarModal, setCalendarModal] = useState(false)
    
    const openCalendar = () => {
        setCalendarModal(true);
    };


    const handleStartDateChange = (date) => {
        setStartDate(date);
      };
      
    const handleEndDateChange = (date) => {
        setEndDate(date);
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
                    onPress={() => openCalendar()}
                >
                    <Image
                        source={require('../../../assets/img/calendar.png')}
                        style={styles.ico}
                    />

                    {selectedDates ? <Text style={[styles.modalLabel,{fontWeight: 'bold', fontSize: 20}]}>{selectedDates}</Text> : <Text style={styles.modalLabel}>Select A Date</Text>}
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
            </View>

           <Modal
                visible={calendarModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setCalendarModal(false)}
            >
                <View>
                <DatePicker
                    mode="date"
                    date={startDate}
                    onDateChange={handleStartDateChange}
                />
                <DatePicker
                    mode="date"
                    date={endDate}
                    onDateChange={handleEndDateChange}
                    minDate={startDate}
                />
                <TouchableOpacity
                    title="Confirm"
                    onPress={() => {
                    setCalendarModal(false);
                    console.log('Selected Start Date:', startDate);
                    console.log('Selected End Date:', endDate);
                    }}
                />
                </View>
            </Modal>

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