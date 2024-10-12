import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access the camera roll is required!');
      }
    })();
  }, []);

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

  const handleOrganizationNameChange = (text: string) => {
    const sanitizedText = text.replace(/[^a-zA-Z'\s]/g, ''); // Allow only letters, apostrophes, and spaces
    const capitalizedText = sanitizedText.replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize each word
    setOrganizationName(capitalizedText);
  };

  const handleHackathonNameChange = (text: string) => {
    const sanitizedText = text.replace(/[^a-zA-Z0-9'\s]/g, ''); // Allow only letters, numbers, apostrophes, and spaces
    setHackathonName(sanitizedText);
  };

  const handleEmailChange = (text: string) => {
    const emailRegex = /^[a-zA-Z][^\s@]+@[^\s@]+\.[^\s@]+$/; // Email must start with a letter
    if (emailRegex.test(text)) {
      setEmail(text);
    } else {
      Alert.alert('Invalid Email', 'Email must start with a letter and be in a valid format.');
    }
  };

  const handlePhoneNoChange = (text: string) => {
    const phoneRegex = /^\d{10}$/; // Allow only 10 digits
    if (phoneRegex.test(text)) {
      setPhoneNo(text);
    } else {
      Alert.alert('Invalid Phone Number', 'Phone number must be exactly 10 digits.');
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
        onChangeText={handleOrganizationNameChange}
      />

      <Text style={styles.label}>
        Hackathon Name <Text style={styles.required}>*</Text>
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Hackathon Name *"
        value={hackathonName}
        onChangeText={handleHackathonNameChange}
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
        onChangeText={handlePhoneNoChange}
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>
        Email <Text style={styles.required}>*</Text>
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Email *"
        value={email}
        onChangeText={handleEmailChange}
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

      <Text style={styles.label}>
        Logo <Text style={styles.required}>*</Text>
      </Text>
      <View style={styles.logoPickerContainer}>
        {logo ? (
          <Image source={{ uri: logo }} style={[styles.logo, { width: screenWidth * 0.7 }]} />
        ) : (
          <Text>No Logo Selected</Text>
        )}
        <TouchableOpacity onPress={handleLogoPick} style={styles.uploadButton}>
          <Text style={styles.uploadButtonText}>Upload Logo</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  required: {
    color: 'red',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  picker: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
  },
  logoPickerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    height: 200,
    resizeMode: 'contain',
  },
  uploadButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  uploadButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddHackathonScreen;
