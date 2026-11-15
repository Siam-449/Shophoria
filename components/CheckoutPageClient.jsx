
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext.jsx';
import { getCoupon, createSale, getFreeDeliverySettings, getDeliveryCharges, getQuantityCoupons } from '../lib/firebase.js';
import { PlusIcon } from './icons/PlusIcon.jsx';
import { MinusIcon } from './icons/MinusIcon.jsx';
import { RemoveIcon } from './icons/RemoveIcon.jsx';
import { CloseIcon } from './icons/CloseIcon.jsx';
import { motion, AnimatePresence } from 'motion/react';
import { Banknote, CheckCircle2, ShoppingBag, ArrowLeft, Tag, Truck } from 'lucide-react';

const FALLBACK_IMAGE = '/shophoria.jpeg';

const extractImageUrl = (val) => {
  if (!val) return '';
  if (typeof val === 'string') return val.trim();
  if (typeof val === 'object') {
    const candidate =
      val.url ||
      val.image ||
      val.imageLink ||
      val.imageUrl ||
      val.link ||
      val.src ||
      val.photo;
    return typeof candidate === 'string' ? candidate.trim() : '';
  }
  return '';
};

const resolveItemName = (item) => {
  if (!item) return 'Product';
  const candidates = [
    item.selectedImageTitle,
    item.name,
    item.productName,
    item.title,
  ];
  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate.trim()) {
      return candidate.trim();
    }
  }
  return 'Product';
};

const resolveItemImage = (item) => {
  if (!item) return FALLBACK_IMAGE;
  const candidates = [
    extractImageUrl(item.image),
    extractImageUrl(item.selectedImage),
    extractImageUrl(item.picture),
    extractImageUrl(item.selectedVariant?.image),
    extractImageUrl(item.selectedVariant?.imageLink),
    extractImageUrl(item.selectedVariant?.imageUrl),
    extractImageUrl(item.selectedVariant?.photo),
    extractImageUrl(item.imageLink),
    ...(Array.isArray(item.images) ? item.images.map(extractImageUrl) : []),
  ].filter(Boolean);

  return candidates[0] || FALLBACK_IMAGE;
};

const CheckoutItemImage = ({ src, alt }) => {
  const [imgSrc, setImgSrc] = useState(src || FALLBACK_IMAGE);

  useEffect(() => {
    setImgSrc(src || FALLBACK_IMAGE);
  }, [src]);

  return (
    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-white dark:bg-[#1c1b1a] border border-neutral-200 dark:border-neutral-800 p-1.5 flex items-center justify-center flex-shrink-0 overflow-hidden">
      <img
        src={imgSrc}
        alt={alt || 'Product image'}
        referrerPolicy="no-referrer"
        onError={() => {
          if (imgSrc !== FALLBACK_IMAGE) {
            setImgSrc(FALLBACK_IMAGE);
          }
        }}
        className="w-full h-full object-contain"
      />
    </div>
  );
};

const CheckoutPageClient = () => {
  const { cartItems, total, clearCart, isCartOpen, toggleCart, updateItemQuantity, removeItemFromCart } = useCart();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submissionError, setSubmissionError] = useState(null);
  const [shippingLocation, setShippingLocation] = useState('inside-dhaka');

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponMessage, setCouponMessage] = useState({ text: '', type: '' });
  const [isCouponLoading, setIsCouponLoading] = useState(false);

  const [freeDeliveryThreshold, setFreeDeliveryThreshold] = useState(0);
  const [deliveryCharges, setDeliveryCharges] = useState({ inside: 60, outside: 110 });

  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Automatically remove the coupon if cart changes make it invalid
  useEffect(() => {
    if (appliedCoupon && appliedCoupon.minItems && totalQuantity < appliedCoupon.minItems) {
      setAppliedCoupon(null);
      setCouponMessage({
        text: `Coupon '${appliedCoupon.code}' removed. Minimum of ${appliedCoupon.minItems} items required.`,
        type: 'error',
      });
    }
  }, [totalQuantity, appliedCoupon]);

  const isFreeShipping = freeDeliveryThreshold > 0 && totalQuantity >= freeDeliveryThreshold + 1;

  const shippingCost = isFreeShipping
    ? 0
    : (total > 0 ? (shippingLocation === 'inside-dhaka' ? deliveryCharges.inside : deliveryCharges.outside) : 0);

  const discountAmount = appliedCoupon
    ? (total * appliedCoupon.discountPercentage) / 100
    : 0;

  const grandTotal = total - discountAmount + shippingCost;

  useEffect(() => {
    if (isCartOpen) {
      toggleCart();
    }
  }, [isCartOpen, toggleCart]);

  useEffect(() => {
    const fetchSettings = async () => {
      const settings = await getFreeDeliverySettings();
      setFreeDeliveryThreshold(settings.threshold);
    };
    const fetchDeliveryCharges = async () => {
      const charges = await getDeliveryCharges();
      setDeliveryCharges(charges);
    };
    fetchSettings();
    fetchDeliveryCharges();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    setIsSubmitting(true);
    setSubmissionError(null);

    const formData = new FormData(e.target);
    const customerName = String(formData.get('customerName') || '').trim();
    const address = String(formData.get('address') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const phone = String(formData.get('phone') || '').trim();
    const deliveryLocation = String(formData.get('deliveryLocation') || '').trim();

    const orderItems = cartItems.map(item => {
      const exactName = resolveItemName(item);
      const exactImage = resolveItemImage(item);
      const unitPrice = Number(item.price) || 0;
      const qty = Number(item.quantity) || 1;
      const originalUnitPrice =
        item.originalPrice != null && !isNaN(Number(item.originalPrice))
          ? Number(item.originalPrice)
          : null;

      return {
        id: item.id ?? null,
        cartItemId: item.cartItemId || item.id || null,
        name: exactName,
        productName: exactName,
        mainProductName:
          (typeof item.baseProductName === 'string' && item.baseProductName.trim()) ||
          exactName,
        selectedImageTitle: item.selectedImageTitle || null,
        price: unitPrice,
        originalPrice: originalUnitPrice,
        quantity: qty,
        lineTotal: unitPrice * qty,
        image: exactImage,
        picture: exactImage,
        imageLink: exactImage,
        slug: item.slug || null,
        category: item.category || null,
        barcode: item.barcode || '',
        variant: item.selectedVariant?.name || null,
        variantId: item.selectedVariant?.id || null,
        variantType: item.selectedVariant?.variantType || null,
        color: item.selectedColor || null,
        size: item.selectedSize || null,
        sizeUnit: item.selectedVariant?.sizeUnit || null,
        weight: item.selectedWeight || null,
        weightUnit: item.selectedVariant?.weightUnit || null,
      };
    });

    const orderData = {
      customerName,
      address,
      email,
      phone,
      deliveryLocation,
      items: orderItems,
      totalQuantity,
      subtotal: Number(total) || 0,
      shippingCost: Number(shippingCost) || 0,
      isFreeShipping: Boolean(isFreeShipping),
      discountAmount: Number(discountAmount) || 0,
      coupon: appliedCoupon
        ? {
            code: appliedCoupon.code,
            discountPercentage: Number(appliedCoupon.discountPercentage) || 0,
            discountAmount: Number(discountAmount) || 0,
          }
        : null,
      grandTotal: Number(grandTotal) || 0,
      paymentMethod: 'Cash on Delivery',
      status: 'Pending',
    };

    try {
      await createSale(orderData);
      setSubmitted(true);
      clearCart();
    } catch (error) {
      console.error("Failed to submit order:", error);
      setSubmissionError("There was a problem placing your order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApplyCoupon = async (e) => {
    if (e) e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    setIsCouponLoading(true);
    setCouponMessage({ text: '', type: '' });

    let foundCoupon = null;
    let isQtyCoupon = false;

    // 1. Check standard coupons
    const standardCoupon = await getCoupon(code);
    if (standardCoupon) {
      foundCoupon = standardCoupon;
    } else {
      // 2. Check quantity coupons
      const qtyCoupons = await getQuantityCoupons();
      const qCoupon = qtyCoupons.find(c => c.code && c.code.toUpperCase() === code);
      if (qCoupon) {
        foundCoupon = {
          code: qCoupon.code,
          discountPercentage: Number(qCoupon.discountPercentage),
          minItems: parseInt(qCoupon.minItems, 10) || 0,
        };
        isQtyCoupon = true;
      }
    }

    if (foundCoupon && foundCoupon.discountPercentage > 0) {
      if (isQtyCoupon && foundCoupon.minItems > 0) {
        if (totalQuantity < foundCoupon.minItems) {
          const missing = foundCoupon.minItems - totalQuantity;
          const msg = `Add ${missing} more item${missing > 1 ? 's' : ''} to use this coupon code.`;

          setCouponMessage({
            text: msg,
            type: 'error',
          });
          setAppliedCoupon(null);
          setIsCouponLoading(false);
          return;
        }
      }

      setAppliedCoupon(foundCoupon);
      setCouponMessage({ text: 'Coupon applied successfully!', type: 'success' });
      setCouponCode('');
    } else {
      setAppliedCoupon(null);
      setCouponMessage({ text: 'Invalid or expired coupon code.', type: 'error' });
    }
    setIsCouponLoading(false);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponMessage({ text: 'Coupon removed.', type: 'info' });
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-[#0a0a0a] text-neutral-900 dark:text-neutral-100 min-h-[70vh] flex items-center justify-center px-4 py-16"
      >
        <div className="max-w-md w-full text-center bg-[#f8f9fb] dark:bg-[#141414] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8 sm:p-10 shadow-sm">
          <div className="mx-auto mb-5 w-14 h-14 rounded-full bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-900/50 flex items-center justify-center text-green-600 dark:text-green-400">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <motion.h1
            initial={{ y: -12 }}
            animate={{ y: 0 }}
            className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white tracking-tight mb-3"
          >
            Thank You for Your Order!
          </motion.h1>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 mb-8 leading-relaxed">
            Your order has been placed successfully. We will contact you shortly with confirmation.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </motion.div>
    );
  }

  if (cartItems.length === 0 && !submitted) {
    return (
      <div className="bg-white dark:bg-[#0a0a0a] text-neutral-900 dark:text-neutral-100 min-h-[70vh] flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center bg-[#f8f9fb] dark:bg-[#141414] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8 sm:p-10 shadow-sm">
          <div className="mx-auto mb-5 w-14 h-14 rounded-full bg-white dark:bg-[#1c1b1a] border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-neutral-700 dark:text-neutral-300">
            <ShoppingBag className="h-6 w-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">Your Cart is Empty</h1>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 mb-8 leading-relaxed">
            You have no items in your cart to check out.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#0a0a0a] text-neutral-900 dark:text-neutral-100 overflow-hidden min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* Page Header */}
        <div className="mb-8 sm:mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-6">
          <div>
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors mb-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Shop
            </Link>
            <motion.h1
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white"
            >
              Checkout
            </motion.h1>
          </div>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 tabular-nums">
            {totalQuantity} {totalQuantity === 1 ? 'item' : 'items'} in your order
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start"
        >
          {/* Left Column: Customer & Shipping Form */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="lg:col-span-7 bg-[#f8f9fb] dark:bg-[#141414] p-6 sm:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800"
          >
            <div className="space-y-8">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white mb-5">
                  Shipping Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="sm:col-span-2">
                    <label htmlFor="fullName" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                      Customer Name
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="customerName"
                      required
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 text-sm bg-white dark:bg-[#1c1b1a] border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:border-black dark:focus:border-white focus:ring-2 focus:ring-black/10 dark:focus:ring-white/15 transition-colors"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="address" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                      Delivery Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      required
                      placeholder="House, road, area, and city"
                      className="w-full px-4 py-3 text-sm bg-white dark:bg-[#1c1b1a] border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:border-black dark:focus:border-white focus:ring-2 focus:ring-black/10 dark:focus:ring-white/15 transition-colors"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Delivery Location
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <label
                        htmlFor="inside-dhaka"
                        className={`flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                          shippingLocation === 'inside-dhaka'
                            ? 'border-black dark:border-white bg-white dark:bg-[#1c1b1a]'
                            : 'border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-[#181818] hover:border-neutral-400 dark:hover:border-neutral-600'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            id="inside-dhaka"
                            name="deliveryLocation"
                            type="radio"
                            value="Inside Dhaka"
                            checked={shippingLocation === 'inside-dhaka'}
                            onChange={() => setShippingLocation('inside-dhaka')}
                            className="h-4 w-4 accent-black dark:accent-white border-neutral-300 dark:border-neutral-600"
                          />
                          <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                            Inside Dhaka
                          </span>
                        </div>
                        <span className="text-sm font-semibold tabular-nums text-neutral-600 dark:text-neutral-300">
                          {isFreeShipping ? 'Free' : `৳${deliveryCharges.inside}`}
                        </span>
                      </label>

                      <label
                        htmlFor="outside-dhaka"
                        className={`flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                          shippingLocation === 'outside-dhaka'
                            ? 'border-black dark:border-white bg-white dark:bg-[#1c1b1a]'
                            : 'border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-[#181818] hover:border-neutral-400 dark:hover:border-neutral-600'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            id="outside-dhaka"
                            name="deliveryLocation"
                            type="radio"
                            value="Outside Dhaka"
                            checked={shippingLocation === 'outside-dhaka'}
                            onChange={() => setShippingLocation('outside-dhaka')}
                            className="h-4 w-4 accent-black dark:accent-white border-neutral-300 dark:border-neutral-600"
                          />
                          <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                            Outside Dhaka
                          </span>
                        </div>
                        <span className="text-sm font-semibold tabular-nums text-neutral-600 dark:text-neutral-300">
                          {isFreeShipping ? 'Free' : `৳${deliveryCharges.outside}`}
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-neutral-200 dark:border-neutral-800 pt-7">
                <h2 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white mb-5">
                  Contact Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 text-sm bg-white dark:bg-[#1c1b1a] border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:border-black dark:focus:border-white focus:ring-2 focus:ring-black/10 dark:focus:ring-white/15 transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      placeholder="01XXXXXXXXX"
                      className="w-full px-4 py-3 text-sm bg-white dark:bg-[#1c1b1a] border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:border-black dark:focus:border-white focus:ring-2 focus:ring-black/10 dark:focus:ring-white/15 transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="lg:col-span-5 bg-[#f8f9fb] dark:bg-[#141414] p-6 sm:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 lg:sticky lg:top-24"
          >
            <h2 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white mb-5">
              Order Summary
            </h2>

            <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
              {cartItems.map(item => {
                const itemKey = item.cartItemId || item.id;
                const resolvedName = resolveItemName(item);
                const resolvedImage = resolveItemImage(item);
                const hasVariantDetails = item.selectedVariant?.name || item.selectedColor || item.selectedSize || item.selectedWeight;
                const showGenericVariantName =
                  item.selectedVariant?.name &&
                  item.selectedVariant.variantType !== 'size' &&
                  item.selectedVariant.variantType !== 'weight' &&
                  item.selectedVariant.variantType !== 'color';

                return (
                  <div
                    key={itemKey}
                    className="flex items-start gap-3.5 pb-4 border-b border-neutral-200/80 dark:border-neutral-800/80 last:border-b-0 last:pb-0"
                  >
                    <CheckoutItemImage src={resolvedImage} alt={resolvedName} />

                    <div className="flex-grow min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-semibold text-sm text-neutral-900 dark:text-neutral-100 leading-snug line-clamp-2">
                          {resolvedName}
                        </p>
                        <button
                          type="button"
                          onClick={() => removeItemFromCart(itemKey)}
                          className="text-neutral-400 hover:text-red-500 dark:hover:text-red-400 transition-colors p-0.5 flex-shrink-0 disabled:opacity-50"
                          disabled={isSubmitting}
                          aria-label={`Remove ${resolvedName}`}
                        >
                          <RemoveIcon className="h-4 w-4" />
                        </button>
                      </div>

                      {hasVariantDetails && (
                        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                          {showGenericVariantName && (
                            <span>Option: <strong className="font-medium text-neutral-800 dark:text-neutral-200">{item.selectedVariant.name}</strong></span>
                          )}
                          {item.selectedColor && (
                            <span>Color: <strong className="font-medium text-neutral-800 dark:text-neutral-200">{item.selectedColor}</strong></span>
                          )}
                          {item.selectedSize && (
                            <span>Size: <strong className="font-medium text-neutral-800 dark:text-neutral-200">{item.selectedSize}{item.selectedVariant?.sizeUnit ? ` ${item.selectedVariant.sizeUnit}` : ''}</strong></span>
                          )}
                          {item.selectedWeight && (
                            <span>Weight: <strong className="font-medium text-neutral-800 dark:text-neutral-200">{item.selectedWeight}{item.selectedVariant?.weightUnit ? ` ${item.selectedVariant.weightUnit}` : ''}</strong></span>
                          )}
                        </div>
                      )}

                      <div className="flex items-center justify-between gap-3 mt-2.5">
                        <div className="inline-flex items-center border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-[#1c1b1a] overflow-hidden">
                          <button
                            type="button"
                            onClick={() => updateItemQuantity(itemKey, item.quantity - 1)}
                            className="p-1.5 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors disabled:opacity-40"
                            disabled={isSubmitting}
                            aria-label="Decrease quantity"
                          >
                            <MinusIcon className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-8 text-center text-xs font-semibold tabular-nums text-neutral-900 dark:text-white">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateItemQuantity(itemKey, item.quantity + 1)}
                            className="p-1.5 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors disabled:opacity-40"
                            disabled={isSubmitting}
                            aria-label="Increase quantity"
                          >
                            <PlusIcon className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <p className="text-sm font-bold tabular-nums text-neutral-900 dark:text-white">
                          ৳{(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-neutral-200 dark:border-neutral-800 my-6" />

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                <span>Subtotal</span>
                <span className="tabular-nums font-medium text-neutral-900 dark:text-neutral-100">
                  ৳{total.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                <span className="inline-flex items-center gap-1.5">
                  <Truck className="h-4 w-4 text-neutral-400 dark:text-neutral-500" />
                  Shipping
                </span>
                {isFreeShipping ? (
                  <span className="font-semibold text-green-600 dark:text-green-400">Free</span>
                ) : (
                  <span className="tabular-nums font-medium text-neutral-900 dark:text-neutral-100">
                    ৳{shippingCost.toLocaleString()}
                  </span>
                )}
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-green-600 dark:text-green-400">
                  <span>Discount ({appliedCoupon.code})</span>
                  <span className="tabular-nums font-semibold">
                    -৳{discountAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
              )}
            </div>

            <div className="border-t border-neutral-200 dark:border-neutral-800 my-6" />

            <AnimatePresence>
              {!appliedCoupon ? (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2 mb-6 overflow-hidden"
                >
                  <label htmlFor="coupon" className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    <Tag className="h-3.5 w-3.5 text-neutral-500 dark:text-neutral-400" />
                    Have a coupon?
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      id="coupon"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon(e)}
                      placeholder="Enter coupon code"
                      className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-[#1c1b1a] border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:border-black dark:focus:border-white focus:ring-2 focus:ring-black/10 dark:focus:ring-white/15 transition-colors"
                      disabled={isCouponLoading}
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="px-4 py-2.5 bg-white dark:bg-[#1c1b1a] border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white text-sm font-semibold rounded-xl hover:border-black dark:hover:border-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors disabled:opacity-50 whitespace-nowrap"
                      disabled={isCouponLoading}
                    >
                      {isCouponLoading ? '...' : 'Apply'}
                    </button>
                  </div>
                  {couponMessage.text && (
                    <p
                      className={`text-xs mt-1.5 ${
                        couponMessage.type === 'success'
                          ? 'text-green-600 dark:text-green-400'
                          : couponMessage.type === 'error'
                          ? 'text-red-600 dark:text-red-400'
                          : 'text-neutral-600 dark:text-neutral-400'
                      }`}
                    >
                      {couponMessage.text}
                    </p>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex justify-between items-center mb-6 px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#1c1b1a] border border-neutral-200 dark:border-neutral-700 overflow-hidden"
                >
                  <p className="text-sm text-neutral-700 dark:text-neutral-300">
                    Coupon Applied:{' '}
                    <span className="font-bold text-green-600 dark:text-green-400">{appliedCoupon.code}</span>
                  </p>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    title="Remove coupon"
                    aria-label="Remove coupon"
                    className="text-neutral-400 hover:text-red-500 dark:hover:text-red-400 p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  >
                    <CloseIcon className="h-4 w-4" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex justify-between items-baseline text-lg sm:text-xl font-bold text-neutral-900 dark:text-white">
              <span>Total</span>
              <span className="tabular-nums">
                ৳{grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className="mt-6 p-4 rounded-xl bg-white dark:bg-[#1c1b1a] border border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-2.5">
                <Banknote className="h-4 w-4 text-neutral-900 dark:text-white flex-shrink-0" />
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                  Cash on Delivery Available
                </h3>
              </div>
              <p className="mt-1.5 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Pay when your order is delivered to your doorstep. No advance payment required.
              </p>
            </div>

            {submissionError && (
              <div className="mt-4 text-center text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 p-3 rounded-xl">
                {submissionError}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-5 py-3.5 px-6 bg-black dark:bg-white text-white dark:text-black rounded-xl hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors font-bold text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? 'Placing Order...' : 'Place Order (Cash on Delivery)'}
            </button>
          </motion.div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPageClient;