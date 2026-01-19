
import React from 'react';
import BooksPageClient from '../../components/category/BooksPageClient.jsx';

export const metadata = {
  title: 'Books & Paints',
  description: 'Browse our collection of notepads, stationery, and art supplies for your creative projects.',
  alternates: {
    canonical: '/books',
  },
};

export default function BooksPage() {
  return <BooksPageClient />;
}
