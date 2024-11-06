// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDLdPMsAfx4uM-l_oHkhaPr5NKNAqcaypw",
    authDomain: "sos-omi.firebaseapp.com",
    projectId: "sos-omi",
    storageBucket: "sos-omi.firebasestorage.app",
    messagingSenderId: "567413138464",
    appId: "1:567413138464:web:76d142cbe63c5241d5c845"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
