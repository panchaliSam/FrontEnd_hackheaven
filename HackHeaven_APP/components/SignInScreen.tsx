import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert } from 'react-native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import '@/firebaseConfig'; // Ensure this is the correct path
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the types for your navigation
type RootStackParamList = {
  SignUp: undefined;
  Home: { user_token: string, email: string }; // Pass email along with user_token
};

type SignInScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SignUp' | 'Home'>;

type SignInScreenProps = {
  navigation: SignInScreenNavigationProp;
};

const SignInScreen: React.FC<SignInScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const auth = getAuth();

const handleSignIn = async () => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Retrieve the user token
    const userToken = await user.getIdToken(); // Get the user token

    // Save the user's email to AsyncStorage
    await AsyncStorage.setItem('userEmail', user.email || '');

    Alert.alert('Login Successful', 'Welcome back!');

    // Navigate to the Home and pass the user_token and email
    navigation.navigate('Home', { user_token: userToken, email: user.email || '' });
  } catch (error: any) {
    Alert.alert('Login Failed', error.message);
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log In</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={setPassword}
        value={password}
        secureTextEntry
      />
      <Button title="Log In" onPress={handleSignIn} />
      <Text style={styles.link} onPress={() => navigation.navigate('SignUp')}>
        Don't have an account? Sign Up
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  link: {
    marginTop: 15,
    textAlign: 'center',
    color: '#007BFF',
  },
});

export default SignInScreen;
