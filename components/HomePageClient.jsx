
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Hero from './Hero.jsx';
import CategoryShowcase from './CategoryShowcase.jsx';
import { useProducts } from '../context/ProductsContext.jsx';
import ProductCard from './ProductCard.jsx';
import ProductSkeleton from './ProductSkeleton.jsx';
import { getTimeOffers } from '../lib/firebase.js';
import TimeOfferCard from './TimeOfferCard.jsx';
import { Flame } from 'lucide-react';

import { motion } from 'motion/react';

const getCollectionsProducts = (products) => {
  const displayableProducts = products.filter(p => p.category !== 'prank');

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const categories = ['Fashion & Beauty', 'Electronics', 'Home & Toys', 'Knife'];
  const numToSelectPerCategory = 2;
  const totalProductsToShow = 12;

  let guaranteedProducts = [];
  const selectedIds = new Set();

  // 1. Get guaranteed products from each category
  categories.forEach(category => {
    const categoryProducts = displayableProducts.filter(p => p.category === category);
    const shuffledCategoryProducts = shuffleArray([...categoryProducts]);
    const selectedFromCategory = shuffledCategoryProducts.slice(0, numToSelectPerCategory);
    
    selectedFromCategory.forEach(product => {
      if (!selectedIds.has(product.id)) {
        guaranteedProducts.push(product);
        selectedIds.add(product.id);
      }
    });
  });

  let finalProducts = [...guaranteedProducts];

  // 2. Fill remaining spots with products from any category
  if (finalProducts.length < totalProductsToShow) {
    const remainingProducts = displayableProducts.filter(p => !selectedIds.has(p.id));
    const shuffledRemaining = shuffleArray([...remainingProducts]);
    const needed = totalProductsToShow - finalProducts.length;
    finalProducts.push(...shuffledRemaining.slice(0, needed));
  }
  
  // 3. Final shuffle to mix everything up for display
  return shuffleArray(finalProducts);
};

export default function HomePageClient() {
  const [timeOffers, setTimeOffers] = useState([]);
  const [timeOffersLoading, setTimeOffersLoading] = useState(true);
  const { products, loading } = useProducts();

  const collectionsProducts = React.useMemo(() => {
    if (products.length === 0) return [];
    return getCollectionsProducts(products);
  }, [products]);

  useEffect(() => {
    const fetchOffers = async () => {
      setTimeOffersLoading(true);
      const offers = await getTimeOffers();
      setTimeOffers(offers);
      setTimeOffersLoading(false);
    };
    fetchOffers();
  }, []);

  return (
    <div className="bg-slate-50 dark:bg-slate-900 overflow-hidden">
      {!timeOffersLoading && timeOffers.length > 0 && (
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10"
        >
          <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-7 md:p-8 bg-white dark:bg-[#111111] border border-slate-300 dark:border-neutral-800 shadow-sm sm:shadow-md ring-1 ring-black/5 dark:ring-white/5">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 sm:mb-8 pb-4 border-b border-slate-200 dark:border-neutral-800">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <Flame className="w-3.5 h-3.5 fill-rose-500 animate-pulse" />
                  Flash Deals
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Limited Time Offers
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Grab these limited special deals before the countdown expires.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
              {timeOffers.map((product) => (
                <TimeOfferCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </motion.section>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <Hero />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <CategoryShowcase />
      </motion.div>

      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
        className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12"
      >
         <div className="text-center my-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-slate-100 mb-4">Our Collections</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">Explore our curated selection of amazing products.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
          {loading
            ? Array.from({ length: 12 }).map((_, index) => <ProductSkeleton key={index} />)
            : collectionsProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
          }
        </div>
        
        <div className="mt-12 text-center">
            <Link 
                href="/products" 
                className="inline-block px-8 py-3 border border-slate-300 dark:border-neutral-700 bg-white dark:bg-[#1c1b1a] rounded-lg text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors font-medium"
            >
                View All Products
            </Link>
        </div>
      </motion.main>
    </div>
  );
};
