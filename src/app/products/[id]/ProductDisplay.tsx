'use client';

import { useState } from 'react'
import CheckoutButton from '@/src/app/components/CheckoutButton'

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
  const [imageError, setImageError] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const details = formatProductDetails(product.description);

  return (
    <main className="min-h-screen p-4 md:p-10">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="relative aspect-square bg-zinc-900/30 rounded-lg overflow-hidden">
          {product.image_url && !imageError ? (
            <>
              {isImageLoading && (
                <div className="absolute inset-0 bg-zinc-900/30 flex items-center justify-center">
                  <span className="text-zinc-500 text-sm">Loading image...</span>
                </div>
              )}
              <img
                src={product.image_url}
                alt={product.name}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                  isImageLoading ? 'opacity-0' : 'opacity-100'
                }`}
                onError={() => setImageError(true)}
                onLoad={() => setIsImageLoading(false)}
              />
            </>
          ) : (
            <div className="w-full h-full bg-zinc-900/30 flex items-center justify-center">
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
            <CheckoutButton productId={product.id} />
          </div>
        </div>
      </div>
    </main>
  );
} 