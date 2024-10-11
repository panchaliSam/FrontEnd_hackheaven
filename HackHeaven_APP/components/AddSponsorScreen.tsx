import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Image, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const AddSponsorScreen: React.FC = () => {
  const [sponsorName, setSponsorName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [contactNo, setContactNo] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  const [category, setCategory] = useState<string>('Technical');
  const [logo, setLogo] = useState<string | null>(null);
  const [imageData, setImageData] = useState<ImagePicker.ImageInfo | null>(null);

  // Get screen width and height
  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access the camera roll is required!');
      }
    })();
  }, []);

  const handleImagePick = async () => {
    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    };

    const result = await ImagePicker.launchImageLibraryAsync(options);

    if (!result.canceled && result.assets) {
      setLogo(result.assets[0].uri);
      setImageData(result.assets[0]);
    }
  };

  const handleSubmit = async () => {
    // Validate fields
    if (!sponsorName || !email || !contactNo || !country || !imageData) {
      Alert.alert('Error', 'All fields are required. Please fill in all fields and select an image.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }

    if (contactNo.length < 10) {
      Alert.alert('Error', 'Contact number must be at least 10 digits long.');
      return;
    }

    let fileToUpload = null;
    try {
      const response = await fetch(imageData.uri);
      fileToUpload = await response.blob();
    } catch (error) {
      console.error('Error converting image to Blob:', error);
      Alert.alert('Error', 'Failed to process the selected image.');
      return;
    }

    const formData = new FormData();
    formData.append('sponsor_name', sponsorName);
    formData.append('email', email);
    formData.append('contact_no', contactNo);
    formData.append('country', country);
    formData.append('category', category);
    formData.append('logo', fileToUpload, imageData.fileName || 'logo.jpg');

    try {
      const response = await fetch('http://192.168.1.9:4003/api/sponsor/add', {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
        },
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Sponsor added successfully!');
        resetForm(); // Reset form after successful submission
      } else {
        Alert.alert('Error', result.error || 'Failed to add sponsor');
      }
    } catch (error) {
      console.error('Error adding sponsor:', error);
      Alert.alert('Error', 'An error occurred while adding the sponsor. Check your network connection and server status.');
    }
  };

  const resetForm = () => {
    setSponsorName('');
    setEmail('');
    setContactNo('');
    setCountry('');
    setCategory('Technical');
    setLogo(null);
    setImageData(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add Sponsor</Text>

      <TextInput
        style={styles.input}
        placeholder="Sponsor Name *"
        value={sponsorName}
        onChangeText={setSponsorName}
      />

      <TextInput
        style={styles.input}
        placeholder="Email *"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Contact No *"
        value={contactNo}
        onChangeText={setContactNo}
        keyboardType="phone-pad"
      />

      <TextInput
        style={styles.input}
        placeholder="Country *"
        value={country}
        onChangeText={setCountry}
      />

      <TextInput
        style={styles.input}
        placeholder="Category"
        value={category}
        onChangeText={setCategory}
      />

      <TouchableOpacity style={styles.imagePicker} onPress={handleImagePick}>
        {logo ? (
          <Image source={{ uri: logo }} style={[styles.imagePreview, { width: screenWidth - 40 }]} />
        ) : (
          <Text style={styles.imageText}>Pick an Image *</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Add Sponsor</Text>
      </TouchableOpacity>
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  imagePicker: {
    height: 150,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  imagePreview: {
    height: 150,
    borderRadius: 5,
  },
  imageText: {
    color: '#aaa',
  },
  submitButton: {
    backgroundColor: '#000',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddSponsorScreen;
