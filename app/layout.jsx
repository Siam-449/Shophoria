import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '../components/ThemeProvider';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import { CartProvider } from '../context/CartContext.jsx';
import CartDrawer from '../components/CartDrawer.jsx';
import OfferBanner from '../components/OfferBanner.jsx';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'SHOPHORIA',
  description: 'Your one-stop shop for everything amazing. Explore our collections.',
  other: {
    'google-site-verification': 'ps7tDPlns9KwY4J3aAN5Ua0mDMYVBehC7TY5D0s2Sys',
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
          <CartProvider>
            <OfferBanner />
            <Navbar />
            <CartDrawer />
            {children}
            <Footer />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
