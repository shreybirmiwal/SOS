import React, { useState, useEffect } from 'react';
import 'tailwindcss/tailwind.css';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { updateDoc } from 'firebase/firestore';
import { db } from './firebase';

function App() {
  const uid = new URLSearchParams(window.location.search).get('uid');

  const [contact, setContact] = useState('');
  const [savedContact, setSavedContact] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch existing contact if it exists
    if (uid) {
      const fetchContact = async () => {
        setLoading(true);
        const docRef = doc(db, 'users', uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setSavedContact(data.emergencyContacts ? data.emergencyContacts[0] : null);
        }
        setLoading(false);
      };
      fetchContact();
    }
  }, [uid]);

  const handleSaveContact = async () => {
    if (!contact || !uid) return;

    try {
      const userRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        // If user document exists, update it
        await updateDoc(userRef, {
          emergencyContacts: [contact],
        });
      } else {
        // If user document does not exist, create it
        await setDoc(userRef, {
          emergencyContacts: [contact],
        });
      }

      setSavedContact(contact);
      setContact('');
    } catch (error) {
      console.error("Error saving emergency contact:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 space-y-4">
        <h1 className="text-3xl font-bold text-center text-gray-800">SOS - Emergency Contact Setup</h1>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          <div>
            {savedContact ? (
              <div className="text-center">
                <p className="text-gray-600">Your emergency contact:</p>
                <p className="text-lg font-semibold text-gray-800">{savedContact}</p>
              </div>
            ) : (
              <p className="text-center text-gray-500">No emergency contact saved yet.</p>
            )}

            <div className="mt-4">
              <label htmlFor="contact" className="block text-sm font-medium text-gray-700">
                Emergency Contact Phone Number
              </label>
              <input
                type="text"
                id="contact"
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter phone number"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
              />
            </div>

            <button
              className="mt-6 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition"
              onClick={handleSaveContact}
            >
              Save Contact
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
