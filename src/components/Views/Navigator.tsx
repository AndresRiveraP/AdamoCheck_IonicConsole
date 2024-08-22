import 'react-native-gesture-handler';
import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import InitialScreen from './InitialScreen';
import CameraScreen from './CameraScreen';
import Verified from './Verified';
import Unverified from './Unverified';

export type RootStackParamList = {
  InitialScreen: undefined;
  CameraScreen: { check: string | null };
  Verified: { payload: any; check: string | null };
  Unverified: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const App: React.FC = () => {
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
