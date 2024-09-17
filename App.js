import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LotoScreen from './screens/lotoScreen'; 
import HomeScreen from './screens/HomeScreen';
import EuroScreen from './screens/euroScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="HomeScreen">
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{ headerShown: false }} 
        />
        <Stack.Screen
          name="LotoScreen"
          component={LotoScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EuroScreen"
          component={EuroScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
