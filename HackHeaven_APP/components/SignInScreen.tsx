import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert, TouchableOpacity, Image } from 'react-native';
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import '@/firebaseConfig'; // Ensure this is the correct path
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons'; // Import the icon component
import Sidebar from './Sidebar'; // Import the Sidebar component

// Define the types for your navigation
type RootStackParamList = {
  SignUp: undefined;
  Main: { user_token: string; email: string; profileImage: string | null }; // Updated to include profile image
};

type SignInScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SignUp' | 'Main'>;

type SignInScreenProps = {
  navigation: SignInScreenNavigationProp;
};

const SignInScreen: React.FC<SignInScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false); // Toggle password visibility
  const auth = getAuth();

  const handleSignIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Retrieve the user token
      const userToken = await user.getIdToken(); // Get the user token

      // Save the user's email to AsyncStorage
      await AsyncStorage.setItem('userEmail', user.email || '');

      // Optionally, retrieve the user's profile image from your user database or use a placeholder
      const profileImage = user.photoURL || 'https://path-to-default-profile-image.png'; // Placeholder for profile image

      Alert.alert('Login Successful', 'Welcome back!');

      // Navigate to the Main screen and pass the user_token, email, and profileImage
      navigation.navigate('Main', {
        user_token: userToken,
        email: user.email || '',
        profileImage,
      });
    } catch (error: any) {
      Alert.alert('Login Failed', error.message);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email to reset your password.');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert('Password Reset', 'A password reset link has been sent to your email.');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: 'https://firebasestorage.googleapis.com/v0/b/hackheaven-1a9c2.appspot.com/o/HomeScreenImages%2FLogIn.jpg?alt=media&token=d633dc40-f08d-424a-8823-53f652453428', // Replace with your actual image URI
        }}
        style={styles.loginImage}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          onChangeText={setPassword}
          value={password}
          secureTextEntry={!isPasswordVisible} // Toggle based on isPasswordVisible state
        />
        <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
          <Icon name={isPasswordVisible ? 'eye-off' : 'eye'} size={24} color="gray" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={handleForgotPassword}>
        <Text style={styles.forgotPassword}>Forgot Password?</Text>
      </TouchableOpacity>

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
  loginImage: {
    width: 300,
    height: 200,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  passwordInput: {
    flex: 1,
    height: 40,
  },
  forgotPassword: {
    marginBottom: 20,
    color: '#007BFF',
    textAlign: 'right',
  },
  link: {
    marginTop: 15,
    textAlign: 'center',
    color: '#007BFF',
  },
});

export default SignInScreen;
