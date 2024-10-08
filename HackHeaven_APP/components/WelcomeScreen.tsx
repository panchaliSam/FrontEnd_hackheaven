import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const WelcomeScreen = ({ navigation }) => {
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
