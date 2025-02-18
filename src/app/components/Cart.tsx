'use client';

import { useState } from 'react';
import { useCart } from '@/src/contexts/CartContext';

export default function Cart() {
  const { items, totalItems, updateQuantity, removeItem } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  const total = items.reduce((sum, item) => sum + ((item.price || 0) * item.quantity), 0);

  return (
    <div className="relative">
      {/* Cart Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-zinc-500 hover:text-white transition-colors relative"
      >
        <span className="sr-only">Cart</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <path d="M16 10a4 4 0 0 1-8 0"></path>
        </svg>
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 bg-white text-black text-xs w-4 h-4 flex items-center justify-center rounded-full">
            {totalItems}
          </span>
        )}
      </button>

      {/* Cart Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-zinc-950 border border-zinc-800 rounded-lg shadow-xl z-50">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Cart</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-zinc-400 hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {items.length === 0 ? (
              <p className="text-zinc-400 text-center py-4">Your cart is empty</p>
            ) : (
              <>
                <div className="space-y-4 max-h-96 overflow-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <div className="flex-1">
                        <h3 className="text-sm font-medium">{item.name || 'Loading...'}</h3>
                        <p className="text-sm text-zinc-400">
                          {item.price !== undefined 
                            ? `$${(item.price / 100).toFixed(2)}` 
                            : 'Loading...'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="text-zinc-400 hover:text-white transition-colors"
                        >
                          -
                        </button>
                        <span className="text-sm w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="text-zinc-400 hover:text-white transition-colors"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-zinc-400 hover:text-white transition-colors ml-2"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-zinc-800">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-medium">Total</span>
                    <span className="font-medium">${(total / 100).toFixed(2)}</span>
                  </div>
                  <button
                    onClick={() => {
                      // Handle checkout
                    }}
                    className="w-full bg-white hover:bg-zinc-100 text-black font-medium py-2 rounded-md transition-colors"
                  >
                    Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 