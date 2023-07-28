import React, {useState, useEffect} from 'react'
import moment from 'moment';
import {SafeAreaView,ImageBackground, Text,View, StyleSheet,Image,Modal, TouchableOpacity, ToastAndroid} from 'react-native'
import { Calendar } from 'react-native-calendars';
import {gql, useQuery} from '@apollo/client';
import MTable from './MTable.js';


const FETCH_LOGS = gql `
    query Query($date: String!) {
        logsByDate(date: $date) {
        identification
        name
        day
        checkin
        checkout
        id
        }
    }
`;

const AdminScreen = () => {
    const [selectedStartDate, setSelectedStartDate] = useState(null);
    const [selectedEndDate, setSelectedEndDate] = useState(null);
    const [calendarModal, setCalendarModal] = useState(false);
    const [modalTable, setModalTable] = useState(false);
    const [logsU, setLogsU] = useState({});

    useEffect(() => {
        if (selectedStartDate) {
          fetchingLogs();
        }
      }, [selectedStartDate]);
    
    const openCalendar = () => {
        setSelectedStartDate(null)
        setSelectedEndDate(null)
        setCalendarModal(true);
    };

    const handleStartDateSelect = (dateStart) => {
        const formattedDate = moment(dateStart.dateString, 'YYYY-MM-DD').format('DD-MM-YYYY');
        setSelectedStartDate(formattedDate)        
      };
      
    const handleEndDateSelect = (dateEnd) => {
        const formattedDate = moment(dateEnd.dateString, 'YYYY-MM-DD').format('DD-MM-YYYY');
        setSelectedEndDate(formattedDate);
    };

    //Apollo useQuery
    const { data } = useQuery(FETCH_LOGS, {
        variables: {
        date: selectedStartDate,
        },
        skip: !selectedStartDate, // Skip query if selectedStartDate is not set
    });

    const fetchingLogs = () => {
        if (data?.logsByDate) { 
            const logs = data.logsByDate.map((log) => {
                const { checkin, checkout, id, identification, name } = log;
                return {
                    checkin,
                    checkout,
                    id,
                    identification,
                    name,
                };
            });
    
            setLogsU(logs);
        } else {
            setLogsU(null); 
        }
    };

  return (
    <SafeAreaView style={styles.container}>
        <ImageBackground
            source={require('../../assets/img/imgBG02.png')}
            style={styles.background}
        >
            <Image 
                source={require('../../assets/img/ic_white_c.png')}
                style={styles.logoA}
            />

            <View style={styles.adminMethods}>
                <TouchableOpacity
                    style={styles.boton}
                    onPress={() => openCalendar()}
                >
                    <Image
                        source={require('../../assets/img/calendar.png')}
                        style={styles.ico}
                    />

                    {selectedStartDate ? <Text style={[styles.modalLabel,{fontWeight: '600', fontSize: 14}]}>{selectedStartDate} to {selectedEndDate}</Text> : <Text style={styles.modalLabel}>Select A Date</Text>}
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.boton}
                    onPress={() => console.log('Downloading .csv...')}
                >

                    <Image
                        source={require('../../assets/img/csvicon.png')}
                        style={styles.ico}
                    />
                    <Text style={styles.modalLabel}>Download as .csv</Text>

                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.botonShow]}
                    onPress={() => {setModalTable(true),fetchingLogs()}}
                >
                    <Image
                        source={require('../../assets/img/table.png')}
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
                <Calendar
                    onDayPress={(day) => {
                    if (selectedStartDate === null) {
                        handleStartDateSelect(day);
                    } else if (selectedEndDate === null) {
                        handleEndDateSelect(day);
                        setCalendarModal(false);
                    }
                    }}
                    markedDates={{
                        [selectedStartDate]: { startingDay: true, color: 'green' },
                        [selectedEndDate]: { endingDay: true, color: 'green' },
                    }}
                    markingType={'period'}
                />
                </View>
            </Modal>

        </ImageBackground>

        {modalTable && (
        <Modal
            animationType='slide'
            onRequestClose={() => setModalTable(false)}
        >
            <MTable
            logsU={logsU}
            startDate={selectedStartDate}
            />
        </Modal>
        )}
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