import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LotoScreen from './screens/lotoScreen'; 

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="LotoScreen"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="LotoScreen"
          component={LotoScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
