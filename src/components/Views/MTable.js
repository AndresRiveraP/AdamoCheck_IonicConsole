import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, Image, StyleSheet, FlatList, ImageBackground } from 'react-native';
import { scaleFontSize } from '@/utils/scaleUtils';

const MTable = ({ logsU, startDate, endDate }) => {
  const [logsData, setLogsData] = useState(null);

  useEffect(() => {
    setLogsData(logsU);
    console.log("The Logs:\n", logsU); 
  }, [logsU]);

  const TableHeader = () => (
    <View style={styles.tableHeader}>
      <View style={styles.headerItem}>
        <Text style={styles.headerText}>Date</Text>
      </View>
      <View style={styles.headerItem}>
        <Text style={styles.headerText}>ID</Text>
      </View>
      <View style={styles.headerItem}>
        <Text style={styles.headerText}>Name</Text>
      </View>
      <View style={styles.headerItem}>
        <Text style={styles.headerText}>Check-in</Text>
      </View>
      <View style={styles.headerItem}>
        <Text style={styles.headerText}>Check-out</Text>
      </View>
    </View>
  );

  const TableRow = ({ item }) => (
    <View style={styles.tableRow}>
      <View style={styles.rowItem}>
        <Text style={styles.rowItemText}>{startDate}</Text>
      </View>
      <View style={styles.rowItem}>
        <Text style={styles.rowItemText}>{item.identification}</Text>
      </View>
      <View style={styles.rowItem}>
        <Text style={styles.rowItemText}>{item.name}</Text>
      </View>
      <View style={styles.rowItem}>
        <Text style={styles.rowItemText}>{item.checkin}</Text>
      </View>
      <View style={styles.rowItem}>
        <Text style={styles.rowItemText}>{item.checkout}</Text>
      </View>
    </View>
  );

  return (
    <ImageBackground
      source={require('@/assets/img/imgBG02.png')}
      style={styles.background}
    >
      <SafeAreaView style={styles.safe}>
        <FlatList
          data={logsData}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => <TableRow item={item} />}
          ListHeaderComponent={() => (
            <>
              <View style={styles.header}>
                <Image
                  source={require('@/assets/img/logoCheck.png')}
                  style={styles.image}
                />
                <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center',}}> 
                  <Text style={{ fontFamily: 'Guitar-Acoustic', fontSize: scaleFontSize(20), color: '#fff',}}>
                    adamo
                  </Text>
                  <Text style={{  fontFamily: 'Guitar-Acoustic', fontSize: scaleFontSize(20),color: '#fff', opacity: 0.4,}}>
                    check
                  </Text>
                </View>
                <Text style={styles.title}>{startDate} to {endDate} records</Text>
              </View>
              <TableHeader />
            </>
          )}
        />
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    alignItems: 'center',
  },
  safe: {
    flex: 1,
    paddingVertical: '10%',
    paddingHorizontal: '3%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: '20%',
    height: undefined,
    aspectRatio: 1,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  title: {
    fontSize: scaleFontSize(16),
    color: 'white',
    fontFamily: 'Octarine-Bold',
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: 30,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FFF',
  },
  headerItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: scaleFontSize(10),
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
  },
  rowItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowItemText: {
    color: 'white',
    fontSize: scaleFontSize(8),
  },
});

export default MTable;