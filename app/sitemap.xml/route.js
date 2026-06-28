import { getProducts } from '../../lib/firebase';

const URL = 'https://www.shophoriabd.com';

function generateSiteMap(products) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <url>
       <loc>${URL}</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <changefreq>monthly</changefreq>
       <priority>1.0</priority>
     </url>
     <url>
       <loc>${URL}/products</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <changefreq>weekly</changefreq>
       <priority>0.9</priority>
     </url>
     <url>
       <loc>${URL}/fashion</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <changefreq>monthly</changefreq>
       <priority>0.7</priority>
     </url>
     <url>
       <loc>${URL}/electronics</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <changefreq>monthly</changefreq>
       <priority>0.7</priority>
     </url>
     <url>
       <loc>${URL}/home-toy</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <changefreq>monthly</changefreq>
       <priority>0.7</priority>
     </url>
     <url>
       <loc>${URL}/knife</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <changefreq>monthly</changefreq>
       <priority>0.7</priority>
     </url>
     <url>
       <loc>${URL}/contact</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <changefreq>yearly</changefreq>
       <priority>0.5</priority>
     </url>
     ${products
       .map((product) => {
         return `
       <url>
           <loc>${`${URL}/products/${product.slug}`}</loc>
           <lastmod>${new Date().toISOString()}</lastmod>
           <changefreq>daily</changefreq>
           <priority>0.8</priority>
       </url>
     `;
       })
       .join('')}
   </urlset>
 `;
}

export const dynamic = 'force-dynamic';

export async function GET() {
  const products = await getProducts();
  const body = generateSiteMap(products);

  return new Response(body, {
    status: 200,
    headers: {
      'Cache-Control': 'no-store, max-age=0',
      'Content-Type': 'application/xml',
    },
  });
}
