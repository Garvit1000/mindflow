import React, { createContext, useState, useContext, useEffect } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as firebaseSignOut } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      try {
        if (user) {
          // Check if user has completed setup
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({ ...user, ...userData });
            setIsNewUser(!userData.setupCompleted);
          } else {
            setUser(user);
            setIsNewUser(true);
          }
        } else {
          setUser(null);
          setIsNewUser(false);
        }
      } catch (error) {
        console.error('Auth state change error:', error);
        setUser(null);
        setIsNewUser(false);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const signup = async (email, password, username) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Create a user document in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email,
        name: username,
        displayName: username,
        createdAt: new Date(),
        setupCompleted: false,
      });
      setIsNewUser(true);
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      throw error;
    }
  };

  const updateUserData = async (userId, data) => {
    try {
      await setDoc(doc(db, 'users', userId), data, { merge: true });
    } catch (error) {
      throw error;
    }
  };

  const completeSetup = async (userId) => {
    try {
      await setDoc(doc(db, 'users', userId), { setupCompleted: true }, { merge: true });
      setIsNewUser(false);
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    isNewUser,
    signup,
    login,
    signOut,
    updateUserData,
    completeSetup,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
