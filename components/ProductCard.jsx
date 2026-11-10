
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext.jsx';
import CountdownTimer from './CountdownTimer.jsx';
import { CheckIcon } from './icons/CheckIcon.jsx';
import RelatedProducts from './RelatedProducts.jsx';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, ShoppingCart, Check } from 'lucide-react';

const ProductCard = ({ product }) => {
  const { addItemToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  
  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const handleAddToCart = () => {
    addItemToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
      className="relative bg-white dark:bg-[#141414] rounded-xl sm:rounded-2xl overflow-hidden group shadow-sm hover:shadow-md border border-slate-200 dark:border-neutral-800 flex flex-col h-full p-3 sm:p-4 transition-all"
    >
      {discountPercentage && (
        <div className="absolute top-4 right-4 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-full z-10 shadow-sm">
          -{discountPercentage}%
        </div>
      )}
      <Link href={`/products/${product.slug}`} aria-label={`View details for ${product.name}`}>
        <div className="overflow-hidden aspect-square rounded-lg bg-slate-50 dark:bg-neutral-900 mb-3 flex items-center justify-center p-2">
            <img src={product.image} alt={product.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" />
        </div>
      </Link>
      <div className="flex flex-col flex-grow">
        <Link href={`/products/${product.slug}`} className="flex-grow">
          <h3 className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">{product.name}</h3>
          <p className="mt-1 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{product.description}</p>
        </Link>
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-neutral-800/80">
          <div className="flex justify-between items-center mb-2.5">
            <div className="flex items-baseline gap-1.5 sm:gap-2">
              <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">৳{product.price.toLocaleString()}</p>
              {product.originalPrice && product.originalPrice > product.price && (
                <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-500 line-through">৳{product.originalPrice.toLocaleString()}</p>
              )}
            </div>
            <p className={`text-[10px] sm:text-xs font-semibold ${product.quantity > 5 ? 'text-green-600 dark:text-green-400' : product.quantity > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'}`}>
              {product.quantity > 0 ? 'In Stock' : 'Out of Stock'}
            </p>
          </div>
          <button 
            onClick={handleAddToCart}
            disabled={product.quantity <= 0 || isAdded}
            className={`w-full py-2.5 px-3 text-white text-xs sm:text-sm font-medium rounded-lg transition-colors duration-300 flex items-center justify-center gap-1.5 ${
              isAdded 
              ? 'bg-green-600 text-white' 
              : 'bg-black dark:bg-[#1c1b1a] dark:border dark:border-neutral-700 text-white hover:bg-neutral-800 dark:hover:bg-neutral-800'
            } disabled:bg-slate-400 dark:disabled:bg-slate-700 disabled:cursor-not-allowed`}
          >
            {isAdded ? (
                <>
                    <CheckIcon className="h-4 w-4" /> Added!
                </>
            ) : product.quantity > 0 ? (
                'Add to Cart'
            ) : (
                'Out of Stock'
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;

export const ProductDetailClient = ({ product, relatedProducts }) => {
    const { addItemToCart } = useCart();
    const [isAdded, setIsAdded] = useState(false);
    const [buyQuantity, setBuyQuantity] = useState(1);

    // Multi-image handling
    const images = (product.images && product.images.length > 0)
      ? product.images
      : [product.image].filter(Boolean);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    // Variants and attributes handling
    const variants = Array.isArray(product.variants) ? product.variants : [];

    const availableColors = (product.colors && product.colors.length > 0)
      ? product.colors
      : Array.from(new Set(variants.map(v => v.color).filter(Boolean)));

    const availableSizes = (product.sizes && product.sizes.length > 0)
      ? product.sizes
      : Array.from(new Set(variants.map(v => v.size).filter(Boolean)));

    const availableWeights = (product.weights && product.weights.length > 0)
      ? product.weights
      : Array.from(new Set(variants.map(v => v.weight).filter(Boolean)));

    const [selectedColor, setSelectedColor] = useState(availableColors[0] || null);
    const [selectedSize, setSelectedSize] = useState(availableSizes[0] || null);
    const [selectedWeight, setSelectedWeight] = useState(availableWeights[0] || null);
    const [selectedVariantId, setSelectedVariantId] = useState(variants[0]?.id || null);

    // Resolve the active variant based on user selection or explicit variant
    const activeVariant = variants.length > 0
      ? (variants.find(v => {
          const matchColor = !selectedColor || !v.color || v.color === selectedColor;
          const matchSize = !selectedSize || !v.size || v.size === selectedSize;
          const matchWeight = !selectedWeight || !v.weight || v.weight === selectedWeight;
          return matchColor && matchSize && matchWeight;
        }) || variants.find(v => v.id === selectedVariantId) || variants[0])
      : null;

    // Dynamic price, original price, and quantity
    const currentPrice = activeVariant?.price != null ? activeVariant.price : product.price;
    const currentOriginalPrice = activeVariant?.originalPrice != null ? activeVariant.originalPrice : product.originalPrice;
    const currentQuantity = activeVariant?.quantity != null ? activeVariant.quantity : (product.quantity || 0);

    const discountPercentage = currentOriginalPrice && currentOriginalPrice > currentPrice
      ? Math.round(((currentOriginalPrice - currentPrice) / currentOriginalPrice) * 100)
      : null;

    const handleColorSelect = (color) => {
      setSelectedColor(color);
      const matchedVariant = variants.find(v => v.color === color && v.image);
      if (matchedVariant?.image) {
        const imgIndex = images.indexOf(matchedVariant.image);
        if (imgIndex !== -1) {
          setSelectedImageIndex(imgIndex);
        }
      }
    };

    const handleVariantSelect = (variant) => {
      setSelectedVariantId(variant.id);
      if (variant.color) setSelectedColor(variant.color);
      if (variant.size) setSelectedSize(variant.size);
      if (variant.weight) setSelectedWeight(variant.weight);
      if (variant.image) {
        const imgIndex = images.indexOf(variant.image);
        if (imgIndex !== -1) {
          setSelectedImageIndex(imgIndex);
        }
      }
    };

    const handlePrevImage = () => {
      setSelectedImageIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const handleNextImage = () => {
      setSelectedImageIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const handleAddToCart = () => {
      const activeImage = images[selectedImageIndex] || product.image;
      addItemToCart({
        ...product,
        price: currentPrice,
        originalPrice: currentOriginalPrice,
        image: activeImage,
        selectedVariant: activeVariant,
        selectedColor,
        selectedSize,
        selectedWeight,
      }, buyQuantity);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-[#0a0a0a] py-6 sm:py-10"
        >
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumbs Navigation */}
                <nav className="mb-6 sm:mb-8 flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    <Link href="/" className="hover:text-slate-900 dark:hover:text-white transition-colors">Home</Link>
                    <span>/</span>
                    <Link href="/products" className="hover:text-slate-900 dark:hover:text-white transition-colors">Shop</Link>
                    {product.category && (
                        <>
                            <span>/</span>
                            <Link href={`/category/${product.category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} className="hover:text-slate-900 dark:hover:text-white transition-colors">
                                {product.category}
                            </Link>
                        </>
                    )}
                    <span>/</span>
                    <span className="text-slate-800 dark:text-slate-200 font-medium truncate max-w-[200px] sm:max-w-md">
                        {product.name}
                    </span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                    {/* Left Side: Images Gallery (Vertical thumbnails on desktop + Main image) */}
                    <div className="lg:col-span-6 flex flex-col-reverse lg:flex-row gap-3.5 sm:gap-4 items-start w-full">
                        {/* Thumbnail Strip: Vertical on desktop, horizontal on mobile */}
                        {images.length > 1 && (
                            <div className="flex lg:flex-col gap-2.5 sm:gap-3 overflow-x-auto lg:overflow-y-auto max-h-[540px] scrollbar-none w-full lg:w-20 flex-shrink-0 py-1">
                                {images.map((img, idx) => (
                                    <button
                                        key={img + idx}
                                        type="button"
                                        onClick={() => setSelectedImageIndex(idx)}
                                        className={`relative w-16 h-16 sm:w-20 sm:h-20 aspect-square rounded-xl overflow-hidden border-2 transition-all p-1.5 bg-white dark:bg-[#141414] flex items-center justify-center flex-shrink-0 ${
                                            selectedImageIndex === idx
                                                ? 'border-orange-500 shadow-sm ring-2 ring-orange-500/20'
                                                : 'border-slate-200 dark:border-neutral-800 opacity-70 hover:opacity-100 hover:border-slate-400'
                                        }`}
                                    >
                                        <img 
                                            src={img} 
                                            alt={`${product.name} thumbnail ${idx + 1}`} 
                                            className="w-full h-full object-contain" 
                                        />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Main Image Box */}
                        <div className="flex-1 w-full bg-[#f8f9fb] dark:bg-[#141414] rounded-2xl sm:rounded-3xl p-6 sm:p-10 aspect-square flex items-center justify-center relative border border-slate-100 dark:border-neutral-800/80 shadow-xs">
                            {product.expiresAt && (
                                <div className="absolute top-4 left-4 right-4 z-10">
                                    <CountdownTimer expiresAt={product.expiresAt} />
                                </div>
                            )}

                            {discountPercentage && (
                                <div className="absolute top-4 left-4 bg-red-600 text-white text-xs sm:text-sm font-bold px-3 py-1 rounded-full z-10 shadow-sm">
                                    -{discountPercentage}%
                                </div>
                            )}

                            {images.length > 1 && (
                                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full z-10">
                                    {selectedImageIndex + 1} / {images.length}
                                </div>
                            )}

                            <img 
                                src={images[selectedImageIndex] || product.image} 
                                alt={product.name} 
                                className="w-full h-full object-contain transition-all duration-300" 
                            />

                            {/* Left & Right navigation chevrons for multiple images */}
                            {images.length > 1 && (
                                <>
                                    <button
                                        type="button"
                                        onClick={handlePrevImage}
                                        aria-label="Previous product image"
                                        className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 dark:bg-neutral-800/90 hover:bg-white dark:hover:bg-neutral-700 text-slate-800 dark:text-white shadow-md transition-transform hover:scale-110 z-10"
                                    >
                                        <ChevronLeft className="h-5 w-5" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleNextImage}
                                        aria-label="Next product image"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 dark:bg-neutral-800/90 hover:bg-white dark:hover:bg-neutral-700 text-slate-800 dark:text-white shadow-md transition-transform hover:scale-110 z-10"
                                    >
                                        <ChevronRight className="h-5 w-5" />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Right Side: Product Details */}
                    <div className="lg:col-span-6 flex flex-col">
                        {/* Title */}
                        <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
                            {product.name}
                        </h1>

                        {/* Stock Badge with Dot Indicator */}
                        <div className="mt-3">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                                currentQuantity > 0 
                                    ? 'bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 border border-orange-200/60 dark:border-orange-900/40' 
                                    : 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200/60 dark:border-red-900/40'
                            }`}>
                                <span className={`w-2 h-2 rounded-full ${currentQuantity > 0 ? 'bg-orange-500' : 'bg-red-500'}`}></span>
                                {currentQuantity > 0 ? 'In Stock' : 'Out of Stock'}
                            </span>
                        </div>

                        {/* Price */}
                        <div className="mt-4 flex items-baseline gap-3">
                            <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                                ৳{currentPrice.toLocaleString()}
                            </p>
                            {currentOriginalPrice && currentOriginalPrice > currentPrice && (
                                <p className="text-xl sm:text-2xl text-slate-400 dark:text-slate-500 line-through font-normal">
                                    ৳{currentOriginalPrice.toLocaleString()}
                                </p>
                            )}
                        </div>

                        {/* Description Box (styled shaded box matching screenshot) */}
                        {product.description && (
                            <div className="mt-5 p-4 sm:p-5 rounded-xl bg-[#f0f4f9] dark:bg-[#161616] border border-slate-200/60 dark:border-neutral-800/80 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                                {product.description}
                            </div>
                        )}

                        {/* Color Selector (if available) */}
                        {availableColors.length > 0 && (
                            <div className="mt-5">
                                <label className="block text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">
                                    Color: <span className="font-normal text-slate-600 dark:text-slate-400">{selectedColor || 'Select'}</span>
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {availableColors.map((color) => {
                                        const isSelected = selectedColor === color;
                                        return (
                                            <button
                                                key={color}
                                                type="button"
                                                onClick={() => handleColorSelect(color)}
                                                className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm transition-all ${
                                                    isSelected
                                                        ? 'bg-orange-500 text-white font-semibold shadow-sm ring-2 ring-orange-500/20'
                                                        : 'bg-slate-50 dark:bg-neutral-900 border border-slate-300 dark:border-neutral-700 text-slate-800 dark:text-slate-200 hover:border-slate-400 font-medium'
                                                }`}
                                            >
                                                {color}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Size Selector (if available) */}
                        {availableSizes.length > 0 && (
                            <div className="mt-4">
                                <label className="block text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">
                                    Size: <span className="font-normal text-slate-600 dark:text-slate-400">{selectedSize || 'Select'}</span>
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {availableSizes.map((size) => {
                                        const isSelected = selectedSize === size;
                                        return (
                                            <button
                                                key={size}
                                                type="button"
                                                onClick={() => setSelectedSize(size)}
                                                className={`min-w-[44px] px-3.5 py-1.5 rounded-lg text-xs sm:text-sm transition-all ${
                                                    isSelected
                                                        ? 'bg-orange-500 text-white font-semibold shadow-sm ring-2 ring-orange-500/20'
                                                        : 'bg-slate-50 dark:bg-neutral-900 border border-slate-300 dark:border-neutral-700 text-slate-800 dark:text-slate-200 hover:border-slate-400 font-medium'
                                                }`}
                                            >
                                                {size}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Weight Selector (if available) */}
                        {availableWeights.length > 0 && (
                            <div className="mt-4">
                                <label className="block text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">
                                    Weight: <span className="font-normal text-slate-600 dark:text-slate-400">{selectedWeight || 'Select'}</span>
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {availableWeights.map((weight) => {
                                        const isSelected = selectedWeight === weight;
                                        return (
                                            <button
                                                key={weight}
                                                type="button"
                                                onClick={() => setSelectedWeight(weight)}
                                                className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm transition-all ${
                                                    isSelected
                                                        ? 'bg-orange-500 text-white font-semibold shadow-sm ring-2 ring-orange-500/20'
                                                        : 'bg-slate-50 dark:bg-neutral-900 border border-slate-300 dark:border-neutral-700 text-slate-800 dark:text-slate-200 hover:border-slate-400 font-medium'
                                                }`}
                                            >
                                                {weight}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Variant Selector (if available) */}
                        {variants.length > 1 && variants.some(v => v.name && !availableColors.includes(v.name) && !availableSizes.includes(v.name) && !availableWeights.includes(v.name)) && (
                            <div className="mt-4">
                                <label className="block text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">
                                    Variant: <span className="font-normal text-slate-600 dark:text-slate-400">{activeVariant?.name || 'Select'}</span>
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {variants.map((variant) => {
                                        const isSelected = activeVariant?.id === variant.id;
                                        return (
                                            <button
                                                key={variant.id}
                                                type="button"
                                                onClick={() => handleVariantSelect(variant)}
                                                className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm transition-all ${
                                                    isSelected
                                                        ? 'bg-orange-500 text-white font-semibold shadow-sm ring-2 ring-orange-500/20'
                                                        : 'bg-slate-50 dark:bg-neutral-900 border border-slate-300 dark:border-neutral-700 text-slate-800 dark:text-slate-200 hover:border-slate-400 font-medium'
                                                }`}
                                            >
                                                {variant.name} {variant.price != null && variant.price !== product.price ? `(৳${variant.price})` : ''}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Quantity Stepper Row */}
                        <div className="mt-6 flex items-center gap-4">
                            <span className="text-xs sm:text-sm font-bold tracking-wider text-slate-800 dark:text-slate-200 uppercase">
                                QUANTITY
                            </span>
                            <div className="flex items-center border border-slate-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-[#141414] overflow-hidden">
                                <button
                                    type="button"
                                    onClick={() => setBuyQuantity(q => Math.max(1, q - 1))}
                                    disabled={buyQuantity <= 1 || currentQuantity <= 0}
                                    className="px-3.5 py-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-neutral-800 font-bold transition-colors disabled:opacity-40"
                                    aria-label="Decrease quantity"
                                >
                                    -
                                </button>
                                <span className="w-10 text-center text-sm font-semibold text-slate-900 dark:text-white">
                                    {buyQuantity}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setBuyQuantity(q => (currentQuantity > 0 ? Math.min(currentQuantity, q + 1) : q + 1))}
                                    disabled={currentQuantity <= 0 || (currentQuantity > 0 && buyQuantity >= currentQuantity)}
                                    className="px-3.5 py-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-neutral-800 font-bold transition-colors disabled:opacity-40"
                                    aria-label="Increase quantity"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Action CTA Button (Add to Cart / Out of Stock) */}
                        <button
                            type="button"
                            onClick={handleAddToCart}
                            disabled={currentQuantity <= 0 || isAdded}
                            className={`w-full mt-5 py-3.5 sm:py-4 px-6 rounded-xl font-bold text-base sm:text-lg flex items-center justify-center gap-2.5 shadow-md transition-all ${
                                isAdded
                                    ? 'bg-green-600 text-white'
                                    : currentQuantity <= 0
                                    ? 'bg-slate-300 dark:bg-neutral-800 text-slate-500 dark:text-slate-400 cursor-not-allowed shadow-none'
                                    : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white active:scale-[0.99]'
                            } disabled:cursor-not-allowed`}
                        >
                            {isAdded ? (
                                <>
                                    <Check className="h-5 w-5" /> Added to Cart!
                                </>
                            ) : currentQuantity > 0 ? (
                                <>
                                    <ShoppingCart className="h-5 w-5" /> Add to Cart
                                </>
                            ) : (
                                'Out of Stock'
                            )}
                        </button>
                    </div>
                </div>

                {/* Related Products */}
                <div className="mt-12 sm:mt-16">
                    <RelatedProducts products={relatedProducts} />
                </div>
            </main>
        </motion.div>
    );
};