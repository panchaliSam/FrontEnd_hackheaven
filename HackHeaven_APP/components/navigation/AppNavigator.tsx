import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnBoardScreen1 from '@/components/OnBoardScreen1'; 
import OnBoardScreen2 from '@/components/OnBoardScreen2';
import OnBoardScreen3 from '@/components/OnBoardScreen3';
import WelcomeScreen from '@/components/WelcomeScreen'; 
import SignUpScreen from '@/components/SignUpScreen'; 
import SignInScreen from '@/components/SignInScreen'; 
import ProfileScreen from '@/components/ProfileScreen';
// import HomeScreen from '@/components/HomeScreen';
import BottomTabNavigator from './BottomTabNavigator'; 

const Stack = createNativeStackNavigator();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName="OnBoardScreen1">
        <Stack.Screen
          name="OnBoardScreen1"
          component={OnBoardScreen1}
          options={{ headerShown: false }} 
        />
        <Stack.Screen
          name="OnBoardScreen2"
          component={OnBoardScreen2}
          options={{ headerShown: false }} 
        />
        <Stack.Screen
          name="OnBoardScreen3"
          component={OnBoardScreen3}
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="WelcomeScreen" 
          component={WelcomeScreen} 
          options={{ title: 'Welcome' }}
        />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="SignIn" component={SignInScreen} />
        
        {/* Add the Bottom Tab Navigator instead of HomeScreen */}
        <Stack.Screen 
          name="Home" 
          component={BottomTabNavigator} // This will load the bottom navigation
          options={{ headerShown: false }} // You can hide the header if desired
        />

        {/* <Stack.Screen name="HomeScreen" component={HomeScreen} /> */}

        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
