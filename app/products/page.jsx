"use client";

import React from 'react';
import Link from 'next/link';
import { useCart } from '../../context/CartContext.jsx';
import { products } from '../../data/products.js';

const displayProducts = products.filter(p => p.category !== 'prank');

export default function AllProductsPage() {
  const { addItemToCart } = useCart();

  return (
    <div className="bg-white dark:bg-slate-950">
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
         <div className="text-center my-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-slate-100 mb-4">All Products</h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">Browse our entire collection of amazing products.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
          {displayProducts.map((product) => (
            <div key={product.id} className="bg-white dark:bg-slate-900 rounded-lg overflow-hidden group shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col">
              <Link href={`/products/${product.id}`} aria-label={`View details for ${product.name}`}>
                <div className="overflow-hidden aspect-square">
                    <img src={product.image} alt={product.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" />
                </div>
              </Link>
              <div className="p-3 flex flex-col flex-grow">
                 <Link href={`/products/${product.id}`} className="flex-grow">
                  <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">{product.name}</h3>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-3">{product.description}</p>
                </Link>
                <div className="mt-2">
                  <p className="text-base font-bold text-slate-900 dark:text-slate-100">৳{product.price.toLocaleString()}</p>
                  <button 
                    onClick={() => addItemToCart(product)}
                    className="w-full mt-2 px-3 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition-colors"
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