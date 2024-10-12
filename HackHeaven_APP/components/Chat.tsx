import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc, query, where, orderBy, onSnapshot } from 'firebase/firestore';

const Chat: React.FC<{ route: any }> = ({ route }) => {
  const { recipientId, recipientEmail } = route.params; // Receive parameters from navigation
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const userId = auth.currentUser?.uid;

    // Listen for new messages
    const messagesRef = collection(db, 'chats');
    const q = query(
      messagesRef,
      where('senderId', 'in', [userId, recipientId]),
      where('recipientId', 'in', [userId, recipientId]),
      orderBy('timestamp')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const msgs: any[] = [];
      querySnapshot.forEach((doc) => {
        msgs.push(doc.data());
      });
      setMessages(msgs);
    });

    return () => unsubscribe(); // Clean up the subscription on unmount
  }, [db, auth.currentUser?.uid, recipientId]);

  const sendMessage = async () => {
    const userId = auth.currentUser?.uid;
    if (messageText.trim() === '') return;

    await addDoc(collection(db, 'chats'), {
      senderId: userId,
      recipientId: recipientId,
      message: messageText,
      timestamp: new Date(),
      senderEmail: auth.currentUser?.email, // Optional, for display purposes
    });

    setMessageText(''); // Clear the input
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()} // Update with a better key based on your messages structure
        renderItem={({ item }) => (
          <View style={item.senderId === auth.currentUser?.uid ? styles.sentMessage : styles.receivedMessage}>
            <Text>{item.message}</Text>
          </View>
        )}
      />
      <TextInput
        style={styles.input}
        placeholder="Type a message..."
        value={messageText}
        onChangeText={setMessageText}
      />
      <Button title="Send" onPress={sendMessage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#dcf8c6',
    borderRadius: 5,
    padding: 10,
    marginVertical: 2,
    maxWidth: '80%',
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#ececec',
    borderRadius: 5,
    padding: 10,
    marginVertical: 2,
    maxWidth: '80%',
  },
});

export default Chat;
