import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Image,
  Share,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

interface Hackathon {
  hackathon_id: number;
  hackathon_name: string;
  organization_name: string;
  hackathon_type: string;
  final_date: string;
  location: string;
  country: string;
  phone_no: string;
  email: string;
  proposal_pdf: string;
}

const hackathonTypeColors: Record<string, string> = {
  Technical: '#28a745',
  Business: '#17a2b8',
  Coding: '#ffc107',
  Gaming: '#dc3545',
  Innovation: '#6f42c1',
  Other: '#6c757d',
};

const HackathonScreen: React.FC = () => {
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [savedHackathonIds, setSavedHackathonIds] = useState<number[]>([]); // Track saved hackathons

  useEffect(() => {
    fetchHackathons();
    loadSavedHackathons(); // Load saved hackathons on component mount
  }, []);

  const fetchHackathons = async () => {
    try {
      const response = await fetch('http://192.168.1.9:4003/api/hackathon/select-hackathons');
      const data = await response.json();
      if (response.ok) {
        setHackathons(data.hackathons);
      } else {
        Alert.alert('Error', data.error || 'Failed to fetch hackathons');
      }
    } catch (error) {
      console.error('Error fetching hackathons:', error);
      Alert.alert('Error', 'An error occurred while fetching hackathons.');
    } finally {
      setLoading(false);
    }
  };

  const loadSavedHackathons = async () => {
    try {
      const savedHackathons = await AsyncStorage.getItem('savedHackathons');
      const savedData = savedHackathons ? JSON.parse(savedHackathons) : [];
      setSavedHackathonIds(savedData.map((hackathon: Hackathon) => hackathon.hackathon_id)); // Load saved hackathon IDs
    } catch (error) {
      console.error('Error loading saved hackathons:', error);
    }
  };

  const shareHackathon = async (hackathon: Hackathon) => {
    try {
      await Share.share({
        message: `Check out this hackathon: ${hackathon.hackathon_name} by ${hackathon.organization_name}`,
      });
    } catch (error) {
      console.error('Error sharing hackathon:', error);
    }
  };

  const saveHackathon = async (hackathon: Hackathon) => {
    try {
      const savedHackathons = await AsyncStorage.getItem('savedHackathons');
      const savedData = savedHackathons ? JSON.parse(savedHackathons) : [];
      const isSaved = savedData.some((savedHackathon: Hackathon) => savedHackathon.hackathon_id === hackathon.hackathon_id);

      let updatedData;
      if (isSaved) {
        // Remove from saved
        updatedData = savedData.filter((savedHackathon: Hackathon) => savedHackathon.hackathon_id !== hackathon.hackathon_id);
        Alert.alert('Success', 'Hackathon removed from saved!');
      } else {
        // Add to saved
        updatedData = [...savedData, hackathon];
        Alert.alert('Success', 'Hackathon saved!');
      }

      await AsyncStorage.setItem('savedHackathons', JSON.stringify(updatedData));
      setSavedHackathonIds(updatedData.map((h: Hackathon) => h.hackathon_id)); // Update saved hackathon IDs
    } catch (error) {
      console.error('Error saving hackathon:', error);
      Alert.alert('Error', 'An error occurred while saving the hackathon.');
    }
  };

  const openProposalPDF = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error('Error opening PDF link:', error);
    }
  };

  const handlePhonePress = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleEmailPress = (email: string) => {
    Linking.openURL(`mailto:${email}`);
  };

  const handleLocationPress = (location: string) => {
    const encodedLocation = encodeURIComponent(location);
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodedLocation}`);
  };

  const renderHackathonItem = ({ item }: { item: Hackathon }) => {
    const eventDate = new Date(item.final_date);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    };
    const formattedDate = eventDate.toLocaleDateString('en-US', options).replace(',', '');

    const isSaved = savedHackathonIds.includes(item.hackathon_id); // Check if hackathon is saved

    return (
      <View style={styles.hackathonItem}>
        <Image
          source={{
            uri: 'https://firebasestorage.googleapis.com/v0/b/hackheaven-1a9c2.appspot.com/o/HackathonImages%2Fhackx.png?alt=media&token=81fdd552-8d5b-4cef-b433-334f381a5aa6',
          }}
          style={styles.hackathonImage}
          resizeMode="cover"
        />

        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={() => shareHackathon(item)}>
            <Icon name="share-alt" size={30} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => saveHackathon(item)}>
            <Icon name={isSaved ? "bookmark" : "bookmark-o"} size={30} color={isSaved ? "black" : "#000"} />
          </TouchableOpacity>
        </View>

        <View style={[styles.tag, { backgroundColor: hackathonTypeColors[item.hackathon_type] || '#6c757d' }]} >
          <Text style={styles.tagText}>{item.hackathon_type}</Text>
        </View>

        <Text style={[styles.hackathonTitle, { marginTop: 15 }]}>{item.hackathon_name}</Text>
        <Text style={styles.hackathonSubtitle}>{item.organization_name}</Text>

        <TouchableOpacity onPress={() => openProposalPDF(item.proposal_pdf)}>
          <Text style={styles.pdfLink}>View Proposal PDF</Text>
        </TouchableOpacity>

        <View style={styles.dateContainer}>
          <Icon name="calendar" size={20} color="#007BFF" />
          <Text style={styles.dateText}>{formattedDate}</Text>
        </View>

        <View style={styles.contactContainer}>
          <Icon name="map-marker" size={20} color="#007BFF" />
          <TouchableOpacity onPress={() => handleLocationPress(item.location)}>
            <Text style={styles.linkText}>{item.location}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.contactContainer}>
          <Icon name="phone" size={20} color="#007BFF" />
          <TouchableOpacity onPress={() => handlePhonePress(item.phone_no)}>
            <Text style={styles.linkText}>{item.phone_no}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.contactContainer}>
          <Icon name="envelope" size={20} color="#007BFF" />
          <TouchableOpacity onPress={() => handleEmailPress(item.email)}>
            <Text style={styles.linkText}>{item.email}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.applyButton}>
            <Text style={styles.applyButtonText}>Apply</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.applyButton}>
            <Text style={styles.applyButtonText}>Add</Text>
        </TouchableOpacity>
      </View>


      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={hackathons}
          keyExtractor={(item) => item.hackathon_id.toString()}
          renderItem={renderHackathonItem}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  applyButton: {
    backgroundColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignItems: 'center',
  },
  
  applyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },  
  list: {
    paddingBottom: 20,
  },
  hackathonItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  hackathonImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 10,
  },
  tag: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  tagText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  hackathonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  hackathonSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  pdfLink: {
    color: '#007BFF',
    marginBottom: 10,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  dateText: {
    marginLeft: 5,
    color: '#333',
  },
  contactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  linkText: {
    marginLeft: 5,
    color: '#020304',
  },
});

export default HackathonScreen;
