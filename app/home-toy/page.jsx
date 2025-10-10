import React from 'react';
import { products } from '../../data/products.js';
import ProductCard from '../../components/ProductCard.jsx';

const toyProducts = products.filter(p => p.category === 'Home & Toys');

export const metadata = {
  title: 'Home & Toys - SHOPHORIA',
  description: 'Explore our fun collection of home decor, games, and toys. Find the perfect items for your home and for playtime.',
};

export default function HomeAndToyPage() {
  return (
    <div className="bg-slate-50 dark:bg-slate-950">
      <main className="container mx-auto p-4 sm:p-6 lg:p-8 min-h-[60vh]">
         <div className="text-center my-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-slate-100 mb-4">Home & Toys</h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">Explore our fun collection of home decor, games, and toys.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
          {toyProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
    </div>
  );
};