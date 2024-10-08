import React from 'react';
import { View, Text, StyleSheet, Image, Button } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';

// Define the types for your navigation
type RootStackParamList = {
  OnBoardScreen3: undefined;
  WelcomeScreen: undefined; // Fix the spelling here
};

type OnBoardScreen1NavigationProp = StackNavigationProp<
  RootStackParamList,
  'OnBoardScreen3' | 'WelcomeScreen' // Fix the spelling here as well
>;

type OnBoardScreen1Props = {
  navigation: OnBoardScreen1NavigationProp;
};

const OnBoardScreen3: React.FC<OnBoardScreen1Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/logos/NameBlack.png')} 
        style={styles.logo}
      />
      <Image
        source={require('../assets/images/onBoardImages/3.png')}
        style={styles.image}
      />
      <Text style={styles.description}>Let's make your next hackathon unforgettable!</Text>
      <View style={styles.buttonContainer}>
        <Button
          title="Start Exploring"
          onPress={() => navigation.navigate('WelcomeScreen')} // Fix the spelling here
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
    padding: 20,
  },
  logo: {
    width: '100%', 
    height: 150, 
    resizeMode: 'contain', 
    marginBottom: 20,
  },
  image: {
    width: '100%', 
    height: 150, 
    resizeMode: 'contain', 
    marginBottom: 20,
  },
  description: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  buttonContainer: {
    width: '80%', 
  },
});

export default OnBoardScreen3;
