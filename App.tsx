import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { Button, StyleSheet, Text, View, TextInput, Keyboard, ScrollView, Pressable } from 'react-native';
import { db } from './firebase'
import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
  /**
   * Page that displays what national holiday it is today. Filters data from firestore by day and month
   * numeric values, then adds them to a string.
   */
function whatDayIsToday() {
  var date = new Date().toDateString();
  var month = new Date().getMonth();
  var day = new Date().getDate();
  const dayFiltered = db.firestore().collection('Holidays').where("day", "==", day);
  const monthFiltered = dayFiltered.where("month", "==", month);
  const [data, setData] = useState("");
  var strings: string[] = [];

  useEffect(() => {
    async function getDataFromFireStore() {
      monthFiltered.onSnapshot((query) => {
        const objs: string[] = [];
        query.forEach((doc) => {
          objs.push(doc.id);
        });
        let str: string = "";
        objs.forEach(function (value) {
          str = str + value + "\n"
        });
        setData(str);
        strings = objs;
      });
    }

    getDataFromFireStore();
  }, []);

  var month = new Date().getMonth();
  var day = new Date().getDate();
  return (
    <View style={styles.container}>
      <Text>Today, {date}, is:</Text>
      <Text>{data}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

/**
 * Page that allows the user to search for a specific date, and tells them what holidays are on that
 * day.
 */
function screen2() {
    const [holidays, setHolidays] = useState([])
    const [filter, setFilter] = useState([])
    const [day, setDay] = useState(0);
    const [month, setMonth] = useState(0)

  return (
    <View style={styles.container}>
      <View style={styles.dateInput}>
        <TextInput
          style={styles.input}
          onChangeText={setDay}
          onSubmitEditing={Keyboard.dismiss}
          keyboardType={'number-pad'}
          returnKeyType={'done'}
          blurOnSubmit={true}
          placeholder="Day"
          multiline={false} />
        <TextInput
          style={styles.input}
          onChangeText={setMonth}
          onSubmitEditing={Keyboard.dismiss}
          keyboardType={'number-pad'}
          returnKeyType={'done'}
          blurOnSubmit={true}
          placeholder="Month"
          multiline={false} />
      </View>
      <Pressable
        onPress={() => {
          const filteredDays = holidays.filter((e) => e.day == day);
          const filteredMonths = filteredDays.filter((e) => e.month == month);
          setFilter(filteredMonths)
        }}
        style={[styles.button, { left: 0 }, { backgroundColor: '#0000FF' }]}
        disabled={!((day > 0 && day <= 31) && (month > 0 && month <= 12))}
      >
        <Text>SUBMIT</Text>
      </Pressable>
      <Text>{filter}</Text>
    </View>
  )
}

/**
 * React navigator
 */
const Tab = createBottomTabNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={whatDayIsToday} />
        <Tab.Screen name="Search" component={screen2} />
      </Tab.Navigator>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems:'center'
    
  },
  dateInput: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  input: {
    height: 40,
    width: 140,
    borderWidth: 1,
    padding: 10,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    height: 40,
    width: 150,
    borderWidth: 1,
  }
});
