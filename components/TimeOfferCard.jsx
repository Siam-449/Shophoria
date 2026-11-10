
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext.jsx';

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

const TimeOfferCard = ({ product }) => {
  const { addItemToCart } = useCart();
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(product.expiresAt));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(product.expiresAt));
    }, 1000);

    return () => clearInterval(timer);
  }, [product.expiresAt]);

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div className="relative bg-white dark:bg-[#141414] rounded-xl sm:rounded-2xl overflow-hidden group shadow-sm hover:shadow-md border border-slate-200 dark:border-neutral-800 flex flex-col h-full transition-all">
      <div className="p-2 sm:p-3 bg-red-600 text-white text-center">
        <h4 className="font-bold text-xs sm:text-sm uppercase tracking-wide">Time Left to Order!</h4>
        <div className="flex justify-center gap-1 sm:gap-3 mt-1 sm:mt-1.5">
            {Object.keys(timeLeft).length > 0 ? (
                Object.entries(timeLeft).map(([unit, value]) => (
                    <div key={unit} className="flex flex-col items-center">
                        <span className="text-xs sm:text-base font-mono font-bold">{String(value).padStart(2, '0')}</span>
                        <span className="text-[9px] uppercase">{unit}</span>
                    </div>
                ))
            ) : (
                <span className="text-xs sm:text-sm font-bold">Offer Expired!</span>
            )}
        </div>
      </div>
      <div className="p-3 sm:p-4 flex flex-col flex-grow">
        <Link href={`/products/${product.slug}`} aria-label={`View details for ${product.name}`}>
          <div className="overflow-hidden aspect-square rounded-lg bg-slate-50 dark:bg-neutral-900 mb-3 flex items-center justify-center p-2">
              <img src={product.image} alt={product.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" />
          </div>
        </Link>
        <div className="flex flex-col flex-grow">
          <Link href={`/products/${product.slug}`} className="flex-grow">
            <h3 className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">{product.name}</h3>
            <p className="mt-1 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{product.description}</p>
          </Link>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-neutral-800/80">
            <div className="flex justify-between items-center mb-2.5">
              <div className="flex items-baseline gap-1.5 sm:gap-2">
                <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">৳{product.price.toLocaleString()}</p>
                {product.originalPrice && product.originalPrice > product.price && (
                  <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-500 line-through">৳{product.originalPrice.toLocaleString()}</p>
                )}
              </div>
               {discountPercentage && (
                <div className="bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300 text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full z-10">
                  -{discountPercentage}%
                </div>
              )}
            </div>
            <button 
              onClick={() => addItemToCart(product)}
              disabled={product.quantity <= 0 || Object.keys(timeLeft).length === 0}
              className="w-full py-2.5 px-3 bg-black dark:bg-[#1c1b1a] dark:border dark:border-neutral-700 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-800 transition-colors disabled:bg-slate-400 dark:disabled:bg-slate-700 disabled:cursor-not-allowed"
            >
              {product.quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeOfferCard;
