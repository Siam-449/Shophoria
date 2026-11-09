"use client";

import React from 'react';
import ProductCard from '../ProductCard.jsx';
import ProductSkeleton from '../ProductSkeleton.jsx';
import { useProducts } from '../../context/ProductsContext.jsx';
import { motion } from 'motion/react';

export default function FashionPageClient() {
  const { products, loading } = useProducts();
  const fashionProducts = products.filter(p => p.category === 'Fashion & Beauty');

  return (
    <div className="bg-slate-50 dark:bg-slate-950 overflow-hidden">
      <main className="container mx-auto p-4 sm:p-6 lg:p-8 min-h-[60vh]">
         <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center my-12"
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-slate-100 mb-4">Fashion & Beauty</h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">Discover our collection of stylish bags, accessories, and beauty products.</p>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6"
        >
          {loading ? (
            Array.from({ length: 8 }).map((_, index) => <ProductSkeleton key={index} />)
          ) : (
            fashionProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </motion.div>
      </main>
    </div>
  );
};
