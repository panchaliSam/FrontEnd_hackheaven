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
import { useNavigation } from '@react-navigation/native';
import { getAuth } from 'firebase/auth'; 
import { Picker } from '@react-native-picker/picker'; // Import Picker

interface Sponsor {
  sponsor_id: number;
  sponsor_name: string;
  email: string;
  contact_no: string;
  country: string;
  category: string;
  logo: string; 
}

const sponsorImages: Record<string, string> = {
    Technical: 'https://firebasestorage.googleapis.com/v0/b/hackheaven-1a9c2.appspot.com/o/HackathonImages%2Ftechnology.jpg?alt=media&token=79f5579a-3734-4f0b-847f-5dd084ec729e',
    Media: 'https://firebasestorage.googleapis.com/v0/b/hackheaven-1a9c2.appspot.com/o/HackathonImages%2Fmedia.jpg?alt=media&token=f1dac8b8-56d6-4cc0-86e0-fcceb17a3825',
    Beverage: 'https://firebasestorage.googleapis.com/v0/b/hackheaven-1a9c2.appspot.com/o/HackathonImages%2Fbeverage.jpg?alt=media&token=a1110c45-0665-4273-8a3c-5d86ab51904a',
    'Business Person': 'https://firebasestorage.googleapis.com/v0/b/hackheaven-1a9c2.appspot.com/o/HackathonImages%2Fbusiness.jpg?alt=media&token=9167ca81-77de-41be-bdc1-c66af2d6649a',
    Other: 'https://firebasestorage.googleapis.com/v0/b/hackheaven-1a9c2.appspot.com/o/HomeScreenImages%2FSponsor.png?alt=media&token=d5736315-e126-4ecb-a6ef-67bd8ddfdf7b',
  };

// Define colors for sponsor categories
const sponsorCategoryColors: Record<string, string> = {
  Technical: '#28a745',
  Media: '#17a2b8',
  Beverage: '#ffc107',
  'Business Person': '#dc3545',
  Other: '#6c757d',
};

const SponsorScreen: React.FC = () => {
  const navigation = useNavigation();
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All'); // State for selected category
  const auth = getAuth(); 

  const handleAddSponsor = () => {
    navigation.navigate('ADD  SPONSOR');
  };

  useEffect(() => {
    fetchSponsors();
  }, []);

  const fetchSponsors = async () => {
    try {
      const user = auth.currentUser;
      const accessToken = await user?.getIdToken(); 

      const response = await fetch('http://172.28.9.185:4003/api/sponsor/select-sponsors', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`, 
        },
      });

      const data = await response.json();
      if (response.ok) {
        setSponsors(data.sponsors);
      } else {
        Alert.alert('Error', data.error || 'Failed to fetch sponsors');
      }
    } catch (error) {
      console.error('Error fetching sponsors:', error);
      Alert.alert('Error', 'An error occurred while fetching sponsors.');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyPress = () => {
    Linking.openURL('https://forms.gle/nWv7urpHfe86iF3R6'); // Open the application form link
  };

  const shareSponsor = async (sponsor: Sponsor) => {
    try {
      await Share.share({
        message: `Check out this sponsor: ${sponsor.sponsor_name} from ${sponsor.country}`,
      });
    } catch (error) {
      console.error('Error sharing sponsor:', error);
    }
  };

  const handlePhonePress = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleEmailPress = (email: string) => {
    Linking.openURL(`mailto:${email}`);
  };

  const renderSponsorItem = ({ item }: { item: Sponsor }) => {
    const categoryColor = sponsorCategoryColors[item.category] || '#6c757d';

    return (
      <View style={styles.sponsorItem}>
      <TouchableOpacity style={styles.applyButton} onPress={handleApplyPress}>
        <Text style={styles.applyButtonText}>Apply</Text>
      </TouchableOpacity>

        <Image
        source={{
            uri: sponsorImages[item.category] || 'https://firebasestorage.googleapis.com/v0/b/hackheaven-1a9c2.appspot.com/o/HomeScreenImages%2FSponsor.png?alt=media&token=d5736315-e126-4ecb-a6ef-67bd8ddfdf7b',
        }}
        style={styles.sponsorImage}
        resizeMode="cover"
        />

        <View style={[styles.tag, { backgroundColor: categoryColor }]}>
          <Text style={styles.tagText}>{item.category}</Text>
        </View>

        <Text style={[styles.sponsorName, { marginTop: 10 }]}>{item.sponsor_name}</Text>

        <View style={styles.contactContainer}>
          <Icon name="phone" size={20} color="#007BFF" />
          <TouchableOpacity onPress={() => handlePhonePress(item.contact_no)}>
            <Text style={styles.linkText}>{item.contact_no}</Text>
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

  // Get unique categories for the dropdown
  const uniqueCategories = Array.from(new Set(sponsors.map(sponsor => sponsor.category)));

  // Filter sponsors based on selected category
  const filteredSponsors = selectedCategory === 'All'
    ? sponsors
    : sponsors.filter(sponsor => sponsor.category === selectedCategory);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.addButton} onPress={handleAddSponsor}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.filterContainer}>
        <Picker
          selectedValue={selectedCategory}
          onValueChange={(itemValue) => setSelectedCategory(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="All" value="All" />
          <Picker.Item label="Technical" value="Technical" />
          <Picker.Item label="Media" value="Media" />
          <Picker.Item label="Beverage" value="Beverage" />
          <Picker.Item label="Finance" value="Finance" />
          <Picker.Item label="Education" value="Education" />
          <Picker.Item label="Other" value="Other" />
        </Picker>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : filteredSponsors.length === 0 ? (
        <Text style={styles.noSponsorsText}>No sponsors available</Text>
      ) : (
        <FlatList
          data={filteredSponsors}
          keyExtractor={(item) => item.sponsor_id.toString()}
          renderItem={renderSponsorItem}
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
  list: {
    paddingBottom: 20,
  },
  sponsorItem: {
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
  sponsorImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
  },
  tag: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 5,
  },
  tagText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  sponsorName: {
    fontSize: 18,
    fontWeight: 'bold',
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
  applyButton: {
    backgroundColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 10,
    width: 100,
  },
  applyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 10,
    width: 100,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  noSponsorsText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    marginTop: 20,
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
});

export default SponsorScreen;
