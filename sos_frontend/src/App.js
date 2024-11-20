import React, { useState, useEffect } from 'react';
import 'tailwindcss/tailwind.css';
import { doc, getDoc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';

function App() {
  const uid = new URLSearchParams(window.location.search).get('uid');
  const [contact, setContact] = useState('');
  const [savedContact, setSavedContact] = useState(null);
  const [loading, setLoading] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);

  useEffect(() => {
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
    if (!contact || !uid || !consentChecked || !termsChecked) return;

    // Validate US phone number (10 digits only)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(contact)) {
      alert('Please enter a valid 10-digit US phone number (e.g., 5125551234)');
      return;
    }

    try {
      const userRef = doc(db, 'users', uid);
      const timestamp = new Date().toISOString();

      const consentData = {
        emergencyContacts: [contact],
        consentTimestamp: timestamp,
        consentType: 'SMS emergency alerts',
        termsAccepted: true
      };

      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        await updateDoc(userRef, consentData);
      } else {
        await setDoc(userRef, consentData);
      }

      setSavedContact(contact);
      setContact('');
    } catch (error) {
      console.error("Error saving emergency contact:", error);
    }
  };

  const handleRemoveContact = async () => {
    if (!uid) return;
    try {
      const userRef = doc(db, 'users', uid);
      await deleteDoc(userRef);
      setSavedContact(null);
    } catch (error) {
      console.error("Error removing emergency contact:", error);
    }
  };

  // Format phone number input to remove any non-digit characters
  const handlePhoneChange = (e) => {
    const cleaned = e.target.value.replace(/\D/g, '');
    setContact(cleaned.slice(0, 10)); // Limit to 10 digits
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 space-y-4">
        <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800">SOS - Emergency Contact Setup</h1>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          <div className="space-y-4">
            {savedContact && (
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-600">Your emergency contact:</p>
                <p className="text-lg font-semibold text-gray-800">{savedContact}</p>
                <button
                  onClick={handleRemoveContact}
                  className="mt-4 w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition text-sm"
                >
                  Unsubscribe from Emergency Alerts
                </button>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="contact" className="block text-sm font-medium text-gray-700">
                  Emergency Contact Phone Number (US Number ONLY)
                </label>
                <input
                  type="tel"
                  id="contact"
                  className="mt-1 p-3 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-base"
                  placeholder="5125551234"
                  value={contact}
                  onChange={handlePhoneChange}
                  maxLength="10"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="consent"
                    className="mt-1 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    checked={consentChecked}
                    onChange={(e) => setConsentChecked(e.target.checked)}
                  />
                  <label htmlFor="consent" className="ml-2 text-sm text-gray-600">
                    I agree to receive emergency notifications from Omi when {savedContact || '[Contact Name]'} activates an SOS alert
                  </label>
                </div>

                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="terms"
                    className="mt-1 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    checked={termsChecked}
                    onChange={(e) => setTermsChecked(e.target.checked)}
                  />
                  <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                    I have read and agree to the Privacy Policy and Terms of Service
                  </label>
                </div>
              </div>

              <button
                className={`w-full py-3 px-4 rounded-md transition text-white ${consentChecked && termsChecked
                  ? 'bg-indigo-600 hover:bg-indigo-700'
                  : 'bg-gray-400 cursor-not-allowed'
                  }`}
                onClick={handleSaveContact}
                disabled={!consentChecked || !termsChecked}
              >
                Save Contact
              </button>

              <div className="text-xs text-gray-500 mt-4 space-y-2">
                <p>By signing up, you agree to receive emergency SMS alerts. Message and data rates may apply.</p>
                <p>To opt-out at any time, click the "Unsubscribe" button above or reply STOP to any message.</p>
                <p>For help, reply HELP or contact support@omi.com</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;