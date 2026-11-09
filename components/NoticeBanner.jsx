"use client";

import React, { useState, useEffect, useRef } from 'react';
import { getOfferMessage } from '../lib/firebase';

import { motion, AnimatePresence } from 'motion/react';

const NoticeBanner = () => {
  const [notice, setNotice] = useState(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const noticeRef = useRef(null);

  useEffect(() => {
    getOfferMessage().then(setNotice);
  }, []);

  useEffect(() => {
    if (notice && noticeRef.current) {
      setIsOverflowing(noticeRef.current.scrollWidth > noticeRef.current.clientWidth);
    }
  }, [notice]);

  return (
    <AnimatePresence>
      {notice && (
        <motion.div 
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="marquee-container lg:hidden bg-black text-[#fca5a5] text-sm font-medium whitespace-nowrap overflow-hidden"
        >
          <div className="py-1.5 px-5" ref={noticeRef}>
            <div className="animate-marquee inline-block">
              {notice}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NoticeBanner;
