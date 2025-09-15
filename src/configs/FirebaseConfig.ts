// src/FirebaseConfig.js
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, doc, setDoc, getDoc, query, where } from "firebase/firestore";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyA78_auowszE7MsTqcHeMcQQurWdp8HIuo",
  authDomain: "nthomeapp-7da33.firebaseapp.com",
  projectId: "nthomeapp-7da33",
  storageBucket: "nthomeapp-7da33.appspot.com",
  messagingSenderId: "68267545029",
  appId: "1:68267545029:web:ee1092099328e9b1b8bbac",
};
// Initialize Firebase app
const app = getApps().find(a => a.name === "nthomeApp") || initializeApp(firebaseConfig, "nthomeApp");

// Initialize Auth (web persistence enabled by default)
const auth = getAuth(app);

// Initialize Firestore
const db = getFirestore(app);

export { app, auth, db, collection, doc, setDoc, getDoc, query, where };
