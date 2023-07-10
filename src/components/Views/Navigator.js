import 'react-native-gesture-handler';
import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

import InitialScreen from './InitialScreen';
import CameraScreen from './CameraScreen';
import Verified from './Verified';
import Unverified from './Unverified';

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
            name="InitialScreen" 
            component={InitialScreen} 
            options={{ headerShown: false}}
        />
        <Stack.Screen
            name="CameraScreen"
            component={CameraScreen}
            options={{ headerShown: false } }
        />
         <Stack.Screen
            name="Verified"
            component={Verified}
            options={{ headerShown: false } }
        />
         <Stack.Screen
            name="Unverified"
            component={Unverified}
            options={{ headerShown: false } }
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
