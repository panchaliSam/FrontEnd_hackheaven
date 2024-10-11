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
import { getAuth } from 'firebase/auth'; // Import Firebase Auth

interface Sponsor {
  sponsor_id: number;
  sponsor_name: string;
  email: string;
  contact_no: string;
  country: string;
  category: string;
  logo: string; // Added logo field
}

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
  const auth = getAuth(); // Initialize Firebase Auth

  const handleAddSponsor = () => {
    navigation.navigate('AddSponsor');
  };

  useEffect(() => {
    fetchSponsors();
  }, []);

  const fetchSponsors = async () => {
    try {
      // Get the current user's ID token
      const user = auth.currentUser;
      const accessToken = await user?.getIdToken(); // This returns a promise

      const response = await fetch('http://192.168.1.9:4003/api/sponsor/select-sponsors', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`, // Set the Authorization header
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
    const categoryColor = sponsorCategoryColors[item.category] || '#6c757d'; // Default color for unknown categories

    return (
      <View style={styles.sponsorItem}>
        <TouchableOpacity style={styles.applyButton}>
          <Text style={styles.applyButtonText}>Apply</Text>
        </TouchableOpacity>

        <Image
          source={{
            uri: item.logo || 'https://example.com/default-sponsor-image.png', // Use logo field, fallback to a default image
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.addButton} onPress={handleAddSponsor}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : sponsors.length === 0 ? (
        <Text style={styles.noSponsorsText}>No sponsors available</Text>
      ) : (
        <FlatList
          data={sponsors}
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
});

export default SponsorScreen;
