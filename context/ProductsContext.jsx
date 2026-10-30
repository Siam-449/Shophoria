"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getProducts } from '../lib/firebase';

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
    let isResolved = false;

    const timer = setTimeout(() => {
      if (!isResolved) {
        isResolved = true;
        setLoading(false);
      }
    }, 2000);

    const fetchProducts = async () => {
      const productList = await getProducts();
      if (!isResolved) {
        isResolved = true;
        clearTimeout(timer);
        setProducts(productList);
        setLoading(false);
      }
    };

    fetchProducts();

    return () => clearTimeout(timer);
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
