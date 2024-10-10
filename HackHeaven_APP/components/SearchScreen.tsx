import React, { useState } from 'react';
import axios from 'axios';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // Import FontAwesome icons

interface Hackathon {
  hackathon_id: number;
  hackathon_name: string;
  organization_name: string;
}

const SearchScreen: React.FC = () => {
  const [searchName, setSearchName] = useState<string>(''); // Only search by name
  const [searchResults, setSearchResults] = useState<Hackathon[]>([]);

  const handleSearch = async () => {
    try {
      const response = await axios.get('http://192.168.1.9:4003/api/hackathon/search/name', {
        params: {
          name: searchName,
        },
      });
      setSearchResults(response.data.hackathons); // Assuming the response has a `hackathons` array
    } catch (error) {
      console.error('Error searching hackathons:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search Hackathons</Text>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          value={searchName}
          onChangeText={(text) => setSearchName(text)}
          placeholder="Enter hackathon name"
        />
        <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
          <FontAwesome name="search" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <Text style={styles.resultsTitle}>Search Results:</Text>
      <FlatList
        data={searchResults}
        keyExtractor={(item) => item.hackathon_id.toString()}
        renderItem={({ item }) => (
          <Text style={styles.resultItem}>
            {item.hackathon_name} - {item.organization_name}
          </Text>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  searchButton: {
    padding: 10,
    marginLeft: 10,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  resultItem: {
    fontSize: 16,
    marginVertical: 4,
  },
});

export default SearchScreen;
