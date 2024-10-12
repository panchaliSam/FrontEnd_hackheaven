import React from 'react';
import { View, StyleSheet } from 'react-native';
import UserSearch from './UserSearch'; // Adjust the path based on your folder structure
import Chat from './Chat'; // Adjust the path based on your folder structure

const ChatScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <UserSearch />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ChatScreen;
