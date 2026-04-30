
import React from 'react';
import HomePageClient from '../components/HomePageClient.jsx';
import StructuredData from '../components/StructuredData.jsx';

export const metadata = {
  title: 'Shophoria | Premium Online Shopping for Fashion, Electronics & More',
  description: 'Discover the latest trends in luxury fashion, cutting-edge electronics, and home essentials at Shophoria. Quality products with fast delivery in Bangladesh.',
  alternates: {
    canonical: '/',
  },
};

export default function Home() {
  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Shophoria",
    "url": "https://www.shophoriabd.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://www.shophoriabd.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <>
      <StructuredData data={websiteData} />
      <HomePageClient />
    </>
  );
}
