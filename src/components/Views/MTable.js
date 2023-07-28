import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text } from 'react-native';

const MTable = ({ logsU, startDate }) => {
  const [logsData, setLogsData] = useState(null);

  useEffect(() => {
    setLogsData(logsU);
    console.log(JSON.stringify(logsU));
  }, [logsU]);

  return (
    <ScrollView>
      <View>
        <Text>ModalTable</Text>
        <Text>{startDate}</Text>

        {logsData.map((log, index) => (
          <View key={index}>
            <Text>{log.name}</Text>
            <Text>{log.checkin}</Text>
            <Text>{log.checkout}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default MTable;
