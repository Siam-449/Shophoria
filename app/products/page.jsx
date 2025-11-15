import React from 'react';
import ProductCard from '../../components/ProductCard.jsx';
import { getProducts } from '../../lib/firebase';

export const metadata = {
  title: 'All Products - SHOPHORIA',
  description: 'Browse our entire collection of amazing products. Find everything you need in one place.',
};

export default async function AllProductsPage() {
  const allProducts = await getProducts();
  const displayProducts = allProducts.filter(p => p.category !== 'prank');

  return (
    <div className="bg-white dark:bg-slate-950">
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
         <div className="text-center my-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-slate-100 mb-4">All Products</h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">Browse our entire collection of amazing products.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
    </div>
  );
};