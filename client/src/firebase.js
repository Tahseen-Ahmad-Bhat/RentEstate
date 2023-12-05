// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "rent-estate-cc247.firebaseapp.com",
  projectId: "rent-estate-cc247",
  storageBucket: "rent-estate-cc247.appspot.com",
  messagingSenderId: "213167348463",
  appId: "1:213167348463:web:a50880ada0817c99ba991a",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
