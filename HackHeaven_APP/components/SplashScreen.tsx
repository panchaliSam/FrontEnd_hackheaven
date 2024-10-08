import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Define the props type for the SplashScreen component
interface SplashScreenProps {
  navigation: {
    replace: (screen: string) => void;
  };
}

const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
  useEffect(() => {
    // Navigate to the Welcome screen after 2 seconds
    const timer = setTimeout(() => {
      navigation.replace('Welcome'); // Use replace to remove Splash from stack
    }, 2000);

    // Cleanup the timer when the component unmounts
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.splashText}>Welcome to HackHeaven!</Text>
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
  splashText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
});

export default SplashScreen;
