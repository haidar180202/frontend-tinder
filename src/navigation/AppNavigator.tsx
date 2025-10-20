
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import TabNavigator from './TabNavigator';
import ChatScreen from '../screens/ChatScreen';
import CreateProfileScreen from '../screens/CreateProfileScreen';
import { RootStackParamList } from '../types';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Main" component={TabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen 
        name="CreateProfile" 
        component={CreateProfileScreen} 
        options={({ route }) => ({ 
          headerShown: true, 
          title: route.params?.isEdit ? 'Update Profile' : 'Create Profile' 
        })} 
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;