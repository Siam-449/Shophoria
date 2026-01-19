
import React from 'react';
import FashionPageClient from '../../components/category/FashionPageClient.jsx';

export const metadata = {
  title: 'Fashion & Beauty',
  description: 'Discover our collection of stylish bags, trendy accessories, and essential beauty products.',
  alternates: {
    canonical: '/fashion',
  },
};

export default function FashionAndBeautyPage() {
  return <FashionPageClient />;
}
