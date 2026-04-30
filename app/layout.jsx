
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '../components/ThemeProvider';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import { CartProvider } from '../context/CartContext.jsx';
import CartDrawer from '../components/CartDrawer.jsx';
import OfferBanner from '../components/OfferBanner.jsx';
import { ProductsProvider } from '../context/ProductsContext.jsx';
import MaintenanceGuard from '../components/MaintenanceGuard.jsx';
import MoveNotification from '../components/MoveNotification.jsx';
import StructuredData from '../components/StructuredData.jsx';
import FacebookPixel from '../components/FacebookPixel.jsx';
import { Suspense } from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  metadataBase: new URL('https://www.shophoriabd.com'),
  title: {
    default: 'Shophoria | Luxury E-commerce Shopping in Bangladesh',
    template: '%s | Shophoria',
  },
  description: 'Shop at Shophoria for the best in Luxury Fashion, Electronics, Home & Toys. The premium online shopping destination in Bangladesh with fast delivery.',
  keywords: ['online shopping Bangladesh', 'luxury fashion', 'electronics', 'home decor', 'toys', 'Shophoria'],
  authors: [{ name: 'Shophoria Team' }],
  creator: 'Shophoria',
  publisher: 'Shophoria',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: { url: '/icon.svg', type: 'image/svg+xml' },
    shortcut: { url: '/icon.svg', type: 'image/svg+xml' },
    apple: { url: '/icon.svg', type: 'image/svg+xml' },
  },
  openGraph: {
    title: 'Shophoria | Luxury Shopping',
    description: 'Explore our premium collections of Fashion, Electronics, and more. Quality guaranteed.',
    url: 'https://www.shophoriabd.com',
    siteName: 'Shophoria',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shophoria | Luxury Shopping',
    description: 'The premium online shopping destination in Bangladesh.',
    creator: '@shophoriabd',
  },
  other: {
    'google-site-verification': 'ZjX56i_R8VsbzOZe1gsC6Nn0YyiQqXrjob-U19soXq0',
  },
};

export default function RootLayout({ children }) {
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Shophoria",
    "url": "https://www.shophoriabd.com",
    "logo": "https://www.shophoriabd.com/icon.svg",
    "sameAs": [
      "https://facebook.com/shophoriabd",
      "https://twitter.com/shophoriabd",
      "https://instagram.com/shophoriabd"
    ],
    "description": "Premium e-commerce platform in Bangladesh offering fashion, electronics, and home toys."
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Suspense fallback={null}>
          <FacebookPixel />
        </Suspense>
        <StructuredData data={organizationData} />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          storageKey="shophoria-theme"
        >
          <MaintenanceGuard>
            <ProductsProvider>
              <CartProvider>
                <OfferBanner />
                <Navbar />
                <CartDrawer />
                <Suspense fallback={null}>
                  <MoveNotification />
                </Suspense>
                {children}
                <Footer />
              </CartProvider>
            </ProductsProvider>
          </MaintenanceGuard>
        </ThemeProvider>
      </body>
    </html>
  );
}