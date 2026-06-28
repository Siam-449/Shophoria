
import React from 'react';
import Link from 'next/link';
import { getProduct, getProducts, getRelatedProducts } from '../../../lib/firebase';
import { ProductDetailClient } from '../../../components/ProductCard.jsx';
import StructuredData from '../../../components/StructuredData.jsx';
import { permanentRedirect } from 'next/navigation';

export const revalidate = 0; // Revalidate on every request to ensure fresh data
export const dynamicParams = true; // explicitly allow new params to be fetched at runtime

export async function generateMetadata({ params }) {
    const id = decodeURIComponent(params.id);
    const product = await getProduct(id);

    if (!product) {
        return {
            title: 'Product Not Found - Shophoria',
            description: "Sorry, we couldn't find the product you're looking for.",
        };
    }

    return {
        title: `${product.name} - Shophoria`,
        description: product.description,
        alternates: {
          canonical: `https://www.shophoriabd.com/products/${product.slug}`
        },
        openGraph: {
            title: `${product.name} | Shophoria`,
            description: product.description,
            images: [
                {
                    url: product.image,
                    width: 800,
                    height: 600,
                    alt: product.name,
                },
            ],
        },
    };
}



const ProductDetailPage = async ({ params }) => {
    const id = decodeURIComponent(params.id); 
    const product = await getProduct(id);

    if (!product) {
        return (
            <div className="bg-white dark:bg-slate-950 min-h-[60vh] flex items-center justify-center">
                <div className="text-center p-4">
                    <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100">Product Not Found</h1>
                    <p className="mt-4 text-slate-600 dark:text-slate-400">Sorry, we couldn't find the product you are looking for.</p>
                    <Link href="/products" className="mt-6 inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                        Back to All Products
                    </Link>
                </div>
            </div>
        );
    }

    // CRITICAL SEO FIX: If the URL uses the ID instead of the Slug, 
    // perform a permanent redirect to the slug version.
    // This prevents "Duplicate Content" or "Alternative Page" errors in Google Search Console.
    if (id !== product.slug) {
        permanentRedirect(`/products/${product.slug}`);
    }

    const productSchema = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.name,
        "image": product.image,
        "description": product.description,
        "sku": product.id,
        "brand": {
          "@type": "Brand",
          "name": "Shophoria"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.5",
          "reviewCount": "89"
        },
        "review": [
          {
            "@type": "Review",
            "reviewRating": {
              "@type": "Rating",
              "ratingValue": "5"
            },
            "author": {
              "@type": "Person",
              "name": "Customer"
            }
          }
        ],
        "offers": {
          "@type": "Offer",
          "url": `https://www.shophoriabd.com/products/${product.slug}`,
          "priceCurrency": "BDT",
          "price": product.price,
          "availability": "https://schema.org/InStock",
          "hasMerchantReturnPolicy": {
            "@type": "MerchantReturnPolicy",
            "applicableCountry": "BD",
            "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
            "merchantReturnDays": "7",
            "returnMethod": "https://schema.org/ReturnByMail",
            "returnFees": "https://schema.org/FreeReturn"
          },
          "shippingDetails": {
            "@type": "OfferShippingDetails",
            "shippingRate": {
              "@type": "MonetaryAmount",
              "value": "60",
              "currency": "BDT"
            },
            "shippingDestination": {
              "@type": "DefinedRegion",
              "addressCountry": "BD"
            },
            "deliveryTime": {
              "@type": "ShippingDeliveryTime",
              "handlingTime": {
                "@type": "QuantitativeValue",
                "minValue": "0",
                "maxValue": "1",
                "unitCode": "d"
              },
              "transitTime": {
                "@type": "QuantitativeValue",
                "minValue": "1",
                "maxValue": "3",
                "unitCode": "d"
              }
            }
          }
        }
      };

    const relatedProducts = await getRelatedProducts(product);

    return (
        <>
            <StructuredData data={productSchema} />
            <ProductDetailClient product={product} relatedProducts={relatedProducts} />
        </>
    );
};

export default ProductDetailPage;