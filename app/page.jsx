import React from 'react';
import Navbar from '../components/Navbar.jsx';

export default function Home() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">Welcome to Naki</h1>
        <p className="text-lg text-gray-600">Your one-stop shop for everything amazing. Explore our collections.</p>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300">
              <img src={`https://picsum.photos/400/300?random=${index}`} alt="Product" className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800">Product Name</h3>
                <p className="text-gray-500 mt-2">A brief description of this fantastic product goes here.</p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-2xl font-bold text-gray-900">$99.99</span>
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