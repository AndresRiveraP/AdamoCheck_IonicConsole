import 'react-native-gesture-handler';
import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import InitialScreen from './InitialScreen';
import CameraScreen from './CameraScreen';
import LoadingScreen from './LoadingModal';
import Verified from './Verified';
import Verified2 from './Verified2';
import Verified3 from './Verified3';
import Unverified from './Unverified';
import InternalLogin from './InternalLogin';
import VerifiedNew from './VerifiedNew';
import Verified2New from './Verified2New';
import Splash from './Splash';
import Verified3New from './Verified3New';
import VerifiedBirthday from './VerifiedBirthday';
import UnverifiedNew from './UnverifiedNew';
import NoData from './NoData';

const Stack = createStackNavigator();

interface NavigatorProps {
  initialRouteName: string;
}

const Navigator: React.FC<NavigatorProps> = ({initialRouteName}) => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRouteName}>
        <Stack.Screen
            name="Splash"
            component={Splash as React.FC}
            options={{ headerShown: false, headerLeft: () => null} }
        />
        <Stack.Screen
            name="InternalLogin"
            component={InternalLogin as React.FC}
            options={{ headerShown: false, headerLeft: () => null} }
        />
        <Stack.Screen 
            name="InitialScreen" 
            component={InitialScreen as React.FC} 
            options={{
                headerShown: false,
                cardStyleInterpolator: ({ current, layouts }) => {
                    return {
                        cardStyle: {
                            opacity: current.progress,
                            transform: [
                                {
                                    translateX: current.progress.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [layouts.screen.width, 0],
                                    }),
                                },
                            ],
                        },
                    };
                },
            }}
        />
        <Stack.Screen
            name="CameraScreen"
            component={CameraScreen as React.FC}
            options={{ headerShown: false, headerLeft: () => null,} }
        />
        <Stack.Screen
            name="LoadingScreen"
            component={LoadingScreen as React.FC}
            options={{ headerShown: false, headerLeft: () => null,} }
          />
         <Stack.Screen
            name="Verified"
            component={Verified as React.FC}
            options={{ headerShown: false , headerLeft: () => null,
        }} 
        />
        <Stack.Screen
            name="Verified2"
            component={Verified2 as React.FC}
            options={{ headerShown: false, headerLeft: () => null, } }
        />
        <Stack.Screen 
            name="Verified3"
            component={Verified3 as React.FC}
            options={{ headerShown: false, headerLeft: () => null, } }
        />
         <Stack.Screen
            name="Unverified"
            component={Unverified as React.FC}
            options={{ headerShown: false, headerLeft: () => null} }
        />
        <Stack.Screen
           name="VerifiedNew"
           component={VerifiedNew as React.FC}
           options={{ headerShown: false, headerLeft: () => null} }
        />
        <Stack.Screen
           name="Verified2New"
           component={Verified2New as React.FC}
           options={{ headerShown: false, headerLeft: () => null} }
        />
        <Stack.Screen
           name="Verified3New"
           component={Verified3New as React.FC}
           options={{ headerShown: false, headerLeft: () => null} }
        />
        <Stack.Screen
           name="VerifiedBirthday"
           component={VerifiedBirthday as React.FC}
           options={{ headerShown: false, headerLeft: () => null} }
        />
        <Stack.Screen
           name="UnverifiedNew"
           component={UnverifiedNew as React.FC}
           options={{ headerShown: false, headerLeft: () => null} }
        />
        <Stack.Screen
           name="NoData"
           component={NoData as React.FC}
           options={{ headerShown: false, headerLeft: () => null} }
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigator;
