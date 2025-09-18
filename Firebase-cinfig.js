// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAyljFcBhoFr1wN0WXIOpiua5yKiahrpP0",
  authDomain: "workorder-app-c1b0f.firebaseapp.com",
  projectId: "workorder-app-c1b0f",
  storageBucket: "workorder-app-c1b0f.firebasestorage.app",
  messagingSenderId: "453685925986",
  appId: "1:453685925986:web:1c9a616c2a7c1251cd193b",
  measurementId: "G-KYHSNQVD96"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
