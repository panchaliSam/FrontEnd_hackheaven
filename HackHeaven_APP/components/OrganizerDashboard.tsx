import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Modal, TextInput } from 'react-native';

// Define the structure of an event object
interface Event {
  id: number;
  title: string;
  organization: string;
  description: string;
  image: string;
}

const MyEventsScreen = () => {
  const [events, setEvents] = useState<Event[]>([
    {
      id: 1,
      title: 'Hackathon',
      organization: 'UCSC',
      description: 'Business ideas and technical experts',
      image: 'https://i.imgur.com/your-event-image.png', // Replace with the actual image URI
    },
    // Add more events here as needed
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedOrg, setEditedOrg] = useState('');
  const [editedDesc, setEditedDesc] = useState('');

  // Function to handle Edit button click
  const handleEdit = (event: Event) => {
    setSelectedEvent(event);
    setEditedTitle(event.title);
    setEditedOrg(event.organization);
    setEditedDesc(event.description);
    setModalVisible(true);
  };

  // Function to save the edited event details
  const handleSave = () => {
    if (selectedEvent) {
      const updatedEvents = events.map((event) =>
        event.id === selectedEvent.id
          ? { ...event, title: editedTitle, organization: editedOrg, description: editedDesc }
          : event
      );
      setEvents(updatedEvents);
      setModalVisible(false);
    }
  };

  // Function to handle View button click
  const handleView = (event: Event) => {
    setSelectedEvent(event);
    setViewModalVisible(true);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Image
          source={{ uri: 'https://i.imgur.com/your-profile-image.png' }} // Replace with actual image URI
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>John Doe</Text>
        <TouchableOpacity style={styles.editProfileButton}>
          <Text style={styles.editProfileText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* My Events Header */}
      <Text style={styles.sectionTitle}>My Events</Text>

      {/* Scrollable Event List */}
      <ScrollView style={styles.scrollView}>
        {events.map((event) => (
          <View key={event.id} style={styles.eventCard}>
            <Image source={{ uri: event.image }} style={styles.eventImage} />
            <Text style={styles.eventTitle}>{event.title}</Text>
            <Text style={styles.eventOrg}>{event.organization}</Text>
            <Text style={styles.eventDesc}>{event.description}</Text>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.actionButton} onPress={() => handleEdit(event)}>
                <Text style={styles.actionText}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton} onPress={() => handleView(event)}>
                <Text style={styles.actionText}>View</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Add Button */}
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>Add</Text>
      </TouchableOpacity>

      {/* Modal for Editing Event */}
      {selectedEvent && (
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
                value={editedTitle}
                onChangeText={(text) => setEditedTitle(text)}
              />

              <TextInput
                style={styles.input}
                placeholder="Organization"
                value={editedOrg}
                onChangeText={(text) => setEditedOrg(text)}
              />

              <TextInput
                style={styles.input}
                placeholder="Description"
                value={editedDesc}
                onChangeText={(text) => setEditedDesc(text)}
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
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
              <Text style={styles.modalEventTitle}>{selectedEvent.title}</Text>
              <Text style={styles.modalEventOrg}>{selectedEvent.organization}</Text>
              <Text style={styles.modalEventDesc}>{selectedEvent.description}</Text>

              <TouchableOpacity style={styles.closeButton} onPress={() => setViewModalVisible(false)}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  editProfileButton: {
    backgroundColor: '#00AEEF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editProfileText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  scrollView: {
    flex: 1,
  },
  eventCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginBottom: 20,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  eventImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  eventOrg: {
    fontSize: 14,
    color: '#555',
  },
  eventDesc: {
    fontSize: 12,
    color: '#777',
    marginBottom: 10,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  actionButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  actionText: {
    fontSize: 14,
    color: '#333',
  },
  addButton: {
    backgroundColor: '#00AEEF',
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 25,
    marginVertical: 15,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalEventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalEventOrg: {
    fontSize: 16,
    marginBottom: 10,
  },
    modalEventDesc: {
    fontSize: 14,
    color: '#777',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  saveButton: {
    backgroundColor: '#00AEEF',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  cancelButtonText: {
    color: '#333',
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#00AEEF',
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 20,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default MyEventsScreen;

