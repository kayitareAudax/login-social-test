import { initializeApp } from 'firebase/app'
import { getStorage } from 'firebase/storage'
// Initialize Firebase
const app = initializeApp({
    apiKey: 'AIzaSyB_8zD4lZnEYCvXw2XB2X_p-WfrSiW3UyU',
    authDomain: 'nitrility-370613.firebaseapp.com',
    projectId: 'nitrility-370613',
    storageBucket: 'nitrility-370613.appspot.com',
    messagingSenderId: '118831700689',
    appId: '1:118831700689:web:6edf3af23a86a036ddc3f0',
    measurementId: 'G-K0DYT0EXX0',
})
// Firebase storage reference
const storage = getStorage(app)
export default storage
