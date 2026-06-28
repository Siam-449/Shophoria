
import React from 'react';
import CheckoutPageClient from '../../components/CheckoutPageClient.jsx';

export const metadata = {
  title: 'Checkout',
  description: 'Complete your purchase from SHOPHORIA securely.',
  alternates: {
    canonical: 'https://www.shophoriabd.com/checkout',
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function CheckoutPage() {
  return <CheckoutPageClient />;
}
