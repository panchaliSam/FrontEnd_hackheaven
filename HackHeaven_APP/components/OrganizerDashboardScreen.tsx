import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Linking,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

interface Event {
  id: number;
  organizationName: string;
  hackathonName: string;
  hackathonType: string;
  date: string;
  location: string;
  phoneNo: string;
  email: string;
  proposalPDF: string;
}

const OrganizerDashboardScreen = () => {
  const navigation: any = useNavigation();
  const [eventData, setEventData] = useState([]);
  const [events, setEvents] = useState<Event[]>([
    {
      id: 1,
      organizationName: "ahaha",
      hackathonName: "Hackathon",
      hackathonType: "UCSC",
      date: "Business ideas and technical experts",
      location: "https://i.imgur.com/your-event-image.png",
      phoneNo: "0778736987",
      email: "haha@gmail.com",
      proposalPDF: "ahsahd",
    },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any | any>(null);
  const [selectedEventEditor, setSelectedEventEditor] = useState<any | any>(
    null
  );

  const [editedHackathonName, setEditedHackathonName] = useState("");
  const [editeditedDate, setEditeditedDate] = useState<any | any>("");
  const [editedLocation, setEditedLocation] = useState("");
  const [editedPhoneNo, setEditedPhoneNo] = useState("");
  const [showDatePicker, setShowDatePicker] = useState<any | any>(false);

  const [coverImages, setCoverImages] = useState([
    "https://cdn.pixabay.com/photo/2016/11/23/14/45/coding-1853305_1280.jpg",
    "https://cdn.pixabay.com/photo/2024/06/14/12/15/developer-8829735_1280.jpg",
    "https://cdn.pixabay.com/photo/2023/09/24/15/52/ai-generated-8273245_1280.jpg",
    "https://cdn.pixabay.com/photo/2016/10/15/15/19/digital-1742687_1280.jpg",
    "https://cdn.pixabay.com/photo/2016/11/30/20/44/computer-1873831_1280.png",
  ]);

  const validateEditForm = () => {
    if (!editedHackathonName) {
      Alert.alert("Validation Error", "Hackathon Name is required.");
      return false;
    }
    if (!editeditedDate) {
      Alert.alert("Validation Error", "Event Date is required.");
      return false;
    }
    if (!editedLocation) {
      Alert.alert("Validation Error", "Location is required.");
      return false;
    }
    if (!editedPhoneNo) {
      Alert.alert("Validation Error", "Phone number is required.");
      return false;
    }
    
    return true;
  };

  const handleEdit = (event: any) => {
    console.log("-----------------------");
    console.log(event);
    setSelectedEventEditor(event);

    setEditedHackathonName(event.hackathon_name);
    setEditeditedDate(event.final_date);
    setEditedLocation(event.location);
    setEditedPhoneNo(event.phone_no);

    setModalVisible(true);
  };

  const handleSave = () => {
    if (selectedEvent) {
      const updatedEvents = events.map((event) =>
        event.id === selectedEvent.id
          ? {
              ...event,
              title: editedHackathonName,
              date: editeditedDate,
              location: editedLocation,
              phoneNo: editedPhoneNo,
            }
          : event
      );
      setEvents(updatedEvents);
      setModalVisible(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      handleGetEvents();
    });

    return unsubscribe;
  }, [navigation]);

  const handleView = async (id: any) => {
    try {
      const url = `http://192.168.133.77:4003/api/organizer/getEventDetails?hackathon_id=${id}`;
      const response = await axios.get(url);

      if (response.status === 200) {
        const eventDetails = response.data;
        console.log(eventDetails);
        setSelectedEvent(eventDetails);
        setViewModalVisible(true);
      }
    } catch (error: any) {
      console.error("Error fetching event details:", error);
      Alert.alert("Error", "Could not fetch event details.", [{ text: "OK" }]);
    }
  };

  const handleGetEvents = async () => {
    try {
      const loggedUserEmail = await AsyncStorage.getItem("userEmail");

      if (loggedUserEmail) {
        const url = `http://192.168.133.77:4003/api/organizer/retrieveHackathonEventsByEmail?email=${encodeURIComponent(
          loggedUserEmail
        )}`;

        const response = await axios.get(url);
        setEventData(response.data);

        console.log("Hackathon Events:", response.data);
      } else {
        console.error("No email found in AsyncStorage");
      }
    } catch (error) {}
  };

  const handleDeleteEvent = async (id: any) => {
    try {
      const url = `http://192.168.133.77:4003/api/organizer/deleteHackathonEvent?hackathon_id=${id}`;

      const response = await axios.delete(url);

      if (response.status === 200) {
        console.log("Response:", response.data);
        Alert.alert("Success", response.data.message, [
          { text: "OK", onPress: handleGetEvents }, // Trigger handleGetEvents on OK press
        ]);
      }
    } catch (error: any) {
      if (error.response) {
        console.error("Error response:", error.response.data);
        Alert.alert("Error", error.response.data.error, [{ text: "OK" }]);
      } else {
        console.error("Error deleting event:", error);
        Alert.alert("Error", "An unexpected error occurred", [{ text: "OK" }]);
      }
    }
  };

  const submitUpdate = async (id: any) => {
    console.log("fsdfsdfsd", id);
    const url = `http://192.168.133.77:4003/api/organizer/updateHackathonEvent/?hackathon_id=${id}`;

    if (!validateEditForm()) return;

    try {
      // Assuming you have the updated event data to send, adjust as needed
      const updatedData = {
        hackathon_name: editedHackathonName,
        final_date: new Date(editeditedDate)
          .toISOString()
          .slice(0, 19)
          .replace("T", " "),
        location: editedLocation,
        phone_no: editedPhoneNo,
      };

      const response = await axios.put(url, updatedData); // Use POST if needed

      if (response.status === 200) {
        Alert.alert("Success", "Hackathon event updated successfully!", [
          {
            text: "OK",
            onPress: () => {
              setSelectedEventEditor(false);
              handleGetEvents();
            },
          }, // Call handleGetEvents here
        ]);
      } else {
        Alert.alert("Error", "Failed to update the event.", [{ text: "OK" }]);
      }
    } catch (error: any) {
      console.error("Error updating event:", error);
      Alert.alert(
        "Error",
        "An unexpected error occurred while updating the event.",
        [{ text: "OK" }]
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>MY EVENTS</Text>

      <ScrollView style={styles.scrollView}>
        {eventData.map((event: any, index) => (
          <View key={event.hackathon_name} style={styles.eventCard}>
            <Image
              source={{
                uri: coverImages[index > 4 ? index - 1 : index],
              }}
              style={styles.eventImage}
            />
            <Text style={styles.eventTitle}>{event.hackathon_name}</Text>
            <Text style={styles.eventOrg}>{event.hackathon_type}</Text>
            <Text style={styles.eventDesc}>
              {new Date(event.final_date).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>
            <Text style={styles.eventDesc}>{event.location}</Text>
            <Text style={styles.eventDesc}>{event.phone_no}</Text>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleEdit(event)}
              >
                <Text style={styles.actionText}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleView(event.hackathon_id)}
              >
                <Text style={styles.actionText}>View</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleDeleteEvent(event.hackathon_id)}
              >
                <Text style={styles.actionText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Add Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("ADD HACKATHON")}
      >
        <Text style={styles.addButtonText}>A D D</Text>
      </TouchableOpacity>

      {/* Modal for Editing Event */}
      {selectedEventEditor && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Edit Event</Text>

              <TextInput
                style={styles.input}
                placeholder="Title"
                value={editedHackathonName}
                onChangeText={(text) => setEditedHackathonName(text)}
              />

              <TextInput
                style={styles.input}
                placeholder="date"
                value={
                  editeditedDate
                    ? new Date(editeditedDate).toLocaleDateString()
                    : ""
                }
                onFocus={() => setShowDatePicker(true)} // Show the date picker on focus
              />

              {showDatePicker && (
                <DateTimePicker
                  value={new Date(editeditedDate)}
                  mode="date"
                  display="default"
                  onChange={(event: any, selectedDate?: Date) => {
                    const currentDate = selectedDate || editeditedDate; // Keep the previous date if cancelled
                    if (event.type === "set") {
                      setEditeditedDate(currentDate); // Update only if a date was selected
                    }
                    setShowDatePicker(false);
                    // If the user cancels, do nothing and keep the previous value
                  }}
                />
              )}

              <TextInput
                style={styles.input}
                placeholder="location"
                value={editedLocation}
                onChangeText={(text) => setEditedLocation(text)}
              />

              <TextInput
                style={styles.input}
                placeholder="phone"
                value={editedPhoneNo}
                onChangeText={(text) => setEditedPhoneNo(text)}
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={() => submitUpdate(selectedEventEditor.hackathon_id)}
                >
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* Modal for Viewing Event Details */}
      {selectedEvent && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={viewModalVisible}
          onRequestClose={() => setViewModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Event Details</Text>
              <Text style={styles.modalEventTitle}>
                {selectedEvent.organization_name}
              </Text>
              <Text style={styles.modalEventOrg}>
                {selectedEvent.hackathon_name}
              </Text>
              <Text style={styles.modalEventDesc}>
                {selectedEvent.hackathon_type}
              </Text>
              <Text style={styles.modalEventOrg}>
                {new Date(selectedEvent.final_date).toLocaleDateString(
                  undefined,
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}
              </Text>
              <Text style={styles.modalEventOrg}>{selectedEvent.location}</Text>
              <Text style={styles.modalEventOrg}>{selectedEvent.phone_no}</Text>
              <Text style={styles.modalEventOrg}>{selectedEvent.email}</Text>
              <Text
                style={styles.modalEventOrg}
                onPress={() => Linking.openURL(selectedEvent.proposal_pdf)}
              >
                {selectedEvent.proposal_pdf}
              </Text>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setViewModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles: any = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  headerContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  editProfileButton: {
    backgroundColor: "#00AEEF",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editProfileText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 10,
  },
  scrollView: {
    flex: 1,
  },
  eventCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    marginBottom: 20,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  eventImage: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  eventOrg: {
    fontSize: 14,
    color: "#555",
  },
  eventDesc: {
    fontSize: 12,
    color: "#777",
    marginBottom: 10,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  actionButton: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  actionText: {
    fontSize: 14,
    color: "#333",
  },
  addButton: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom:50,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "90%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  modalEventTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalEventOrg: {
    fontSize: 16,
    marginBottom: 10,
  },
  modalEventDesc: {
    fontSize: 14,
    color: "#777",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  saveButton: {
    backgroundColor: "#00AEEF",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  cancelButtonText: {
    color: "#333",
    fontWeight: "bold",
  },
  closeButton: {
    backgroundColor: "#00AEEF",
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 5,
    marginTop: 20,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default OrganizerDashboardScreen;
