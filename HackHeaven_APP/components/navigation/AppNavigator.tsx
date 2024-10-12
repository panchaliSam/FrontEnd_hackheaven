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
import OrganizerScreen from '@/components/OrganizerDashboardScreen';
import OrganizerAddHacakthon from '@/components/OrganizerScreen'
import AddHackathon from '@/components/AddHackathon';
import ChatScreen from '@/components/ChatScreen';


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
        <Stack.Screen name="H A C K A T H O N S" component={HackathonScreen} />
        <Stack.Screen name="S P O N S O R S" component={SponsorScreen} />
        <Stack.Screen name="ADD  SPONSOR" component={AddSponsorScreen} />
        <Stack.Screen name="I N N O V A T I O N S" component={InnovatorScreen} />
        <Stack.Screen name="ADD INNOVATOR" component={AddInnovatorScreen} />
        <Stack.Screen name="O R G A N I Z E R" component={OrganizerScreen} />
        <Stack.Screen name="ADD HACKATHON" component={OrganizerAddHacakthon} />
        <Stack.Screen name="ChatScreen" component={ChatScreen} />
        <Stack.Screen name="ADD HACKATHON2" component={AddHackathon} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Create the main drawer navigator
const MainDrawerNavigator = () => {
  return (
    <Drawer.Navigator drawerContent={(props) => <Sidebar {...props} />}>
      <Drawer.Screen name="M E N U" component={BottomTabNavigator} />
      {/* Add more screens to the drawer if needed */}
      <Drawer.Screen name="Profile" component={ProfileScreen} />
      {/* Additional screens can be added here */}
    </Drawer.Navigator>
  );
};

export default AppNavigator;
