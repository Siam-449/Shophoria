"use client";

import React from 'react';
import Hero from '../components/Hero.jsx';
import { useCart } from '../context/CartContext.jsx';

const products = [
  { id: 1, name: 'Premium Cotton T-Shirt', price: 2499, image: 'https://picsum.photos/400/300?random=1', description: 'A brief description of this fantastic product goes here.' },
  { id: 2, name: 'Wireless Bluetooth Headphones', price: 5999, image: 'https://picsum.photos/400/300?random=2', description: 'A brief description of this fantastic product goes here.' },
  { id: 3, name: 'Modern Leather Backpack', price: 7999, image: 'https://picsum.photos/400/300?random=3', description: 'A brief description of this fantastic product goes here.' },
  { id: 4, name: 'Smart Fitness Watch', price: 12999, image: 'https://picsum.photos/400/300?random=4', description: 'A brief description of this fantastic product goes here.' },
  { id: 5, name: 'Scented Soy Candle', price: 1499, image: 'https://picsum.photos/400/300?random=5', description: 'A brief description of this fantastic product goes here.' },
  { id: 6, name: 'Hardcover Novel', price: 1999, image: 'https://picsum.photos/400/300?random=6', description: 'A brief description of this fantastic product goes here.' },
];

export default function Home() {
  const { addItemToCart } = useCart();

  return (
    <div className="bg-white dark:bg-slate-950">
      <Hero />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
         <div className="text-center my-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-slate-100 mb-4">Our Collections</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">Explore our curated selection of amazing products.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product.id} className="bg-white dark:bg-slate-900 rounded-lg shadow-md dark:shadow-none dark:border dark:border-slate-800 overflow-hidden transform hover:scale-105 transition-transform duration-300 flex flex-col">
              <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100">{product.name}</h3>
                <p className="text-slate-500 dark:text-slate-400 mt-2 flex-grow">{product.description}</p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-2xl font-bold text-slate-900 dark:text-white">₹{product.price.toLocaleString()}</span>
                  <button 
                    onClick={() => addItemToCart(product)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
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