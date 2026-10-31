"use client";

import React from 'react';
import Link from 'next/link';
import {
  Smartphone,
  CookingPot,
  SprayCan,
  Lightbulb,
  Heart,
  ShoppingBag,
  Smile,
  Car,
  Sparkles,
  Shirt,
  Scissors,
  Package,
} from 'lucide-react';
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

const renderCategoryIcon = (category) => {
  // If admin provided an image URL for the nav
  const imageUrl = category.image || category.navImage || category.iconUrl;
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={category.name}
        className="w-8 h-8 sm:w-10 sm:h-10 object-contain filter drop-shadow brightness-0 invert"
      />
    );
  }

  // If letter is specified (like 'H' or 'B' in screenshot)
  if (category.letter) {
    return (
      <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-wider select-none">
        {category.letter}
      </span>
    );
  }

  // Matching Lucide icons based on iconType or name
  const name = (category.name || '').toLowerCase();
  const type = category.iconType || '';

  if (type === 'gadget' || name.includes('electronic') || name.includes('gadget')) {
    return <Smartphone className="w-7 h-7 sm:w-9 sm:h-9 text-white stroke-[2.2]" />;
  }
  if (type === 'pot' || name.includes('kitchen') || name.includes('cook')) {
    return <CookingPot className="w-7 h-7 sm:w-9 sm:h-9 text-white stroke-[2.2]" />;
  }
  if (type === 'spray' || name.includes('clean')) {
    return <SprayCan className="w-7 h-7 sm:w-9 sm:h-9 text-white stroke-[2.2]" />;
  }
  if (type === 'lightbulb' || name.includes('light')) {
    return <Lightbulb className="w-7 h-7 sm:w-9 sm:h-9 text-white stroke-[2.2]" />;
  }
  if (type === 'heart' || name.includes('health')) {
    return <Heart className="w-7 h-7 sm:w-9 sm:h-9 text-white stroke-[2.2]" />;
  }
  if (type === 'bag' || name.includes('bag') || name.includes('watch')) {
    return <ShoppingBag className="w-7 h-7 sm:w-9 sm:h-9 text-white stroke-[2.2]" />;
  }
  if (type === 'toy' || name.includes('toy') || name.includes('kid')) {
    return <Smile className="w-7 h-7 sm:w-9 sm:h-9 text-white stroke-[2.2]" />;
  }
  if (type === 'car' || name.includes('car') || name.includes('auto')) {
    return <Car className="w-7 h-7 sm:w-9 sm:h-9 text-white stroke-[2.2]" />;
  }
  if (name.includes('fashion') || name.includes('cloth') || name.includes('beauty')) {
    return <Shirt className="w-7 h-7 sm:w-9 sm:h-9 text-white stroke-[2.2]" />;
  }
  if (name.includes('knife')) {
    return <Scissors className="w-7 h-7 sm:w-9 sm:h-9 text-white stroke-[2.2]" />;
  }

  // Default fallback: Initial letter of category name
  const initial = category.name ? category.name.trim().charAt(0).toUpperCase() : 'C';
  return (
    <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-wider select-none">
      {initial}
    </span>
  );
};

const CategoryShowcase = () => {
  const { categories } = useCategories();

  const getHref = (category) => {
    if (category.href) return category.href;
    const slug = category.slug || toSlug(category.name);
    // Aliases to existing dedicated pages if applicable
    if (slug === 'fashion' || slug === 'fashion-beauty') return '/fashion';
    if (slug === 'electronics' || slug === 'electronics-gadgets') return '/electronics';
    if (slug === 'home-toy' || slug === 'toys-kids') return '/home-toy';
    if (slug === 'knife') return '/knife';
    return `/category/${slug}`;
  };

  return (
    <section className="py-8 sm:py-12">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100">
            Shop by Category
          </h2>
        </div>

        {/* Categories Grid matching reference design */}
        <div className="flex flex-wrap items-start justify-center gap-6 sm:gap-8 md:gap-10">
          {categories.map((category, idx) => {
            const href = getHref(category);

            return (
              <Link
                key={category.id || category.slug || idx}
                href={href}
                className="group flex flex-col items-center focus:outline-none transition-transform duration-200"
              >
                {/* Glowing Orange Circle */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-b from-[#ff8200] via-[#ff5a00] to-[#ff3b00] shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300 flex items-center justify-center p-3 sm:p-4">
                  {renderCategoryIcon(category)}
                </div>

                {/* Category Name below Circle */}
                <span className="mt-2.5 text-center text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-[#ff5a00] dark:group-hover:text-orange-400 transition-colors line-clamp-2 max-w-[90px] sm:max-w-[110px] leading-tight select-none">
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