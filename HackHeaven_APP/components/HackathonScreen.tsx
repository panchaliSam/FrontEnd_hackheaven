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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker'; // Import the Picker component

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

const hackathonImages: Record<string, string> = {
    Technology: 'https://firebasestorage.googleapis.com/v0/b/hackheaven-1a9c2.appspot.com/o/HackathonImages%2Ftechnology.jpg?alt=media&token=79f5579a-3734-4f0b-847f-5dd084ec729e',
    Business: 'https://firebasestorage.googleapis.com/v0/b/hackheaven-1a9c2.appspot.com/o/HackathonImages%2Fbusiness.jpg?alt=media&token=9167ca81-77de-41be-bdc1-c66af2d6649a',
    Coding: 'https://firebasestorage.googleapis.com/v0/b/hackheaven-1a9c2.appspot.com/o/HackathonImages%2Fcoding.jpg?alt=media&token=01a2ed1d-b6d5-4f41-97dd-58022ab62690',
    Gaming: 'https://firebasestorage.googleapis.com/v0/b/hackheaven-1a9c2.appspot.com/o/HackathonImages%2Fgaming.jpg?alt=media&token=73bb0554-3fb1-49dd-aed9-09b405d0d9b6',
    Innovation: 'https://firebasestorage.googleapis.com/v0/b/hackheaven-1a9c2.appspot.com/o/HackathonImages%2Finnovation.jpg?alt=media&token=b41fad7e-4ecd-46ef-9463-30e94031a475',
    Other: 'https://firebasestorage.googleapis.com/v0/b/hackheaven-1a9c2.appspot.com/o/HomeScreenImages%2FHackathon.jpg?alt=media&token=6b8e9b2d-4358-4531-9c0f-16ffe1c6afad',
  };

const hackathonTypeColors: Record<string, string> = {
Technology: '#28a745',
  Business: '#17a2b8',
  Coding: '#ffc107',
  Gaming: '#dc3545',
  Innovation: '#6f42c1',
  Other: '#6c757d',
};

const HackathonScreen: React.FC = () => {
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [savedHackathonIds, setSavedHackathonIds] = useState<number[]>([]);
  const [selectedType, setSelectedType] = useState<string>('All'); // State for selected hackathon type
  const [filteredHackathons, setFilteredHackathons] = useState<Hackathon[]>([]); // State for filtered hackathons

  useEffect(() => {
    fetchHackathons();
    loadSavedHackathons();
  }, []);

  useEffect(() => {
    if (selectedType === 'All') {
      setFilteredHackathons(hackathons);
    } else {
      setFilteredHackathons(hackathons.filter(hackathon => hackathon.hackathon_type === selectedType));
    }
  }, [hackathons, selectedType]); // Update filtered hackathons when hackathons or selectedType changes

  const fetchHackathons = async () => {
    try {
      const response = await fetch('http://192.168.133.77:4003/api/hackathon/select-hackathons');
      const data = await response.json();
      if (response.ok) {
        setHackathons(data.hackathons);
        setFilteredHackathons(data.hackathons); // Initialize filtered hackathons
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
      setSavedHackathonIds(savedData.map((hackathon: Hackathon) => hackathon.hackathon_id));
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
        updatedData = savedData.filter((savedHackathon: Hackathon) => savedHackathon.hackathon_id !== hackathon.hackathon_id);
        Alert.alert('Success', 'Hackathon removed from saved!');
      } else {
        updatedData = [...savedData, hackathon];
        Alert.alert('Success', 'Hackathon saved!');
      }

      await AsyncStorage.setItem('savedHackathons', JSON.stringify(updatedData));
      setSavedHackathonIds(updatedData.map((h: Hackathon) => h.hackathon_id));
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

    const isSaved = savedHackathonIds.includes(item.hackathon_id);

    return (
      <View style={styles.hackathonItem}>
        <Image
        source={{
            uri: hackathonImages[item.hackathon_type] || 'https://firebasestorage.googleapis.com/v0/b/hackheaven-1a9c2.appspot.com/o/HomeScreenImages%2FHackathon.jpg?alt=media&token=6b8e9b2d-4358-4531-9c0f-16ffe1c6afad',
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
        {/* <TouchableOpacity style={styles.applyButton}>
            <Text style={styles.applyButtonText}>Apply</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.applyButton}>
            <Text style={styles.applyButtonText}>Add</Text>
        </TouchableOpacity> */}
      </View>

      <View style={styles.filterContainer}>
        <Picker
          selectedValue={selectedType}
          onValueChange={(itemValue) => setSelectedType(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="All" value="All" />
          <Picker.Item label="Technology" value="Technology" />
          <Picker.Item label="Business" value="Business" />
          <Picker.Item label="Coding" value="Coding" />
          <Picker.Item label="Gaming" value="Gaming" />
          <Picker.Item label="Innovation" value="Innovation" />
          <Picker.Item label="Other" value="Other" />
        </Picker>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : (
        <FlatList
          data={filteredHackathons} // Use filteredHackathons here
          keyExtractor={(item) => item.hackathon_id.toString()}
          renderItem={renderHackathonItem}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  filterContainer: {
    marginVertical: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  hackathonItem: {
    marginBottom: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  hackathonImage: {
    width: '100%',
    height: 150,
    borderRadius: 5,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  tag: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  tagText: {
    color: '#fff',
  },
  hackathonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  hackathonSubtitle: {
    fontSize: 14,
    color: '#555',
  },
  pdfLink: {
    color: '#007BFF',
    marginTop: 10,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  dateText: {
    marginLeft: 5,
  },
  contactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  linkText: {
    color: '#000',
    marginLeft: 5,
  },
});

export default HackathonScreen;
