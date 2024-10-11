import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer'; // Import Drawer Navigator
import OnBoardScreen1 from '@/components/OnBoardScreen1'; 
import OnBoardScreen2 from '@/components/OnBoardScreen2';
import OnBoardScreen3 from '@/components/OnBoardScreen3';
import WelcomeScreen from '@/components/WelcomeScreen'; 
import SignUpScreen from '@/components/SignUpScreen'; 
import SignInScreen from '@/components/SignInScreen'; 
import ProfileScreen from '@/components/ProfileScreen';
import BottomTabNavigator from './BottomTabNavigator'; 
import Sidebar from '@/components/Sidebar'; 
import HackathonScreen from '@/components/HackathonScreen';
import SponsorScreen from '@/components/SponsorScreen';
import AddSponsorScreen from '@/components/AddSponsorScreen';
import InnovatorScreen from '@/components/InnovatorScreen';
import AddInnovatorScreen from '@/components/AddInnovatorScreen';
import OrganizerScreen from '@/components/OrganizerScreen';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator(); // Create Drawer Navigator

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
        
        {/* Drawer Navigation for Home and other screens */}
        <Stack.Screen name="Main" component={MainDrawerNavigator} options={{ headerShown: false }} />
        
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen name="Hackathons" component={HackathonScreen} />
        <Stack.Screen name="Sponsors" component={SponsorScreen} />
        <Stack.Screen name="AddSponsor" component={AddSponsorScreen} />
        <Stack.Screen name="Innovators" component={InnovatorScreen} />
        <Stack.Screen name="AddInnovator" component={AddInnovatorScreen} />
        <Stack.Screen name="Organizer" component={OrganizerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Create the main drawer navigator
const MainDrawerNavigator = () => {
  return (
    <Drawer.Navigator drawerContent={(props) => <Sidebar {...props} />}>
      <Drawer.Screen name="Menu" component={BottomTabNavigator} />
      {/* Add more screens to the drawer if needed */}
      <Drawer.Screen name="Profile" component={ProfileScreen} />
      {/* Additional screens can be added here */}
    </Drawer.Navigator>
  );
};

export default AppNavigator;
