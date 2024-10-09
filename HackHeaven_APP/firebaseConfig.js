// Import only the necessary functions from Firebase SDK
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage"; // Import Firebase storage

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBidIAQJ2RQ82746Q4-gCoGEuRisCxP4JY",
  authDomain: "hackheaven-1a9c2.firebaseapp.com",
  projectId: "hackheaven-1a9c2",
  storageBucket: "hackheaven-1a9c2.appspot.com",
  messagingSenderId: "738905783906",
  appId: "1:738905783906:web:721dc265175c8f4f279b3b",
  measurementId: "G-4RH4T9QH5F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Storage and export it for later use
const storage = getStorage(app);

export { app, storage };
