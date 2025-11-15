import React from 'react';
import ProductCard from '../../components/ProductCard.jsx';
import { getProducts } from '../../lib/firebase.js';

export const metadata = {
  title: 'Books & Paints - SHOPHORIA',
  description: 'Browse our collection of notepads, stationery, and art supplies. Get creative with our quality products.',
};

export default async function BooksPage() {
  const allProducts = await getProducts();
  const bookProducts = allProducts.filter(p => p.category === 'Books & Paints');

  return (
    <div className="bg-slate-50 dark:bg-slate-950">
      <main className="container mx-auto p-4 sm:p-6 lg:p-8 min-h-[60vh]">
         <div className="text-center my-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-slate-100 mb-4">Books & Paints</h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">Browse our collection of notepads, stationery, and art supplies.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
          {bookProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
    </div>
  );
};