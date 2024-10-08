import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

const RegisterOrganizerScreen: React.FC = () => {
  const [organizationName, setOrganizationName] = useState('');
  const [hackathonName, setHackathonName] = useState('');
  const [hackathonType, setHackathonType] = useState('Business');
  const [finalEventDate, setFinalEventDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [venue, setVenue] = useState('');
  const [country, setCountry] = useState('Sri Lanka');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');

  const hackathonTypes = [
    'Online',
    'In-Person',
    'Hybrid',
    'Gaming',
    'Business',
    'Healthcare',
    'Education',
    'Social Innovation',
    'Artificial Intelligence',
    'Blockchain',
    'Sustainability',
  ];

  const countries = [
    'USA',
    'UK',
    'Canada',
    'India',
    'Australia',
    'Sri Lanka',
    'Other',
  ];

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFinalEventDate(selectedDate);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Organization Name*</Text>
      <TextInput
        style={styles.input}
        value={organizationName}
        onChangeText={setOrganizationName}
        placeholder="Enter Organization Name"
      />

      <Text style={styles.label}>Hackathon Name*</Text>
      <TextInput
        style={styles.input}
        value={hackathonName}
        onChangeText={setHackathonName}
        placeholder="Enter Hackathon Name"
      />

      <Text style={styles.label}>Hackathon Type*</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={hackathonType}
          onValueChange={(itemValue) => setHackathonType(itemValue)}>
          {hackathonTypes.map((type) => (
            <Picker.Item key={type} label={type} value={type} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Final Event Date*</Text>
      <TouchableOpacity
        style={styles.dateInput}
        onPress={() => setShowDatePicker(true)}>
        <Text>{finalEventDate.toLocaleDateString()}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={finalEventDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      <Text style={styles.label}>Venue*</Text>
      <TextInput
        style={styles.input}
        value={venue}
        onChangeText={setVenue}
        placeholder="Enter Venue"
      />

      <Text style={styles.label}>Country*</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={country}
          onValueChange={(itemValue) => setCountry(itemValue)}>
          {countries.map((country) => (
            <Picker.Item key={country} label={country} value={country} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Phone no.*</Text>
      <TextInput
        style={styles.input}
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        placeholder="Enter Phone Number"
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Enter Email"
        keyboardType="email-address"
      />

      <TouchableOpacity style={styles.submitButton}>
        <Text style={styles.submitText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RegisterOrganizerScreen;
