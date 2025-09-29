import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-slate-900 dark:bg-white">
      <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="text-white dark:text-slate-900">
            <h2 className="text-2xl font-bold">SHOPHORIA</h2>
            <p className="mt-4 text-slate-300 dark:text-slate-600 max-w-xs">
              Your destination for luxury shopping across multiple categories.
            </p>
          </div>

          <div>
            <p className="font-bold text-white dark:text-slate-900">Categories</p>
            <ul className="mt-6 space-y-4 text-sm">
              <li><Link href="/fashion" className="text-slate-300 dark:text-slate-600 transition hover:text-white dark:hover:text-slate-900">Fashion</Link></li>
              <li><Link href="/electronics" className="text-slate-300 dark:text-slate-600 transition hover:text-white dark:hover:text-slate-900">Electronics</Link></li>
              <li><Link href="/home-toy" className="text-slate-300 dark:text-slate-600 transition hover:text-white dark:hover:text-slate-900">Home & Toy</Link></li>
              <li><Link href="/books" className="text-slate-300 dark:text-slate-600 transition hover:text-white dark:hover:text-slate-900">Books & Paints</Link></li>
            </ul>
          </div>

          <div>
            <p className="font-bold text-white dark:text-slate-900">Customer Service</p>
            <ul className="mt-6 space-y-4 text-sm">
              <li><Link href="/contact" className="text-slate-300 dark:text-slate-600 transition hover:text-white dark:hover:text-slate-900">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <p className="font-bold text-white dark:text-slate-900">Connect</p>
            <ul className="mt-6 space-y-4 text-sm">
              <li><a href="https://www.instagram.com/__shophoria__" target="_blank" rel="noopener noreferrer" className="text-slate-300 dark:text-slate-600 transition hover:text-white dark:hover:text-slate-900">Instagram</a></li>
              <li><a href="https://www.facebook.com/saeedakhansumai" target="_blank" rel="noopener noreferrer" className="text-slate-300 dark:text-slate-600 transition hover:text-white dark:hover:text-slate-900">Facebook</a></li>
              <li><a href="https://s.daraz.com.bd/s.ZscSw" target="_blank" rel="noopener noreferrer" className="text-slate-300 dark:text-slate-600 transition hover:text-white dark:hover:text-slate-900">Daraz</a></li>
              <li><a href="https://www.tiktok.com/@shophoria26?_t=ZS-906nScpkuVc&_r=1" target="_blank" rel="noopener noreferrer" className="text-slate-300 dark:text-slate-600 transition hover:text-white dark:hover:text-slate-900">TikTok</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-700 dark:border-slate-200 pt-8 sm:flex sm:items-center sm:justify-between">
          <p className="text-sm text-slate-400 dark:text-slate-500">
            &copy; {new Date().getFullYear()} SHOPHORIA. All rights reserved.
          </p>
          <div className="mt-4 sm:mt-0">
            <p className="text-sm text-slate-400 dark:text-slate-500">
              Developed by{' '}
              <a 
                href="https://siamdev.netlify.app/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="font-medium underline transition hover:text-white dark:hover:text-slate-900"
              >
                SIAM
              </a>.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;