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
    const fetchProducts = async () => {
      setLoading(true);
      const productList = await getProducts();
      setProducts(productList);
      setLoading(false);
    };

    fetchProducts();
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
