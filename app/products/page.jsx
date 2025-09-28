"use client";

import React from 'react';
import Link from 'next/link';
import { useCart } from '../../context/CartContext.jsx';
import { products } from '../../data/products.js';

export default function AllProductsPage() {
  const { addItemToCart } = useCart();

  return (
    <div className="bg-white dark:bg-slate-950">
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
         <div className="text-center my-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-slate-100 mb-4">All Products</h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">Browse our entire collection of amazing products.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product.id} className="bg-white dark:bg-slate-900 rounded-lg shadow-md dark:shadow-none dark:border dark:border-slate-800 overflow-hidden transform hover:scale-105 transition-transform duration-300 flex flex-col">
              <Link href={`/products/${product.id}`} aria-label={`View details for ${product.name}`}>
                <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
              </Link>
              <div className="p-6 flex flex-col flex-grow">
                 <Link href={`/products/${product.id}`}>
                  <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">{product.name}</h3>
                </Link>
                <p className="text-slate-500 dark:text-slate-400 mt-2 flex-grow">{product.description}</p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-2xl font-bold text-slate-900 dark:text-white">৳{product.price.toLocaleString()}</span>
                  <button 
                    onClick={() => addItemToCart(product)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};
