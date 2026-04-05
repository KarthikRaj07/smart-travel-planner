// Firebase Client SDK Configuration
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAAyDeG2776YudwUm46eYD6Mh52mPZRfHg',
  authDomain: 'smart-travel-planner-23860.firebaseapp.com',
  projectId: 'smart-travel-planner-23860',
  storageBucket: 'smart-travel-planner-23860.firebasestorage.app',
  messagingSenderId: '830352792596',
  appId: '1:830352792596:web:c9c307fd49ecf0d07d5b01',
  measurementId: 'G-0RDTQVJ0C6',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
