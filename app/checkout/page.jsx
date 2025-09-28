"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '../../context/CartContext.jsx';

const CheckoutPage = () => {
  const { cartItems, total, clearCart, isCartOpen, toggleCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [shippingLocation, setShippingLocation] = useState('inside-dhaka');
  
  const shippingCost = total > 0 ? (shippingLocation === 'inside-dhaka' ? 60 : 110) : 0;
  const grandTotal = total + shippingCost;

  React.useEffect(() => {
    if (isCartOpen) {
      toggleCart();
    }
  }, [isCartOpen, toggleCart]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.target);
    
    // Format cart items for Google Form fields
    const productNames = cartItems.map(item => `${item.name} (x${item.quantity})`).join('\n');
    const productQuantities = cartItems.map(item => item.quantity).join(', ');
    const shippingInfo = `${shippingLocation === 'inside-dhaka' ? 'Inside Dhaka' : 'Outside Dhaka'} - ৳${shippingCost}`;

    formData.append('entry.111115754', productNames);
    formData.append('entry.1362617278', productQuantities);
    formData.append('entry.723655692', grandTotal.toString());
    formData.append('entry.464718279', shippingInfo);
    
    try {
      await fetch('https://docs.google.com/forms/u/3/d/1p_63-EOQIeRIj5UvMWre1s1h2ZYyGC2YSCyviNsnmZ0/formResponse', {
        method: 'POST',
        body: formData,
        mode: 'no-cors', // Important: Google Forms will throw a CORS error but the data will be submitted.
      });

      setSubmitted(true);
      clearCart();
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error placing your order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
    )
  }

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
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-16">
          {/* Left Side: Form */}
          <div className="bg-slate-50 dark:bg-slate-900 p-6 sm:p-8 rounded-lg border border-slate-200 dark:border-slate-800">
            <div className="space-y-8">
              {/* Shipping Information */}
              <div>
                <h2 className="text-2xl font-bold mb-6">Shipping Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="sm:col-span-2">
                    <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                    <input type="text" id="fullName" name="entry.2046529921" required className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="address" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Address</label>
                    <input type="text" id="address" name="entry.840182848" required className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                  </div>
                   <div>
                    <label htmlFor="city" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">City</label>
                    <input type="text" id="city" name="entry.1886815229" required className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                  </div>
                  <div>
                    <label htmlFor="postalCode" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Postal Code</label>
                    <input type="text" id="postalCode" name="entry.1516143116" required className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Delivery Location</label>
                    <div className="flex flex-col sm:flex-row gap-4 mt-2">
                      <div className="flex items-center">
                        <input
                          id="inside-dhaka"
                          name="shippingLocation"
                          type="radio"
                          value="inside-dhaka"
                          checked={shippingLocation === 'inside-dhaka'}
                          onChange={() => setShippingLocation('inside-dhaka')}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 dark:border-slate-700"
                        />
                        <label htmlFor="inside-dhaka" className="ml-3 block text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                          Inside Dhaka <span className="text-slate-500 dark:text-slate-400">(৳60)</span>
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="outside-dhaka"
                          name="shippingLocation"
                          type="radio"
                          value="outside-dhaka"
                          checked={shippingLocation === 'outside-dhaka'}
                          onChange={() => setShippingLocation('outside-dhaka')}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 dark:border-slate-700"
                        />
                        <label htmlFor="outside-dhaka" className="ml-3 block text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                          Outside Dhaka <span className="text-slate-500 dark:text-slate-400">(৳110)</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Contact Information */}
              <div>
                <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                   <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                    <input type="email" id="email" name="entry.2031731440" required className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                    <input type="tel" id="phone" name="entry.1625432820" required className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                  </div>
                 </div>
              </div>
            </div>
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
            <div className="mt-8">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                <h3 className="font-semibold text-slate-800 dark:text-slate-100">Cash on Delivery Available</h3>
              </div>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Pay when your order is delivered to your doorstep. No advance payment required.
              </p>
            </div>
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