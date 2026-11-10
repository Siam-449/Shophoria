
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
      const safeStringify = (obj) => {
        let cache = [];
        const retVal = JSON.stringify(obj, (key, value) =>
          typeof value === "object" && value !== null
            ? cache.includes(value) ? undefined : cache.push(value) && value
            : value
        );
        cache = null;
        return retVal;
      };
      localStorage.setItem(CART_STORAGE_KEY, safeStringify(cartItems));
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  }, [cartItems]);


  const toggleCart = () => {
    setIsCartOpen(prevState => !prevState);
  };

  const getCartItemId = (product) => {
    if (product.cartItemId) return product.cartItemId;
    const parts = [
      product.id,
      product.selectedVariant?.id || product.selectedVariant?.name || '',
      product.selectedColor || '',
      product.selectedSize || '',
      product.selectedWeight || ''
    ];
    return parts.join('_');
  };

  const addItemToCart = (product, quantityToAdd = 1) => {
    const qty = typeof quantityToAdd === 'number' && quantityToAdd > 0 ? quantityToAdd : 1;
    const cartItemId = getCartItemId(product);
    const itemToAdd = {
      ...product,
      cartItemId,
    };

    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => (item.cartItemId || item.id) === cartItemId);
      if (existingItem) {
        return prevItems.map(item =>
          (item.cartItemId || item.id) === cartItemId
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [...prevItems, { ...itemToAdd, quantity: qty }];
    });
    setIsCartOpen(true);
  };

  const removeItemFromCart = (cartItemIdOrId) => {
    setCartItems(prevItems => prevItems.filter(item => (item.cartItemId || item.id) !== cartItemIdOrId && item.id !== cartItemIdOrId));
  };
  
  const updateItemQuantity = (cartItemIdOrId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItemFromCart(cartItemIdOrId);
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          ((item.cartItemId || item.id) === cartItemIdOrId || item.id === cartItemIdOrId)
            ? { ...item, quantity: newQuantity }
            : item
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
