import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '../components/ThemeProvider';
import Navbar from '../components/Navbar.jsx';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'SHOPHORIA',
  description: 'Your one-stop shop for everything amazing. Explore our collections.',
  icons: {
    icon: '/shophoria.jpeg',
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
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}