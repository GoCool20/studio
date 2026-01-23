import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyC5...<redacted>",
    authDomain: "devfolio-f3a74.firebaseapp.com",
    projectId: "devfolio-f3a74",
    storageBucket: "devfolio-f3a74.appspot.com",
    messagingSenderId: "100...<redacted>",
    appId: "1:100...<redacted>",
    measurementId: "G-C...<redacted>"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const firestore = getFirestore(app);

export { app, auth, firestore };
