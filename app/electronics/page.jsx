
import React from 'react';
import ElectronicsPageClient from '../../components/category/ElectronicsPageClient.jsx';

export const metadata = {
  title: 'Electronics',
  description: 'Check out our latest electronic gadgets, smart devices, and kits for tech enthusiasts.',
  alternates: {
    canonical: '/electronics',
  },
};

export default function ElectronicsPage() {
  return <ElectronicsPageClient />;
}
