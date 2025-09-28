import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-slate-900">
      <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="text-white">
            <h2 className="text-2xl font-bold">SHOPHORIA</h2>
            <p className="mt-4 text-slate-300 max-w-xs">
              Your destination for luxury shopping across multiple categories.
            </p>
          </div>

          <div>
            <p className="font-bold text-white">Categories</p>
            <ul className="mt-6 space-y-4 text-sm">
              <li><Link href="/fashion" className="text-slate-300 transition hover:text-white">Fashion</Link></li>
              <li><Link href="/electronics" className="text-slate-300 transition hover:text-white">Electronics</Link></li>
              <li><Link href="/home-garden" className="text-slate-300 transition hover:text-white">Home & Garden</Link></li>
              <li><Link href="/books" className="text-slate-300 transition hover:text-white">Books</Link></li>
            </ul>
          </div>

          <div>
            <p className="font-bold text-white">Customer Service</p>
            <ul className="mt-6 space-y-4 text-sm">
              <li><Link href="/contact" className="text-slate-300 transition hover:text-white">Contact Us</Link></li>
              <li><Link href="/shipping" className="text-slate-300 transition hover:text-white">Shipping Info</Link></li>
              <li><Link href="/returns" className="text-slate-300 transition hover:text-white">Returns</Link></li>
              <li><Link href="/size-guide" className="text-slate-300 transition hover:text-white">Size Guide</Link></li>
            </ul>
          </div>

          <div>
            <p className="font-bold text-white">Connect</p>
            <ul className="mt-6 space-y-4 text-sm">
              <li><a href="#" target="_blank" rel="noopener noreferrer" className="text-slate-300 transition hover:text-white">Instagram</a></li>
              <li><a href="#" target="_blank" rel="noopener noreferrer" className="text-slate-300 transition hover:text-white">Facebook</a></li>
              <li><a href="#" target="_blank" rel="noopener noreferrer" className="text-slate-300 transition hover:text-white">Twitter</a></li>
              <li><Link href="/newsletter" className="text-slate-300 transition hover:text-white">Newsletter</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-700 pt-8 sm:flex sm:items-center sm:justify-between">
          <p className="text-sm text-slate-400">
            &copy; {new Date().getFullYear()} SHOPHORIA. All rights reserved.
          </p>
          <div className="mt-4 flex gap-x-6 sm:mt-0">
            <Link href="/privacy" className="text-sm text-slate-400 transition hover:text-white">Privacy Policy</Link>
            <Link href="/terms" className="text-sm text-slate-400 transition hover:text-white">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
