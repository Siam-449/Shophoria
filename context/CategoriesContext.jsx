"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCategories, subscribeToCategories } from '../lib/firebase.js';

export const DEFAULT_CATEGORIES = [
  {
    id: 'fashion',
    name: 'Fashion & Beauty',
    slug: 'fashion',
    href: '/fashion',
    image: 'https://res.cloudinary.com/dqki5wiei/image/upload/c_fill,w_600,h_600,f_auto,q_auto/v1759251677/Fashion-_-Clothing_n26a59.jpg',
  },
  {
    id: 'electronics',
    name: 'Electronics',
    slug: 'electronics',
    href: '/electronics',
    image: 'https://res.cloudinary.com/dqki5wiei/image/upload/c_fill,w_600,h_600,f_auto,q_auto/v1759251676/Electronics-_-Gadgets_awvtfq.jpg',
  },
  {
    id: 'home-toy',
    name: 'Home & Toys',
    slug: 'home-toy',
    href: '/home-toy',
    image: 'https://res.cloudinary.com/dqki5wiei/image/upload/c_fill,w_600,h_600,f_auto,q_auto/v1759251693/Home-_-Toy_qvbwoc.jpg',
  },
  {
    id: 'knife',
    name: 'Knife',
    slug: 'knife',
    href: '/knife',
    image: 'https://res.cloudinary.com/dqki5wiei/image/upload/c_fill,w_600,h_600,f_auto,q_auto/v1781364320/Knife_vwbnhk.jpg',
  },
];

const CategoriesContext = createContext({
  categories: DEFAULT_CATEGORIES,
  loading: false,
});

export const useCategories = () => useContext(CategoriesContext);

export const CategoriesProvider = ({ children }) => {
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let unsubscribe = null;

    // Load from localStorage cache on client mount
    try {
      const cached = localStorage.getItem('cached_shophoria_categories');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCategories(parsed);
        }
      }
    } catch (e) {}

    const fetchInitial = async () => {
      try {
        const fetched = await getCategories();
        if (fetched && fetched.length > 0) {
          setCategories(fetched);
          try {
            localStorage.setItem('cached_shophoria_categories', JSON.stringify(fetched));
          } catch (e) {}
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchInitial();

    if (typeof subscribeToCategories === 'function') {
      unsubscribe = subscribeToCategories((liveCats) => {
        if (liveCats && liveCats.length > 0) {
          setCategories(liveCats);
          try {
            localStorage.setItem('cached_shophoria_categories', JSON.stringify(liveCats));
          } catch (e) {}
        }
      });
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return (
    <CategoriesContext.Provider value={{ categories, loading }}>
      {children}
    </CategoriesContext.Provider>
  );
};
