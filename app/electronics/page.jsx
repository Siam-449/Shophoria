import React from 'react';
import ProductCard from '../../components/ProductCard.jsx';
import { getProducts } from '../../lib/firebase.js';

export const metadata = {
  title: 'Electronics - SHOPHORIA',
  description: 'Check out our latest electronic gadgets and kits. Innovative tech for your modern lifestyle.',
};

export default async function ElectronicsPage() {
  const allProducts = await getProducts();
  const electronicProducts = allProducts.filter(p => p.category === 'Electronics');

  return (
    <div className="bg-slate-50 dark:bg-slate-950">
      <main className="container mx-auto p-4 sm:p-6 lg:p-8 min-h-[60vh]">
         <div className="text-center my-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-slate-100 mb-4">Electronics</h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">Check out our latest electronic gadgets and kits.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
          {electronicProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
    </div>
  );
};