// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC4FFyjSaIl-U--8mqhohdeOFnGadDJj38",
  authDomain: "monivation-85c78.firebaseapp.com",
  projectId: "monivation-85c78",
  storageBucket: "monivation-85c78.appspot.com",
  messagingSenderId: "915414972426",
  appId: "1:915414972426:web:6a87a572ec6438211d07f3",
  measurementId: "G-9F627ZDMYT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);