"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Hero from '../components/Hero.jsx';
import CategoryShowcase from '../components/CategoryShowcase.jsx';
import { useCart } from '../context/CartContext.jsx';
import { products } from '../data/products.js';

export default function Home() {
  const { addItemToCart } = useCart();
  const [collectionsProducts, setCollectionsProducts] = useState([]);

  useEffect(() => {
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
    setCollectionsProducts(shuffleArray(finalProducts));
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
          {collectionsProducts.map((product) => (
            <div key={product.id} className="bg-white dark:bg-slate-900 rounded-lg overflow-hidden group shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col">
              <Link href={`/products/${product.id}`} aria-label={`View details for ${product.name}`}>
                <div className="overflow-hidden aspect-square">
                    <img src={product.image} alt={product.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" />
                </div>
              </Link>
              <div className="p-3 flex flex-col flex-grow">
                <Link href={`/products/${product.id}`} className="flex-grow">
                  <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">{product.name}</h3>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-3">{product.description}</p>
                </Link>
                <div className="mt-2">
                  <p className="text-base font-bold text-slate-900 dark:text-slate-100">৳{product.price.toLocaleString()}</p>
                   <button 
                      onClick={() => addItemToCart(product)}
                      className="w-full mt-2 px-3 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition-colors"
                    >
                      Add to Cart
                    </button>
                </div>
              </div>
            </div>
          ))}
        </div>
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