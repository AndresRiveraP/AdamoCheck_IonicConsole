import React, { useState } from 'react';
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
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import Toast from 'react-native-toast-message';
import MTable from './MTable';
import { scaleFontSize } from '@/utils/scaleUtils';

interface CustomDateObject {
  dateString: string;
}

const AdminScreen: React.FC = () => {
  const [selectedStartDate, setSelectedStartDate] = useState<string | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<string | null>(null);
  const [calendarModal, setCalendarModal] = useState<boolean>(false);
  const [logsU, setLogsU] = useState<any[] | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [modalTable, setModalTable] = useState<boolean>(false);

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

  const validate =  async () => {
    if (!selectedStartDate) {
      setMessage('Select a date before requesting table');
      Toast.show({
        type: 'warning',
        text1: 'Warning',
        text2: message || undefined,
        position: 'top',
        visibilityTime: 2500,
      })
      return;
    } else {
      let range: {
        startDate: string | null,
        endDate: string | null
      } = {
        startDate: selectedStartDate,
        endDate: selectedEndDate
      };


      const response = await fetch('https://adamocheckback.up.railway.app/api/logs/gettingLogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(range),
      });

      const result = await response.json();
      setLogsU(result); 
      setModalTable(true);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={require('../../assets/img/imgBG02.png')} style={styles.background}>
        <View style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: '10%'}}>
          <Image
            source={require('../../assets/img/logoCheck.png')}
            style={{width: '30%', height: '30%', resizeMode: 'contain'}}
          />
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text
              style={{
                fontFamily: 'Guitar-Acoustic',
                fontSize: scaleFontSize(40),
                color: '#fff',
              }}>
              adamo
            </Text>
            <Text
              style={{
                fontFamily: 'Guitar-Acoustic',
                fontSize: scaleFontSize(40),
                color: '#fff',
                opacity: 0.4,
              }}>
              check
            </Text>
          </View>
        </View>

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
          <MTable logsU={logsU} startDate={selectedStartDate} endDate={selectedEndDate} />
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
  },
  adminMethods: {
    backgroundColor: '#FFF',
    width: '90%',
    height: '40%',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
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
