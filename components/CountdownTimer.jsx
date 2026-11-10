
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
    <div className="bg-neutral-950 text-white p-2.5 sm:p-4 rounded-t-xl border-b border-neutral-800">
      <div className="flex items-center justify-between gap-1 mb-1.5 sm:mb-2.5">
        <div className="flex items-center gap-1 sm:gap-1.5 text-rose-400 font-semibold text-[10px] sm:text-xs tracking-wider uppercase">
          <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-rose-500 animate-pulse" />
          <span>Flash Sale Offer</span>
        </div>
        <div className="flex items-center gap-1 text-[9px] sm:text-[11px] text-neutral-400 font-medium">
          <Timer className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-neutral-400" />
          <span>Limited Time</span>
        </div>
      </div>

      {isExpired ? (
        <div className="text-center py-2 text-xs font-semibold text-rose-400">Offer Expired</div>
      ) : (
        <div className="flex items-center justify-center gap-1 sm:gap-2.5">
          <div className="flex flex-col items-center">
            <div className="w-8 h-7.5 sm:w-11 sm:h-9 bg-neutral-900 border border-neutral-800 rounded flex items-center justify-center font-mono font-bold text-[11px] sm:text-sm text-white shadow-inner">
              {String(timeLeft.days ?? 0).padStart(2, '0')}
            </div>
            <span className="text-[8px] sm:text-[9px] text-neutral-400 uppercase font-medium mt-0.5">Days</span>
          </div>
          <span className="text-neutral-500 font-bold text-[10px] sm:text-xs mb-2 sm:mb-3">:</span>
          <div className="flex flex-col items-center">
            <div className="w-8 h-7.5 sm:w-11 sm:h-9 bg-neutral-900 border border-neutral-800 rounded flex items-center justify-center font-mono font-bold text-[11px] sm:text-sm text-white shadow-inner">
              {String(timeLeft.hours ?? 0).padStart(2, '0')}
            </div>
            <span className="text-[9px] text-neutral-400 uppercase font-medium mt-1">Hours</span>
          </div>
          <span className="text-neutral-500 font-bold text-xs mb-3">:</span>
          <div className="flex flex-col items-center">
            <div className="w-9 h-8 sm:w-11 sm:h-9 bg-neutral-900 border border-neutral-800 rounded-md flex items-center justify-center font-mono font-bold text-xs sm:text-sm text-white shadow-inner">
              {String(timeLeft.minutes ?? 0).padStart(2, '0')}
            </div>
            <span className="text-[9px] text-neutral-400 uppercase font-medium mt-1">Mins</span>
          </div>
          <span className="text-neutral-500 font-bold text-xs mb-3">:</span>
          <div className="flex flex-col items-center">
            <div className="w-9 h-8 sm:w-11 sm:h-9 bg-neutral-900 border border-rose-500/40 rounded-md flex items-center justify-center font-mono font-bold text-xs sm:text-sm text-rose-400 shadow-inner">
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