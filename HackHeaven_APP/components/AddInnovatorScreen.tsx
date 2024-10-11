import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Image, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

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

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add Innovator</Text>

      <TextInput
        style={styles.input}
        placeholder="Innovator Name"
        value={innovatorName}
        onChangeText={setInnovatorName}
      />

      <TextInput
        style={styles.input}
        placeholder="Product Name"
        value={productName}
        onChangeText={setProductName}
      />

      <TextInput
        style={styles.input}
        placeholder="Innovation Category"
        value={innovationCategory}
        onChangeText={setInnovationCategory}
      />

      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
      />

      <TextInput
        style={styles.input}
        placeholder="Proposal Link"
        value={proposalLink}
        onChangeText={setProposalLink}
      />

      <TextInput
        style={styles.input}
        placeholder="Contact No"
        value={contactNo}
        onChangeText={setContactNo}
        keyboardType="phone-pad"
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Video Link"
        value={videoLink}
        onChangeText={setVideoLink}
      />

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

export default AddInnovatorScreen;
