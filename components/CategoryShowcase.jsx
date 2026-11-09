"use client";

import React from 'react';
import Link from 'next/link';
import { useCategories } from '../context/CategoriesContext.jsx';

import { motion } from 'motion/react';

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <section className="py-8 sm:py-12 bg-white dark:bg-[#0d0c0b] transition-colors">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-10"
        >
          <h2 className="text-2xl sm:text-3xl font-extrabold text-black dark:text-white tracking-tight">
            Shop by Category
          </h2>
        </motion.div>

        {/* Categories Grid - Circular Nav Pictures in Black & White Theme */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="flex flex-wrap items-start justify-center gap-6 sm:gap-10 md:gap-12"
        >
          {categories.map((category, idx) => {
            const href = getHref(category);
            const imageUrl = category.image || category.navImage || category.iconUrl || category.img;

            return (
              <motion.div key={category.id || category.slug || idx} variants={itemVariants}>
                <Link
                  href={href}
                  className="group flex flex-col items-center focus:outline-none transition-transform duration-200"
                >
                  {/* Circular Nav Image Frame */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-black dark:border-white shadow-md group-hover:scale-105 transition-all duration-300 bg-neutral-100 dark:bg-neutral-900">
                    {imageUrl ? (
                      <motion.img
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.4 }}
                        src={imageUrl}
                        alt={category.name}
                        className="w-full h-full object-cover"
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
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default CategoryShowcase;