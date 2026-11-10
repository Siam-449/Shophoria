"use client";

import React from 'react';
import ProductCard from '../ProductCard.jsx';
import ProductSkeleton from '../ProductSkeleton.jsx';
import { useProducts } from '../../context/ProductsContext.jsx';
import { motion } from 'motion/react';

export default function AllProductsPageClient() {
  const { products, loading } = useProducts();
  const displayProducts = products.filter(p => p.category !== 'prank');

  return (
    <div className="bg-white dark:bg-slate-950 overflow-hidden">
      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 min-h-[60vh]">
         <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center my-12"
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-slate-100 mb-4">All Products</h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">Browse our entire collection of amazing products.</p>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6"
        >
          {loading ? (
            Array.from({ length: 16 }).map((_, index) => <ProductSkeleton key={index} />)
          ) : (
            displayProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </motion.div>
      </main>
    </div>
  );
};
