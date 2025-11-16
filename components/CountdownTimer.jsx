
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

  return (
    <div className="p-3 bg-red-600 text-white text-center">
      <h4 className="font-bold text-lg">Time Left to Order!</h4>
      <div className="flex justify-center gap-3 mt-2">
        {Object.keys(timeLeft).length > 0 ? (
          Object.entries(timeLeft).map(([unit, value]) => (
            <div key={unit} className="flex flex-col items-center">
              <span className="text-xl font-mono font-bold">{String(value).padStart(2, '0')}</span>
              <span className="text-xs uppercase">{unit}</span>
            </div>
          ))
        ) : (
          <span className="text-lg font-bold">Offer Expired!</span>
        )}
      </div>
    </div>
  );
};

export default CountdownTimer;