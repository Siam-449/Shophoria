
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext.jsx';
import { CheckIcon } from './icons/CheckIcon.jsx';
import { Flame, Timer, ShoppingCart } from 'lucide-react';
import { motion } from 'motion/react';

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

const TimeOfferCard = ({ product }) => {
  const { addItemToCart } = useCart();
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(product.expiresAt));
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(product.expiresAt));
    }, 1000);

    return () => clearInterval(timer);
  }, [product.expiresAt]);

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const isExpired = !timeLeft || Object.keys(timeLeft).length === 0;

  const handleAddToCart = () => {
    addItemToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
      className="relative bg-white dark:bg-[#141414] rounded-xl sm:rounded-2xl overflow-hidden group shadow-sm hover:shadow-lg border border-slate-200 dark:border-neutral-800 flex flex-col h-full transition-all"
    >
      {/* Sleek Digital Clock Showcase Header */}
      <div className="bg-neutral-950 text-white p-2.5 sm:p-3 md:p-3.5 border-b border-neutral-800">
        <div className="flex items-center justify-between gap-1 mb-1.5 sm:mb-2">
          <div className="flex items-center gap-1 sm:gap-1.5 text-rose-400 font-semibold text-[10px] sm:text-xs tracking-wider uppercase truncate">
            <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-rose-500 animate-pulse shrink-0" />
            <span className="truncate">Flash Deal</span>
          </div>
          <div className="flex items-center gap-0.5 sm:gap-1 text-[9px] sm:text-[11px] text-neutral-400 font-medium shrink-0">
            <Timer className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-neutral-400" />
            <span>Ends Soon</span>
          </div>
        </div>

        {isExpired ? (
          <div className="py-1.5 text-center text-xs font-semibold text-rose-400">
            Offer Expired
          </div>
        ) : (
          <div className="flex items-center justify-center gap-0.5 sm:gap-1 md:gap-1.5 w-full">
            <div className="flex flex-col items-center flex-1 max-w-[34px] sm:max-w-[42px] md:max-w-[48px]">
              <div className="w-full h-7 sm:h-8 md:h-9 bg-neutral-900 border border-neutral-800 rounded flex items-center justify-center font-mono font-bold text-[10px] sm:text-xs md:text-sm text-white shadow-inner">
                {String(timeLeft.days ?? 0).padStart(2, '0')}
              </div>
              <span className="text-[8px] sm:text-[9px] text-neutral-400 uppercase font-medium mt-0.5">Days</span>
            </div>
            <span className="text-neutral-500 font-bold text-[10px] sm:text-xs mb-2.5 sm:mb-3 shrink-0">:</span>
            <div className="flex flex-col items-center flex-1 max-w-[34px] sm:max-w-[42px] md:max-w-[48px]">
              <div className="w-full h-7 sm:h-8 md:h-9 bg-neutral-900 border border-neutral-800 rounded flex items-center justify-center font-mono font-bold text-[10px] sm:text-xs md:text-sm text-white shadow-inner">
                {String(timeLeft.hours ?? 0).padStart(2, '0')}
              </div>
              <span className="text-[8px] sm:text-[9px] text-neutral-400 uppercase font-medium mt-0.5">Hours</span>
            </div>
            <span className="text-neutral-500 font-bold text-[10px] sm:text-xs mb-2.5 sm:mb-3 shrink-0">:</span>
            <div className="flex flex-col items-center flex-1 max-w-[34px] sm:max-w-[42px] md:max-w-[48px]">
              <div className="w-full h-7 sm:h-8 md:h-9 bg-neutral-900 border border-neutral-800 rounded flex items-center justify-center font-mono font-bold text-[10px] sm:text-xs md:text-sm text-white shadow-inner">
                {String(timeLeft.minutes ?? 0).padStart(2, '0')}
              </div>
              <span className="text-[8px] sm:text-[9px] text-neutral-400 uppercase font-medium mt-0.5">Mins</span>
            </div>
            <span className="text-neutral-500 font-bold text-[10px] sm:text-xs mb-2.5 sm:mb-3 shrink-0">:</span>
            <div className="flex flex-col items-center flex-1 max-w-[34px] sm:max-w-[42px] md:max-w-[48px]">
              <div className="w-full h-7 sm:h-8 md:h-9 bg-neutral-900 border border-rose-500/40 rounded flex items-center justify-center font-mono font-bold text-[10px] sm:text-xs md:text-sm text-rose-400 shadow-inner">
                {String(timeLeft.seconds ?? 0).padStart(2, '0')}
              </div>
              <span className="text-[8px] sm:text-[9px] text-rose-400 uppercase font-medium mt-0.5">Secs</span>
            </div>
          </div>
        )}
      </div>

      {/* Product Card Body */}
      <div className="p-2.5 sm:p-3.5 md:p-4 flex flex-col flex-grow">
        <Link href={`/products/${product.slug}`} aria-label={`View details for ${product.name}`}>
          <div className="overflow-hidden aspect-square rounded-lg bg-slate-50 dark:bg-neutral-900 mb-2 sm:mb-3 flex items-center justify-center p-1.5 sm:p-2 relative">
            {discountPercentage && (
              <div className="absolute top-2 right-2 bg-rose-600 text-white text-[9px] sm:text-[10px] md:text-xs font-bold px-1.5 sm:px-2 py-0.5 rounded-full shadow-md z-10">
                -{discountPercentage}%
              </div>
            )}
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </Link>
        <div className="flex flex-col flex-grow">
          <Link href={`/products/${product.slug}`} className="flex-grow">
            <h3 className="text-[11px] sm:text-xs md:text-sm font-semibold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 leading-tight">
              {product.name}
            </h3>
            <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-[11px] md:text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
              {product.description}
            </p>
          </Link>
          <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-slate-100 dark:border-neutral-800/80">
            <div className="flex flex-wrap sm:flex-nowrap justify-between items-baseline gap-1 mb-2 sm:mb-2.5">
              <div className="flex items-baseline gap-1 sm:gap-1.5">
                <p className="text-xs sm:text-sm md:text-base font-bold text-slate-900 dark:text-slate-100">
                  ৳{product.price.toLocaleString()}
                </p>
                {product.originalPrice && product.originalPrice > product.price && (
                  <p className="text-[10px] sm:text-xs md:text-sm text-slate-400 dark:text-slate-500 line-through">
                    ৳{product.originalPrice.toLocaleString()}
                  </p>
                )}
              </div>
              <p className={`text-[9px] sm:text-[10px] md:text-xs font-semibold ${product.quantity > 5 ? 'text-green-600 dark:text-green-400' : product.quantity > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'}`}>
                {product.quantity > 0 ? 'In Stock' : 'Out of Stock'}
              </p>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={product.quantity <= 0 || isExpired || isAdded}
              className={`w-full py-2 sm:py-2.5 px-2 sm:px-3 text-white text-[11px] sm:text-xs md:text-sm font-medium rounded-lg transition-colors duration-300 flex items-center justify-center gap-1 sm:gap-1.5 ${
                isAdded
                  ? 'bg-green-600 text-white'
                  : 'bg-black dark:bg-[#1c1b1a] dark:border dark:border-neutral-700 text-white hover:bg-neutral-800 dark:hover:bg-neutral-800'
              } disabled:bg-slate-400 dark:disabled:bg-slate-700 disabled:cursor-not-allowed`}
            >
              {isAdded ? (
                <>
                  <CheckIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Added!
                </>
              ) : product.quantity > 0 && !isExpired ? (
                <>
                  <ShoppingCart className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Add to Cart
                </>
              ) : (
                'Out of Stock'
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TimeOfferCard;

