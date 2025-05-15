import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyBCKpZR1GzlF6vL4160hkCWYsZmq7EGnnI",
    authDomain: "myezjobs.firebaseapp.com",
    projectId: "myezjobs",
    storageBucket: "myezjobs.firebasestorage.app",
    messagingSenderId: "513283961596",
    appId: "1:513283961596:web:577bfe13aa675145e19d79",
    measurementId: "G-W874RDX1JT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };