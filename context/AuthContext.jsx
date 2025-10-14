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
    // This combined effect handles both the initial auth state and the redirect result.
    setLoading(true);

    // First, process the potential redirect result from Google Sign-In.
    getRedirectResult(auth)
      .then((result) => {
        if (result) {
          // This confirms the redirect was processed successfully.
          console.log("✅ Sign-in redirect result successful:", result);
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          console.log("OAuth Access Token:", token);
          console.log("User from Redirect:", result.user);
        }
      })
      .catch((error) => {
        // This is the most important part for debugging.
        // It will catch errors if Firebase fails to create the user on the backend.
        console.error("🚨 CRITICAL ERROR from getRedirectResult:", error);
        console.error("Error Code:", error.code);
        console.error("Error Message:", error.message);
      });

    // Set up the listener for auth state changes. This is the source of truth for the UI.
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("Auth state changed. Current user:", currentUser);
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  
  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);
  
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithRedirect(auth, provider);
    } catch (error) {
      console.error("Error initiating sign-in with Google redirect:", error);
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
