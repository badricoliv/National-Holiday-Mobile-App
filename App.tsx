import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

function App() {
  var date = new Date().toDateString();
  var month = new Date().getMonth();
  var day = new Date().getDate();
  return (
    <View style={styles.container}>
      <Text>{day}</Text>
      <Text>{month}</Text>
      <Text>{date}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

export default App
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
