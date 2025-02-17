'use client';

import Image from 'next/image'
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

export default function ProductDisplay({ product }: Props) {
  const [imageError, setImageError] = useState(false);

  return (
    <main className="min-h-screen p-4 md:p-10">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="relative aspect-square bg-zinc-900/50 backdrop-blur-sm rounded-lg overflow-hidden">
          {product.image_url && !imageError ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
              <span className="text-zinc-500 text-sm">
                {imageError ? 'Failed to load image' : 'No image'}
              </span>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex flex-col justify-center">
          <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
          {product.category && (
            <p className="text-gray-400 mb-4">{product.category}</p>
          )}
          <p className="text-xl mb-6">${(product.price / 100).toFixed(2)}</p>
          {product.description && (
            <p className="text-gray-300 mb-8">{product.description}</p>
          )}
          
          {product.stock !== undefined && (
            <p className="text-sm text-gray-400 mb-4">
              {product.stock} items left in stock
            </p>
          )}

          <CheckoutButton productId={product.id} />
        </div>
      </div>
    </main>
  );
} 