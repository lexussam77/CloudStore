import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Your existing imports
import PrivacyPolicyScreen from './screens/PrivacyPolicy';
import TermsOfServiceScreen from './screens/TermsofService';
import { AddAccount } from './screens/AddAccount';
import SignUp from './screens/Login';

// You're also missing these component imports:
import BottomTabNavigation from './screens/BottomTabNavigation'; // Add correct path
import Settings from './screens/Settings'; // Add correct path
import Login from './screens/Login'

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const loggedIn = await AsyncStorage.getItem('loggedIn');
      setIsLoggedIn(loggedIn === 'true');
    };
    checkLoginStatus();
  }, []);

  if (isLoggedIn === null) {
    return null; // or splash/loading screen
  }

  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="MainTabs"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen 
          name="MainTabs" 
          component={BottomTabNavigation} 
        />
        <Stack.Screen 
          name="Settings" 
          component={Settings}
        />
        <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
        <Stack.Screen name="TermsOfService" component={TermsOfServiceScreen} />
        <Stack.Screen 
          name="Login" 
          component={(props) => <Login {...props} setIsLoggedIn={setIsLoggedIn} />} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}