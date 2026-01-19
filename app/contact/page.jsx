
import React from 'react';
import ContactPageClient from '../../components/ContactPageClient.jsx';

export const metadata = {
  title: 'Contact Us',
  description: "Get in touch with SHOPHORIA. We're here to help with any questions about our products or your orders.",
  alternates: {
    canonical: '/contact',
  },
};

export default function ContactPage() {
  return <ContactPageClient />;
}
