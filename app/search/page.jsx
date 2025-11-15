
"use client";

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { useProducts } from '../../context/ProductsContext.jsx';
import ProductSkeleton from '../../components/ProductSkeleton.jsx';
import ProductCard from '../../components/ProductCard.jsx';

const SearchResults = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const { products, loading } = useProducts();

  const filteredProducts = useMemo(() => {
    if (!query || products.length === 0) {
      return [];
    }
    const lowerCaseQuery = query.trim().toLowerCase();
    return products.filter(product => {
      const productName = product.name.toLowerCase();
      const productId = String(product.id).toLowerCase();

      if (product.id === 'badann') {
        return productId === lowerCaseQuery || productName === lowerCaseQuery;
      }

      return productName.includes(lowerCaseQuery) || productId.includes(lowerCaseQuery);
    });
  }, [query, products]);

  if (loading) {
     return (
        <main className="container mx-auto p-4 sm:p-6 lg:p-8 min-h-[60vh]">
            <div className="text-center my-12">
                 <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded w-1/2 mx-auto mb-4 animate-pulse"></div>
                 <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/4 mx-auto animate-pulse"></div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
              {Array.from({ length: 8 }).map((_, index) => <ProductSkeleton key={index} />)}
            </div>
        </main>
     )
  }

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
                <ProductCard key={product.id} product={product} />
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