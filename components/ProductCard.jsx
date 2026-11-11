
"use client";

import React, { useState, useMemo } from 'react';
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
          {product.variants && product.variants.length > 0 ? (
            <Link
              href={`/products/${product.slug}`}
              className="w-full py-2.5 px-3 bg-black dark:bg-[#1c1b1a] dark:border dark:border-neutral-700 text-white hover:bg-neutral-800 dark:hover:bg-neutral-800 text-xs sm:text-sm font-medium rounded-lg text-center block transition-colors"
            >
              Select Options
            </Link>
          ) : (
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
          )}
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

    // Variants and attributes handling
    const variants = useMemo(() => (Array.isArray(product.variants) ? product.variants : []), [product.variants]);

    // Multi-image handling: product images + variant images
    const images = useMemo(() => {
      const list = [];
      const add = (url) => {
        if (url && typeof url === 'string' && url.trim() && !list.includes(url.trim())) {
          list.push(url.trim());
        }
      };
      if (Array.isArray(product.images)) {
        product.images.forEach(add);
      }
      if (product.image) add(product.image);
      variants.forEach(v => {
        if (v && v.image) add(v.image);
      });
      return list.length > 0 ? list : ['/shophoria.jpeg'];
    }, [product.images, product.image, variants]);

    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const sizeVariants = useMemo(() => variants.filter(v => v.variantType === 'size' || v.size), [variants]);
    const weightVariants = useMemo(() => variants.filter(v => v.variantType === 'weight' || v.weight), [variants]);
    const colorVariants = useMemo(() => variants.filter(v => v.variantType === 'color' || v.color), [variants]);

    const availableSizes = useMemo(() => {
      if (product.sizes && product.sizes.length > 0) return product.sizes;
      return Array.from(new Set(sizeVariants.map(v => v.size || v.name).filter(Boolean)));
    }, [product.sizes, sizeVariants]);

    const availableWeights = useMemo(() => {
      if (product.weights && product.weights.length > 0) return product.weights;
      return Array.from(new Set(weightVariants.map(v => v.weight || v.name).filter(Boolean)));
    }, [product.weights, weightVariants]);

    const availableColors = useMemo(() => {
      if (product.colors && product.colors.length > 0) return product.colors;
      return Array.from(new Set(colorVariants.map(v => v.color).filter(Boolean)));
    }, [product.colors, colorVariants]);

    // Initial state: User MUST select a variant if variants exist
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedWeight, setSelectedWeight] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedVariantId, setSelectedVariantId] = useState(null);

    const hasVariants = variants.length > 0;
    const hasSizeVariants = availableSizes.length > 0;
    const hasWeightVariants = availableWeights.length > 0;
    const hasColorVariants = availableColors.length > 0;
    const hasOtherVariants = variants.some(
      v => v.variantType !== 'size' && v.variantType !== 'weight' &&
           !availableSizes.includes(v.size || v.name) &&
           !availableWeights.includes(v.weight || v.name) &&
           !availableColors.includes(v.color || v.name)
    );

    // Resolve the active variant based on user selection
    const activeVariant = useMemo(() => {
      if (variants.length === 0) return null;

      if (selectedVariantId) {
        const found = variants.find(v => v.id === selectedVariantId);
        if (found) return found;
      }

      if (selectedSize || selectedWeight || selectedColor) {
        const matched = variants.find(v => {
          const matchSize = !selectedSize || v.size === selectedSize || v.name === selectedSize;
          const matchWeight = !selectedWeight || v.weight === selectedWeight || v.name === selectedWeight;
          const matchColor = !selectedColor || v.color === selectedColor;
          return matchSize && matchWeight && matchColor;
        });
        if (matched) return matched;
      }

      return null;
    }, [variants, selectedVariantId, selectedSize, selectedWeight, selectedColor]);

    // Validation: if product has variants, user must select a variant to add to cart
    const isVariantSelected = useMemo(() => {
      if (!hasVariants) return true;
      if (hasSizeVariants && !selectedSize) return false;
      if (hasWeightVariants && !selectedWeight) return false;
      if (hasOtherVariants && !selectedVariantId) return false;
      return !!activeVariant;
    }, [hasVariants, hasSizeVariants, selectedSize, hasWeightVariants, selectedWeight, hasOtherVariants, selectedVariantId, activeVariant]);

    // Dynamic price, original price, and quantity
    const currentPrice = activeVariant?.price != null ? activeVariant.price : product.price;
    const currentOriginalPrice = activeVariant?.originalPrice != null ? activeVariant.originalPrice : product.originalPrice;
    const currentQuantity = activeVariant?.quantity != null ? activeVariant.quantity : (product.quantity || 0);

    const discountPercentage = currentOriginalPrice && currentOriginalPrice > currentPrice
      ? Math.round(((currentOriginalPrice - currentPrice) / currentOriginalPrice) * 100)
      : null;

    // Cross Connection: sync variant button when image changes
    const syncVariantFromImage = (imgUrl) => {
      if (!imgUrl || variants.length === 0) return;
      const matched = variants.find(v => v.image === imgUrl);
      if (matched) {
        setSelectedVariantId(matched.id);
        if (matched.size) setSelectedSize(matched.size);
        if (matched.weight) setSelectedWeight(matched.weight);
        if (matched.color) setSelectedColor(matched.color);
      }
    };

    // Cross Connection: sync gallery image when variant is selected
    const syncImageFromVariant = (imgUrl) => {
      if (!imgUrl) return;
      const idx = images.indexOf(imgUrl);
      if (idx !== -1) {
        setSelectedImageIndex(idx);
      }
    };

    const handleThumbnailClick = (idx) => {
      setSelectedImageIndex(idx);
      syncVariantFromImage(images[idx]);
    };

    const handlePrevImage = () => {
      setSelectedImageIndex(prev => {
        const nextIdx = prev === 0 ? images.length - 1 : prev - 1;
        syncVariantFromImage(images[nextIdx]);
        return nextIdx;
      });
    };

    const handleNextImage = () => {
      setSelectedImageIndex(prev => {
        const nextIdx = prev === images.length - 1 ? 0 : prev + 1;
        syncVariantFromImage(images[nextIdx]);
        return nextIdx;
      });
    };

    const handleSizeSelect = (size, variant) => {
      setSelectedSize(size);
      const targetVariant = variant || variants.find(v => v.size === size || (v.variantType === 'size' && v.name === size));
      if (targetVariant) {
        setSelectedVariantId(targetVariant.id);
        if (targetVariant.image) {
          syncImageFromVariant(targetVariant.image);
        }
      }
    };

    const handleWeightSelect = (weight, variant) => {
      setSelectedWeight(weight);
      const targetVariant = variant || variants.find(v => v.weight === weight || (v.variantType === 'weight' && v.name === weight));
      if (targetVariant) {
        setSelectedVariantId(targetVariant.id);
        if (targetVariant.image) {
          syncImageFromVariant(targetVariant.image);
        }
      }
    };

    const handleColorSelect = (color) => {
      setSelectedColor(color);
      const targetVariant = variants.find(v => v.color === color);
      if (targetVariant) {
        setSelectedVariantId(targetVariant.id);
        if (targetVariant.image) {
          syncImageFromVariant(targetVariant.image);
        }
      }
    };

    const handleVariantSelect = (variant) => {
      setSelectedVariantId(variant.id);
      if (variant.color) setSelectedColor(variant.color);
      if (variant.size) setSelectedSize(variant.size);
      if (variant.weight) setSelectedWeight(variant.weight);
      if (variant.image) {
        syncImageFromVariant(variant.image);
      }
    };

    const handleAddToCart = () => {
      if (!isVariantSelected) return;
      const activeImage = images[selectedImageIndex] || activeVariant?.image || product.image;
      addItemToCart({
        ...product,
        price: currentPrice,
        originalPrice: currentOriginalPrice,
        image: activeImage,
        selectedVariant: activeVariant,
        selectedColor,
        selectedSize: selectedSize || activeVariant?.size || (activeVariant?.variantType === 'size' ? activeVariant.name : null),
        selectedWeight: selectedWeight || activeVariant?.weight || (activeVariant?.variantType === 'weight' ? activeVariant.name : null),
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
                                        onClick={() => handleThumbnailClick(idx)}
                                        className={`relative w-16 h-16 sm:w-20 sm:h-20 aspect-square rounded-xl overflow-hidden border-2 transition-all p-1.5 bg-white dark:bg-[#141414] flex items-center justify-center flex-shrink-0 ${
                                            selectedImageIndex === idx
                                                ? 'border-black dark:border-white shadow-sm ring-2 ring-black/20 dark:ring-white/30'
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
                        <div className="flex-1 w-full bg-[#f8f9fb] dark:bg-[#141414] rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col border border-slate-100 dark:border-neutral-800/80 shadow-xs">
                            {product.expiresAt && (
                                <div className="w-full flex-shrink-0">
                                    <CountdownTimer expiresAt={product.expiresAt} />
                                </div>
                            )}

                            <div className="relative p-6 sm:p-10 aspect-square flex items-center justify-center w-full flex-grow">
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
                                    Color: <span className="font-normal text-slate-600 dark:text-slate-400">{selectedColor || 'Select a color'}</span>
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {availableColors.map((color) => {
                                        const isSelected = selectedColor === color;
                                        return (
                                            <button
                                                key={color}
                                                type="button"
                                                onClick={() => handleColorSelect(color)}
                                                className={`min-h-[40px] px-3.5 py-1.5 rounded-lg text-xs sm:text-sm transition-all border-2 ${
                                                    isSelected
                                                        ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white shadow-xs font-semibold'
                                                        : 'bg-white dark:bg-[#141414] border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 hover:border-black dark:hover:border-white font-medium'
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
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                                        Size: <span className="font-normal text-slate-600 dark:text-slate-400">{selectedSize || 'Select a size'}</span>
                                    </label>
                                    {!selectedSize && hasVariants && (
                                        <span className="text-[11px] text-neutral-500 font-medium">Required</span>
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {availableSizes.map((size) => {
                                        const matchedVariant = variants.find(v => v.size === size || (v.variantType === 'size' && v.name === size));
                                        const isSelected = selectedSize === size || (activeVariant && (activeVariant.size === size || activeVariant.name === size || activeVariant.id === matchedVariant?.id));
                                        const variantPrice = matchedVariant?.price != null ? matchedVariant.price : null;
                                        const variantImg = matchedVariant?.image || null;
                                        return (
                                            <button
                                                key={size}
                                                type="button"
                                                onClick={() => handleSizeSelect(size, matchedVariant)}
                                                className={`min-h-[40px] px-3.5 py-1.5 rounded-lg text-xs sm:text-sm transition-all flex items-center gap-2 border-2 ${
                                                    isSelected
                                                        ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white shadow-xs font-semibold'
                                                        : 'bg-white dark:bg-[#141414] border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 hover:border-black dark:hover:border-white font-medium'
                                                }`}
                                            >
                                                {variantImg && (
                                                    <img 
                                                        src={variantImg} 
                                                        alt={size} 
                                                        className="w-5 h-5 rounded object-contain bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 flex-shrink-0" 
                                                    />
                                                )}
                                                <span>{size}</span>
                                                {variantPrice != null && variantPrice !== product.price && (
                                                    <span className={`text-[11px] ${isSelected ? 'text-neutral-300 dark:text-neutral-600' : 'text-neutral-500 dark:text-neutral-400'}`}>
                                                        (৳{variantPrice.toLocaleString()})
                                                    </span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Weight Selector (if available) */}
                        {availableWeights.length > 0 && (
                            <div className="mt-4">
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                                        Weight: <span className="font-normal text-slate-600 dark:text-slate-400">{selectedWeight || 'Select a weight'}</span>
                                    </label>
                                    {!selectedWeight && hasVariants && (
                                        <span className="text-[11px] text-neutral-500 font-medium">Required</span>
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {availableWeights.map((weight) => {
                                        const matchedVariant = variants.find(v => v.weight === weight || (v.variantType === 'weight' && v.name === weight));
                                        const isSelected = selectedWeight === weight || (activeVariant && (activeVariant.weight === weight || activeVariant.name === weight || activeVariant.id === matchedVariant?.id));
                                        const variantPrice = matchedVariant?.price != null ? matchedVariant.price : null;
                                        const variantImg = matchedVariant?.image || null;
                                        return (
                                            <button
                                                key={weight}
                                                type="button"
                                                onClick={() => handleWeightSelect(weight, matchedVariant)}
                                                className={`min-h-[40px] px-3.5 py-1.5 rounded-lg text-xs sm:text-sm transition-all flex items-center gap-2 border-2 ${
                                                    isSelected
                                                        ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white shadow-xs font-semibold'
                                                        : 'bg-white dark:bg-[#141414] border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 hover:border-black dark:hover:border-white font-medium'
                                                }`}
                                            >
                                                {variantImg && (
                                                    <img 
                                                        src={variantImg} 
                                                        alt={weight} 
                                                        className="w-5 h-5 rounded object-contain bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 flex-shrink-0" 
                                                    />
                                                )}
                                                <span>{weight}</span>
                                                {variantPrice != null && variantPrice !== product.price && (
                                                    <span className={`text-[11px] ${isSelected ? 'text-neutral-300 dark:text-neutral-600' : 'text-neutral-500 dark:text-neutral-400'}`}>
                                                        (৳{variantPrice.toLocaleString()})
                                                    </span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Variant Selector (for any other variant types not covered by Size or Weight) */}
                        {variants.length > 1 && variants.some(v => v.variantType !== 'size' && v.variantType !== 'weight' && !availableSizes.includes(v.size || v.name) && !availableWeights.includes(v.weight || v.name) && !availableColors.includes(v.color || v.name)) && (
                            <div className="mt-4">
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                                        Variant: <span className="font-normal text-slate-600 dark:text-slate-400">{activeVariant?.name || 'Select a variant'}</span>
                                    </label>
                                    {!selectedVariantId && hasVariants && (
                                        <span className="text-[11px] text-neutral-500 font-medium">Required</span>
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {variants.filter(v => v.variantType !== 'size' && v.variantType !== 'weight').map((variant) => {
                                        const isSelected = activeVariant?.id === variant.id;
                                        return (
                                            <button
                                                key={variant.id}
                                                type="button"
                                                onClick={() => handleVariantSelect(variant)}
                                                className={`min-h-[40px] px-3.5 py-1.5 rounded-lg text-xs sm:text-sm transition-all flex items-center gap-2 border-2 ${
                                                    isSelected
                                                        ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white shadow-xs font-semibold'
                                                        : 'bg-white dark:bg-[#141414] border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 hover:border-black dark:hover:border-white font-medium'
                                                }`}
                                            >
                                                {variant.image && (
                                                    <img 
                                                        src={variant.image} 
                                                        alt={variant.name} 
                                                        className="w-5 h-5 rounded object-contain bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 flex-shrink-0" 
                                                    />
                                                )}
                                                <span>{variant.name}</span>
                                                {variant.price != null && variant.price !== product.price && (
                                                    <span className={`text-[11px] ${isSelected ? 'text-neutral-300 dark:text-neutral-600' : 'text-neutral-500 dark:text-neutral-400'}`}>
                                                        (৳{variant.price.toLocaleString()})
                                                    </span>
                                                )}
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

                        {/* Action CTA Button (Add to Cart / Out of Stock / Selection Required) */}
                        <div className="mt-5">
                            <button
                                type="button"
                                onClick={handleAddToCart}
                                disabled={currentQuantity <= 0 || isAdded || !isVariantSelected}
                                className={`w-full py-3.5 sm:py-4 px-6 rounded-xl font-bold text-base sm:text-lg flex items-center justify-center gap-2.5 shadow-sm transition-all ${
                                    isAdded
                                        ? 'bg-neutral-900 text-white dark:bg-white dark:text-black'
                                        : currentQuantity <= 0
                                        ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500 cursor-not-allowed shadow-none'
                                        : !isVariantSelected
                                        ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 border border-neutral-300 dark:border-neutral-700 cursor-not-allowed shadow-none'
                                        : 'bg-black dark:bg-[#1c1b1a] dark:border dark:border-neutral-700 text-white hover:bg-neutral-800 dark:hover:bg-neutral-800 active:scale-[0.99] cursor-pointer'
                                } disabled:cursor-not-allowed`}
                            >
                                {isAdded ? (
                                    <>
                                        <Check className="h-5 w-5" /> Added to Cart!
                                    </>
                                ) : currentQuantity <= 0 ? (
                                    'Out of Stock'
                                ) : !isVariantSelected ? (
                                    hasSizeVariants && !selectedSize
                                        ? 'Select a Size'
                                        : hasWeightVariants && !selectedWeight
                                        ? 'Select a Weight'
                                        : 'Select a Variant'
                                ) : (
                                    <>
                                        <ShoppingCart className="h-5 w-5" /> Add to Cart
                                    </>
                                )}
                            </button>
                            {!isVariantSelected && hasVariants && currentQuantity > 0 && (
                                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 text-center font-medium">
                                    Please select an option above to add this product to your cart
                                </p>
                            )}
                        </div>
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