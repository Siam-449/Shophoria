
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext.jsx';
import CountdownTimer from './CountdownTimer.jsx';
import { CheckIcon } from './icons/CheckIcon.jsx';
import RelatedProducts from './RelatedProducts.jsx';
import { motion } from 'motion/react';

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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
      className="relative bg-white dark:bg-[#141414] rounded-xl sm:rounded-2xl overflow-hidden group shadow-sm hover:shadow-md border border-slate-200 dark:border-neutral-800 flex flex-col h-full p-3 sm:p-4 transition-all"
    >
      {discountPercentage && (
        <div className="absolute top-4 right-4 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-full z-10 shadow-sm">
          -{discountPercentage}%
        </div>
      )}
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
            <p className={`text-[10px] sm:text-xs font-semibold ${product.quantity > 5 ? 'text-green-600 dark:text-green-400' : product.quantity > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'}`}>
              {product.quantity > 0 ? 'In Stock' : 'Out of Stock'}
            </p>
          </div>
          <button 
            onClick={handleAddToCart}
            disabled={product.quantity <= 0 || isAdded}
            className={`w-full py-2.5 px-3 text-white text-xs sm:text-sm font-medium rounded-lg transition-colors duration-300 flex items-center justify-center gap-1.5 ${
              isAdded 
              ? 'bg-green-600 text-white' 
              : 'bg-black dark:bg-[#1c1b1a] dark:border dark:border-neutral-700 text-white hover:bg-neutral-800 dark:hover:bg-neutral-800'
            } disabled:bg-slate-400 dark:disabled:bg-slate-700 disabled:cursor-not-allowed`}
          >
            {isAdded ? (
                <>
                    <CheckIcon className="h-4 w-4" /> Added!
                </>
            ) : product.quantity > 0 ? (
                'Add to Cart'
            ) : (
                'Out of Stock'
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;

export const ProductDetailClient = ({ product, relatedProducts }) => {
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
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-slate-950 py-12 sm:py-16"
        >
            <main className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="bg-white dark:bg-slate-900 rounded-lg overflow-hidden shadow-md border border-slate-200 dark:border-slate-800 flex flex-col"
                    >
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
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-slate-100">{product.name}</h1>
                        <div className="mt-2 flex items-center gap-2">
                            <div className="flex text-amber-500">
                                {/* 4.5 stars */}
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" /></svg>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" /></svg>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" /></svg>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" /></svg>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 opacity-50"><path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" /></svg>
                            </div>
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">4.5 (89 reviews)</span>
                        </div>
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
                              ? 'bg-green-600 text-white'
                              : 'bg-black dark:bg-[#1c1b1a] dark:border dark:border-neutral-700 text-white hover:bg-neutral-800 dark:hover:bg-neutral-800'
                            } disabled:bg-slate-400 dark:disabled:bg-slate-700 disabled:cursor-not-allowed`}
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
                    </motion.div>
                </div>

                <RelatedProducts products={relatedProducts} />
            </main>
        </motion.div>
    );
};