"use client";

import React, { useState, useEffect } from 'react';
import { subscribeToMaintenanceMode } from '../lib/firebase.js';

// Helper to detect if the user agent is Googlebot
const isGoogleBot = () => {
  if (typeof window === 'undefined') {
    return false;
  }
  const userAgent = window.navigator.userAgent;
  return /Googlebot/i.test(userAgent);
};

const MaintenanceGuard = ({ children }) => {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [isBypassed, setIsBypassed] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check query params for admin/bypass
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'true' || params.get('bypass') === 'true') {
      localStorage.setItem('isAdmin', 'true');
      setIsBypassed(true);
    }

    // Check localStorage for admin status
    if (
      localStorage.getItem('isAdmin') === 'true' ||
      localStorage.getItem('admin') === 'true' ||
      localStorage.getItem('shophoria_admin') === 'true'
    ) {
      setIsBypassed(true);
    }

    // Check if localhost or sandbox / preview domains
    const hostname = window.location.hostname;
    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '0.0.0.0' ||
      hostname.includes('run.app') ||
      hostname.includes('sandbox') ||
      hostname.includes('preview') ||
      hostname.includes('webcontainer') ||
      hostname.includes('gitpod') ||
      hostname.includes('stackblitz')
    ) {
      setIsBypassed(true);
    }

    if (isGoogleBot()) {
      return;
    }

    const unsubscribe = subscribeToMaintenanceMode((isEnabled) => {
      setMaintenanceMode(isEnabled);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleAdminBypass = () => {
    localStorage.setItem('isAdmin', 'true');
    setIsBypassed(true);
    window.location.reload();
  };

  if (maintenanceMode && !isBypassed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 px-4">
        <div className="text-center max-w-lg p-8 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto text-indigo-500 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
             <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
             <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
           </svg>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-slate-100 mb-4">
            We'll be back soon!
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
            Our website is currently down for scheduled maintenance. We apologize for any inconvenience and appreciate your patience.
          </p>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 mb-6">
            <div className="bg-indigo-600 h-2.5 rounded-full w-3/4 animate-pulse"></div>
          </div>
          <button
            onClick={handleAdminBypass}
            className="text-xs text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors underline"
          >
            Admin / Developer Bypass
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default MaintenanceGuard;
