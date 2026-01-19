
import React from 'react';
import CheckoutPageClient from '../../components/CheckoutPageClient.jsx';

export const metadata = {
  title: 'Checkout',
  description: 'Complete your purchase from SHOPHORIA securely.',
  alternates: {
    canonical: '/checkout',
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function CheckoutPage() {
  return <CheckoutPageClient />;
}
