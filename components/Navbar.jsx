
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
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-black dark:bg-[#1c1b1a] dark:border dark:border-neutral-700 rounded-full">
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

        <div className="flex items-center gap-2 sm:gap-4 py-2 overflow-x-auto scrollbar-none">
          <Link 
            href="/" 
            aria-label="Home"
            className="flex items-center gap-1.5 bg-black dark:bg-[#1c1b1a] dark:border dark:border-neutral-700 text-white px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap hover:bg-neutral-800 dark:hover:bg-neutral-800 transition-colors"
          >
            <Home className="h-4 w-4" />
            <span>Home</span>
          </Link>
          <Link 
            href="/products" 
            className="bg-black dark:bg-[#1c1b1a] dark:border dark:border-neutral-700 text-white px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap hover:bg-neutral-800 dark:hover:bg-neutral-800 transition-colors"
          >
            All Products
          </Link>
          <div className="relative" ref={categoriesRef}>
            <button 
                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                className="flex items-center gap-2 bg-black dark:bg-[#1c1b1a] dark:border dark:border-neutral-700 text-white px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap hover:bg-neutral-800 dark:hover:bg-neutral-800 transition-colors"
            >
                All Categories
                <ChevronDown className="h-4 w-4" />
            </button>
            {isCategoriesOpen && (
                <div className="absolute top-full left-0 mt-2 bg-white dark:bg-[#0d0c0b] border border-black dark:border-neutral-800 w-56 max-h-80 overflow-y-auto shadow-xl rounded-md py-1 z-50">
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
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-2 text-base font-semibold text-black dark:text-white"
          >
            <Home className="h-5 w-5" />
            <span>Home</span>
          </Link>
          <Link
            href="/products"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-base font-medium text-black dark:text-white"
          >
            All Products
          </Link>
          <div className="border-t border-slate-200 dark:border-neutral-800 pt-3 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Categories</p>
            {dynamicCategoryLinks.map((link, idx) => (
              <Link
                key={link.name + idx}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-base font-medium text-black dark:text-white hover:text-orange-500 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;