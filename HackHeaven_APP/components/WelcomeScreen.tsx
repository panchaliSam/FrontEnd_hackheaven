import React from 'react';
import { View, Text, StyleSheet, Button, Image } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';

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
      <Image
        source={require('../assets/images/logos/Icon PNG.png')} // Ensure the path to the image is correct
        style={styles.logo}
      />
      <Text style={styles.welcomeText}>Welcome to HackHeaven!</Text>
      <View style={styles.buttonContainer}>
        <Button
          title="Sign Up"
          onPress={() => navigation.navigate('SignUp')} // Navigate to Sign Up screen
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Log In"
          onPress={() => navigation.navigate('SignIn')} // Navigate to Sign In screen
        />
      </View>
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
  logo: {
    width: 210,
    height: 200,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '80%', 
    marginVertical: 10,
  },
});

export default WelcomeScreen;
