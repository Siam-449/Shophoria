import React from 'react';
import { products } from '../../data/products.js'; 
import ProductCard from '../../components/ProductCard.jsx';

const fashionProducts = products.filter(p => p.category === 'Fashion & Beauty');

export const metadata = {
  title: 'Fashion & Beauty - SHOPHORIA',
  description: 'Discover our collection of stylish bags, accessories, and beauty products. High-quality fashion items just for you.',
};

export default function FashionAndBeautyPage() {
  return (
    <div className="bg-slate-50 dark:bg-slate-950">
      <main className="container mx-auto p-4 sm:p-6 lg:p-8 min-h-[60vh]">
         <div className="text-center my-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-slate-100 mb-4">Fashion & Beauty</h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">Discover our collection of stylish bags, accessories, and beauty products.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
          {fashionProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
    </div>
  );
};