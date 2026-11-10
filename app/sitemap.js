import { getProducts, getCategories } from '../lib/firebase';
import { unstable_noStore as noStore } from 'next/cache';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const URL = 'https://www.shophoriabd.com';

const toSlug = (text) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const getCategoryHref = (category) => {
  if (category.href) return category.href;
  const slug = category.slug || toSlug(category.name);
  if (slug === 'fashion' || slug === 'fashion-beauty') return '/fashion';
  if (slug === 'electronics' || slug === 'electronics-gadgets') return '/electronics';
  if (slug === 'home-toy' || slug === 'toys-kids') return '/home-toy';
  if (slug === 'knife') return '/knife';
  return `/category/${slug}`;
};

export default async function sitemap() {
  noStore();
  const [products, categoriesData] = await Promise.all([
    getProducts(),
    getCategories()
  ]);

  const productUrls = products.map((product) => {
    return {
      url: `${URL}/products/${product.slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    };
  });

  const categories = categoriesData && categoriesData.length > 0 ? categoriesData : [
    { name: 'Fashion & Beauty', slug: 'fashion' },
    { name: 'Electronics', slug: 'electronics' },
    { name: 'Home & Toys', slug: 'home-toy' },
    { name: 'Knife', slug: 'knife' },
  ];

  const categoryUrls = categories.map((cat) => {
    const path = getCategoryHref(cat);
    return {
      url: `${URL}${path.startsWith('/') ? path : `/${path}`}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    };
  });

  const staticUrls = [
    { url: URL, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    { url: `${URL}/products`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${URL}/contact`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
  ];

  const urlMap = new Map();
  [...staticUrls, ...categoryUrls, ...productUrls].forEach((item) => {
    if (!urlMap.has(item.url)) {
      urlMap.set(item.url, item);
    }
  });

  return Array.from(urlMap.values());
}

