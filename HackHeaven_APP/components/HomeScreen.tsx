import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuText}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Home</Text>
        <Image
          source={{
            uri: 'https://path-to-profile-image.png',
          }}
          style={styles.profileImage}
        />
      </View>

      <View style={styles.gridContainer}>
        <TouchableOpacity
          style={styles.card}
        //   onPress={() => navigation.navigate('Hackathons')}
          >
          <View style={styles.placeholderImage} />
          <Text style={styles.cardTitle}>Hackathons</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
        //   onPress={() => navigation.navigate('Sponsors')}
          >
          <View style={styles.placeholderImage} />
          <Text style={styles.cardTitle}>Sponsors</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
        //   onPress={() => navigation.navigate('Organizer')}
          >
          <View style={styles.placeholderImage} />
          <Text style={styles.cardTitle}>Organizer</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
        //   onPress={() => navigation.navigate('Innovators')}
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
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
