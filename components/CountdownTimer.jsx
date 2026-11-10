
"use client";

import React, { useState, useEffect } from 'react';
import { Flame, Timer } from 'lucide-react';

const calculateTimeLeft = (expiresAt) => {
  if (!expiresAt) return {};
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

  const isExpired = !timeLeft || Object.keys(timeLeft).length === 0;

  return (
    <div className="w-full bg-neutral-950 text-white px-3 py-2.5 sm:px-4 sm:py-3 border-b border-neutral-800/80">
      <div className="flex items-center justify-between gap-1 mb-2">
        <div className="flex items-center gap-1.5 text-rose-400 font-semibold text-[11px] sm:text-xs tracking-wider uppercase">
          <Flame className="w-3.5 h-3.5 fill-rose-500 animate-pulse flex-shrink-0" />
          <span>Flash Sale Offer</span>
        </div>
        <div className="flex items-center gap-1 text-[10px] sm:text-xs text-neutral-400 font-medium">
          <Timer className="w-3 h-3 text-neutral-400 flex-shrink-0" />
          <span>Limited Time</span>
        </div>
      </div>

      {isExpired ? (
        <div className="text-center py-1.5 text-xs font-semibold text-rose-400">Offer Expired</div>
      ) : (
        <div className="flex items-center justify-center gap-1.5 sm:gap-2.5">
          <div className="flex flex-col items-center">
            <div className="w-9 h-8 sm:w-12 sm:h-9 bg-neutral-900 border border-neutral-800 rounded-md flex items-center justify-center font-mono font-bold text-xs sm:text-sm text-white shadow-inner">
              {String(timeLeft.days ?? 0).padStart(2, '0')}
            </div>
            <span className="text-[9px] text-neutral-400 uppercase font-medium mt-1">Days</span>
          </div>
          <span className="text-neutral-500 font-bold text-xs mb-3.5">:</span>
          <div className="flex flex-col items-center">
            <div className="w-9 h-8 sm:w-12 sm:h-9 bg-neutral-900 border border-neutral-800 rounded-md flex items-center justify-center font-mono font-bold text-xs sm:text-sm text-white shadow-inner">
              {String(timeLeft.hours ?? 0).padStart(2, '0')}
            </div>
            <span className="text-[9px] text-neutral-400 uppercase font-medium mt-1">Hours</span>
          </div>
          <span className="text-neutral-500 font-bold text-xs mb-3.5">:</span>
          <div className="flex flex-col items-center">
            <div className="w-9 h-8 sm:w-12 sm:h-9 bg-neutral-900 border border-neutral-800 rounded-md flex items-center justify-center font-mono font-bold text-xs sm:text-sm text-white shadow-inner">
              {String(timeLeft.minutes ?? 0).padStart(2, '0')}
            </div>
            <span className="text-[9px] text-neutral-400 uppercase font-medium mt-1">Mins</span>
          </div>
          <span className="text-neutral-500 font-bold text-xs mb-3.5">:</span>
          <div className="flex flex-col items-center">
            <div className="w-9 h-8 sm:w-12 sm:h-9 bg-neutral-900 border border-rose-500/40 rounded-md flex items-center justify-center font-mono font-bold text-xs sm:text-sm text-rose-400 shadow-inner">
              {String(timeLeft.seconds ?? 0).padStart(2, '0')}
            </div>
            <span className="text-[9px] text-rose-400 uppercase font-medium mt-1">Secs</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CountdownTimer;