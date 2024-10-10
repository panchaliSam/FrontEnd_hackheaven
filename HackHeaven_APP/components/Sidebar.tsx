import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { DrawerContentScrollView, DrawerItemList, DrawerItemListProps } from '@react-navigation/drawer';
import { Divider } from 'react-native-paper';

interface SidebarProps extends DrawerItemListProps {
  navigation: {
    navigate: (screen: string) => void; // Define navigate function type
  };
}

const Sidebar: React.FC<SidebarProps> = (props) => {
  return (
    <DrawerContentScrollView {...props}>
      {/* Profile Section */}
      <View style={styles.profileContainer}>
        <Image
          source={{ uri: 'https://i.imgur.com/your-profile-image.png' }} // Replace with actual image URI
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>John Doe</Text>
        <Divider style={styles.divider} />
      </View>

      {/* Navigation Links */}
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => props.navigation.navigate('Hackathons')}
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
        onPress={() => props.navigation.navigate('Innovations')}
      >
        <Text style={styles.menuText}>Innovations</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => props.navigation.navigate('Sponsors')}
      >
        <Text style={styles.menuText}>Sponsors</Text>
      </TouchableOpacity>

      <Divider style={styles.divider} />

      {/* Subscription and Profile Edit Links */}
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => props.navigation.navigate('SubscriptionPlan')}
      >
        <Text style={styles.menuText}>Subscription Plan</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => props.navigation.navigate('EditProfile')}
      >
        <Text style={styles.menuText}>Edit Profile</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#00AEEF', // Background color for the profile section
    paddingVertical: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profileName: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  divider: {
    marginVertical: 10,
    width: '80%',
    backgroundColor: '#fff',
  },
  menuItem: {
    padding: 15,
  },
  menuText: {
    fontSize: 16,
    color: '#fff',
  },
});

export default Sidebar;
