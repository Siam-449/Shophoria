
"use client";

import React from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { UserIcon } from '../../components/icons/UserIcon.jsx';

const ProfilePage = () => {
  const { user, loading, openAuthModal } = useAuth();

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-950 min-h-[60vh] flex items-center justify-center">
        <p className="text-lg text-slate-600 dark:text-slate-400">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 min-h-[60vh] flex items-center justify-center">
          <div className="text-center p-4">
              <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
              <p className="text-slate-600 dark:text-slate-400 mb-8">You need to sign in to view your profile.</p>
              <button onClick={openAuthModal} className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium">
                  Sign In
              </button>
          </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-950 py-16 sm:py-24">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 sm:p-12">
            <div className="flex flex-col items-center text-center">
                 {user.photoURL ? (
                    <img src={user.photoURL} alt="User profile" className="h-28 w-28 rounded-full border-4 border-slate-200 dark:border-slate-700" />
                ) : (
                    <div className="h-28 w-28 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center border-4 border-slate-300 dark:border-slate-600">
                        <UserIcon className="h-16 w-16 text-slate-500 dark:text-slate-400" />
                    </div>
                )}

                <h1 className="mt-6 text-3xl font-bold text-slate-800 dark:text-slate-100">{user.displayName || 'Welcome!'}</h1>
                <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">{user.email}</p>
            </div>

            <div className="mt-10 border-t border-slate-200 dark:border-slate-700 pt-8">
                <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4 text-center">Profile Details</h2>
                <div className="space-y-4">
                    <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
                        <span className="font-medium text-slate-700 dark:text-slate-300">Full Name</span>
                        <span className="text-slate-900 dark:text-slate-100">{user.displayName || 'Not Provided'}</span>
                    </div>
                     <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
                        <span className="font-medium text-slate-700 dark:text-slate-300">Email Address</span>
                        <span className="text-slate-900 dark:text-slate-100">{user.email}</span>
                    </div>
                     <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
                        <span className="font-medium text-slate-700 dark:text-slate-300">Email Verified</span>
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${user.emailVerified ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'}`}>
                            {user.emailVerified ? 'Yes' : 'No'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
