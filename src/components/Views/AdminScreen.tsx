import React, { useState, useEffect } from 'react';
import moment from 'moment';
import {
  SafeAreaView,
  ImageBackground,
  Text,
  View,
  StyleSheet,
  Image,
  Modal,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { gql, useQuery } from '@apollo/client';
import MTable from './MTable';



const AdminScreen: React.FC = () => {
  const [selectedStartDate, setSelectedStartDate] = useState<string | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<string | null>(null);
  const [calendarModal, setCalendarModal] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [modalTable, setModalTable] = useState<boolean>(false);
  const [logsU, setLogsU] = useState<Log[] | null>(null);

  useEffect(() => {
    if (selectedStartDate) {
      fetchingLogs();
    }
  }, [selectedStartDate]);

  const openCalendar = () => {
    setSelectedStartDate(null);
    setSelectedEndDate(null);
    setCalendarModal(true);
  };

  const handleStartDateSelect = (dateStart: CustomDateObject) => {
    const formattedDate = moment(dateStart.dateString, 'YYYY-MM-DD').format('DD-MM-YYYY');
    setSelectedStartDate(formattedDate);
  };

  const handleEndDateSelect = (dateEnd: CustomDateObject) => {
    const formattedDate = moment(dateEnd.dateString, 'YYYY-MM-DD').format('DD-MM-YYYY');
    setSelectedEndDate(formattedDate);
  };

  const fetchingLogs = () => {
    if (data?.logsByDate) {
      const logs = data.logsByDate.map((log: Log) => {
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

  const validate = () => {
    if (!selectedStartDate) {
      setMessage('Select a date before requesting table');
      return;
    } else {
      setModalTable(true);
      fetchingLogs();
    }
  };

  const mostrarAlerta = () => {
    if (message) {
      ToastAndroid.showWithGravity(message, ToastAndroid.SHORT, ToastAndroid.CENTER);
      setTimeout(() => {
        setMessage(null);
      }, 3500);
    }
  };

  // useEffect to handle mostrarAlerta side effect
  useEffect(() => {
    if (message) {
      mostrarAlerta();
    }
  }, [message]);

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={require('../../assets/img/imgBG02.png')} style={styles.background}>
        <Image source={require('../../assets/img/ic_white_c.png')} style={styles.logoA} />

        <View style={styles.adminMethods}>
          <TouchableOpacity style={styles.boton} onPress={openCalendar}>
            <Image source={require('../../assets/img/calendar.png')} style={styles.ico} />
            {selectedStartDate ? (
              <Text style={[styles.modalLabel, { fontWeight: '600', fontSize: 14 }]}>
                {selectedStartDate} to {selectedEndDate}
              </Text>
            ) : (
              <Text style={styles.modalLabel}>Select A Date</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.boton}
            onPress={() => console.log('Downloading .csv...')}
          >
            <Image source={require('../../assets/img/csvicon.png')} style={styles.ico} />
            <Text style={styles.modalLabel}>Download as .csv</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.botonShow} onPress={validate}>
            <Image source={require('../../assets/img/table.png')} style={styles.ico} />
            <Text style={styles.modalLabel}>Show Modal Table</Text>
          </TouchableOpacity>
        </View>

        <Modal
          visible={calendarModal}
          animationType="slide"
          transparent
          onRequestClose={() => setCalendarModal(false)}
        >
          <View>
            <Calendar
              onDayPress={(day: CustomDateObject) => {
                if (!selectedStartDate) {
                  handleStartDateSelect(day as CustomDateObject);
                } else if (!selectedEndDate) {
                  handleEndDateSelect(day as CustomDateObject);
                  setCalendarModal(false);
                }
              }}
              markedDates={{
                [selectedStartDate as string]: { startingDay: true, color: 'green' },
                [selectedEndDate as string]: { endingDay: true, color: 'green' },
              }}
              markingType="period"
            />
          </View>
        </Modal>
      </ImageBackground>

      {modalTable && (
        <Modal animationType="slide" onRequestClose={() => setModalTable(false)}>
          <MTable logsU={logsU} startDate={selectedStartDate} />
        </Modal>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
    alignItems: 'center',
  },
  logoA: {
    marginTop: '15%',
    maxWidth: '30%',
    maxHeight: '30%',
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  adminMethods: {
    marginTop: '10%',
    backgroundColor: '#FFF',
    width: '90%',
    height: '40%',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  boton: {
    width: '80%',
    flexDirection: 'row',
    alignContent: 'flex-start',
    alignItems: 'center',
    borderWidth: 2,
    paddingVertical: 10,
    marginBottom: 15,
    borderRadius: 10,
    borderColor: '#eeeee4',
    justifyContent: 'flex-start',
  },
  botonShow: {
    width: '80%',
    flexDirection: 'row',
    alignContent: 'flex-start',
    alignItems: 'center',
    borderWidth: 2,
    paddingVertical: 10,
    marginBottom: 15,
    borderRadius: 10,
    borderColor: '#9d927c',
    backgroundColor: '#b9e4f4',
    justifyContent: 'flex-start',
  },
  ico: {
    alignSelf: 'flex-start',
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  modalLabel: {
    marginLeft: 20,
    color : "#000"
  },
});

export default AdminScreen;
