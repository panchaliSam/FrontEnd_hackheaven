// import React, { useEffect, useState } from 'react';
// import { View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
// import { useNavigation } from '@react-navigation/native';

// // Define a type for your user structure
// interface User {
//   uid: string; // Unique user identifier
//   email: string; // User email
// }

// const UserSearch: React.FC = () => {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [users, setUsers] = useState<User[]>([]);
//   const navigation = useNavigation();

//   // Fetch users from your backend
//   const fetchUsers = async () => {
//     try {
//       const response = await fetch('http://192.168.1.9:4003/api/auth-user/get-users'); // Replace with your backend URL
//       const data = await response.json();
//       setUsers(data);
//     } catch (error) {
//       console.error('Error fetching users:', error);
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   // Filter users based on the search query
//   const filteredUsers = users.filter(user => user.email?.toLowerCase().includes(searchQuery.toLowerCase()));

//   // Handle user selection and navigate to Chat screen
//   const handleUserSelect = (userId: string, userEmail: string) => {
//     navigation.navigate('Chat', { recipientId: userId, recipientEmail: userEmail });
//   };

//   return (
//     <View style={styles.container}>
//       <TextInput
//         style={styles.input}
//         placeholder="Search Users by Email"
//         value={searchQuery}
//         onChangeText={setSearchQuery}
//       />
//       <FlatList
//         data={filteredUsers}
//         keyExtractor={item => item.uid}
//         renderItem={({ item }) => (
//           <TouchableOpacity style={styles.userItem} onPress={() => handleUserSelect(item.uid, item.email)}>
//             <Text style={styles.userText}>{item.email}</Text>
//           </TouchableOpacity>
//         )}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//   },
//   input: {
//     height: 40,
//     borderColor: '#ccc',
//     borderWidth: 1,
//     marginBottom: 15,
//     paddingHorizontal: 10,
//   },
//   userItem: {
//     padding: 10,
//     borderBottomColor: '#ccc',
//     borderBottomWidth: 1,
//   },
//   userText: {
//     fontSize: 18,
//   },
// });

// export default UserSearch;


import React, { useEffect, useState } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';

// Define a type for your user structure
interface User {
  uid: string; // Unique user identifier
  email: string; // User email
}

const UserSearch: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);

  // Fetch users from your backend
  const fetchUsers = async () => {
    try {
      const response = await fetch('http://192.168.1.9:4003/api/auth-user/get-users'); // Replace with your backend URL
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users based on the search query
  const filteredUsers = users.filter(user => user.email?.toLowerCase().includes(searchQuery.toLowerCase()));

  // Handle user selection and open the email app
  const handleUserSelect = (userEmail: string) => {
    const emailUrl = `mailto:${userEmail}`;
    Linking.openURL(emailUrl).catch(err => console.error('Error opening email client:', err));
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search Users by Email"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={filteredUsers}
        keyExtractor={item => item.uid}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.userItem} onPress={() => handleUserSelect(item.email)}>
            <Text style={styles.userText}>{item.email}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  userItem: {
    padding: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  userText: {
    fontSize: 18,
  },
});

export default UserSearch;
