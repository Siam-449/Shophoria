"use client";

import React from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext.jsx';
import { CloseIcon } from './icons/CloseIcon.jsx';
import { PlusIcon } from './icons/PlusIcon.jsx';
import { MinusIcon } from './icons/MinusIcon.jsx';
import { RemoveIcon } from './icons/RemoveIcon.jsx';

const CartDrawer = () => {
  const { isCartOpen, toggleCart, cartItems, removeItemFromCart, updateItemQuantity, total } = useCart();

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 ${isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={toggleCart}
      />
      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-slate-900 shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-white">
              Shopping Cart ({cartItems.reduce((acc, item) => acc + item.quantity, 0)})
            </h2>
            <button onClick={toggleCart} className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white">
              <CloseIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Cart Items */}
          {cartItems.length > 0 ? (
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
              {cartItems.map(item => (
                <div key={item.id} className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg">
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-md" />
                  <div className="flex-grow">
                    <p className="font-semibold text-slate-800 dark:text-slate-100">{item.name}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">₹{item.price.toLocaleString()}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => updateItemQuantity(item.id, item.quantity - 1)} className="p-1 border border-slate-300 dark:border-slate-700 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700">
                        <MinusIcon className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button onClick={() => updateItemQuantity(item.id, item.quantity + 1)} className="p-1 border border-slate-300 dark:border-slate-700 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700">
                        <PlusIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <button onClick={() => removeItemFromCart(item.id)} className="text-red-500 hover:text-red-700 dark:hover:text-red-400">
                    <RemoveIcon className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-grow flex items-center justify-center">
              <p className="text-slate-500 dark:text-slate-400">Your cart is empty.</p>
            </div>
          )}


          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex justify-between font-bold text-lg text-slate-800 dark:text-white">
                <span>Total:</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
              <Link
                href="/checkout"
                onClick={toggleCart}
                className="w-full block text-center py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-700 transition-colors"
              >
                Proceed to Checkout
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartDrawer;