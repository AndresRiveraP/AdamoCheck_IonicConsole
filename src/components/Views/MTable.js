import React, { useState, useEffect } from 'react';
import {SafeAreaView,ScrollView, View, Text, Image, StyleSheet} from 'react-native';

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

      <ScrollView style={styles.scroll}>
        <View>
          {logsData.map((log, index) => (
            <View key={index}>
              <Text>{log.name}</Text>
              <Text>{log.checkin}</Text>
              <Text>{log.checkout}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  image : {
    width: 106,
    height: 207,
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
    marginTop: 30,
    width : '85%',
    backgroundColor: "#E7F4FF",
    alignSelf: 'center',
    alignContent :'center',
    borderRadius: 10,
  }
});

export default MTable;
