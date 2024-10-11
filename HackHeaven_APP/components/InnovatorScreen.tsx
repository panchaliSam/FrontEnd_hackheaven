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
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { getAuth } from 'firebase/auth'; // Import Firebase Auth

interface Innovator {
  innovator_name: string;
  product_name: string;
  innovation_category: string;
  description: string;
  proposal_link: string;
  contact_no: string;
  email: string;
  video_link: string;
  image: string; // Added image field
}

// Define colors for innovation categories (optional)
const innovationCategoryColors: Record<string, string> = {
  Technology: '#28a745',
  Environment: '#17a2b8',
  Health: '#ffc107',
  Education: '#dc3545',
  Other: '#6c757d',
};

const InnovatorScreen: React.FC = () => {
  const navigation = useNavigation();
  const [innovators, setInnovators] = useState<Innovator[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const auth = getAuth(); // Initialize Firebase Auth

  const handleAddInnovator = () => {
    navigation.navigate('AddInnovator');
  };

  useEffect(() => {
    fetchInnovators();
  }, []);

  const fetchInnovators = async () => {
    try {
      const user = auth.currentUser;
      const accessToken = await user?.getIdToken(); // This returns a promise

      const response = await fetch('http://192.168.1.9:4003/api/innovator/select-innovators', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`, // Set the Authorization header
        },
      });

      const data = await response.json();
      if (response.ok) {
        setInnovators(data.innovators);
      } else {
        Alert.alert('Error', data.error || 'Failed to fetch innovators');
      }
    } catch (error) {
      console.error('Error fetching innovators:', error);
      Alert.alert('Error', 'An error occurred while fetching innovators.');
    } finally {
      setLoading(false);
    }
  };

  const handlePhonePress = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleEmailPress = (email: string) => {
    Linking.openURL(`mailto:${email}`);
  };

  const renderInnovatorItem = ({ item }: { item: Innovator }) => {
    const categoryColor = innovationCategoryColors[item.innovation_category] || '#6c757d'; // Default color for unknown categories

    return (
      <View style={styles.innovatorItem}>
        <Image
          source={{
            uri: item.image || 'https://example.com/default-innovator-image.png', // Use image field, fallback to a default image
          }}
          style={styles.innovatorImage}
          resizeMode="cover"
        />
        <View style={[styles.tag, { backgroundColor: categoryColor }]}>
          <Text style={styles.tagText}>{item.innovation_category}</Text>
        </View>

        <Text style={[styles.innovatorName, { marginTop: 10 }]}>{item.innovator_name}</Text>
        <Text style={styles.productName}>{item.product_name}</Text>
        <Text style={styles.description}>{item.description}</Text>

        <TouchableOpacity onPress={() => Linking.openURL(item.proposal_link)} style={styles.linkButton}>
          <Text style={styles.linkText}>View Proposal</Text>
        </TouchableOpacity>

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

        <View style={styles.contactContainer}>
          <Icon name="video-camera" size={20} color="#007BFF" />
          <TouchableOpacity onPress={() => Linking.openURL(item.video_link)}>
            <Text style={styles.linkText}>Watch Video</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.addButton} onPress={handleAddInnovator}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : innovators.length === 0 ? (
        <Text style={styles.noInnovatorsText}>No innovators available</Text>
      ) : (
        <FlatList
          data={innovators}
          keyExtractor={(item, index) => index.toString()} // Assuming you have unique indices
          renderItem={renderInnovatorItem}
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
  innovatorItem: {
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
  innovatorImage: {
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
  innovatorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  productName: {
    fontSize: 16,
    color: '#666',
  },
  description: {
    fontSize: 14,
    color: '#555',
    marginVertical: 5,
  },
  linkButton: {
    marginVertical: 5,
  },
  linkText: {
    color: '#020304',
  },
  contactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
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
  noInnovatorsText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    marginTop: 20,
  },
});

export default InnovatorScreen;
