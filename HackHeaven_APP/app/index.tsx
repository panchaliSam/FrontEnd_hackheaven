import React from 'react';
import { View, StyleSheet } from 'react-native'; // Import View and StyleSheet
import { registerRootComponent } from 'expo';
import AppNavigator from '@/components/navigation/AppNavigator'; // Adjust path as needed

const App: React.FC = () => {
  return (
    <View style={styles.container}> 
      <AppNavigator />
    </View>
  ); 
};

// Define styles
const styles = StyleSheet.create({
  container: {
    flex: 1, // Allow the View to take up the full screen
    backgroundColor: '#fff', // Set a background color (optional)
  },
});

registerRootComponent(App);

export default App;
