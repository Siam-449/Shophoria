"use client";

import React from 'react';
import Link from 'next/link';
import { useCategories } from '../context/CategoriesContext.jsx';

const toSlug = (text) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const CategoryShowcase = () => {
  const { categories } = useCategories();

  const getHref = (category) => {
    if (category.href) return category.href;
    const slug = category.slug || toSlug(category.name);
    if (slug === 'fashion' || slug === 'fashion-beauty') return '/fashion';
    if (slug === 'electronics' || slug === 'electronics-gadgets') return '/electronics';
    if (slug === 'home-toy' || slug === 'toys-kids') return '/home-toy';
    if (slug === 'knife') return '/knife';
    return `/category/${slug}`;
  };

  return (
    <section className="py-8 sm:py-12 bg-white dark:bg-[#0d0c0b] transition-colors">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-black dark:text-white tracking-tight">
            Shop by Category
          </h2>
        </div>

        {/* Categories Grid - Circular Nav Pictures in Black & White Theme */}
        <div className="flex flex-wrap items-start justify-center gap-6 sm:gap-10 md:gap-12">
          {categories.map((category, idx) => {
            const href = getHref(category);
            const imageUrl = category.image || category.navImage || category.iconUrl || category.img;

            return (
              <Link
                key={category.id || category.slug || idx}
                href={href}
                className="group flex flex-col items-center focus:outline-none transition-transform duration-200"
              >
                {/* Circular Nav Image Frame */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-black dark:border-white shadow-md group-hover:scale-105 transition-all duration-300 bg-neutral-100 dark:bg-neutral-900">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-black dark:bg-white text-white dark:text-black font-extrabold text-xl">
                      {category.name ? category.name.charAt(0) : 'C'}
                    </div>
                  )}
                </div>

                {/* Category Name below Circle */}
                <span className="mt-3 text-center text-xs sm:text-sm font-bold text-black dark:text-white group-hover:underline transition-all line-clamp-2 max-w-[100px] sm:max-w-[120px] leading-tight select-none">
                  {category.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoryShowcase;