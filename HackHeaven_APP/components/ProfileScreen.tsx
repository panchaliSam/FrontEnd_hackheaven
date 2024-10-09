import React from 'react';
import { View, Button, Alert, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker'; // Import from expo-image-picker
import storage from '@react-native-firebase/storage';
import axios from 'axios';
import { RouteProp } from '@react-navigation/native';

// Define the types for your navigation
type RootStackParamList = {
  ProfileScreen: { user_token: string }; // Update to accept user_token as a parameter
};

interface ProfileScreenProps {
  route: RouteProp<RootStackParamList, 'ProfileScreen'>; // Use RouteProp to access params
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ route }) => {
  const { user_token } = route.params; // Extract user_token from props

  // Request permission to access image library
  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Permission to access media library is required!');
    }
  };

  React.useEffect(() => {
    requestPermission(); // Request permission when component mounts
  }, []);

  const uploadImage = async (uri: string) => {
    try {
      // Create a reference to the storage bucket
      const reference = storage().ref(`profileImages/${user_token}.jpg`);

      // Upload the image
      await reference.putFile(uri);

      // Get the download URL
      const profileImage = await reference.getDownloadURL();

      // Call the API to update the user profile image in MySQL
      await updateUserProfileImage(user_token, profileImage);

      Alert.alert('Success', 'Your profile image has been updated.');
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Upload failed', 'Could not upload image. Please try again.');
    }
  };

  const updateUserProfileImage = async (user_token: string, profileImage: string) => {
    try {
      const response = await axios.post('http://localhost:4003/api/user/update', {
        user_token: user_token, // Send user_token instead of userId
        profileImage,
      });

      if (response.status === 200) {
        console.log('User profile updated successfully:', response.data);
      } else {
        console.error('Failed to update user profile:', response.data);
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
      Alert.alert('Error', 'Failed to update user profile. Please try again later.');
    }
  };

  const selectImage = async () => {
    try {
      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri; // Get the image URI
        if (uri) {
          await uploadImage(uri); // Upload the image
        } else {
          Alert.alert('Error', 'Image not selected. Please try again.');
        }
      }
    } catch (error) {
      console.error('Image selection error:', error);
      Alert.alert('Error', 'Failed to open image picker.');
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Upload Profile Image" onPress={selectImage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default ProfileScreen;
