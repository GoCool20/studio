// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD8rXBa-mwJxJE90dYJ2-n2xwF2UHmliY8",
  authDomain: "devfolio-3aee7.firebaseapp.com",
  projectId: "devfolio-3aee7",
  storageBucket: "devfolio-3aee7.firebasestorage.app",
  messagingSenderId: "377224569806",
  appId: "1:377224569806:web:357d2f704ab9cef41c819f",
  measurementId: "G-DZ7HE9524B"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const firestore = getFirestore(app);
const analytics = isSupported().then(yes => yes ? getAnalytics(app) : null);

export { app, auth, firestore, analytics };
