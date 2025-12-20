
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
    <div className="relative bg-white dark:bg-slate-900 rounded-lg overflow-hidden group shadow-md border border-slate-200 dark:border-slate-800 flex flex-col">
      <div className="p-3 bg-red-600 text-white text-center">
        <h4 className="font-bold text-lg">Time Left to Order!</h4>
        <div className="flex justify-center gap-3 mt-2">
            {Object.keys(timeLeft).length > 0 ? (
                Object.entries(timeLeft).map(([unit, value]) => (
                    <div key={unit} className="flex flex-col items-center">
                        <span className="text-xl font-mono font-bold">{String(value).padStart(2, '0')}</span>
                        <span className="text-xs uppercase">{unit}</span>
                    </div>
                ))
            ) : (
                <span className="text-lg font-bold">Offer Expired!</span>
            )}
        </div>
      </div>
      <Link href={`/products/${product.slug}`} aria-label={`View details for ${product.name}`}>
        <div className="overflow-hidden aspect-square">
            <img src={product.image} alt={product.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" />
        </div>
      </Link>
      <div className="p-3 flex flex-col flex-grow">
        <Link href={`/products/${product.slug}`} className="flex-grow">
          <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">{product.name}</h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{product.description}</p>
        </Link>
        <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex justify-between items-center">
            <div className="flex items-baseline gap-2">
              <p className="text-base font-bold text-slate-900 dark:text-slate-100">৳{product.price.toLocaleString()}</p>
              {product.originalPrice && product.originalPrice > product.price && (
                <p className="text-sm text-slate-500 dark:text-slate-400 line-through">৳{product.originalPrice.toLocaleString()}</p>
              )}
            </div>
             {discountPercentage && (
              <div className="bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300 text-xs font-bold px-2 py-1 rounded-full z-10">
                -{discountPercentage}%
              </div>
            )}
          </div>
          <button 
            onClick={() => addItemToCart(product)}
            disabled={product.quantity <= 0 || Object.keys(timeLeft).length === 0}
            className="w-full mt-2 px-3 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition-colors disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed"
          >
            {product.quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimeOfferCard;
