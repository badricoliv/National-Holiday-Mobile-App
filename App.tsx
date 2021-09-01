import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {db} from './firebase'

class holiday {
  day;
  month;
  name;
  constructor(day:number, month:number,name:string) {
    this.day = day;
    this.month = month;
    this.name = name;
  }
}
function App() {
  var date = new Date().toDateString();
  var month = new Date().getMonth();
  var day = new Date().getDate();
  const coll = db.firestore().collection('Holidays')
  const ref = db.firestore().collection('Holidays').where("day","==",day);
  const ref2 = ref.where("month","==",month);
  const [data,setData] = useState("");
  var strings: string[] = [];
  /* Code to add data to firestore */
  const days = [
  new holiday(1,8, "American Chess Day"),
  new holiday(1,8, "Building and Code Staff Appreciation Day"),
  new holiday(1,8, "Chicken Boy Day"),
  new holiday(1,8,"National No Rhyme Nor Reason Day"),
  new holiday(1,8,"Wattle Day"),
  new holiday(1,8,"World Letter Writing Day"),
]
for(var i = 0; i < 6; i++) {
  const user = coll.doc(days[i].name).set({
    day: days[i].day,
    month: days[i].month,
  })
}

  useEffect(() => {
    async function getDataFromFireStore() {
        ref.onSnapshot((query) => {
            const objs : string[] = [];
            query.forEach((doc) => {
                objs.push(doc.id);
            });
            let str : string = "";
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

export default App
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
