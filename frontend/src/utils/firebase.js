// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "fresherai-1910c.firebaseapp.com",
  projectId: "fresherai-1910c",
  storageBucket: "fresherai-1910c.firebasestorage.app",
  messagingSenderId: "430375694764",
  appId: "1:430375694764:web:db992bc967ab1736a50a09"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app)

const provider = new GoogleAuthProvider()

export {auth, provider} 