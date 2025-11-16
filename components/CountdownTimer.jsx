
"use client";

import React, { useState, useEffect } from 'react';

const calculateTimeLeft = (expiresAt) => {
  const difference = +new Date(expiresAt) - +new Date();
  let timeLeft = {};

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }
  return timeLeft;
};

const CountdownTimer = ({ expiresAt }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(expiresAt));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(expiresAt));
    }, 1000);
    return () => clearInterval(timer);
  }, [expiresAt]);

  if (Object.keys(timeLeft).length === 0) {
    return <div className="text-center p-3 bg-slate-200 dark:bg-slate-800 text-red-600 dark:text-red-400 font-bold rounded-lg">Offer Expired!</div>;
  }

  return (
    <div className="p-3 bg-red-600 text-white text-center rounded-lg shadow-lg">
      <h4 className="font-bold text-base mb-2">Time Left to Order!</h4>
      <div className="flex justify-center gap-2 sm:gap-3">
        {Object.entries(timeLeft).map(([unit, value]) => (
          <div key={unit} className="flex flex-col items-center">
            <span className="text-xl font-mono font-bold">{String(value).padStart(2, '0')}</span>
            <span className="text-xs uppercase">{unit}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CountdownTimer;
