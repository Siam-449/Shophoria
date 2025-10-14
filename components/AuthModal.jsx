"use client";

import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { CloseIcon } from './icons/CloseIcon.jsx';
import { GoogleIcon } from './icons/GoogleIcon.jsx';

const AuthModal = () => {
  const { isAuthModalOpen, closeAuthModal, signInWithGoogle } = useAuth();

  if (!isAuthModalOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-60 z-[60] transition-opacity duration-300"
        onClick={closeAuthModal}
        aria-hidden="true"
      />
      {/* Modal */}
      <div
        className="fixed inset-0 z-[70] flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
      >
        <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-lg shadow-xl p-8 transform transition-all duration-300 ease-in-out scale-100">
          <button onClick={closeAuthModal} className="absolute top-4 right-4 p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white" aria-label="Close authentication modal">
            <CloseIcon className="h-6 w-6" />
          </button>
          <div className="text-center">
            <h2 id="auth-modal-title" className="text-2xl font-bold text-slate-800 dark:text-white">Sign In Required</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400">Please sign in to continue with your order.</p>
            <div className="mt-8">
               <button 
                  onClick={signInWithGoogle}
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-900"
               >
                  <GoogleIcon className="h-5 w-5" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Sign in with Google</span>
               </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthModal;
