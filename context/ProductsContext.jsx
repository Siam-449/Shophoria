"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { subscribeToProducts, getProducts } from '../lib/firebase';

const ProductsContext = createContext({
  products: [],
  loading: true,
});

export const useProducts = () => {
  return useContext(ProductsContext);
};

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isSubscribed = true;

    // Load from localStorage cache immediately on client mount to avoid hydration mismatch
    try {
      const cached = localStorage.getItem('cached_shophoria_products');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProducts(parsed);
          setLoading(false);
        }
      }
    } catch (e) {}

    // Fetch initial fresh data
    getProducts().then((productList) => {
      if (isSubscribed && productList && productList.length > 0) {
        setProducts(productList);
        setLoading(false);
        try {
          localStorage.setItem('cached_shophoria_products', JSON.stringify(productList));
        } catch (e) {}
      }
    });

    // Subscribe to real-time updates
    const unsubscribe = subscribeToProducts((liveProducts) => {
      if (isSubscribed && liveProducts && liveProducts.length > 0) {
        setProducts(liveProducts);
        setLoading(false);
        try {
          localStorage.setItem('cached_shophoria_products', JSON.stringify(liveProducts));
        } catch (e) {}
      }
    });

    return () => {
      isSubscribed = false;
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  const value = {
    products,
    loading,
  };

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
};
