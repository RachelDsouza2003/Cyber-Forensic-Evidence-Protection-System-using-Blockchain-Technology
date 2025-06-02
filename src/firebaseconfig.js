// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";  // Import getAuth for Firebase Authentication
import { getFirestore } from "firebase/firestore"; // Import Firestore
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyChlT3jECQdc6PbGzgmT-ez_HAUpQljoW4",
  authDomain: "cyber-forensic-evidence.firebaseapp.com",
  projectId: "cyber-forensic-evidence",
  storageBucket: "cyber-forensic-evidence.appspot.com",
  messagingSenderId: "35073071801",
  appId: "1:35073071801:web:3b531c1ace5a13918a5968",
  measurementId: "G-KQM7J49ZV2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication and Firestore, then export them
const auth = getAuth(app);
const db = getFirestore(app);  // Initialize Firestore

export { auth, db };