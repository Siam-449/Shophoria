
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
import { Suspense } from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  metadataBase: new URL('https://www.shophoriabd.com'),
  title: {
    default: 'SHOPHORIA | Luxury Shopping',
    template: '%s | SHOPHORIA',
  },
  description: 'Your one-stop shop for everything amazing. Explore our collections of Fashion, Electronics, Home & Toys.',
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: { url: '/icon.svg', type: 'image/svg+xml' },
    shortcut: { url: '/icon.svg', type: 'image/svg+xml' },
    apple: { url: '/icon.svg', type: 'image/svg+xml' },
  },
  other: {
    'google-site-verification': 'ZjX56i_R8VsbzOZe1gsC6Nn0YyiQqXrjob-U19soXq0',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
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
