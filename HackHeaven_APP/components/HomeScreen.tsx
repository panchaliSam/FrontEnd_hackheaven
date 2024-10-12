import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Alert  } from 'react-native';
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
                {/* <TouchableOpacity style={styles.menuButton}>
                    <Text style={styles.menuText}>☰</Text>
                </TouchableOpacity> */}
                <Text style={styles.title}>H O M E</Text>
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
                    onPress={() => navigation.navigate('H A C K A T H O N S')}
                >
                    <Image
                        source={{
                            uri: 'https://firebasestorage.googleapis.com/v0/b/hackheaven-1a9c2.appspot.com/o/HomeScreenImages%2FHackathon.jpg?alt=media&token=6b8e9b2d-4358-4531-9c0f-16ffe1c6afad',
                        }}
                        style={styles.innovatorImage}
                    />
                    <Text style={styles.cardTitle}>Hackathons</Text>
                </TouchableOpacity>

                {/* Sponsors card */}
                <TouchableOpacity
                    style={styles.card}
                    onPress={() => navigation.navigate('S P O N S O R S')}
                >
                    <Image
                        source={{
                            uri: 'https://firebasestorage.googleapis.com/v0/b/hackheaven-1a9c2.appspot.com/o/HackathonImages%2Fbusiness.jpg?alt=media&token=9167ca81-77de-41be-bdc1-c66af2d6649a',
                        }}
                        style={styles.innovatorImage}
                    />
                    <Text style={styles.cardTitle}>Sponsors</Text>
                </TouchableOpacity>

                {/* Organizer card */}
                <TouchableOpacity
                    style={styles.card}
                    onPress={() => navigation.navigate('O R G A N I Z E R')}
                >
                    <Image
                        source={{
                            uri: 'https://firebasestorage.googleapis.com/v0/b/hackheaven-1a9c2.appspot.com/o/HomeScreenImages%2FOrganizer.png?alt=media&token=390c8424-1d71-49eb-aedd-d467c4f82ec4',
                        }}
                        style={styles.innovatorImage}
                    />
                    <Text style={styles.cardTitle}>Organizer</Text>
                </TouchableOpacity>

                {/* Innovators card */}
                <TouchableOpacity
                    style={styles.card}
                    onPress={() => navigation.navigate('I N N O V A T I O N S')}
                >
                    <Image
                        source={{
                            uri: 'https://firebasestorage.googleapis.com/v0/b/hackheaven-1a9c2.appspot.com/o/HomeScreenImages%2FInnovator.png?alt=media&token=ccaf6f00-9493-42a9-afca-7a81d2f93643',
                        }}
                        style={styles.innovatorImage}
                    />
                    <Text style={styles.cardTitle}>Innovations</Text>
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
        borderColor: '#099fe1',
        borderWidth: 1, // Ensure border is visible
        borderRadius: 10,
        marginBottom: 20,
        marginTop: 50,
        alignItems: 'center',
        paddingVertical: 20,
        
        // Shadow properties for iOS
        shadowColor: '#000', // Color of the shadow
        shadowOffset: {
            width: 0, // Horizontal offset
            height: 2, // Vertical offset
        },
        shadowOpacity: 0.25, // Opacity of the shadow
        shadowRadius: 3.5, // Blur radius of the shadow
    
        // Elevation for Android
        elevation: 5, // Control the depth of the shadow
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
