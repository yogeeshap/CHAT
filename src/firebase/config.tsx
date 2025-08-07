// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";        // If you want Firestore
// import { getAuth } from "firebase/auth";                  // If you want Auth

const firebaseConfig = {
  apiKey: "AIzaSyBZyezJBjgsj4LqnTShpZBWkHYNMX0z6uc",
  authDomain: "let-s-chat-683cc.firebaseapp.com",
  databaseURL: "https://let-s-chat-683cc-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "let-s-chat-683cc",
  storageBucket: "let-s-chat-683cc.firebasestorage.app",
  messagingSenderId: "1010103384996",
  appId: "1:1010103384996:web:d4581bb0e94767eec65f31",
  measurementId: "G-8QBPK9TL93"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const db = getFirestore(app);
// const auth = getAuth(app);

export {app, db};
