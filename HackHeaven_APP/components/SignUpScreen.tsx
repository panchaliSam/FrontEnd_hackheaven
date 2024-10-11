import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert, TouchableOpacity, Image } from 'react-native';
import { getAuth, createUserWithEmailAndPassword, AuthError } from 'firebase/auth';
import '@/firebaseConfig'; // Ensure this is the correct path
import Icon from 'react-native-vector-icons/Ionicons'; // Import the icon component

// Define the props type for the SignUpScreen component
interface SignUpScreenProps {
  navigation: {
    navigate: (screen: string) => void;
  };
}

const SignUpScreen: React.FC<SignUpScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const auth = getAuth();

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Get the token
      const token = await user.getIdToken();

      // Ensure token is valid
      if (token) {
        // Since we're removing the backend storage, you can alert success here
        Alert.alert('Sign Up Successful', 'You can now log in!');
        navigation.navigate('SignIn'); // Navigate to Sign In screen
      } else {
        Alert.alert('Failed to get user token.');
      }
    } catch (error) {
      const firebaseError = error as AuthError;
      Alert.alert('Sign Up Failed', firebaseError.message);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: 'https://firebasestorage.googleapis.com/v0/b/hackheaven-1a9c2.appspot.com/o/HomeScreenImages%2FSignUp.jpg?alt=media&token=bd2b7a4d-20a4-47d9-80ca-b3ce3044835a', // Replace with your actual image URI
        }}
        style={styles.signUpImage}
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
          secureTextEntry={!isPasswordVisible}
        />
        <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
          <Icon name={isPasswordVisible ? 'eye-off' : 'eye'} size={24} color="gray" />
        </TouchableOpacity>
      </View>

      <Button title="Sign Up" onPress={handleSignUp} />

      {/* Already have an account section */}
      <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
        <Text style={styles.link}>Already have an account? Log In</Text>
      </TouchableOpacity>
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
  signUpImage: {
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
  link: {
    marginTop: 15,
    textAlign: 'center',
    color: '#007BFF',
  },
});

export default SignUpScreen;
