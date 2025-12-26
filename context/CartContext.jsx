
"use client";

import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';

const CartContext = createContext();
const CART_STORAGE_KEY = 'shophoria-cart'; // Changed from session to permanent

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    // This function now runs only on the client-side, preventing hydration issues.
    if (typeof window === 'undefined') {
      return [];
    }
    try {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY);
      return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
      console.error("Error reading cart from localStorage:", error);
      return [];
    }
  });
  
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    // This effect runs only on the client-side, where localStorage is available.
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  }, [cartItems]);


  const toggleCart = () => {
    setIsCartOpen(prevState => !prevState);
  };

  const addItemToCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeItemFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };
  
  const updateItemQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItemFromCart(productId);
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const total = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cartItems]);


  const value = {
    cartItems,
    isCartOpen,
    toggleCart,
    addItemToCart,
    removeItemFromCart,
    updateItemQuantity,
    total,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
