import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert } from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import '../firebaseConfig'; // Ensure this is the correct path

const SignUpScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profileImage, setProfileImage] = useState(''); // Added for profile image
  const auth = getAuth();

  // Function to store user in the database
  const storeUserInDatabase = async (email, profileImage, token) => {
    try {
      const response = await fetch('http://localhost:4003/api/user/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          profileImage,
          user_token: token,
        }),
      });
      const data = await response.json();
      if (data.userId) {
        Alert.alert('User stored successfully!');
      } else {
        Alert.alert('Failed to store user data.');
      }
    } catch (error) {
      console.error('Error storing user data:', error);
      Alert.alert('An error occurred while storing user data.');
    }
  };

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const token = await user.getIdToken(); // Get the user's ID token
      
      // Store user in backend after signup
      await storeUserInDatabase(user.email, profileImage, token);

      Alert.alert('Sign Up Successful', 'You can now log in!');
      navigation.navigate('SignIn'); // Navigate to Sign In screen
    } catch (error) {
      Alert.alert('Sign Up Failed', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create an Account</Text>
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
      <TextInput
        style={styles.input}
        placeholder="Profile Image URL" // Added profile image input
        onChangeText={setProfileImage}
        value={profileImage}
      />
      <Button title="Sign Up" onPress={handleSignUp} />
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
});

export default SignUpScreen;
