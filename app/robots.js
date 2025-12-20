
// Your live website domain
const URL = 'https://www.shophoriabd.com';

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${URL}/sitemap.xml`,
  };
}
