"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  signOut
} from 'firebase/auth';
import { auth } from '../firebase/config';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    // This effect handles the result after a user is redirected back from Google sign-in
    getRedirectResult(auth)
      .catch((error) => {
        console.error("Error processing sign-in redirect", error);
      });
      
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);
  
  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);
  
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      // We use signInWithRedirect which is more robust than a popup.
      await signInWithRedirect(auth, provider);
    } catch (error) {
      console.error("Error initiating sign in with Google redirect", error);
    }
  };

  const logOut = () => {
    signOut(auth);
  };

  const value = {
    user,
    loading,
    signInWithGoogle,
    logOut,
    isAuthModalOpen,
    openAuthModal,
    closeAuthModal
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};