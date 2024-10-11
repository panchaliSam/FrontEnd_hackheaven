import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  ProfileScreen: { user_token: string; email: string }; // Adjust as needed
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

const Header: React.FC<{ user_token: string }> = ({ user_token }) => {
  const navigation = useNavigation<NavigationProp>();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [email, setEmail] = useState<string>('');

  const loadProfileImage = async () => {
    try {
      const storedImage = await AsyncStorage.getItem('profileImage');
      if (storedImage) {
        setProfileImage(storedImage);
      }
    } catch (error) {
      console.error('Failed to load profile image:', error);
    }
  };

  const loadEmail = async () => {
    try {
      const storedEmail = await AsyncStorage.getItem('userEmail');
      if (storedEmail) {
        setEmail(storedEmail);
      }
    } catch (error) {
      console.error('Failed to load email:', error);
    }
  };

  useEffect(() => {
    loadProfileImage();
    loadEmail();
  }, []);

  return (
    <View style={styles.header}>
      <Text style={styles.title}>Your App Title</Text>
      <TouchableOpacity onPress={() => navigation.navigate('ProfileScreen', { user_token, email })}>
        <Image
          source={{ uri: profileImage || 'https://path-to-default-profile-image.png' }}
          style={styles.profileImage}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});

export default Header;
