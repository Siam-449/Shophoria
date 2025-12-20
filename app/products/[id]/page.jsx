
import React from 'react';
import Link from 'next/link';
import { getProduct, getProducts } from '../../../lib/firebase';
import { ProductDetailClient } from '../../../components/ProductCard.jsx';

export async function generateMetadata({ params }) {
    const { id } = params;
    const product = await getProduct(id);

    if (!product) {
        return {
            title: 'Product Not Found - SHOPHORIA',
            description: "Sorry, we couldn't find the product you're looking for.",
        };
    }

    return {
        title: `${product.name} - SHOPHORIA`,
        description: product.description,
        alternates: {
          canonical: `/products/${product.slug}`
        }
    };
}

export async function generateStaticParams() {
    const products = await getProducts();
    // Pre-renders the slug-based pages for SEO
    return products.map(product => ({
        id: product.slug,
    }));
}

const ProductDetailPage = async ({ params }) => {
    const { id } = params; 
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

    return <ProductDetailClient product={product} />;
};

export default ProductDetailPage;
