"use client";

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { products } from '../../data/products.js';
import { useCart } from '../../context/CartContext.jsx';

const SearchResults = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const { addItemToCart } = useCart();

  const filteredProducts = useMemo(() => {
    if (!query) {
      return [];
    }
    const lowerCaseQuery = query.trim().toLowerCase();
    return products.filter(product => 
      product.name.toLowerCase().includes(lowerCaseQuery) ||
      String(product.id).includes(lowerCaseQuery)
    );
  }, [query]);

  return (
    <main className="container mx-auto p-4 sm:p-6 lg:p-8 min-h-[60vh]">
      {query ? (
        <>
          <div className="text-center my-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-slate-100 mb-4">
              Search Results for "{query}"
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
            </p>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
              {filteredProducts.map((product) => (
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
          ) : (
            <div className="text-center py-16">
              <p className="text-xl text-slate-600 dark:text-slate-400">No products found matching your search.</p>
              <Link href="/" className="mt-6 inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                Back to Home
              </Link>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-slate-100 mb-4">
                Please enter a search term
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
                Use the search bar in the navigation to find products.
            </p>
        </div>
      )}
    </main>
  );
};


const SearchPage = () => {
    return (
        <div className="bg-white dark:bg-slate-950">
            <Suspense fallback={<div className="min-h-screen flex justify-center items-center">Loading search results...</div>}>
                <SearchResults />
            </Suspense>
        </div>
    )
}

export default SearchPage;