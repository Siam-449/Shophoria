import React from 'react';
import Link from 'next/link';
import { TshirtIcon } from './icons/TshirtIcon';
import { GadgetIcon } from './icons/GadgetIcon';
import { HomeIcon } from './icons/HomeIcon';
import { KnifeIcon } from './icons/KnifeIcon';

const categories = [
  {
    name: 'Fashion & Beauty',
    description: 'Stylish apparel, accessories, and beauty products',
    href: '/fashion',
    icon: TshirtIcon,
    image: 'https://res.cloudinary.com/dqki5wiei/image/upload/c_fill,w_600,h_600,f_auto,q_auto/v1759251677/Fashion-_-Clothing_n26a59.jpg',
  },
  {
    name: 'Electronics & Gadgets',
    description: 'Latest tech and smart devices',
    href: '/electronics',
    icon: GadgetIcon,
    image: 'https://res.cloudinary.com/dqki5wiei/image/upload/c_fill,w_600,h_600,f_auto,q_auto/v1759251676/Electronics-_-Gadgets_awvtfq.jpg',
  },
  {
    name: 'Home & Toys',
    description: 'Elegant home decor, playable games, and toys',
    href: '/home-toy',
    icon: HomeIcon,
    image: 'https://res.cloudinary.com/dqki5wiei/image/upload/c_fill,w_600,h_600,f_auto,q_auto/v1759251693/Home-_-Toy_qvbwoc.jpg',
  },
  {
    name: 'Knife',
    description: 'High quality knives and tools',
    href: '/knife',
    icon: KnifeIcon,
    image: 'https://res.cloudinary.com/dqki5wiei/image/upload/c_fill,w_600,h_600,f_auto,q_auto/v1781364320/Knife_vwbnhk.jpg',
  },
];

const CategoryShowcase = () => {
  return (
    <section className="py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-slate-100">Shop by Category</h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            Curated collections of premium products across multiple categories
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 sm:p-8 rounded-xl shadow-lg">
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
                {categories.map((category) => {
                    const Icon = category.icon;
                    return (
                    <Link
                        key={category.name}
                        href={category.href}
                        className="group flex flex-col bg-white dark:bg-slate-900 rounded-lg overflow-hidden shadow-sm sm:shadow-md border border-slate-200 dark:border-slate-800 sm:border-none sm:hover:shadow-xl transition-all duration-300 ease-in-out hover:-translate-y-1.5"
                    >
                        <div className="relative overflow-hidden aspect-square">
                            <img src={category.image} alt={category.name} className="w-full h-full object-contain sm:object-cover group-hover:scale-105 sm:group-hover:scale-100 transition-transform duration-300" />
                            <div className="hidden sm:flex absolute inset-0 bg-black/40 items-center justify-center">
                                <Icon className="h-6 w-6 sm:h-10 sm:w-10 text-white" />
                            </div>
                        </div>
                        <div className="p-3 sm:p-6 flex flex-col flex-grow sm:justify-between" style={{ minHeight: '80px' }}>
                            <h3 className="text-sm font-medium sm:text-lg sm:font-semibold text-slate-700 sm:text-slate-900 dark:text-slate-300 dark:sm:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 sm:group-hover:text-slate-900 dark:sm:group-hover:text-slate-100 transition-colors line-clamp-2">{category.name}</h3>
                            <p className="mt-1 text-xs sm:text-sm text-slate-500 sm:text-slate-600 dark:text-slate-400 line-clamp-2">{category.description}</p>
                        </div>
                    </Link>
                    )
                })}
            </div>
        </div>

      </div>
    </section>
  );
};

export default CategoryShowcase;