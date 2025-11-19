

"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useCart } from '../../context/CartContext.jsx';
import { getCoupon, createSale, getFreeDeliverySettings, getDeliveryCharges, getQuantityCoupons } from '../../lib/firebase.js';
import { PlusIcon } from '../../components/icons/PlusIcon.jsx';
import { MinusIcon } from '../../components/icons/MinusIcon.jsx';
import { RemoveIcon } from '../../components/icons/RemoveIcon.jsx';
import { CloseIcon } from '../../components/icons/CloseIcon.jsx';


const CheckoutPage = () => {
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
  const isFreeShipping = freeDeliveryThreshold > 0 && totalQuantity >= freeDeliveryThreshold + 1;
  
  const shippingCost = isFreeShipping 
    ? 0 
    : (total > 0 ? (shippingLocation === 'inside-dhaka' ? deliveryCharges.inside : deliveryCharges.outside) : 0);
  
  // Check if quantity requirements are still met (in case user removed items after applying)
  const isCouponRequirementsMet = useMemo(() => {
    if (!appliedCoupon) return false;
    if (appliedCoupon.minItems) {
      return totalQuantity >= appliedCoupon.minItems;
    }
    return true;
  }, [appliedCoupon, totalQuantity]);
  
  const discountAmount = (appliedCoupon && isCouponRequirementsMet)
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
    setIsSubmitting(true);
    setSubmissionError(null);

    const formData = new FormData(e.target);
    const orderData = {
      customerName: formData.get('customerName'),
      address: formData.get('address'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      deliveryLocation: formData.get('deliveryLocation'),
      items: cartItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        originalPrice: item.originalPrice,
        quantity: item.quantity,
      })),
      subtotal: total,
      shippingCost,
      coupon: (appliedCoupon && isCouponRequirementsMet) ? { code: appliedCoupon.code, discountAmount: discountAmount } : null,
      grandTotal,
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
    if(e) e.preventDefault();
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
                minItems: parseInt(qCoupon.minItems, 10) || 0
            };
            isQtyCoupon = true;
        }
    }

    if (foundCoupon && foundCoupon.discountPercentage > 0) {
      // Validate quantity requirement if it's a quantity coupon
      if (isQtyCoupon && foundCoupon.minItems > 0) {
          if (totalQuantity < foundCoupon.minItems) {
              const missing = foundCoupon.minItems - totalQuantity;
              const msg = `Add ${missing} more item${missing > 1 ? 's' : ''} to use this coupon code.`;
              
              setCouponMessage({ 
                  text: msg, 
                  type: 'error' 
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
    setCouponMessage({ text: 'Coupon removed.', type: '' });
  };

  if (submitted) {
    return (
      <div className="bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 min-h-[60vh] flex items-center justify-center">
        <div className="text-center p-4">
          <h1 className="text-3xl font-bold text-green-600 dark:text-green-400 mb-4">Thank You for Your Order!</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-8">Your order has been placed successfully. We will contact you shortly with confirmation.</p>
          <Link href="/" className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0 && !submitted) {
    return (
      <div className="bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 min-h-[60vh] flex items-center justify-center">
        <div className="text-center p-4">
          <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-8">You have no items in your cart to check out.</p>
          <Link href="/" className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <h1 className="text-center text-4xl sm:text-5xl font-bold tracking-tight mb-12">Checkout</h1>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-16"
        >
          <div className="bg-slate-50 dark:bg-slate-900 p-6 sm:p-8 rounded-lg border border-slate-200 dark:border-slate-800">
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-6">Shipping Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="sm:col-span-2">
                    <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Customer Name</label>
                    <input type="text" id="fullName" name="customerName" required className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="address" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Address</label>
                    <input type="text" id="address" name="address" required className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Delivery Location</label>
                    <div className="flex flex-col sm:flex-row gap-4 mt-2">
                      <div className="flex items-center">
                        <input
                          id="inside-dhaka"
                          name="deliveryLocation"
                          type="radio"
                          value="Inside Dhaka"
                          checked={shippingLocation === 'inside-dhaka'}
                          onChange={() => setShippingLocation('inside-dhaka')}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 dark:border-slate-700"
                        />
                        <label htmlFor="inside-dhaka" className="ml-3 block text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                          Inside Dhaka {!isFreeShipping && <span className="text-slate-500 dark:text-slate-400">(৳{deliveryCharges.inside})</span>}
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="outside-dhaka"
                          name="deliveryLocation"
                          type="radio"
                          value="Outside Dhaka"
                          checked={shippingLocation === 'outside-dhaka'}
                          onChange={() => setShippingLocation('outside-dhaka')}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 dark:border-slate-700"
                        />
                        <label htmlFor="outside-dhaka" className="ml-3 block text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                          Outside Dhaka {!isFreeShipping && <span className="text-slate-500 dark:text-slate-400">(৳{deliveryCharges.outside})</span>}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                   <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                    <input type="email" id="email" name="email" required className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                    <input type="tel" id="phone" name="phone" required className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                  </div>
                 </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900 p-6 sm:p-8 rounded-lg border border-slate-200 dark:border-slate-800 self-start">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
            <div className="space-y-4 max-h-72 overflow-y-auto pr-2">
              {cartItems.map(item => (
                <div key={item.id} className="flex items-center gap-4">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md flex-shrink-0" />
                  <div className="flex-grow">
                      <p className="font-semibold text-slate-800 dark:text-slate-100 leading-tight">{item.name}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">৳{(item.price * item.quantity).toLocaleString()}</p>
                      <div className="flex items-center gap-2 mt-2">
                          <button type="button" onClick={() => updateItemQuantity(item.id, item.quantity - 1)} className="p-1 border border-slate-300 dark:border-slate-700 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50" disabled={isSubmitting}>
                              <MinusIcon className="h-4 w-4" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <button type="button" onClick={() => updateItemQuantity(item.id, item.quantity + 1)} className="p-1 border border-slate-300 dark:border-slate-700 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50" disabled={isSubmitting}>
                              <PlusIcon className="h-4 w-4" />
                          </button>
                      </div>
                  </div>
                  <button type="button" onClick={() => removeItemFromCart(item.id)} className="text-red-500 hover:text-red-700 dark:hover:text-red-400 self-start disabled:opacity-50" disabled={isSubmitting}>
                      <RemoveIcon className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="border-t border-slate-200 dark:border-slate-700 my-6"></div>
            <div className="space-y-3">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Subtotal</span>
                <span>৳{total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Shipping</span>
                {isFreeShipping ? (
                    <span className="font-semibold text-green-600 dark:text-green-400">Free</span>
                ) : (
                    <span>৳{shippingCost.toLocaleString()}</span>
                )}
              </div>
              {appliedCoupon && (
                <div className="flex flex-col">
                  <div className="flex justify-between text-green-600 dark:text-green-400">
                    <span>Discount ({appliedCoupon.code})</span>
                    <span>-৳{discountAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                  {!isCouponRequirementsMet && appliedCoupon.minItems && (
                     <span className="text-xs text-red-500 text-right mt-1">
                        Requirements not met: Add {Math.max(0, appliedCoupon.minItems - totalQuantity)} more item(s).
                     </span>
                  )}
                </div>
              )}
            </div>

            <div className="border-t border-slate-200 dark:border-slate-700 my-6"></div>
            
            {!appliedCoupon ? (
              <div className="space-y-2 mb-6">
                <label htmlFor="coupon" className="text-sm font-medium text-slate-700 dark:text-slate-300">Have a coupon?</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    id="coupon"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon(e)}
                    placeholder="Enter coupon code"
                    className="w-full px-4 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    disabled={isCouponLoading}
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-sm font-semibold rounded-md hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors disabled:opacity-50"
                    disabled={isCouponLoading}
                  >
                    {isCouponLoading ? '...' : 'Apply'}
                  </button>
                </div>
                 {couponMessage.text && (
                  <p className={`text-sm mt-2 ${couponMessage.type === 'success' ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                    {couponMessage.text}
                  </p>
                )}
              </div>
            ) : (
               <div className="flex justify-between items-center mb-6">
                  <p className="text-sm text-slate-700 dark:text-slate-300">Coupon Applied: <span className="font-bold text-green-600 dark:text-green-400">{appliedCoupon.code}</span></p>
                   <button type="button" onClick={handleRemoveCoupon} title="Remove coupon" className="text-red-500 hover:text-red-700 dark:hover:text-red-400 p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50">
                     <CloseIcon className="h-4 w-4" />
                   </button>
               </div>
            )}
            
            <div className="flex justify-between text-xl font-bold">
              <span>Total</span>
              <span>৳{grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>

            <div className="mt-8">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                <h3 className="font-semibold text-slate-800 dark:text-slate-100">Cash on Delivery Available</h3>
              </div>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Pay when your order is delivered to your doorstep. No advance payment required.
              </p>
            </div>
             {submissionError && (
              <div className="mt-4 text-center text-red-500 dark:text-red-400 bg-red-100 dark:bg-red-900/50 p-3 rounded-md">
                {submissionError}
              </div>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-4 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Placing Order...' : 'Place Order (Cash on Delivery)'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
