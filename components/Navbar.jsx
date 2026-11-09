
"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useCart } from '../context/CartContext.jsx';
import { useProducts } from '../context/ProductsContext.jsx';
import { useCategories } from '../context/CategoriesContext.jsx';
import { usePathname, useRouter } from 'next/navigation';
import { useDebounce } from '../hooks/useDebounce.js';
import { MoonIcon } from './icons/MoonIcon.jsx';
import { SunIcon } from './icons/SunIcon.jsx';
import { CartIcon } from './icons/CartIcon.jsx';
import { MenuIcon } from './icons/MenuIcon.jsx';
import { CloseIcon } from './icons/CloseIcon.jsx';
import SearchBar from './SearchBar.jsx';
import { ChevronDown, MessageSquare, Home, Package, Grid, Search, ShoppingCart } from 'lucide-react';
import { getOfferMessage } from '../lib/firebase.js';
import { motion, AnimatePresence } from 'motion/react';

const Navbar = () => {
  const [isOptionsMenuOpen, setIsOptionsMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [notice, setNotice] = useState(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const noticeRef = useRef(null);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isTransitioningRef = useRef(false);
  const { toggleCart, cartItems } = useCart();
  const { products } = useProducts();
  const { categories } = useCategories();
  const pathname = usePathname();
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef(null);
  const categoriesRef = useRef(null);
  const optionsRef = useRef(null);

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
      if (optionsRef.current && !optionsRef.current.contains(event.target)) {
        setIsOptionsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchContainerRef, categoriesRef, optionsRef]);

  const handleSearchItemClick = (href) => {
    router.push(href);
    setSearchQuery('');
    setSearchResults([]);
    setIsSearchFocused(false);
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${searchQuery.trim()}`);
      setSearchQuery('');
      setSearchResults([]);
      setIsSearchFocused(false);
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

  const toCategorySlug = (text) => {
    if (!text) return '';
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const dynamicCategoryLinks = categories && categories.length > 0 ? categories.map((cat) => {
    let href = cat.href;
    if (!href) {
      const slug = cat.slug || toCategorySlug(cat.name);
      if (slug === 'fashion' || slug === 'fashion-beauty') href = '/fashion';
      else if (slug === 'electronics' || slug === 'electronics-gadgets') href = '/electronics';
      else if (slug === 'home-toy' || slug === 'toys-kids') href = '/home-toy';
      else if (slug === 'knife') href = '/knife';
      else href = `/category/${slug}`;
    }
    return {
      name: cat.name,
      href,
    };
  }) : [];

  const toggleThemeWithTransition = (e) => {
    if (isTransitioningRef.current) return;

    // Strict, reliable check directly from root class
    const isDark = typeof document !== 'undefined' ? document.documentElement.classList.contains('dark') : theme === 'dark';
    const newTheme = isDark ? 'light' : 'dark';

    if (
      typeof document === 'undefined' ||
      !document.startViewTransition ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setTheme(newTheme);
      return;
    }

    isTransitioningRef.current = true;

    const rect = e?.currentTarget?.getBoundingClientRect?.() || {
      left: window.innerWidth - 60,
      top: 30,
      width: 24,
      height: 24,
    };

    const x = e?.clientX && e.clientX > 0 ? e.clientX : (rect.left + rect.width / 2);
    const y = e?.clientY && e.clientY > 0 ? e.clientY : (rect.top + rect.height / 2);

    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transitionClass = isDark ? 'theme-transition-to-light' : 'theme-transition-to-dark';
    document.documentElement.classList.add(transitionClass);

    let activeAnimation = null;

    const transition = document.startViewTransition(() => {
      // Toggle class synchronously so the new theme DOM snapshot is immediate
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      setTheme(newTheme);
    });

    transition.ready.then(() => {
      const keyframes = isDark
        ? [
            `circle(${endRadius}px at ${x}px ${y}px)`,
            `circle(0px at ${x}px ${y}px)`,
          ]
        : [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ];

      activeAnimation = document.documentElement.animate(
        {
          clipPath: keyframes,
        },
        {
          duration: 400,
          easing: 'ease-in-out',
          fill: 'forwards',
          pseudoElement: isDark ? '::view-transition-old(root)' : '::view-transition-new(root)',
        }
      );
    });

    transition.finished.finally(() => {
      if (activeAnimation) {
        activeAnimation.cancel();
      }
      document.documentElement.classList.remove(
        'theme-transition-to-light',
        'theme-transition-to-dark'
      );
      isTransitioningRef.current = false;
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
        <div className="relative flex items-center justify-between h-20 border-b border-black dark:border-neutral-800">
          <motion.div 
            className="flex items-center gap-8"
            animate={{ 
              opacity: isMobileSearchOpen ? 0 : 1, 
              x: isMobileSearchOpen ? -20 : 0,
              pointerEvents: isMobileSearchOpen ? 'none' : 'auto'
            }}
            transition={{ duration: 0.3 }}
          >
            <Link href="/" className="text-2xl font-extrabold tracking-tight text-black dark:text-white">
              SHOPHORIA
            </Link>
          </motion.div>
          
          {/* Desktop Search */}
          <div className="hidden lg:flex flex-grow items-center justify-center px-8">
             <div className="relative w-full max-w-2xl flex border border-black dark:border-neutral-700 rounded-full overflow-hidden" ref={searchContainerRef}>
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

          {/* Mobile Search & Cart Buttons */}
          <div className="lg:hidden flex items-center gap-2">
            <button onClick={() => setIsMobileSearchOpen(true)} className="p-2" aria-label="Open search">
              <Search className="h-6 w-6" />
            </button>
            <button onClick={toggleCart} className="p-2 relative" aria-label="Open cart">
              <ShoppingCart className="h-6 w-6" />
              {cartItems.length > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-black rounded-full">
                  {cartItems.length}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Search Overlay */}
          <AnimatePresence>
            {isMobileSearchOpen && (
              <motion.div 
                className="absolute inset-0 z-30 flex items-center px-4 bg-white dark:bg-[#0d0c0b]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                  <div className="flex-grow">
                      <SearchBar 
                          isMobile={true}
                          searchQuery={searchQuery}
                          onSearchChange={handleSearchInputChange}
                          onSearchFocus={handleSearchFocus}
                          onSearchSubmit={handleSearchSubmit}
                          isFocused={isSearchFocused}
                          searchResults={searchResults}
                          onItemClick={() => { handleSearchItemClick(); setIsMobileSearchOpen(false); }}
                      />
                  </div>
                  <button 
                    onClick={() => setIsMobileSearchOpen(false)} 
                    className="ml-2 p-2 text-slate-500 hover:text-black dark:hover:text-white"
                    aria-label="Close search"
                  >
                      <CloseIcon className="h-6 w-6" />
                  </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="hidden lg:flex items-center gap-4">
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
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-black dark:bg-[#1c1b1a] dark:border dark:border-neutral-700 rounded-full">
                  {cartItems.length}
                </span>
              )}
            </button>
          </div>
          
        </div>

        <div className="flex items-center lg:justify-start gap-1.5 lg:gap-4 py-2 overflow-x-auto lg:overflow-visible scrollbar-none">
          <Link 
            href="/" 
            aria-label="Home"
            className="flex items-center gap-1 lg:gap-1.5 bg-black dark:bg-[#1c1b1a] dark:border dark:border-neutral-700 text-white px-2 lg:px-3 py-1.5 rounded-md text-xs lg:text-sm font-medium hover:bg-neutral-800 dark:hover:bg-neutral-800 transition-colors"
          >
            <Home className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
            <span>Home</span>
          </Link>
          <Link 
            href="/products" 
            aria-label="All Products"
            className="flex items-center gap-1 lg:gap-1.5 bg-black dark:bg-[#1c1b1a] dark:border dark:border-neutral-700 text-white px-2 lg:px-3 py-1.5 rounded-md text-xs lg:text-sm font-medium hover:bg-neutral-800 dark:hover:bg-neutral-800 transition-colors"
          >
            <Package className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
            <span><span className="lg:hidden">Products</span><span className="hidden lg:inline">All Products</span></span>
          </Link>
          <div className="relative" ref={categoriesRef}>
            <button 
                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                aria-label="All Categories"
                className="flex items-center gap-1 lg:gap-2 bg-black dark:bg-[#1c1b1a] dark:border dark:border-neutral-700 text-white px-2 lg:px-3 py-1.5 rounded-md text-xs lg:text-sm font-medium hover:bg-neutral-800 dark:hover:bg-neutral-800 transition-colors"
            >
                <Grid className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
                <span><span className="lg:hidden">Categories</span><span className="hidden lg:inline">All Categories</span></span>
                <ChevronDown className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
            </button>
            <AnimatePresence>
              {isCategoriesOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="fixed lg:absolute top-[125px] lg:top-full left-4 lg:left-0 mt-2 bg-white dark:bg-[#0d0c0b] border border-black dark:border-neutral-800 w-56 max-h-80 overflow-y-auto shadow-xl rounded-md py-1 z-[100]"
                >
                    {dynamicCategoryLinks.map((link, idx) => (
                      <Link 
                        key={link.name + idx} 
                        href={link.href} 
                        onClick={() => setIsCategoriesOpen(false)}
                        className="block px-4 py-2 text-sm text-black dark:text-white hover:bg-orange-50 dark:hover:bg-neutral-800 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                      >
                        {link.name}
                      </Link>
                    ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* New 3-Line Menu */}
          <div className="relative lg:hidden" ref={optionsRef}>
            <button
              onClick={() => setIsOptionsMenuOpen(!isOptionsMenuOpen)}
              aria-label="Options"
              className="p-2 bg-black dark:bg-[#1c1b1a] dark:border dark:border-neutral-700 text-white rounded-md hover:bg-neutral-800 transition-colors"
            >
              <div className="space-y-1">
                <div className="w-4 h-0.5 bg-white"></div>
                <div className="w-4 h-0.5 bg-white"></div>
                <div className="w-4 h-0.5 bg-white"></div>
              </div>
            </button>
            <AnimatePresence>
              {isOptionsMenuOpen && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="fixed top-[125px] right-4 bg-white dark:bg-[#0d0c0b] border border-black dark:border-neutral-800 w-40 shadow-xl rounded-md py-1 z-[100]"
                >
                  <button
                    onClick={(e) => { toggleThemeWithTransition(e); setIsOptionsMenuOpen(false); }}
                    className="w-full text-left px-4 py-2 text-sm text-black dark:text-white hover:bg-orange-50 dark:hover:bg-neutral-800"
                  >
                    {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                  </button>
                  <Link
                    href="/contact"
                    onClick={() => setIsOptionsMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-black dark:text-white hover:bg-orange-50 dark:hover:bg-neutral-800"
                  >
                    Contact
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
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
    </header>
  );
};

export default Navbar;