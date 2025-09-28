"use client";

import React from 'react';
import Link from 'next/link';
import { useCart } from '../../context/CartContext.jsx';

const CheckoutPage = () => {
  const { cartItems, total, isCartOpen, toggleCart } = useCart();
  const shippingCost = total > 0 ? 500 : 0;
  const grandTotal = total + shippingCost;

  // Close the cart drawer if it's open when navigating to checkout
  React.useEffect(() => {
    if (isCartOpen) {
      toggleCart();
    }
  }, [isCartOpen, toggleCart]);


  if (cartItems.length === 0) {
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-16">
          {/* Left Side: Form */}
          <div className="bg-slate-50 dark:bg-slate-900 p-6 sm:p-8 rounded-lg border border-slate-200 dark:border-slate-800">
            <form className="space-y-8">
              {/* Shipping Information */}
              <div>
                <h2 className="text-2xl font-bold mb-6">Shipping Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="sm:col-span-2">
                    <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                    <input type="text" id="fullName" name="fullName" required className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="address" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Address</label>
                    <input type="text" id="address" name="address" required className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                  </div>
                   <div>
                    <label htmlFor="city" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">City</label>
                    <input type="text" id="city" name="city" required className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                  </div>
                  <div>
                    <label htmlFor="postalCode" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Postal Code</label>
                    <input type="text" id="postalCode" name="postalCode" required className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                  </div>
                </div>
              </div>
              {/* Contact Information */}
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
            </form>
          </div>

          {/* Right Side: Order Summary */}
          <div className="bg-slate-50 dark:bg-slate-900 p-6 sm:p-8 rounded-lg border border-slate-200 dark:border-slate-800 self-start">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
            <div className="space-y-4 max-h-72 overflow-y-auto pr-2">
              {cartItems.map(item => (
                <div key={item.id} className="flex justify-between items-center">
                   <div className="flex items-center gap-4">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md flex-shrink-0" />
                    <div>
                      <p className="font-semibold leading-tight">{item.name}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-semibold text-right flex-shrink-0">৳{(item.price * item.quantity).toLocaleString()}</p>
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
                <span>৳{shippingCost.toLocaleString()}</span>
              </div>
              <div className="border-t border-slate-200 dark:border-slate-700 my-3"></div>
              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span>৳{grandTotal.toLocaleString()}</span>
              </div>
            </div>
            <button className="w-full mt-8 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-700 transition-colors font-semibold">
              Place Order (Cash on Delivery)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;