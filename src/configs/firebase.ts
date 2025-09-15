// Import the functions you need from the SDKs you need
import { getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDCtY0pPbjt6DlGnZMIiFaUO8zRwJcNJlM",
  authDomain: "voice-recording-app-2ed9b.firebaseapp.com",
  projectId: "voice-recording-app-2ed9b",
  storageBucket: "voice-recording-app-2ed9b.appspot.com",
  messagingSenderId: "475610196824",
  appId: "1:475610196824:web:b5b2bdaa100f94c61cd32d",
  measurementId: "G-Z80XTQHKH7"
};

// Initialize Firebase app (singleton pattern)
const app = getApps().find(a => a.name === "storageApp") || initializeApp(firebaseConfig, "storageApp");

// Initialize services
const db = getFirestore(app);
const storage = getStorage(app);

export { storage, db };
