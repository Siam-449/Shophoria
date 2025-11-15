"use client";

import React, { useState, useEffect } from 'react';
import { getOfferMessage } from '../lib/firebase';

const OfferBanner = () => {
  const [offerText, setOfferText] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessage = async () => {
      setLoading(true);
      const message = await getOfferMessage();
      setOfferText(message);
      setLoading(false);
    };

    fetchMessage();
  }, []);

  if (loading || !offerText) {
    return null; // Render nothing if loading or no message
  }

  return (
    <div className="bg-black dark:bg-white text-white dark:text-black py-2.5 text-sm font-medium overflow-hidden">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile Marquee */}
        <div className="lg:hidden relative h-5 flex items-center">
           <p className="animate-marquee">{offerText}</p>
        </div>
        {/* Desktop Centered Text */}
        <div className="hidden lg:block text-center">
          <p className="animate-text-gradient">{offerText}</p>
        </div>
      </div>
    </div>
  );
};

export default OfferBanner;