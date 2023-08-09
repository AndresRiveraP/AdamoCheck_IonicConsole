import React, { useState } from 'react';
import FastImage from 'react-native-fast-image';
import {gql, useMutation, useQuery} from '@apollo/client';
import moment from 'moment';
import { ImageBackground, StyleSheet, View, Image, Text, SafeAreaView, ActivityIndicator } from 'react-native';

const ADD_LOG = gql`
  mutation Mutation($input: LogInput) {
    addLog(input: $input) {
      checkin
      checkout
      day
      id
      identification
      name
    }
  }
`;

const UPDATE_LOG = gql`
  mutation Mutation($updateLogId: ID!, $input: LogInput) {
    updateLog(id: $updateLogId, input: $input) {
      checkin
      checkout
      day
      id
      identification
      name
    }
  }
`;

const CHECK_LOG = gql`
  query Query($identification: String!, $day: String!) {
    checkLog(identification: $identification, day: $day)
}
`

const Verified = ({ route, navigation}) => {
  var payload = route.params.payload;
  var picture = payload.firstFacialVerificationFrame;
  var name = payload.fullname;
  var id = payload.documentNumber;
  var check = route.params.check;

  var currentDate = new Date();
  var formattedDate = moment(currentDate).format('DD-MM-20YY');
  var formattedTime = moment(currentDate).format('h:mm A');

  const [imageLoaded, setImageLoaded] = useState(false);
  const [addLog] = useMutation(ADD_LOG);
  const [updateLog] = useMutation(UPDATE_LOG);

  //console.log(formattedDate);
  //console.log(formattedTime);

  const addingLog = async() => {
    try {

      const {data} = await addLog({
        variables : {
          input : {
            checkin : formattedTime,
            checkout: null,
            day : formattedDate,
            identification : id,
            name : name
          }
        }
      });

      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const updatingLog = async() => {
    try {
      const {data} = useQuery(CHECK_LOG,{
        variables : {
          identification : id,
          day : formattedDate,
        },
      });

      var objectID = data.checkLog;

      
      
    } catch (error) {
      console.log(error);
    }
  };

  if(check === 'in'){
    addingLog();
  }
  else{
    updatingLog();
  }

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../../assets/img/imgBG02.png')}
        style={styles.background}
      >
        <View style={styles.pictureContainer}>
          {!imageLoaded && <ActivityIndicator size="large" color="#FFF" style={{marginTop : 200}}/>}
          <FastImage
            source={{ uri: picture }}
            style={[styles.picture, { opacity: imageLoaded ? 1 : 0 }]}
            onLoad={() => {setImageLoaded(true), setTimeout(() => {
                navigation.navigate('InitialScreen');
            }, 3000); }}
          />
        </View>

        <View style={styles.welcomingText}>
          <Text style={styles.welcome}>{check==='in' ? 'Welcome!' : 'Farewell!'}</Text>
          <Text style={styles.name}>{name}</Text>
        </View>

        <View style={styles.identi}>
          <Image
            source={require('../../assets/img/verified.png')}
            style={styles.ico}
          />
          <Text style={styles.idS}>{id}</Text>
        </View>
        <Image
          source={require('../../assets/img/check.png')}
          style={styles.check}
        />
      </ImageBackground>
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
  pictureContainer: {
    marginTop: 70,
    width: '45%',
    height: '35%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 10,
    borderColor: '#FFF',
    borderRadius: 250,
    overflow: 'hidden',
  },
  picture: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  welcomingText: {
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  welcome: {
    color: "#FFF",
    fontSize: 30,
  },
  name: {
    marginTop: 10,
    color: "#FFF",
    fontSize: 18,
  },
  identi: {
    marginTop: 60,
    backgroundColor: '#80d2ea',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    justifyContent: 'space-around',
    padding: 20
  },
  ico: {
    alignSelf: 'flex-start',
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  idS: {
    color: '#FFF',
    fontSize: 26,
  },
  check: {
    width: 35,
    height: 35,
    marginTop: 20,
  },
});

export default Verified;
