import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

const RegisterOrganizerScreen: React.FC = () => {
  const navigation: any = useNavigation();
  const [organizationName, setOrganizationName] = useState("");
  const [hackathonName, setHackathonName] = useState("");
  const [hackathonType, setHackathonType] = useState("Business");
  const [finalEventDate, setFinalEventDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [venue, setVenue] = useState("");
  const [country, setCountry] = useState("Sri Lanka");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [url, setUrl] = useState("");


  const hackathonTypes = [
    "Online",
    "In-Person",
    "Hybrid",
    "Gaming",
    "Business",
    "Healthcare",
    "Education",
    "Social Innovation",
    "Artificial Intelligence",
    "Blockchain",
    "Sustainability",
  ];

  const countries = [
    "USA",
    "UK",
    "Canada",
    "India",
    "Australia",
    "Sri Lanka",
    "Other",
  ];

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFinalEventDate(selectedDate);
    }
  };

  const validateForm = () => {
    // Phone Number Validation
    if (!organizationName) {
      Alert.alert("Validation Error", "Organization Name is required.");
      return false;
    }
    if (!hackathonName) {
      Alert.alert("Validation Error", "Hackathon Name is required.");
      return false;
    }
    if (!venue) {
      Alert.alert("Validation Error", "Venue is required.");
      return false;
    }
    if (!phoneNumber) {
      Alert.alert("Validation Error", "Phone number is required.");
      return false;
    }
    // Check if phone number starts with 0 and has exactly 10 digits
    if (!/^[0][0-9]{9}$/.test(phoneNumber)) {
      Alert.alert("Validation Error", "Phone number must start with 0 and have 10 digits.");
      return false;
    }
    // Email Validation
    if (email && !/\S+@\S+\.\S+/.test(email)) {
      Alert.alert("Validation Error", "Email format is invalid.");
      return false;
    }
    // Date Validation
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to midnight to avoid time issues
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    if (finalEventDate < tomorrow) {
      Alert.alert("Validation Error", "Final Event Date must be tomorrow or later.");
      return false;
    }
    return true;
  };
  

  const handleFormSubmit = async () => {
    if (!validateForm()) return;

    const finalEventDateObject: any = new Date(finalEventDate);
    const formattedDate = finalEventDateObject.toISOString().split("T")[0];
    const data = {
      organizationName,
      hackathonName,
      hackathonType,
      finalEventDate: formattedDate,
      venue,
      country,
      phoneNumber,
      email,
      proposalPDF: url, 
    };

    try {
      const response = await axios.post(
        "http://192.168.1.8:4003/api/organizer/addHackathonEvent",
        data
      );

      if (response.status === 200) {
        console.log("Response:", response.data);

        Alert.alert("Success", "Hackathon event added successfully!", [
          { text: "OK", onPress: () => navigation.navigate("Organizer") }, // Navigate on OK press
        ]);
      }

      console.log("Response:", response.data);
    } catch (error: any) {
      Alert.alert("Error", "Error adding hackathon event!", [{ text: "OK" }]);
      console.error(
        "Error adding hackathon event:",
        error.response ? error.response.data : error.message
      );
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
          onValueChange={(itemValue) => setHackathonType(itemValue)}
        >
          {hackathonTypes.map((type) => (
            <Picker.Item key={type} label={type} value={type} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Final Event Date*</Text>
      <TouchableOpacity
        style={styles.dateInput}
        onPress={() => setShowDatePicker(true)}
      >
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
          onValueChange={(itemValue) => setCountry(itemValue)}
        >
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
      <Text style={styles.label}>Proposal PDF Link</Text>
      <TextInput
        style={styles.input}
        value={url}
        onChangeText={setUrl}
        placeholder="Enter Proposal PDF Link"
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleFormSubmit}>
        <Text style={styles.submitText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 20,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default RegisterOrganizerScreen;
