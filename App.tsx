import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import {StyleSheet, Text, View, TextInput, Keyboard, ScrollView, Pressable } from 'react-native';
import { db } from './firebase'
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {useFonts} from 'expo-font'
import * as Font from 'expo-font'
/**
 * Page that displays what national holiday it is today. Filters data from firestore by day and month
 * numeric values, then adds them to a string.
 */
function whatDayIsToday() {

  /* Makes it so the date is being updated in real time. */
  const [date,setDate] = useState(new Date());

  const [fontLoaded, setFontLoaded] = useState(false);
  const [font, setFont] = useState('Arial');

  useEffect(() => {
    var timer = setInterval(() => setDate(new Date()), 1000)
    return function cleanup() {
      clearInterval(timer)
    }
  })
  async function loadFonts() {
    await Font.loadAsync({
      HandleeRegular: require('./fonts/Handlee-Regular.ttf'),
      'Handlee': {
        uri: require('./fonts/Handlee-Regular.ttf'),
        display: Font.FontDisplay.FALLBACK,
      },
    })
    setFontLoaded(true);
    setFont('HandleeRegular')
  }
  loadFonts();

  const [loaded] = useFonts({
    HandleeRegular: require('./fonts/Handlee-Regular.ttf')
  })
  var year = date.getFullYear();
  var month = date.getMonth();
  var day = date.getDate();

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
  return (
    <View style={styles.container}>
      <Text style={[styles.title, {fontFamily: font}]}>Today,</Text>
      <Text style={[styles.title, {fontFamily: font}]}>{day}/{month+1}/{year}</Text>
      <Text style={[styles.title, {fontFamily: font}]}>is...</Text>
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
  const [filter, setFilter] = useState("")
  const [day, setDay] = useState(6);
  const [month, setMonth] = useState(8)
  const [data,setData] = useState("");
  const days= db.firestore().collection('Holidays')
  const [hol, setHol] = useState([{}])
  const [filtered, setFiltered] = useState([{}]);
  useEffect(() => {
    const holidays: string[] = [];
    const dayNo: string[] = [];
    const monthNo: string[] = [];
    days.get().then((querySnapshot) => {
      if(querySnapshot.empty) {
        console.log('EMPTY');

      } else {
        querySnapshot.forEach((doc) => {
          holidays.push(doc.id);
          dayNo.push(doc.data().day)
          monthNo.push(doc.data().month)
        })
        for(var i = 0; i < holidays.length; i++) {
          setHol(oldArray => [...oldArray, {id:holidays[i],day:dayNo[i],month: monthNo[i]}])
        }
        
      }
    })
  }, []);
  
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.dateInput}>
        <TextInput
          style={styles.input}
          onChangeText={e => setDay(e)}
          onSubmitEditing={Keyboard.dismiss}
          keyboardType={'number-pad'}
          returnKeyType={'done'}
          blurOnSubmit={true}
          placeholder="Day"
          multiline={false} />
        <TextInput
          style={styles.input}
          onChangeText={e => setMonth(e)}
          onSubmitEditing={Keyboard.dismiss}
          keyboardType={'number-pad'}
          returnKeyType={'done'}
          blurOnSubmit={true}
          placeholder="Month"
          multiline={false} />
      </View>
      <Pressable
        onPress={() => {
          setFiltered(hol.filter(x => (x.day == day && x.month == month-1)))
        }}
        style={[styles.button, { left: 0 }, { backgroundColor: '#0000FF' }]}
        disabled={!((day > 0 && day <= 31) && (month > 0 && month <= 12))}
      >
        <Text>SEARCH</Text>
      </Pressable>
      {filtered.map((x) => {
        return (
          <Text>{x.id}</Text>
        )
      })}
      
    </ScrollView>
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
    alignItems: 'center'

  },
  dateInput: {
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
  },
  title: {
    fontSize: 30,
    alignItems:'center',
    justifyContent: 'center',
  }
});
