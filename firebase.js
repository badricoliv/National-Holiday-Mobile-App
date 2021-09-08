import firebase from "firebase/app";
import "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCW_l8d0Tr7qYWhrmwCjOICcwHw1oUbrwA",
    authDomain: "nationaldayapp-a3c41.firebaseapp.com",
    projectId: "nationaldayapp-a3c41",
    storageBucket: "nationaldayapp-a3c41.appspot.com",
    messagingSenderId: "856741886208",
    appId: "1:856741886208:ios:e130641920b50c124edbe5",
    databaseURL: "https://dungeon-in-a-jiffy-e9931-default-rtdb.asia-southeast1.firebasedatabase.app/"
}; //this is where your firebase app values you copied will go

firebase.initializeApp(firebaseConfig);

export const db = firebase;

