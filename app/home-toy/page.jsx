"use client";

import React from 'react';
import Link from 'next/link';
import { products } from '../../data/products.js';

const toyProducts = products.filter(p => p.category === 'Home & Toy');

export default function HomeAndToyPage() {
  return (
    <div className="bg-slate-50 dark:bg-slate-950">
      <main className="container mx-auto p-4 sm:p-6 lg:p-8 min-h-[60vh]">
         <div className="text-center my-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-slate-100 mb-4">Home & Toy</h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">Explore our fun collection of home decor, games, and toys.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
          {toyProducts.map((product) => (
            <div key={product.id} className="bg-white dark:bg-slate-900 rounded-lg overflow-hidden group shadow-sm border border-slate-200 dark:border-slate-800">
              <Link href={`/products/${product.id}`} aria-label={`View details for ${product.name}`}>
                <div className="overflow-hidden aspect-square">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">{product.name}</h3>
                  <p className="text-base font-bold text-slate-900 dark:text-slate-100 mt-1">৳{product.price.toLocaleString()}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};
