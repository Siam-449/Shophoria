import React from 'react';
import Link from 'next/link';

const Hero = () => {
  return (
    <section className="relative bg-slate-900 text-white">
      {/* Background Image Container */}
      <div className="absolute inset-0">
        <img
          src="/banner.jpg"
          alt="Luxury shopping bags and boxes"
          className="w-full h-full object-cover"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Content */}
      <div className="relative mx-auto max-w-screen-xl px-4 py-32 sm:px-6 lg:flex lg:h-[75vh] lg:items-center lg:px-8">
        <div className="max-w-xl text-center sm:text-left">
          <h1 className="text-4xl font-bold sm:text-6xl tracking-wider uppercase">
            SHOPHORIA
          </h1>

          <p className="mt-4 max-w-lg sm:text-xl/relaxed">
            Discover luxury in every category. Fashion, Electronics, Home & Toys, Books & Paints.
          </p>

          <div className="mt-8 flex flex-wrap gap-4 justify-center sm:justify-start">
            <Link
              href="/products"
              className="block w-full rounded bg-white px-12 py-3 text-sm font-medium text-slate-900 shadow hover:bg-slate-200 focus:outline-none focus:ring sm:w-auto transition-colors"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;