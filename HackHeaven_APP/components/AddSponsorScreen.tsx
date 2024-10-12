import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Image, Dimensions, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';

const AddSponsorScreen: React.FC = () => {
  const [sponsorName, setSponsorName] = useState<string>('');
  const [companyName, setCompanyName] = useState<string>('');
  const [sponsorshipCategory, setSponsorshipCategory] = useState<string>('Technical');
  const [description, setDescription] = useState<string>('');
  const [websiteLink, setWebsiteLink] = useState<string>('');
  const [contactNo, setContactNo] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [image, setImage] = useState<string | null>(null);
  const [imageData, setImageData] = useState<ImagePicker.ImageInfo | null>(null);

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
      setImage(result.assets[0].uri);
      setImageData(result.assets[0]);
    }
  };

  const capitalizeEveryWord = (text: string) => {
    if (!text) return '';
    return text
      .split(' ') // Split the text into words
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize the first letter of each word
      .join(' '); // Join the words back into a single string
  };
  
  

  const handleSubmit = async () => {
    if (!sponsorName || !companyName || !sponsorshipCategory || !description || !websiteLink || !contactNo || !email || !imageData) {
      Alert.alert('Error', 'Please fill all fields and select an image.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address.');
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
    formData.append('company_name', companyName);
    formData.append('sponsorship_category', sponsorshipCategory);
    formData.append('description', description);
    formData.append('website_link', websiteLink);
    formData.append('contact_no', contactNo);
    formData.append('email', email);

    formData.append('image', fileToUpload, imageData.fileName || 'image.jpg');

    try {
      const response = await fetch('http://192.168.133.77:4003/api/sponsor/add', {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
        },
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Sponsor added successfully!');
        resetForm();
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
    setCompanyName('');
    setSponsorshipCategory('Platinum');
    setDescription('');
    setWebsiteLink('');
    setContactNo('');
    setEmail('');
    setImage(null);
    setImageData(null);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>
        Sponsor Name <Text style={styles.required}>*</Text>
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Sponsor Name *"
        value={sponsorName}
        onChangeText={(text) => setSponsorName(capitalizeEveryWord(text))}
      />

      <Text style={styles.label}>
        Company Name <Text style={styles.required}>*</Text>
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Company Name *"
        value={companyName}
        onChangeText={(text) => setCompanyName(capitalizeEveryWord(text))}
      />
      <Text style={styles.label}>
        Sponsorship Category <Text style={styles.required}>*</Text>
      </Text>
      <Picker
        selectedValue={sponsorshipCategory}
        style={styles.picker}
        onValueChange={(itemValue) => setSponsorshipCategory(itemValue)}
      >
        <Picker.Item label="Technical" value="Technical" />
        <Picker.Item label="Media" value="Media" />
        <Picker.Item label="Beverage" value="Beverage" />
        <Picker.Item label="Business Person" value="Business Person" />
        <Picker.Item label="Other" value="Other" />
      </Picker>

      <Text style={styles.label}>
        Description <Text style={styles.required}>*</Text>
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Description *"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
      />

      <Text style={styles.label}>
        Website Link <Text style={styles.required}>*</Text>
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Website Link *"
        value={websiteLink}
        onChangeText={setWebsiteLink}
      />

      <Text style={styles.label}>
        Contact No <Text style={styles.required}>*</Text>
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Contact No *"
        value={contactNo}
        onChangeText={(text) => {
          const sanitizedText = text.replace(/[^0-9]/g, '');
          if (sanitizedText.length <= 10) {
            setContactNo(sanitizedText);
          }
        }}
        keyboardType="phone-pad"
        maxLength={10}
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

      <TouchableOpacity style={styles.imagePicker} onPress={handleImagePick}>
        {image ? (
          <Image source={{ uri: image }} style={[styles.imagePreview, { width: screenWidth - 40 }]} />
        ) : (
          <Text>Select Image</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>S U B M I T</Text>
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
    marginBottom: 5,
  },
  required: {
    color: 'red',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  imagePicker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePreview: {
    height: 200,
    borderRadius: 8,
  },
  submitButton: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 50,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AddSponsorScreen;
