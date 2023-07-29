import React, { useState, useEffect } from 'react';
import {SafeAreaView,ScrollView, View, Text, Image, StyleSheet, FlatList} from 'react-native';


const MTable = ({ logsU, startDate }) => {
  const [logsData, setLogsData] = useState(null);

  useEffect(() => {
    setLogsData(logsU);
  }, [logsU]);

  //console.log(logsData);

  // Render each row of the table
  const TableRow = ({ item }) => (
    <View style={styles.tableRow}>
      <View style={styles.rowItem}>
        <Text>{startDate}</Text>
      </View>
      <View style={styles.rowItem}>
        <Text>{item.identification}</Text>
      </View>
      <View style={styles.rowItem}>
        <Text>{item.name}</Text>
      </View>
      <View style={styles.rowItem}>
        <Text>{item.checkin}</Text>
      </View>
      <View style={styles.rowItem}>
        <Text>{item.checkout}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView>

      <Image
        source={require('../../assets/img/ic.png')}
        style={styles.image}
      />
     
      <Text style={styles.title}>Looking over {startDate} logs</Text>
      <FlatList
        data={logsData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <TableRow item={item} />}
      />
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container :{
  },
  image : {
    width: '50%',
    height: '50%',
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  title :{
    fontSize: 22,
    color : 'black',
    fontWeight: '600',
    textAlign: 'center',
    marginHorizontal: 15,
  },
  scroll :{
    width: '100%',
    padding : 10,
    backgroundColor: "#E7F4FF",
    alignSelf: 'center',
    alignContent :'center',
    borderRadius: 10,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  rowItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MTable;
