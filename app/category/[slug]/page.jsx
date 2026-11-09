import React from 'react';
import DynamicCategoryPageClient from '../../../components/category/DynamicCategoryPageClient.jsx';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;
  const title = slug
    ?.split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  return {
    title: `${title || 'Category'} | Shophoria`,
    description: `Shop the latest ${title || 'category'} products at Shophoria with fast delivery.`,
  };
}

export default async function DynamicCategoryPage({ params }) {
  const resolvedParams = await params;
  return <DynamicCategoryPageClient slug={resolvedParams?.slug} />;
}
