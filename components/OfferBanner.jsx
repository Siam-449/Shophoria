"use client";

import React, { useState, useEffect } from 'react';
import { getOfferMessage } from '../lib/firebase';

const OfferBanner = () => {
  const [offerText, setOfferText] = useState("");
  const [loading, setLoading] = useState(true);
  const defaultMessage = "Buy 2 Or More Products Together And Get Delivery Charge Free In Whole Bangladesh.";

  useEffect(() => {
    const fetchMessage = async () => {
      setLoading(true);
      const message = await getOfferMessage();
      setOfferText(message || defaultMessage);
      setLoading(false);
    };

    fetchMessage();
  }, []);

  if (loading) {
    return (
       <div className="bg-black dark:bg-white py-2.5 text-sm font-medium overflow-hidden">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="h-5 bg-gray-700 dark:bg-gray-300 rounded w-3/4 mx-auto animate-pulse"></div>
          </div>
      </div>
    );
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