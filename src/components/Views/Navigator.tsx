import 'react-native-gesture-handler';
import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import InitialScreen from './InitialScreen';
import CameraScreen from './CameraScreen';
import Verified from './Verified';
import Verified2 from './Verified2';
import Verified3 from './Verified3';
import Unverified from './Unverified';

const Stack = createStackNavigator();

const Navigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
            name="InitialScreen" 
            component={InitialScreen as React.FC} 
            options={{ headerShown: false}}
        />
        <Stack.Screen
            name="CameraScreen"
            component={CameraScreen as React.FC}
            options={{ headerShown: false } }
        />
         <Stack.Screen
            name="Verified"
            component={Verified as React.FC}
            options={{ headerShown: false } }
        />
        <Stack.Screen
            name="Verified2"
            component={Verified2 as React.FC}
            options={{ headerShown: false } }
        />
        <Stack.Screen 
            name="Verified3"
            component={Verified3 as React.FC}
            options={{ headerShown: false } }
        />
         <Stack.Screen
            name="Unverified"
            component={Unverified as React.FC}
            options={{ headerShown: false } }
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigator;
