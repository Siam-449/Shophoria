import React from 'react';
import Hero from '../components/Hero.jsx';

export default function Home() {
  return (
    <div className="bg-white dark:bg-slate-950">
      <Hero />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
         <div className="text-center my-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-slate-100 mb-4">Our Collections</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">Explore our curated selection of amazing products.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-white dark:bg-slate-900 rounded-lg shadow-md dark:shadow-none dark:border dark:border-slate-800 overflow-hidden transform hover:scale-105 transition-transform duration-300">
              <img src={`https://picsum.photos/400/300?random=${index}`} alt="Product" className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Product Name</h3>
                <p className="text-slate-500 dark:text-slate-400 mt-2">A brief description of this fantastic product goes here.</p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-2xl font-bold text-slate-900 dark:text-white">$99.99</span>
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};