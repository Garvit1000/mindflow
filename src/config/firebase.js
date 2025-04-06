import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCzFbDhwQvcNXI-XCMGgzUCOvuGUfpvkDg",
  authDomain: "scanner-90445.firebaseapp.com",
  projectId: "scanner-90445",
  storageBucket: "scanner-90445.firebasestorage.app",
  messagingSenderId: "1078770639893",
  appId: "1:1078770639893:web:b80abb01b910c304b95a1c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
