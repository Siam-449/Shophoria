"use client";

import React from 'react';

const OfferBanner = () => {
  const offerText = "Buy 2 Or More Products Together And Get Delivery Charge Free In Whole Bangladesh.";

  return (
    <div className="bg-black dark:bg-white text-white dark:text-black py-2.5 text-sm font-medium overflow-hidden">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile Marquee */}
        <div className="lg:hidden relative h-5 flex items-center">
           <p className="animate-marquee">{offerText}</p>
        </div>
        {/* Desktop Centered Text */}
        <div className="hidden lg:block text-center">
          <p>{offerText}</p>
        </div>
      </div>
    </div>
  );
};

export default OfferBanner;
