import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Image, Dimensions, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons

const AddInnovatorScreen: React.FC = () => {
  const [innovatorName, setInnovatorName] = useState<string>('');
  const [productName, setProductName] = useState<string>('');
  const [innovationCategory, setInnovationCategory] = useState<string>('Technical');
  const [description, setDescription] = useState<string>('');
  const [proposalLink, setProposalLink] = useState<string>('');
  const [contactNo, setContactNo] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [videoLink, setVideoLink] = useState<string>('');
  const [image, setImage] = useState<string | null>(null);
  const [imageData, setImageData] = useState<ImagePicker.ImageInfo | null>(null);

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

  const handleImagePick = async () => {
    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    };

    const result = await ImagePicker.launchImageLibraryAsync(options);

    if (!result.canceled && result.assets) {
      setImage(result.assets[0].uri); // Set the URI of the selected image
      setImageData(result.assets[0]); // Store the entire image data for upload
    }
  };

  const handleSubmit = async () => {
    if (!innovatorName || !productName || !innovationCategory || !description || !proposalLink || !contactNo || !email || !imageData) {
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
      fileToUpload = await response.blob(); // Convert the image URI to a Blob
    } catch (error) {
      console.error('Error converting image to Blob:', error);
      Alert.alert('Error', 'Failed to process the selected image.');
      return;
    }

    const formData = new FormData();
    formData.append('innovator_name', innovatorName);
    formData.append('product_name', productName);
    formData.append('innovation_category', innovationCategory);
    formData.append('description', description);
    formData.append('proposal_link', proposalLink);
    formData.append('contact_no', contactNo);
    formData.append('email', email);
    formData.append('video_link', videoLink);
    
    // Append the image file
    formData.append('image', fileToUpload, imageData.fileName || 'image.jpg');

    try {
      const response = await fetch('http://192.168.1.9:4003/api/innovator/add', {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
        },
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Innovator added successfully!');
        resetForm(); // Reset form after successful submission
      } else {
        Alert.alert('Error', result.error || 'Failed to add innovator');
      }
    } catch (error) {
      console.error('Error adding innovator:', error);
      Alert.alert('Error', 'An error occurred while adding the innovator. Check your network connection and server status.');
    }
  };

  const resetForm = () => {
    setInnovatorName('');
    setProductName('');
    setInnovationCategory('Technical');
    setDescription('');
    setProposalLink('');
    setContactNo('');
    setEmail('');
    setVideoLink('');
    setImage(null);
    setImageData(null);
  };

  const capitalizeWords = (text: string) => {
    return text.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const capitalizeFirstLetter = (text: string) => {
    if (text.length === 0) return text;
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>
        Innovator Name <Text style={styles.required}>*</Text>
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Innovator Name *"
        value={innovatorName}
        onChangeText={(text) => setInnovatorName(capitalizeWords(text))}
      />

      
<Text style={styles.label}>
        Contact No <Text style={styles.required}>*</Text>
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Contact No *"
        value={contactNo}
        onChangeText={setContactNo}
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
        Product Name <Text style={styles.required}>*</Text>
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Product Name *"
        value={productName}
        onChangeText={(text) => setProductName(capitalizeWords(text))}
      />

      <Text style={styles.label}>
        Innovation Category <Text style={styles.required}>*</Text>
      </Text>
      <Picker
        selectedValue={innovationCategory}
        style={styles.picker}
        onValueChange={(itemValue) => setInnovationCategory(itemValue)}
      >
        <Picker.Item label="Green Technology" value="Green Technology" />
        <Picker.Item label="Artificial Intelligence" value="Artificial Intelligence" />
        <Picker.Item label="Healthcare" value="Healthcare" />
        <Picker.Item label="Information Technology" value="Information Technology" />
        <Picker.Item label="Other" value="Other" />
      </Picker>

      <Text style={styles.label}>
        Description <Text style={styles.required}>*</Text>
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Description *"
        value={description}
        onChangeText={(text) => setDescription(capitalizeFirstLetter(text))}
        multiline
        numberOfLines={4}
      />

      <Text style={styles.label}>
        Proposal Link <Text style={styles.required}>*</Text>
      </Text>
      <View style={styles.proposalLinkContainer}>
        <TextInput
          style={[styles.input, styles.proposalInput]}
          placeholder="Proposal Link *"
          value={proposalLink}
          onChangeText={setProposalLink}
        />
        <TouchableOpacity style={styles.attachIcon} onPress={() => Alert.alert('Attach a link')}>
          <Ionicons name="attach" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>
        Proposal Link <Text style={styles.required}>*</Text>
      </Text>
      <View style={styles.proposalLinkContainer}>
        <TextInput
          style={styles.input}
          placeholder="Video Link *"
          value={videoLink}
          onChangeText={setVideoLink}
        />
        <TouchableOpacity style={styles.attachIcon} onPress={() => Alert.alert('Attach a video link')}>
          <Ionicons name="attach" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.imagePicker} onPress={handleImagePick}>
        {image ? (
          <Image source={{ uri: image }} style={[styles.imagePreview, { width: screenWidth - 40 }]} />
        ) : (
          <Text style={styles.imageText}>Pick an Image</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Add Innovator</Text>
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
    backgroundColor:'#fff',
  },
  proposalLinkContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  proposalInput: {
    flex: 1,
  },
  attachIcon: {
    position: 'absolute',
    right: 10,
    top: 12, // Adjust top position to center the icon vertically
    zIndex: 1, // Ensure the icon is above the input
  },
  imagePicker: {
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
    height: '100%',
    borderRadius: 5,
  },
  submitButton: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom:50,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default AddInnovatorScreen;
