const firebase = require("firebase");
const firebaseConfig = {
    apiKey: "AIzaSyDLdPMsAfx4uM-l_oHkhaPr5NKNAqcaypw",
    authDomain: "sos-omi.firebaseapp.com",
    projectId: "sos-omi",
    storageBucket: "sos-omi.firebasestorage.app",
    messagingSenderId: "567413138464",
    appId: "1:567413138464:web:76d142cbe63c5241d5c845"
};


firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const User = db.collection("users");
module.exports = User;