import React, { useState, useEffect } from 'react';
import {SafeAreaView,ScrollView, View, Text, Image, StyleSheet, FlatList, ImageBackground} from 'react-native';


const MTable = ({ logsU, startDate, endDate}) => {
  const [logsData, setLogsData] = useState(null);

  useEffect(() => {
    setLogsData(logsU);
  }, [logsU]);

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
    <ImageBackground
      source={require('../../assets/img/imgBG02.png')}
      style={styles.background}
    >
        <SafeAreaView>
          <Image
            source={require('../../assets/img/logoCheck.png')}
            style={styles.image}
          />
        
        
          <Text style={styles.title}>Looking over {startDate} logs</Text>
          <FlatList
            data={logsData}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <TableRow item={item} />}
          />
        </SafeAreaView>

    </ImageBackground>
    
  );
};


const styles = StyleSheet.create({
  image : {
    width: '30%',
    height: '30%',
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
    alignItems: 'center',
  },
  title :{
    fontSize: 22,
    color : 'black',
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: 30,
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
