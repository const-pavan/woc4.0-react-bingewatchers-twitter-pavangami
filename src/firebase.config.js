// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDj40N9aQ7gygp0uvDWglfyU9ZxnGnTecU",
  authDomain: "binge-watchers-twitter.firebaseapp.com",
  projectId: "binge-watchers-twitter",
  storageBucket: "binge-watchers-twitter.appspot.com",
  messagingSenderId: "288717272843",
  appId: "1:288717272843:web:6d3f832aac4768334a940e",
};

// Initialize Firebase
// eslint-disable-next-line
const app = initializeApp(firebaseConfig);
export const db = getFirestore();
