import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Image, TouchableOpacity, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { storage } from '@/firebaseConfig'; // Ensure this is the correct path
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Firebase storage functions
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import { RouteProp } from '@react-navigation/native';
import { Platform } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // Import icon library
import { getAuth, sendPasswordResetEmail } from 'firebase/auth'; // Import Firebase Auth functions

type RootStackParamList = {
  ProfileScreen: { user_token: string; email: string };
};

interface ProfileScreenProps {
  route: RouteProp<RootStackParamList, 'ProfileScreen'>;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ route }) => {
  const { user_token, email } = route.params;
  const [profileImage, setProfileImage] = useState<string | null>(null); // Initially null

  const auth = getAuth(); // Initialize Firebase Auth

  // Function to upload the image
  const uploadImage = async (uri: string) => {
    try {
      let filePath = uri;
      if (Platform.OS === 'ios' && !uri.startsWith('file://')) {
        filePath = `file://${uri}`;
      }
      const response = await fetch(filePath);
      const blob = await response.blob();
      const storageRef = ref(storage, `profileImages/${user_token}.jpg`); // Using the imported storage
      await uploadBytes(storageRef, blob); // Uploading the image blob
      const profileImageURL = await getDownloadURL(storageRef); // Get download URL
      setProfileImage(profileImageURL); // Set uploaded image URL
      await AsyncStorage.setItem('profileImage', profileImageURL); // Store URL in AsyncStorage
      Alert.alert('Success', 'Your profile image has been updated.');
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Upload failed', 'Could not upload image. Please try again.');
    }
  };

  // Function to load the profile image from AsyncStorage
  const loadProfileImage = async () => {
    try {
      const storedImage = await AsyncStorage.getItem('profileImage'); // Retrieve URL from AsyncStorage
      if (storedImage) {
        setProfileImage(storedImage); // Set profile image URL if it exists
      }
    } catch (error) {
      console.error('Failed to load profile image:', error);
    }
  };

  // Load the profile image on component mount
  useEffect(() => {
    loadProfileImage();
  }, []);

  // Image picker function
  const selectImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });
      if (!result.canceled && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        if (uri) {
          await uploadImage(uri);
        }
      }
    } catch (error) {
      console.error('Image selection error:', error);
      Alert.alert('Error', 'Failed to open image picker.');
    }
  };

  // Function to reset password
  const resetPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert('Success', 'Password reset email sent. Please check your inbox.');
    } catch (error) {
      console.error('Password reset error:', error);
      Alert.alert('Error', 'Failed to send password reset email. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={selectImage} style={styles.imageButton}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        ) : (
          <FontAwesome name="user-circle-o" size={120} color="gray" style={styles.defaultIcon} />
        )}
        <FontAwesome name="camera" size={24} color="black" style={styles.cameraIcon} />
      </TouchableOpacity>

      <View style={styles.inputContainer}>
        <Text>Email</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            value={email} // Display email passed from HomeScreen
            editable={false} // Email is non-editable
            style={styles.input}
          />
        </View>

        <TouchableOpacity onPress={resetPassword} style={styles.resetButton}>
          <Text style={styles.resetText}>Reset Password</Text>
        </TouchableOpacity>

        <Button title="Done" onPress={() => Alert.alert('Profile Updated')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    alignSelf: 'center',
  },
  defaultIcon: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 20,
  },
  imageButton: {
    position: 'relative',
    alignItems: 'center',
  },
  cameraIcon: {
    position: 'absolute',
    right: 10,
    bottom: 10,
  },
  inputContainer: {
    marginTop: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  resetButton: {
    alignSelf: 'flex-start',
    marginVertical: 10,
  },
  resetText: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
});

export default ProfileScreen;
