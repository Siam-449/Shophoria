import React from 'react';
import DynamicCategoryPageClient from '../../../components/category/DynamicCategoryPageClient.jsx';

export async function generateMetadata({ params }) {
  const { slug } = params;
  const title = slug
    ?.split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  return {
    title: `${title || 'Category'} | Shophoria`,
    description: `Shop the latest ${title || 'category'} products at Shophoria with fast delivery.`,
  };
}

export default function DynamicCategoryPage({ params }) {
  return <DynamicCategoryPageClient slug={params.slug} />;
}
