// import React, { useState } from "react";
// import { StyleSheet, Text, View, TextInput, Button, Alert, ScrollView } from "react-native";
// import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
// import "../../firebaseConfig"; // Ensure this is the correct path

// export default function App() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [profileImage, setProfileImage] = useState("");
//   const [loggedInUser, setLoggedInUser] = useState(null);
//   const auth = getAuth();

//   // Function to send user data to the backend
//   const storeUserInDatabase = async (email, token) => {
//     console.log("Storing user in database with email:", email, "and token:", token); // Log email and token
//     try {
//       const response = await fetch("http://localhost:4003/api/user/add", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           email,
//           profileImage,
//           user_token: token,
//         }),
//       });

//       const data = await response.json();
//       console.log("Response from backend:", data); // Log the response from the backend
//       if (data.userId) {
//         Alert.alert("User stored successfully!");
//       } else {
//         Alert.alert("Failed to store user data.");
//       }
//     } catch (error) {
//       console.error("Error storing user data:", error);
//       Alert.alert("An error occurred while storing user data.");
//     }
//   };

//   // Firebase Sign-Up
//   const createUser = async () => {
//     console.log("Creating user with email:", email); // Log email for user creation
//     try {
//       const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//       const user = userCredential.user;
//       const token = await user.getIdToken(); // Get the user's ID token
//       console.log("User created:", user.email); // Log user email
//       await storeUserInDatabase(user.email, token); // Send user data to backend
//       Alert.alert("Sign-Up Successful!", `Welcome, ${user.email}`);
//       setLoggedInUser(user.email);
//     } catch (error) {
//       const errorMessage = error.message;
//       console.error("Sign-Up Failed:", errorMessage); // Log error message
//       Alert.alert("Sign-Up Failed", errorMessage);
//     }
//   };

//   // Firebase Login
//   const login = async () => {
//     console.log("Logging in user with email:", email); // Log email for login
//     try {
//       const userCredential = await signInWithEmailAndPassword(auth, email, password);
//       const user = userCredential.user;
//       const token = await user.getIdToken(); // Get the user's ID token
//       console.log("User logged in:", user.email); // Log user email
//       Alert.alert("Login Successful!", `Welcome back, ${user.email}`);
//       setLoggedInUser(user.email);
//     } catch (error) {
//       const errorMessage = error.message;
//       console.error("Login Failed:", errorMessage); // Log error message
//       Alert.alert("Login Failed", errorMessage);
//     }
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <View>
//         <Text>Email</Text>
//         <TextInput
//           style={styles.input}
//           onChangeText={setEmail}
//           value={email}
//           placeholder="Enter email"
//           keyboardType="email-address"
//           autoCapitalize="none"
//         />
//         <Text>Password</Text>
//         <TextInput
//           style={styles.input}
//           onChangeText={setPassword}
//           value={password}
//           placeholder="Enter password"
//           secureTextEntry={true}
//         />
//         <Text>Profile Image URL</Text>
//         <TextInput
//           style={styles.input}
//           onChangeText={setProfileImage}
//           value={profileImage}
//           placeholder="Enter profile image URL"
//         />
//         <Button title="Sign Up!" onPress={createUser} />
//         <Button title="Login!" onPress={login} />
//         {loggedInUser && <Text>Logged in as: {loggedInUser}</Text>}
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     backgroundColor: "#fff",
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 20,
//   },
//   input: {
//     height: 40,
//     width: 250,
//     margin: 10,
//     borderWidth: 1,
//     borderColor: "#ccc",
//     padding: 10,
//     borderRadius: 5,
//   },
// });

import React from 'react';
import { View, StyleSheet } from 'react-native'; // Import View and StyleSheet
import { registerRootComponent } from 'expo';
import AppNavigator from '../components/navigation/AppNavigator'; // Adjust path as needed

const App: React.FC = () => {
  return (
    <View style={styles.container}> {/* Wrap AppNavigator in View */}
      <AppNavigator />
    </View>
  ); 
};

// Define styles
const styles = StyleSheet.create({
  container: {
    flex: 1, // Allow the View to take up the full screen
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
    backgroundColor: '#fff', // Set a background color (optional)
  },
});

// Register the root component
registerRootComponent(App);

export default App;
