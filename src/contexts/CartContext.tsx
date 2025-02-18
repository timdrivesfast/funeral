'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartItem, getCartItems, addToCart, updateCartItemQuantity, removeFromCart, clearCart } from '@/src/lib/cart';

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  addItem: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clear: () => Promise<void>;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshCart = async () => {
    const cartItems = await getCartItems();
    setItems(cartItems);
  };

  useEffect(() => {
    refreshCart().finally(() => setIsLoading(false));
  }, []);

  const addItem = async (productId: string, quantity: number = 1) => {
    await addToCart(productId, quantity);
    await refreshCart();
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    await updateCartItemQuantity(itemId, quantity);
    await refreshCart();
  };

  const removeItem = async (itemId: string) => {
    await removeFromCart(itemId);
    await refreshCart();
  };

  const clear = async () => {
    await clearCart();
    await refreshCart();
  };

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items,
      totalItems,
      addItem,
      updateQuantity,
      removeItem,
      clear,
      isLoading
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
} 