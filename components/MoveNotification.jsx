
"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { CloseIcon } from './icons/CloseIcon';

const MoveNotification = () => {
  const searchParams = useSearchParams();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show notification if 'moved=true' is in the URL
    if (searchParams.get('moved') === 'true') {
      setIsVisible(true);
      // Automatically hide after 8 seconds
      const timer = setTimeout(() => setIsVisible(false), 8000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] max-w-sm w-full animate-bounce-in">
      <div className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 p-4 rounded-xl shadow-2xl border border-slate-700 dark:border-slate-200">
        <div className="flex justify-between items-start">
          <div className="flex gap-3">
            <div className="bg-green-500 rounded-full p-1 h-fit mt-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-sm">Welcome to our new home!</p>
              <p className="text-xs text-slate-300 dark:text-slate-500 mt-1">
                You've been redirected to our official domain: <span className="font-semibold text-white dark:text-slate-900">shophoriabd.com</span>.
              </p>
            </div>
          </div>
          <button 
            onClick={() => setIsVisible(false)}
            className="text-slate-400 hover:text-white dark:hover:text-slate-900 p-1"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
      <style jsx>{`
        @keyframes bounce-in {
          0% { transform: translateY(100px); opacity: 0; }
          70% { transform: translateY(-5px); }
          100% { transform: translateY(0); opacity: 1; }
        }
        .animate-bounce-in {
          animation: bounce-in 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
      `}</style>
    </div>
  );
};

export default MoveNotification;
