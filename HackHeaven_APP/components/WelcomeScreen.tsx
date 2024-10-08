import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

// Define the types for your navigation
type RootStackParamList = {
  SignUp: undefined;
  SignIn: undefined;
};

type WelcomeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'SignUp' | 'SignIn'
>;

type WelcomeScreenProps = {
  navigation: WelcomeScreenNavigationProp;
};

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome to HackHeaven!</Text>
      <Button
        title="Sign Up"
        onPress={() => navigation.navigate('SignUp')} // Navigate to Sign Up screen
      />
      <Button
        title="Log In"
        onPress={() => navigation.navigate('SignIn')} // Navigate to Sign In screen
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
});

export default WelcomeScreen;
