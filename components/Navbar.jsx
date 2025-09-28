"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { SearchIcon } from './icons/SearchIcon.jsx';
import { MoonIcon } from './icons/MoonIcon.jsx';
import { SunIcon } from './icons/SunIcon.jsx';
import { CartIcon } from './icons/CartIcon.jsx';
import { MenuIcon } from './icons/MenuIcon.jsx';
import { CloseIcon } from './icons/CloseIcon.jsx';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navLinks = [
    { name: 'All Products', href: '/products' },
    { name: 'Fashion', href: '/fashion' },
    { name: 'Electronics', href: '/electronics' },
    { name: 'Home & Garden', href: '/home-garden' },
    { name: 'Books', href: '/books' },
    { name: 'Contact', href: '/contact' },
  ];

  const renderThemeChanger = () => {
    if (!mounted) return null;

    if (theme === 'dark') {
      return <SunIcon className="h-6 w-6" onClick={() => setTheme('light')} />;
    } else {
      return <MoonIcon className="h-6 w-6" onClick={() => setTheme('dark')} />;
    }
  };

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
      <nav className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left section: Logo and Nav Links */}
          <div className="flex items-center gap-8">
            <Link href="/" className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              SHOPHORIA
            </Link>
            <div className="hidden xl:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right section: Search and Icons (Desktop) */}
          <div className="hidden xl:flex items-center gap-4">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <SearchIcon className="h-5 w-5 text-slate-400" />
              </span>
              <input
                type="search"
                name="search"
                id="search"
                placeholder="Search products..."
                className="w-64 xl:w-80 py-2 pl-10 pr-4 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
            <button aria-label="Toggle theme" className="p-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">
              {renderThemeChanger()}
            </button>
            <Link href="/cart" aria-label="Open cart" className="p-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">
              <CartIcon className="h-6 w-6" />
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="xl:hidden flex items-center">
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

      {/* Mobile Menu */}
      <div 
        id="mobile-menu" 
        className={`xl:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-all duration-300 ease-in-out overflow-hidden ${isMobileMenuOpen ? 'max-h-screen' : 'max-h-0'}`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <div className="relative p-2">
            <span className="absolute inset-y-0 left-0 flex items-center pl-5">
              <SearchIcon className="h-5 w-5 text-slate-400" />
            </span>
            <input
              type="search"
              placeholder="Search products..."
              className="w-full py-2 pl-10 pr-4 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800"
            >
              {link.name}
            </Link>
          ))}
            <div className="border-t border-slate-200 dark:border-slate-700 mt-4 pt-4 flex justify-around">
              <button aria-label="Toggle theme" className="p-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">
                  {renderThemeChanger()}
              </button>
              <Link href="/cart" aria-label="Open cart" onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">
                  <CartIcon className="h-6 w-6" />
              </Link>
            </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;