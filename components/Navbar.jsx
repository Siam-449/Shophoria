
"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useCart } from '../context/CartContext.jsx';
import { products } from '../data/products.js';
import { usePathname, useRouter } from 'next/navigation';
import { SearchIcon } from './icons/SearchIcon.jsx';
import { MoonIcon } from './icons/MoonIcon.jsx';
import { SunIcon } from './icons/SunIcon.jsx';
import { CartIcon } from './icons/CartIcon.jsx';
import { MenuIcon } from './icons/MenuIcon.jsx';
import { CloseIcon } from './icons/CloseIcon.jsx';

// Moved SearchBar outside of Navbar to prevent re-mounting on every render, which was causing focus loss.
const SearchBar = ({ 
  isMobile = false,
  searchQuery,
  onSearchChange,
  onSearchFocus,
  isFocused,
  searchResults,
  onItemClick
}) => {
  return (
    <>
      <form onSubmit={(e) => e.preventDefault()} className="relative">
        <span className={`absolute inset-y-0 left-0 flex items-center ${isMobile ? 'pl-5' : 'pl-3'}`}>
          <SearchIcon className="h-5 w-5 text-slate-400" />
        </span>
        <input
          type="search"
          name="search"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={onSearchChange}
          onFocus={onSearchFocus}
          autoComplete="off"
          className={`w-full py-2 pl-10 pr-4 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${!isMobile && 'w-56 lg:w-64 transition-all'}`}
        />
      </form>
      {isFocused && (
        <div className="absolute top-full mt-2 w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md shadow-lg z-20 max-h-96 overflow-y-auto">
          <ul>
            {searchResults.length > 0 ? searchResults.map(product => (
              <li key={product.id}>
                <button 
                  onClick={() => onItemClick(`/products/${product.id}`)} 
                  className="flex items-center gap-4 p-3 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors w-full text-left"
                >
                  <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded" />
                  <div>
                    <p className="font-semibold text-sm text-slate-800 dark:text-slate-100">{product.name}</p>
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">৳{product.price.toLocaleString()}</p>
                  </div>
                </button>
              </li>
            )) : (
                <li className="p-3 text-center text-sm text-slate-500 dark:text-slate-400">No products found.</li>
             )}
          </ul>
        </div>
      )}
    </>
  );
};


const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { toggleCart, cartItems } = useCart();
  const pathname = usePathname();
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }

    const lowerCaseQuery = searchQuery.trim().toLowerCase();
    const filtered = products.filter(product => {
      const productName = product.name.toLowerCase();
      const productId = String(product.id).toLowerCase();

      if (product.id === 'badann') {
        return productId === lowerCaseQuery || productName === lowerCaseQuery;
      }

      return productName.includes(lowerCaseQuery) || productId.includes(lowerCaseQuery);
    }).slice(0, 5);
    setSearchResults(filtered);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchContainerRef]);

  const handleSearchItemClick = (href) => {
    router.push(href);
    setSearchQuery('');
    setSearchResults([]);
    setIsSearchFocused(false);
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
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
    { name: 'Books & Paints', href: '/books' },
    { name: 'Contact', href: '/contact' },
  ];

  const renderThemeChanger = () => {
    if (!mounted) return null;
    return theme === 'dark' 
      ? <SunIcon className="h-6 w-6" onClick={() => setTheme('light')} /> 
      : <MoonIcon className="h-6 w-6" onClick={() => setTheme('dark')} />;
  };

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
      <nav className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              SHOPHORIA
            </Link>
            <div className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href === '/products' && pathname.startsWith('/products/'));
                return (
                    <Link
                    key={link.name}
                    href={link.href}
                    className={`text-sm font-medium transition-colors ${
                        isActive
                        ? 'text-slate-900 dark:text-white font-semibold'
                        : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                    }`}
                    >
                    {link.name}
                    </Link>
                );
              })}
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <div className="relative" ref={!isMobileMenuOpen ? searchContainerRef : null}>
                <SearchBar 
                    searchQuery={searchQuery}
                    onSearchChange={handleSearchInputChange}
                    onSearchFocus={handleSearchFocus}
                    isFocused={isSearchFocused}
                    searchResults={searchResults}
                    onItemClick={handleSearchItemClick}
                />
            </div>
            <button aria-label="Toggle theme" className="p-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">
              {renderThemeChanger()}
            </button>
            <button onClick={toggleCart} aria-label="Open cart" className="relative p-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">
              <CartIcon className="h-6 w-6" />
              {cartItems.length > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                  {cartItems.length}
                </span>
              )}
            </button>
          </div>

          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </nav>

      <div 
        id="mobile-menu" 
        className={`lg:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-all duration-300 ease-in-out overflow-hidden ${isMobileMenuOpen ? 'max-h-screen' : 'max-h-0'}`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <div className="relative p-2" ref={isMobileMenuOpen ? searchContainerRef : null}>
            <SearchBar 
                isMobile={true} 
                searchQuery={searchQuery}
                onSearchChange={handleSearchInputChange}
                onSearchFocus={handleSearchFocus}
                isFocused={isSearchFocused}
                searchResults={searchResults}
                onItemClick={handleSearchItemClick}
            />
          </div>
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href === '/products' && pathname.startsWith('/products/'));
            return (
                <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800'
                }`}
                >
                {link.name}
                </Link>
            );
          })}
            <div className="border-t border-slate-200 dark:border-slate-700 mt-4 pt-4 flex justify-around items-center">
              <button aria-label="Toggle theme" className="p-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">
                  {renderThemeChanger()}
              </button>
              <button onClick={() => { toggleCart(); setIsMobileMenuOpen(false); }} aria-label="Open cart" className="relative p-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">
                  <CartIcon className="h-6 w-6" />
                   {cartItems.length > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                      {cartItems.length}
                    </span>
                  )}
              </button>  
            </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;