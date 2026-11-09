"use client";

import React from 'react';
import ProductCard from '../ProductCard.jsx';
import ProductSkeleton from '../ProductSkeleton.jsx';
import { useProducts } from '../../context/ProductsContext.jsx';
import { motion } from 'motion/react';

export default function ElectronicsPageClient() {
  const { products, loading } = useProducts();
  const electronicProducts = products.filter(p => p.category === 'Electronics');

  return (
    <div className="bg-slate-50 dark:bg-slate-950 overflow-hidden">
      <main className="container mx-auto p-4 sm:p-6 lg:p-8 min-h-[60vh]">
         <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center my-12"
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-slate-100 mb-4">Electronics</h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">Check out our latest electronic gadgets and kits.</p>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6"
        >
          {loading ? (
            Array.from({ length: 4 }).map((_, index) => <ProductSkeleton key={index} />)
          ) : (
            electronicProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </motion.div>
      </main>
    </div>
  );
};
