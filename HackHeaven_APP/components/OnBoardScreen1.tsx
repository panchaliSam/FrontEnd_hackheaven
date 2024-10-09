import React from 'react';
import { View, Text, StyleSheet, Image, Button } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';

// Define the types for your navigation
type RootStackParamList = {
  OnBoardScreen1: undefined;
  OnBoardScreen2: undefined;
};

type OnBoardScreen1NavigationProp = StackNavigationProp<
  RootStackParamList,
  'OnBoardScreen1' | 'OnBoardScreen2'
>;

type OnBoardScreen1Props = {
  navigation: OnBoardScreen1NavigationProp;
};

const OnBoardScreen1: React.FC<OnBoardScreen1Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/logos/NameBlack.png')} 
        style={styles.logo}
      />
      <Image
        source={require('../assets/images/onBoardImages/1.png')}
        style={styles.image}
      />
      <Text style={styles.description}>Connect, Compete, Create.</Text>
      <View style={styles.buttonContainer}>
        <Button
          title="Get Started"
          onPress={() => navigation.navigate('OnBoardScreen2')} 
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
    width: '100%', // or specify a specific width
    height: 150, // Adjust as needed
    resizeMode: 'contain', // Maintain aspect ratio
    marginBottom: 20,
  },
  image: {
    width: '100%', // or specify a specific width
    height: 150, // Adjust as needed
    resizeMode: 'contain', // Maintain aspect ratio
    marginBottom: 20,
  },
  description: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  buttonContainer: {
    width: '80%', // Set the width of the button container
  },
});

export default OnBoardScreen1;
