
import React from 'react';
import HomeAndToyPageClient from '../../components/category/HomeAndToyPageClient.jsx';

export const metadata = {
  title: 'Home & Toys',
  description: 'Explore our fun collection of elegant home decor, playable games, and toys for all ages.',
  alternates: {
    canonical: '/home-toy',
  },
};

export default function HomeAndToyPage() {
  return <HomeAndToyPageClient />;
}
