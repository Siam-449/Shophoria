
import React from 'react';
import ProductCard from './ProductCard.jsx';

const RelatedProducts = ({ products }) => {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="mt-16 sm:mt-24">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-slate-100">You Might Also Like</h2>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
          Discover other products in this collection.
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default RelatedProducts;