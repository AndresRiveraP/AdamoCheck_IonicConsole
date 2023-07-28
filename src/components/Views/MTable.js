import React, { useState, useEffect } from 'react';
import {SafeAreaView,ScrollView, View, Text, Image, StyleSheet} from 'react-native';
import { Table, Row, Rows } from 'react-native-table-component';

const MTable = ({ logsU, startDate }) => {
  const [logsData, setLogsData] = useState(null);

  useEffect(() => {
    setLogsData(logsU);
  }, [logsU]);

  console.log(logsData);

  return (
    <SafeAreaView>
      <View>
        <Image
          source={require('../../assets/img/ic.png')}
          style={styles.image}
        />
        <Text style={styles.title}>Looking over {startDate} logs</Text>
      </View>

      <ScrollView horizontal={true} style={styles.scroll}>
        <Table style={{borderWidth: 2, borderColor: '#c8e1ff'}}>
          <Row data={['Day','Identification', 'Name', 'Check-in', 'Check-out']} style={ { height: 40, backgroundColor: '#f1f8ff' }}/>
          
          {logsData && logsData.map((log, index) => (
            <View key={index} style>
              <Text>{log.name}</Text>
              <Text>{log.checkin}</Text>
              <Text>{log.checkout}</Text>
            </View>
          ))}
        </Table>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  image : {
    width: '40%',
    height: '40%',
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  title :{
    fontSize: 22,
    color : 'black',
    fontWeight: '600',
    textAlign: 'center'
  },
  scroll :{
    width : '85%',
    backgroundColor: "#E7F4FF",
    alignSelf: 'center',
    alignContent :'center',
    borderRadius: 10,
  }
});

export default MTable;
