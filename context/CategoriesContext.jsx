"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCategories, subscribeToCategories } from '../lib/firebase.js';

export const DEFAULT_CATEGORIES = [
  {
    id: 'electronics-gadgets',
    name: 'Electronics & Gadgets',
    slug: 'electronics',
    href: '/electronics',
    iconType: 'gadget',
  },
  {
    id: 'home-kitchen',
    name: 'Home & Kitchen',
    slug: 'home-kitchen',
    href: '/category/home-kitchen',
    iconType: 'pot',
  },
  {
    id: 'home-kitchen-alt',
    name: 'Home & Kitchen',
    slug: 'home-kitchen',
    href: '/category/home-kitchen',
    letter: 'H',
  },
  {
    id: 'home-cleaning',
    name: 'Home & Cleaning',
    slug: 'home-cleaning',
    href: '/category/home-cleaning',
    iconType: 'spray',
  },
  {
    id: 'beauty-personal-care',
    name: 'Beauty & Personal Care',
    slug: 'beauty-personal-care',
    href: '/category/beauty-personal-care',
    letter: 'B',
  },
  {
    id: 'lighting',
    name: 'Lighting',
    slug: 'lighting',
    href: '/category/lighting',
    iconType: 'lightbulb',
  },
  {
    id: 'health-beauty',
    name: 'Health & Beauty',
    slug: 'health-beauty',
    href: '/category/health-beauty',
    iconType: 'heart',
  },
  {
    id: 'bags-watches',
    name: 'Bags & Watches',
    slug: 'bags-watches',
    href: '/category/bags-watches',
    iconType: 'bag',
  },
  {
    id: 'toys-kids',
    name: 'Toys & Kids',
    slug: 'home-toy',
    href: '/home-toy',
    iconType: 'toy',
  },
  {
    id: 'car-auto',
    name: 'Car & Auto',
    slug: 'car-auto',
    href: '/category/car-auto',
    iconType: 'car',
  },
];

const CategoriesContext = createContext({
  categories: DEFAULT_CATEGORIES,
  loading: false,
});

export const useCategories = () => useContext(CategoriesContext);

export const CategoriesProvider = ({ children }) => {
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe = null;

    const fetchInitial = async () => {
      try {
        const fetched = await getCategories();
        if (fetched && fetched.length > 0) {
          setCategories(fetched);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchInitial();

    if (typeof subscribeToCategories === 'function') {
      unsubscribe = subscribeToCategories((liveCats) => {
        if (liveCats && liveCats.length > 0) {
          setCategories(liveCats);
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
