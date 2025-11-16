

"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Hero from '../components/Hero.jsx';
import CategoryShowcase from '../components/CategoryShowcase.jsx';
import { useProducts } from '../context/ProductsContext.jsx';
import ProductCard from '../components/ProductCard.jsx';
import ProductSkeleton from '../components/ProductSkeleton.jsx';
import { getTimeOffers } from '../lib/firebase.js';
import TimeOfferCard from '../components/TimeOfferCard.jsx';

const getCollectionsProducts = (products) => {
  const displayableProducts = products.filter(p => p.category !== 'prank');

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const categories = ['Fashion & Beauty', 'Electronics', 'Home & Toys', 'Books & Paints'];
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

export default function Home() {
  const [collectionsProducts, setCollectionsProducts] = useState([]);
  const [timeOffers, setTimeOffers] = useState([]);
  const [timeOffersLoading, setTimeOffersLoading] = useState(true);
  const { products, loading } = useProducts();

  useEffect(() => {
    // Shuffling products on the client-side after initial render to avoid hydration errors.
    if (products.length > 0) {
      setCollectionsProducts(getCollectionsProducts(products));
    }
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
    <div className="bg-slate-50 dark:bg-slate-900">
      <Hero />
      <CategoryShowcase />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
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
        
        {!timeOffersLoading && timeOffers.length > 0 && (
          <section className="mt-16">
            <div className="text-center my-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-slate-100 mb-4">Limited Time Offers</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">Grab these amazing deals before they're gone!</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {timeOffers.map((product) => (
                <TimeOfferCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}
        
        <div className="mt-12 text-center">
            <Link 
                href="/products" 
                className="inline-block px-8 py-3 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-medium"
            >
                View All Products
            </Link>
        </div>
      </main>
    </div>
  );
};