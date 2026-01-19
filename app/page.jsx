
import React from 'react';
import HomePageClient from '../components/HomePageClient.jsx';

export const metadata = {
  // The title and description are inherited from the root layout,
  // but we explicitly define the canonical URL for the homepage.
  alternates: {
    canonical: '/',
  },
};

export default function Home() {
  return <HomePageClient />;
}
