
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { flushSync } from 'react-dom';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useCart } from '../context/CartContext.jsx';
import { useProducts } from '../context/ProductsContext.jsx';
import { usePathname, useRouter } from 'next/navigation';
import { useDebounce } from '../hooks/useDebounce.js';
import { MoonIcon } from './icons/MoonIcon.jsx';
import { SunIcon } from './icons/SunIcon.jsx';
import { CartIcon } from './icons/CartIcon.jsx';
import { MenuIcon } from './icons/MenuIcon.jsx';
import { CloseIcon } from './icons/CloseIcon.jsx';
import SearchBar from './SearchBar.jsx';
import { ChevronDown, MessageSquare, Home } from 'lucide-react';
import { getOfferMessage } from '../lib/firebase.js';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [notice, setNotice] = useState(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const noticeRef = useRef(null);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { toggleCart, cartItems } = useCart();
  const { products } = useProducts();
  const pathname = usePathname();
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef(null);
  const categoriesRef = useRef(null);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    setMounted(true);
    getOfferMessage().then(setNotice);
  }, []);

  useEffect(() => {
    if (notice && noticeRef.current) {
        setIsOverflowing(noticeRef.current.scrollWidth > noticeRef.current.clientWidth);
    }
  }, [notice]);

  useEffect(() => {
    if (debouncedSearchQuery.trim() === '' || products.length === 0) {
      setSearchResults([]);
      return;
    }

    const lowerCaseQuery = debouncedSearchQuery.trim().toLowerCase();
    const filtered = products.filter(product => {
      const productName = product.name.toLowerCase();
      const productId = String(product.id).toLowerCase();
      return productName.includes(lowerCaseQuery) || productId.includes(lowerCaseQuery);
    }).slice(0, 5);
    setSearchResults(filtered);
  }, [debouncedSearchQuery, products]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
      if (categoriesRef.current && !categoriesRef.current.contains(event.target)) {
        setIsCategoriesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchContainerRef, categoriesRef]);

  const handleSearchItemClick = (href) => {
    router.push(href);
    setSearchQuery('');
    setSearchResults([]);
    setIsSearchFocused(false);
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${searchQuery.trim()}`);
      setSearchQuery('');
      setSearchResults([]);
      setIsSearchFocused(false);
      if (isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    }
  };
  
  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
    setIsSearchFocused(e.target.value.trim() !== '');
  }

  const handleSearchFocus = () => {
    if (searchQuery.trim()) {
        setIsSearchFocused(true);
    }
  }

  const navLinks = [
    { name: 'All Products', href: '/products' },
    { name: 'Fashion & Beauty', href: '/fashion' },
    { name: 'Electronics', href: '/electronics' },
    { name: 'Home & Toys', href: '/home-toy' },
    { name: 'Knife', href: '/knife' },
  ];

  const toggleThemeWithTransition = (e) => {
    const isDark = theme === 'dark';
    const newTheme = isDark ? 'light' : 'dark';

    if (
      typeof document === 'undefined' ||
      !document.startViewTransition ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setTheme(newTheme);
      return;
    }

    const rect = e?.currentTarget?.getBoundingClientRect?.() || {
      left: window.innerWidth - 60,
      top: 30,
      width: 24,
      height: 24,
    };

    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    document.documentElement.dataset.themeTransition = isDark ? 'dark-to-light' : 'light-to-dark';

    const transition = document.startViewTransition(() => {
      flushSync(() => {
        setTheme(newTheme);
      });
    });

    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ];

      document.documentElement.animate(
        {
          clipPath: isDark ? [...clipPath].reverse() : clipPath,
        },
        {
          duration: 500,
          easing: 'ease-in-out',
          pseudoElement: isDark ? '::view-transition-old(root)' : '::view-transition-new(root)',
        }
      );
    });

    transition.finished.finally(() => {
      delete document.documentElement.dataset.themeTransition;
    });
  };

  const renderThemeChanger = () => {
    if (!mounted) return <span className="inline-block w-6 h-6" />;
    return (
      <span className="relative w-6 h-6 flex items-center justify-center">
        <SunIcon 
          className={`h-6 w-6 absolute transition-all duration-300 ease-in-out transform ${
            theme === 'dark' 
              ? 'rotate-0 scale-100 opacity-100' 
              : 'rotate-90 scale-0 opacity-0'
          }`} 
        />
        <MoonIcon 
          className={`h-6 w-6 absolute transition-all duration-300 ease-in-out transform ${
            theme === 'dark' 
              ? '-rotate-90 scale-0 opacity-0' 
              : 'rotate-0 scale-100 opacity-100'
          }`} 
        />
      </span>
    );
  };

  return (
    <header className="bg-white dark:bg-[#0d0c0b] text-black dark:text-white border-b border-black dark:border-neutral-800 sticky top-0 z-50 transition-colors">
      <nav className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 border-b border-black dark:border-neutral-800">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-2xl font-extrabold tracking-tight text-black dark:text-white">
              SHOPHORIA
            </Link>
          </div>
          
          <div className="flex-grow flex items-center justify-center px-8">
             <div className="relative w-full max-w-2xl flex border border-black dark:border-neutral-700 rounded-full overflow-hidden" ref={!isMobileMenuOpen ? searchContainerRef : null}>
                <SearchBar 
                    searchQuery={searchQuery}
                    onSearchChange={handleSearchInputChange}
                    onSearchFocus={handleSearchFocus}
                    onSearchSubmit={handleSearchSubmit}
                    isFocused={isSearchFocused}
                    searchResults={searchResults}
                    onItemClick={handleSearchItemClick}
                />
             </div>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/contact" aria-label="Contact" className="p-2 text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
              <MessageSquare className="h-6 w-6" />
            </Link>
            <button 
              onClick={toggleThemeWithTransition}
              aria-label="Toggle theme" 
              className="p-2 text-black dark:text-white transition-transform duration-200 hover:scale-110 flex items-center justify-center"
            >
              {renderThemeChanger()}
            </button>
            <button onClick={toggleCart} aria-label="Open cart" className="relative p-2 text-black dark:text-white transition-colors">
              <CartIcon className="h-6 w-6" />
              {cartItems.length > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-black dark:bg-white dark:text-black rounded-full">
                  {cartItems.length}
                </span>
              )}
            </button>
          </div>
          
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-black dark:text-white focus:outline-none"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 py-2">
          <Link 
            href="/" 
            aria-label="Home"
            className="flex items-center gap-1.5 bg-black text-white px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap hover:bg-neutral-800 transition-colors"
          >
            <Home className="h-4 w-4" />
            <span>Home</span>
          </Link>
          <Link href="/products" className="bg-black text-white px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap">
            All Products
          </Link>
          <div className="relative" ref={categoriesRef}>
            <button 
                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                className="flex items-center gap-2 bg-black text-white px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap"
            >
                All Categories
                <ChevronDown className="h-4 w-4" />
            </button>
            {isCategoriesOpen && (
                <div className="absolute top-full left-0 mt-2 bg-white dark:bg-[#0d0c0b] border border-black dark:border-neutral-800 w-48 shadow-lg z-50">
                    {navLinks.map((link) => (
                      <Link 
                        key={link.name} 
                        href={link.href} 
                        onClick={() => setIsCategoriesOpen(false)}
                        className="block px-4 py-2 text-sm text-black dark:text-white hover:bg-gray-100 dark:hover:bg-neutral-800"
                      >
                        {link.name}
                      </Link>
                    ))}
                </div>
            )}
          </div>
          {notice && (
            <div className="hidden lg:block flex-grow overflow-hidden px-5 py-1 text-sm font-medium bg-black text-[#fca5a5] rounded-md whitespace-nowrap" ref={noticeRef}>
              <div className={isOverflowing ? 'animate-marquee' : 'animate-blink'}>
                {notice}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Menu */}
      <div 
        className={`lg:hidden bg-white dark:bg-[#0d0c0b] border-t border-black dark:border-neutral-800 transition-all duration-300 ease-in-out overflow-hidden ${isMobileMenuOpen ? 'max-h-screen' : 'max-h-0'}`}
      >
        <div className="px-4 py-4 space-y-4">
          <div className="relative" ref={isMobileMenuOpen ? searchContainerRef : null}>
            <SearchBar 
                isMobile={true} 
                searchQuery={searchQuery}
                onSearchChange={handleSearchInputChange}
                onSearchFocus={handleSearchFocus}
                onSearchSubmit={handleSearchSubmit}
                isFocused={isSearchFocused}
                searchResults={searchResults}
                onItemClick={handleSearchItemClick}
            />
          </div>
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-base font-medium text-black dark:text-white"
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Navbar;