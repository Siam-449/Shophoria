"use client";

import React, { useState, useEffect, useRef } from 'react';
import { getOfferMessage } from '../lib/firebase';

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

  if (!notice) return null;

  return (
    <div className="lg:hidden bg-black text-[#fca5a5] py-1.5 px-5 text-sm font-medium overflow-hidden whitespace-nowrap" ref={noticeRef}>
      <div className="animate-marquee inline-block">
        {notice}
      </div>
    </div>
  );
};

export default NoticeBanner;
