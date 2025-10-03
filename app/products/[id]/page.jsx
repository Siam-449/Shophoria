"use client";

import React from 'react';
import Link from 'next/link';
import { products } from '../../../data/products.js';
import { useCart } from '../../../context/CartContext.jsx';

const ProductDetailPage = ({ params }) => {
    const { id } = params;
    const product = products.find(p => String(p.id) === id);
    const { addItemToCart } = useCart();

    if (!product) {
        return (
            <div className="bg-white dark:bg-slate-950 min-h-[60vh] flex items-center justify-center">
                <div className="text-center p-4">
                    <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100">Product Not Found</h1>
                    <p className="mt-4 text-slate-600 dark:text-slate-400">Sorry, we couldn't find the product you're looking for.</p>
                    <Link href="/products" className="mt-6 inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                        Back to All Products
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-slate-950 py-12 sm:py-16">
            <main className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="bg-slate-100 dark:bg-slate-900 rounded-lg overflow-hidden">
                        <img 
                            src={product.image} 
                            alt={product.name} 
                            className="w-full h-auto object-contain aspect-square" 
                        />
                    </div>
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-slate-100">{product.name}</h1>
                        <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mt-4">৳{product.price.toLocaleString()}</p>
                        <p className="text-slate-600 dark:text-slate-400 mt-6 text-lg leading-relaxed">{product.description}</p>
                        <button
                            onClick={() => addItemToCart(product)}
                            className="mt-8 w-full sm:w-auto px-8 py-4 bg-slate-900 text-white rounded-lg hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-700 transition-colors text-lg font-semibold"
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProductDetailPage;