
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext.jsx';
import CountdownTimer from './CountdownTimer.jsx';
import { CheckIcon } from './icons/CheckIcon.jsx';

const ProductCard = ({ product }) => {
  const { addItemToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  
  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const handleAddToCart = () => {
    addItemToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <div className="relative bg-white dark:bg-slate-900 rounded-lg overflow-hidden group shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col">
      {discountPercentage && (
        <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
          -{discountPercentage}%
        </div>
      )}
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
            <p className={`text-xs font-semibold ${product.quantity > 5 ? 'text-green-600 dark:text-green-400' : product.quantity > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'}`}>
              {product.quantity > 0 ? 'In Stock' : 'Out of Stock'}
            </p>
          </div>
          <button 
            onClick={handleAddToCart}
            disabled={product.quantity <= 0 || isAdded}
            className={`w-full mt-2 px-3 py-2 text-white text-sm rounded-md transition-colors duration-300 ${
              isAdded 
              ? 'bg-green-500 dark:bg-green-600' 
              : 'bg-indigo-600 hover:bg-indigo-700'
            } disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed`}
          >
            {isAdded ? (
                <span className="flex items-center justify-center gap-2">
                    <CheckIcon className="h-4 w-4" /> Added!
                </span>
            ) : product.quantity > 0 ? (
                'Add to Cart'
            ) : (
                'Out of Stock'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

export const ProductDetailClient = ({ product }) => {
    const { addItemToCart } = useCart();
    const [isAdded, setIsAdded] = useState(false);
    
    const discountPercentage = product.originalPrice
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

    const handleAddToCart = () => {
      addItemToCart(product);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    };

    return (
        <div className="bg-white dark:bg-slate-950 py-12 sm:py-16">
            <main className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="bg-white dark:bg-slate-900 rounded-lg overflow-hidden shadow-md border border-slate-200 dark:border-slate-800 flex flex-col">
                        {product.expiresAt && (
                           <CountdownTimer expiresAt={product.expiresAt} />
                        )}
                        <div className="relative bg-slate-100 dark:bg-slate-900">
                            {discountPercentage && (
                              <div className="absolute top-4 left-4 bg-red-600 text-white text-sm font-bold px-3 py-1.5 rounded-full z-10">
                                -{discountPercentage}%
                              </div>
                            )}
                            <img 
                                src={product.image} 
                                alt={product.name} 
                                className="w-full h-auto object-contain aspect-square" 
                            />
                        </div>
                    </div>
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-slate-100">{product.name}</h1>
                         <div className="flex items-baseline gap-4 mt-4">
                            <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">৳{product.price.toLocaleString()}</p>
                            {product.originalPrice && product.originalPrice > product.price && (
                                <p className="text-2xl text-slate-500 dark:text-slate-400 line-through">৳{product.originalPrice.toLocaleString()}</p>
                            )}
                        </div>
                        <p className={`mt-4 text-lg font-semibold ${product.quantity > 5 ? 'text-green-600 dark:text-green-400' : product.quantity > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'}`}>
                            {product.quantity > 0 ? `${product.quantity} available` : 'Currently Out of Stock'}
                        </p>
                        <p className="text-slate-600 dark:text-slate-400 mt-6 text-lg leading-relaxed">{product.description}</p>
                        <button
                            onClick={handleAddToCart}
                            disabled={product.quantity <= 0 || isAdded}
                            className={`mt-8 w-full sm:w-auto px-8 py-4 text-white rounded-lg transition-colors text-lg font-semibold flex items-center justify-center gap-2 ${
                              isAdded
                              ? 'bg-green-500 dark:bg-green-600'
                              : 'bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-700'
                            } disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed`}
                        >
                           {isAdded ? (
                             <>
                               <CheckIcon className="h-6 w-6" /> Added to Cart!
                             </>
                           ) : product.quantity > 0 ? (
                             'Add to Cart'
                           ) : (
                             'Out of Stock'
                           )}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};