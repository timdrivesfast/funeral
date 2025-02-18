'use client';

import { useState } from 'react'
import { useCart } from '@/src/contexts/CartContext'

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  image_url?: string;
  category?: string;
}

interface Props {
  product: Product;
}

function formatProductDetails(description: string = '') {
  const details: Record<string, string> = {};
  
  // Split the description by newlines or periods
  const lines = description.split(/[\n.]/).map(line => line.trim()).filter(Boolean);
  
  lines.forEach(line => {
    const [key, value] = line.split(':').map(part => part.trim());
    if (key && value) {
      details[key.toUpperCase()] = value;
    }
  });

  return details;
}

export default function ProductDisplay({ product }: Props) {
  const { addItem } = useCart();
  const [imageError, setImageError] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isBuying, setIsBuying] = useState(false);
  const details = formatProductDetails(product.description);

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      await addItem(product.id, quantity);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleBuyNow = async () => {
    setIsBuying(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          quantity
        }),
      });

      if (!response.ok) {
        throw new Error('Checkout failed');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Error during checkout:', error);
    } finally {
      setIsBuying(false);
    }
  };

  return (
    <main className="min-h-screen p-4 md:p-10">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="relative aspect-square bg-transparent">
          {product.image_url && !imageError ? (
            <>
              {isImageLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-zinc-500 text-sm">Loading...</span>
                </div>
              )}
              <img
                src={product.image_url}
                alt={product.name}
                className={`absolute inset-0 w-full h-full object-cover opacity-80 hover:opacity-100
                  transition-all duration-700 ease-out ${isImageLoading ? 'opacity-0' : 'opacity-80'}`}
                onError={() => setImageError(true)}
                onLoad={() => setIsImageLoading(false)}
              />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-zinc-500 text-sm">
                {imageError ? 'Failed to load image' : 'No image available'}
              </span>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex flex-col justify-between py-4">
          <div className="space-y-8">
            <div>
              <p className="text-zinc-400 text-sm uppercase tracking-wider mb-2">
                {product.category || 'Uncategorized'}
              </p>
              <h1 className="text-4xl font-bold tracking-tight mb-2">{product.name}</h1>
              <p className="text-2xl font-medium">${(product.price / 100).toFixed(2)}</p>
            </div>

            {/* Formatted Product Details */}
            <div className="space-y-4">
              {Object.entries(details).map(([key, value]) => (
                <div key={key} className="flex flex-col">
                  <dt className="text-sm text-zinc-400 uppercase tracking-wider">{key}</dt>
                  <dd className="text-white">{value}</dd>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 mt-8">
            {product.stock !== undefined && (
              <p className="text-sm text-zinc-400 uppercase tracking-wider">
                {product.stock} Available
              </p>
            )}
            
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center border border-zinc-800 rounded-md">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-zinc-400 hover:text-white transition-colors"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 text-zinc-400 hover:text-white transition-colors"
                  disabled={product.stock !== undefined && quantity >= product.stock}
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex flex-col space-y-4">
              <button
                onClick={handleAddToCart}
                disabled={isAdding || (product.stock !== undefined && quantity > product.stock)}
                className="relative select-none cursor-pointer px-8 py-3 text-sm uppercase tracking-[0.2em] text-zinc-400 hover:text-white transition-colors duration-500 ease-out disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <div className="absolute inset-0 border border-zinc-800 group-hover:border-zinc-700 transition-colors duration-500" />
                <div className="relative">
                  {isAdding ? 'Adding...' : 'Add to Cart'}
                </div>
              </button>
              
              <button
                onClick={handleBuyNow}
                disabled={isBuying || (product.stock !== undefined && quantity > product.stock)}
                className="relative select-none cursor-pointer px-8 py-3 text-sm uppercase tracking-[0.2em] transition-all duration-500 ease-out disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <div className="absolute inset-0 bg-white opacity-90 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-0 blur-xl opacity-30 bg-white group-hover:opacity-40 transition-opacity duration-500" />
                <div className="relative text-black">
                  {isBuying ? 'Processing...' : 'Buy Now'}
                </div>
                <div className="absolute inset-0 opacity-0 animate-[flicker_4s_infinite] bg-white/50 mix-blend-overlay" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 