"use client";

import React, { useState, useEffect } from 'react';
import { getOfferMessage } from '../lib/firebase';

import { motion, AnimatePresence } from 'motion/react';

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

  return (
    <AnimatePresence>
      {!loading && offerText && (
        <motion.div 
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="marquee-container lg:hidden bg-black dark:bg-white text-white dark:text-black text-sm font-medium overflow-hidden"
        >
          <div className="py-2.5 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Mobile Marquee */}
            <div className="lg:hidden relative h-5 flex items-center">
               <p className="animate-marquee">{offerText}</p>
            </div>
            {/* Desktop Centered Text */}
            <div className="hidden lg:block text-center">
              <p className="animate-text-gradient">{offerText}</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OfferBanner;