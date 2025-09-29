import React from 'react';
import Link from 'next/link';
import { TshirtIcon } from './icons/TshirtIcon';
import { GadgetIcon } from './icons/GadgetIcon';
import { HomeIcon } from './icons/HomeIcon';
import { BookIcon } from './icons/BookIcon';

const categories = [
  {
    name: 'Fashion & Clothing',
    description: 'Premium apparel and accessories',
    href: '/fashion',
    icon: TshirtIcon,
    image: 'https://images.unsplash.com/photo-1581338834647-b0fb40704e21?q=80&w=600&auto=format&fit=crop',
  },
  {
    name: 'Electronics & Gadgets',
    description: 'Latest tech and smart devices',
    href: '/electronics',
    icon: GadgetIcon,
    image: 'https://images.unsplash.com/photo-1582298538104-fe2e74c27f59?q=80&w=600&auto=format&fit=crop',
  },
  {
    name: 'Home & Toy',
    description: 'Elegant home decor, Playable games and Toy',
    href: '/home-toy',
    icon: HomeIcon,
    image: 'https://images.unsplash.com/photo-1557173612-c8f5835c225a?q=80&w=600&auto=format&fit=crop',
  },
  {
    name: 'Books & Media',
    description: 'Curated collection of premium books',
    href: '/books',
    icon: BookIcon,
    image: 'https://images.unsplash.com/photo-1624562522009-c8a73a873831?q=80&w=600&auto=format&fit=crop',
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

        <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-xl shadow-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {categories.map((category) => {
                    const Icon = category.icon;
                    return (
                    <Link
                        key={category.name}
                        href={category.href}
                        className="group block bg-white dark:bg-slate-900 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 ease-in-out hover:-translate-y-1.5"
                    >
                        <div className="relative">
                            <div className="h-48 w-full">
                                <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <Icon className="h-10 w-10 text-white" />
                            </div>
                        </div>
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{category.name}</h3>
                            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{category.description}</p>
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
