import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

// Define types for the navigation routes
type RootStackParamList = {
  Hackathons: undefined;
  Sponsors: undefined;
  Organizer: undefined;
  Innovators: undefined;
  ProfileScreen: { user_token: string; email: string }; // Add ProfileScreen type
};

// Define the type for the navigation prop
type NavigationProp = StackNavigationProp<RootStackParamList>;

const HomeScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const [profileImage, setProfileImage] = useState<string | null>(null); // State for profile image
    const [email, setEmail] = useState<string>(''); // State for user email
    const user_token = ''; // Retrieve this from your authentication context or passed props

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

    const loadEmail = async () => {
      try {
          const storedEmail = await AsyncStorage.getItem('userEmail');
          if (storedEmail) {
              setEmail(storedEmail);
          } else {
              console.log('No email found in storage.');
          }
      } catch (error) {
          console.error('Failed to load email:', error);
          Alert.alert('Error', 'Failed to retrieve email. Please try again later.');
      }
  };
  
    // Load the profile image and email on component mount
    useEffect(() => {
        loadProfileImage();
        loadEmail();
    }, []);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Header section */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.menuButton}>
                    <Text style={styles.menuText}>☰</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Home</Text>
                <TouchableOpacity onPress={() => navigation.navigate('ProfileScreen', { user_token, email })}>
                    <Image
                        source={{ uri: profileImage || 'https://path-to-default-profile-image.png' }} // Default image if null
                        style={styles.profileImage}
                    />
                </TouchableOpacity>
            </View>

            {/* Grid section */}
            <View style={styles.gridContainer}>
                {/* Hackathons card */}
                <TouchableOpacity
                    style={styles.card}
                    onPress={() => navigation.navigate('Hackathons')}
                >
                    <View style={styles.placeholderImage} />
                    <Text style={styles.cardTitle}>Hackathons</Text>
                </TouchableOpacity>

                {/* Sponsors card */}
                <TouchableOpacity
                    style={styles.card}
                    onPress={() => navigation.navigate('Sponsors')}
                >
                    <View style={styles.placeholderImage} />
                    <Text style={styles.cardTitle}>Sponsors</Text>
                </TouchableOpacity>

                {/* Organizer card */}
                <TouchableOpacity
                    style={styles.card}
                    onPress={() => navigation.navigate('Organizer')}
                >
                    <View style={styles.placeholderImage} />
                    <Text style={styles.cardTitle}>Organizer</Text>
                </TouchableOpacity>

                {/* Innovators card */}
                <TouchableOpacity
                    style={styles.card}
                    onPress={() => navigation.navigate('Innovators')}
                >
                    <Image
                        source={{
                            uri: 'https://path-to-innovator-image.png',
                        }}
                        style={styles.innovatorImage}
                    />
                    <Text style={styles.cardTitle}>Innovators</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

// Styles for the screen
const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
        flexGrow: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    menuButton: {
        padding: 10,
    },
    menuText: {
        fontSize: 24,
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
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        width: '45%',
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        marginBottom: 20,
        alignItems: 'center',
        paddingVertical: 20,
    },
    placeholderImage: {
        width: 100,
        height: 100,
        backgroundColor: '#e0e0e0',
        borderRadius: 10,
        marginBottom: 10,
    },
    innovatorImage: {
        width: 100,
        height: 100,
        borderRadius: 10,
    },
    cardTitle: { // Add cardTitle style
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
    },
});

export default HomeScreen;
