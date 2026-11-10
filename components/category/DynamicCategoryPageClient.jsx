"use client";

import React from 'react';
import Link from 'next/link';
import ProductCard from '../ProductCard.jsx';
import ProductSkeleton from '../ProductSkeleton.jsx';
import { useProducts } from '../../context/ProductsContext.jsx';
import { useCategories } from '../../context/CategoriesContext.jsx';

import { motion } from 'motion/react';

// Helper to normalize and slugify names for comparison
const toSlug = (text) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export default function DynamicCategoryPageClient({ slug }) {
  const { products, loading: productsLoading } = useProducts();
  const { categories, loading: categoriesLoading } = useCategories();

  // Find matching category object to display accurate title
  const matchedCategory = categories.find((c) => {
    return c.slug === slug || toSlug(c.name) === slug || toSlug(c.slug) === slug;
  });

  const categoryTitle =
    matchedCategory?.name ||
    slug
      ?.split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ') ||
    'Category';

  // Filter products by matching slug or name
  const filteredProducts = products.filter((p) => {
    if (!p.category) return false;
    const prodCategorySlug = toSlug(p.category);
    return (
      prodCategorySlug === slug ||
      p.category.toLowerCase() === categoryTitle.toLowerCase() ||
      (matchedCategory && p.category.toLowerCase() === matchedCategory.name.toLowerCase())
    );
  });

  const isLoading = productsLoading || categoriesLoading;

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-[70vh] overflow-hidden">
      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Breadcrumb */}
        <motion.nav 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6 text-sm text-slate-500 dark:text-slate-400"
        >
          <Link href="/" className="hover:underline">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/products" className="hover:underline">Categories</Link>
          <span className="mx-2">/</span>
          <span className="font-semibold text-slate-900 dark:text-slate-100">{categoryTitle}</span>
        </motion.nav>

        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center my-8 sm:my-12"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-slate-100 mb-3">
            {categoryTitle}
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Explore our curated selection of quality items in {categoryTitle}.
          </p>
        </motion.div>

        {/* Product Grid or Empty State */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <ProductSkeleton key={index} />
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6"
          >
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center py-16 px-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-lg mx-auto shadow-sm"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 flex items-center justify-center text-2xl font-bold">
              {categoryTitle.charAt(0)}
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
              No products yet in {categoryTitle}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
              Admin has added this category. New products are being updated soon!
            </p>
            <Link
              href="/products"
              className="inline-block px-6 py-2.5 rounded-lg bg-black dark:bg-neutral-800 text-white font-medium hover:bg-neutral-800 dark:hover:bg-neutral-700 transition-colors text-sm shadow"
            >
              Browse All Products
            </Link>
          </motion.div>
        )}
      </main>
    </div>
  );
}
