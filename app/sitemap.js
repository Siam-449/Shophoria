import { products } from '../data/products.js';

// Your live website domain
const URL = 'https://shopshophoria.netlify.app';

export default function sitemap() {
  const productUrls = products.map((product) => {
    return {
      url: `${URL}/products/${product.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    };
  });

  const staticUrls = [
    { url: URL, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    { url: `${URL}/products`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${URL}/fashion`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${URL}/electronics`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${URL}/home-toy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${URL}/books`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${URL}/contact`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
  ];

  return [...staticUrls, ...productUrls];
}