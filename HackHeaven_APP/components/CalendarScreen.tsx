import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Image } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Card, Title, Paragraph, Button, IconButton } from 'react-native-paper';

// Define the events array
const events = [
  {
    id: 1,
    title: 'Codefest',
    organizer: 'By SLIIT',
    time: '10:00 - 13:00',
    date: '2021-09-02',
  },
  {
    id: 2,
    title: 'HackX',
    organizer: 'By UOK',
    time: '10:00 - 13:00',
    date: '2021-09-02',
  },
];

// Define the day structure for TypeScript
interface Day {
  dateString: string;
  day: number;
  month: number;
  year: number;
  timestamp: number;
}

const CalendarScreen: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>('2021-09-02');

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.headerTitle}>Calendar</Title>
        <Image
          source={{ uri: 'https://i.imgur.com/your-profile-image.png' }} // Ensure this image URL is valid
          style={styles.profileImage}
        />
      </View>

      <Calendar
        onDayPress={(day: Day) => setSelectedDate(day.dateString)}
        markedDates={{
          [selectedDate]: { selected: true, marked: true, selectedColor: '#00adf5' }, // Mark the selected date dynamically
        }}
        theme={{
          selectedDayBackgroundColor: '#00adf5',
          todayTextColor: '#00adf5',
          arrowColor: '#00adf5',
        }}
      />

      <View style={styles.eventList}>
        {events
          .filter(event => event.date === selectedDate)
          .map((event) => (
            <Card key={event.id} style={styles.card}>
              <Card.Content>
                <Title>{event.time}</Title>
                <Paragraph>{event.title}</Paragraph>
                <Paragraph>{event.organizer}</Paragraph>
              </Card.Content>
              <Card.Actions>
                <Button onPress={() => { /* Handle view event action */ }}>View</Button>
                <IconButton icon="eye" onPress={() => { /* Handle view event action */ }} />
              </Card.Actions>
            </Card>
          ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  eventList: {
    marginTop: 20,
  },
  card: {
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
  },
});

export default CalendarScreen;
