import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Image, Dimensions, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons

const AddHackathonScreen: React.FC = () => {
  const [organizationName, setOrganizationName] = useState<string>('');
  const [hackathonName, setHackathonName] = useState<string>('');
  const [hackathonType, setHackathonType] = useState<string>('Technology');
  const [finalDate, setFinalDate] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [country, setCountry] = useState<string>('Sri Lanka');
  const [phoneNo, setPhoneNo] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [proposalPdf, setProposalPdf] = useState<string>('');
  const [logo, setLogo] = useState<string | null>(null);
  const [logoData, setLogoData] = useState<ImagePicker.ImageInfo | null>(null);

  // Get screen width
  const screenWidth = Dimensions.get('window').width;

  const handleLogoPick = async () => {
    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    };

    const result = await ImagePicker.launchImageLibraryAsync(options);

    if (!result.canceled && result.assets) {
      setLogo(result.assets[0].uri); // Set the URI of the selected logo
      setLogoData(result.assets[0]); // Store the entire image data for upload
    }
  };

  const handleSubmit = async () => {
    if (!organizationName || !hackathonName || !hackathonType || !finalDate || !location || !phoneNo || !email || !proposalPdf || !logoData) {
      Alert.alert('Error', 'Please fill all fields and select a logo image.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }

    let fileToUpload = null;
    try {
      const response = await fetch(logoData.uri);
      fileToUpload = await response.blob(); // Convert the logo URI to a Blob
    } catch (error) {
      console.error('Error converting logo to Blob:', error);
      Alert.alert('Error', 'Failed to process the selected logo image.');
      return;
    }

    const formData = new FormData();
    formData.append('organization_name', organizationName);
    formData.append('hackathon_name', hackathonName);
    formData.append('hackathon_type', hackathonType);
    formData.append('final_date', finalDate);
    formData.append('location', location);
    formData.append('country', country);
    formData.append('phone_no', phoneNo);
    formData.append('email', email);
    formData.append('proposal_pdf', proposalPdf);
    
    // Append the logo file
    formData.append('logo', fileToUpload, logoData.fileName || 'logo.jpg');

    try {
      const response = await fetch('http://192.168.1.9:4003/api/hackathon/add', {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
        },
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Hackathon added successfully!');
        resetForm(); // Reset form after successful submission
      } else {
        Alert.alert('Error', result.error || 'Failed to add hackathon');
      }
    } catch (error) {
      console.error('Error adding hackathon:', error);
      Alert.alert('Error', 'An error occurred while adding the hackathon. Check your network connection and server status.');
    }
  };

  const resetForm = () => {
    setOrganizationName('');
    setHackathonName('');
    setHackathonType('Technology');
    setFinalDate('');
    setLocation('');
    setCountry('Sri Lanka');
    setPhoneNo('');
    setEmail('');
    setProposalPdf('');
    setLogo(null);
    setLogoData(null);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>
        Organization Name <Text style={styles.required}>*</Text>
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Organization Name *"
        value={organizationName}
        onChangeText={setOrganizationName}
      />

      <Text style={styles.label}>
        Hackathon Name <Text style={styles.required}>*</Text>
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Hackathon Name *"
        value={hackathonName}
        onChangeText={setHackathonName}
      />

      <Text style={styles.label}>
        Hackathon Type <Text style={styles.required}>*</Text>
      </Text>
      <Picker
        selectedValue={hackathonType}
        style={styles.picker}
        onValueChange={(itemValue) => setHackathonType(itemValue)}
      >
        <Picker.Item label="Technology" value="Technology" />
        <Picker.Item label="Social" value="Social" />
        <Picker.Item label="Other" value="Other" />
      </Picker>

      <Text style={styles.label}>
        Final Date <Text style={styles.required}>*</Text>
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Final Date (YYYY-MM-DD) *"
        value={finalDate}
        onChangeText={setFinalDate}
      />

      <Text style={styles.label}>
        Location <Text style={styles.required}>*</Text>
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Location *"
        value={location}
        onChangeText={setLocation}
      />

      <Text style={styles.label}>
        Country <Text style={styles.required}>*</Text>
      </Text>
      <Picker
        selectedValue={country}
        style={styles.picker}
        onValueChange={(itemValue) => setCountry(itemValue)}
      >
        <Picker.Item label="Sri Lanka" value="Sri Lanka" />
        <Picker.Item label="India" value="India" />
        <Picker.Item label="USA" value="USA" />
        <Picker.Item label="Other" value="Other" />
      </Picker>

      <Text style={styles.label}>
        Phone No <Text style={styles.required}>*</Text>
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Phone No *"
        value={phoneNo}
        onChangeText={setPhoneNo}
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>
        Email <Text style={styles.required}>*</Text>
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Email *"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <Text style={styles.label}>
        Proposal PDF Link <Text style={styles.required}>*</Text>
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Proposal PDF Link *"
        value={proposalPdf}
        onChangeText={setProposalPdf}
      />

      <TouchableOpacity style={styles.logoPicker} onPress={handleLogoPick}>
        {logo ? (
          <Image source={{ uri: logo }} style={[styles.imagePreview, { width: screenWidth - 40 }]} />
        ) : (
          <Text style={styles.imageText}>Pick a Logo Image</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Add Hackathon</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  required: {
    color: 'red', // Red color for required indicator
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  logoPicker: {
    height: 200,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#e0e0e0',
  },
  imageText: {
    color: '#888',
  },
  imagePreview: {
    height: 200,
    resizeMode: 'contain',
    borderRadius: 5,
  },
  submitButton: {
    backgroundColor: '#000',
    borderRadius: 5,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom:50,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddHackathonScreen;
