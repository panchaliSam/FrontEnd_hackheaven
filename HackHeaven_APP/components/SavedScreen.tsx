import React, { useEffect, useState, useCallback } from 'react';
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
  Share,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  Technical: '#28a745',
  Business: '#17a2b8',
  Coding: '#ffc107',
  Gaming: '#dc3545',
  Innovation: '#6f42c1',
  Other: '#6c757d',
};

const SavedScreen: React.FC = () => {
  const [savedHackathons, setSavedHackathons] = useState<Hackathon[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [bookmarked, setBookmarked] = useState<Set<number>>(new Set());

  useEffect(() => {
    loadSavedHackathons();
  }, []);

  const loadSavedHackathons = async () => {
    try {
      const saved = await AsyncStorage.getItem('savedHackathons');
      if (saved) {
        const hackathons: Hackathon[] = JSON.parse(saved);
        setSavedHackathons(hackathons);
        setBookmarked(new Set(hackathons.map((hack) => hack.hackathon_id)));
      }
    } catch (error) {
      console.error('Error loading saved hackathons:', error);
      Alert.alert('Error', 'Failed to load saved hackathons.');
    } finally {
      setLoading(false);
    }
  };

  const shareHackathon = async (hackathon: Hackathon) => {
    try {
      await Share.share({
        message: `Check out this hackathon: ${hackathon.hackathon_name} by ${hackathon.organization_name}`,
      });
    } catch (error) {
      console.error('Error sharing hackathon:', error);
      Alert.alert('Error', 'Failed to share hackathon.');
    }
  };

  const toggleBookmark = useCallback((hackathon: Hackathon) => {
    const newBookmarked = new Set(bookmarked);

    if (newBookmarked.has(hackathon.hackathon_id)) {
      newBookmarked.delete(hackathon.hackathon_id);
      setSavedHackathons((prev) => prev.filter(h => h.hackathon_id !== hackathon.hackathon_id));
    } else {
      newBookmarked.add(hackathon.hackathon_id);
      // Optionally, you can add logic to save it again if necessary.
    }

    setBookmarked(newBookmarked);
  }, [bookmarked]);

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

  const renderSavedHackathonItem = ({ item }: { item: Hackathon }) => {
    const eventDate = new Date(item.final_date);
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: '2-digit', day: '2-digit' };
    const formattedDate = eventDate.toLocaleDateString('en-US', options).replace(',', '');

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
          <TouchableOpacity onPress={() => shareHackathon(item)} accessible accessibilityLabel="Share hackathon">
            <Icon name="share-alt" size={30} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => toggleBookmark(item)} accessible accessibilityLabel="Bookmark hackathon">
            <Icon name={bookmarked.has(item.hackathon_id) ? "bookmark" : "bookmark-o"} size={30} color="#000" />
          </TouchableOpacity>
        </View>

        <View style={[styles.tag, { backgroundColor: hackathonTypeColors[item.hackathon_type] || '#6c757d' }]}>
          <Text style={styles.tagText}>{item.hackathon_type}</Text>
        </View>

        <Text style={[styles.hackathonTitle, { marginTop: 15 }]}>{item.hackathon_name}</Text>
        <Text style={styles.hackathonSubtitle}>{item.organization_name}</Text>

        <View style={styles.dateContainer}>
          <Icon name="calendar" size={20} color="#007BFF" />
          <Text style={styles.dateText}>{formattedDate}</Text>
        </View>

        <View style={styles.contactContainer}>
          <Icon name="map-marker" size={20} color="#007BFF" />
          <TouchableOpacity onPress={() => handleLocationPress(item.location)} accessible accessibilityLabel="Open location">
            <Text style={styles.linkText}>{item.location}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.contactContainer}>
          <Icon name="phone" size={20} color="#007BFF" />
          <TouchableOpacity onPress={() => handlePhonePress(item.phone_no)} accessible accessibilityLabel="Call phone number">
            <Text style={styles.linkText}>{item.phone_no}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.contactContainer}>
          <Icon name="envelope" size={20} color="#007BFF" />
          <TouchableOpacity onPress={() => handleEmailPress(item.email)} accessible accessibilityLabel="Email">
            <Text style={styles.linkText}>{item.email}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={savedHackathons}
          keyExtractor={(item) => item.hackathon_id.toString()}
          renderItem={renderSavedHackathonItem} // Render function passed directly
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
  hackathonItem: {
    padding: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  hackathonImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  hackathonTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  hackathonSubtitle: {
    fontSize: 18,
    fontStyle: 'italic',
    color: '#555',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  dateText: {
    marginLeft: 5,
    fontSize: 16,
    color: '#020304',
  },
  contactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  linkText: {
    marginLeft: 5,
    fontSize: 16,
    color: '#020304',
  },
  tag: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  tagText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default SavedScreen;
