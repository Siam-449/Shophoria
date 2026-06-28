
import React from 'react';
import KnifePageClient from '../../components/category/KnifePageClient.jsx';

export const metadata = {
  title: 'Knife',
  description: 'Browse our collection of high quality knives and tools.',
  alternates: {
    canonical: 'https://www.shophoriabd.com/knife',
  },
};

export default function KnifePage() {
  return <KnifePageClient />;
}
