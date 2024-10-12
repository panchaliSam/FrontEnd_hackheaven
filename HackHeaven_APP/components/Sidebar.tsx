import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { DrawerContentScrollView, DrawerItemList, DrawerContentComponentProps } from '@react-navigation/drawer';
import { Divider } from 'react-native-paper';
import { getAuth } from 'firebase/auth'; // Import Firebase Auth

// No need for a custom interface
const Sidebar: React.FC<DrawerContentComponentProps> = (props) => {
  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await auth.signOut(); // Sign out the user
      props.navigation.navigate('SignIn'); // Navigate to Sign In screen after logout
    } catch (error) {
      console.error('Logout Error:', error);
    }
  };

  return (
    <DrawerContentScrollView {...props}>
      {/* Profile Section */}
      <View style={styles.profileContainer}>
        <Image
          source={require('../assets/images/logos/LightBGPNG.png')} // Ensure the path to the image is correct
          style={styles.logo}
        />
        <Divider style={styles.divider} />
      </View>

      {/* Navigation Links */}
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => props.navigation.navigate('H A C K A T H O N S')}
      >
        <Text style={styles.menuText}>Hackathons</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => props.navigation.navigate('Network')}
      >
        <Text style={styles.menuText}>Network</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => props.navigation.navigate('I N N O V A T I O N S')}
      >
        <Text style={styles.menuText}>Innovations</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => props.navigation.navigate('O R G A N I Z E R')}
      >
        <Text style={styles.menuText}>Organizer</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => props.navigation.navigate('S P O N S O R S')}
      >
        <Text style={styles.menuText}>Sponsors</Text>
      </TouchableOpacity>

      <Divider style={styles.divider} />

      {/* Logout Button */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout} // Handle logout
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#fff', // Background color for the profile section
    paddingVertical: 20,
  },
  logo: {
    width: 255,
    height: 200,
    marginBottom: 20,
  },
  divider: {
    marginVertical: 10,
    width: '80%',
    backgroundColor: '#4b4b4b',
  },
  menuItem: {
    padding: 15,
  },
  menuText: {
    fontSize: 16,
    color: '#000',
  },
  logoutButton: {
    backgroundColor: 'black',
    borderRadius: 5,
    paddingVertical: 10,
    alignItems: 'center',
    marginVertical: 10,
    width: '50%', // Set the desired width (adjust as needed)
    marginLeft: 10,
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
  },
});

export default Sidebar;
