
import React from 'react';
import AllProductsPageClient from '../../components/category/AllProductsPageClient.jsx';

export const metadata = {
  title: 'All Products',
  description: 'Browse our entire collection of amazing products, from fashion and electronics to home goods and toys.',
  alternates: {
    canonical: '/products',
  },
};

export default function AllProductsPage() {
  return <AllProductsPageClient />;
}
