// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "ai-short-video-9cc9d.firebaseapp.com",
  projectId: "ai-short-video-9cc9d",
  storageBucket: "ai-short-video-9cc9d.firebasestorage.app",
  messagingSenderId: "704097404084",
  appId: "1:704097404084:web:01a6fe21208517f47c83e1",
  measurementId: "G-KMMEB3RZ6S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);