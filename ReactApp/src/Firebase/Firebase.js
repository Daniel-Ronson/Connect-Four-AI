import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';

if (firebase.apps.length === 0) {
firebase.initializeApp({
  apiKey: "AIzaSyBAQwZ-i3gAD7KmeczPlH9fb7oCHZFCdPQ",
  authDomain: "chat-app-connect-four.firebaseapp.com",
  databaseURL: "https://chat-app-connect-four.firebaseio.com",
  projectId: "chat-app-connect-four",
  storageBucket: "chat-app-connect-four.appspot.com",
  messagingSenderId: "300032827129",
  appId: "1:300032827129:web:23fef24978e9f67c478c28",
  measurementId: "G-9R2TQC19G6"
})
}
  // Initialize Firebase Analytics
//  firebase.analytics();

export default firebase