import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBCKpZR1GzlF6vL4160hkCWYsZmq7EGnnI",
    authDomain: "myezjobs.firebaseapp.com",
    projectId: "myezjobs",
    storageBucket: "myezjobs.appspot.com",
    messagingSenderId: "513283961596",
    appId: "1:513283961596:web:577bfe13aa675145e19d79",
    measurementId: "G-W874RDX1JT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Firestore
const db = getFirestore(app); // 👈 Add this

// Exports
export { auth, googleProvider, db }; // 👈 Export db too
