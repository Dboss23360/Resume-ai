import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyBCkpZR16lF6vL4166hCWYsZmq7EGnnI",
    authDomain: "myezjobs.firebaseapp.com",
    projectId: "myezjobs",
    storageBucket: "myezjobs.appspot.com",
    messagingSenderId: "513283961596",
    appId: "1:513283961596:web:3f42a84714d9d6e19d79"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };