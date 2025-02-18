"use client";

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

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
  product: Product
}

export default function ProductCard({ product }: Props) {
  const { id, name, price, image_url, category, stock } = product
  const [imageError, setImageError] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  
  return (
    <Link 
      href={`/products/${id}`}
      className="group relative block aspect-square bg-transparent 
        transition-all duration-700 ease-out"
    >
      {/* Image Container */}
      <div className="relative w-full h-full">
        {image_url && !imageError ? (
          <>
            {isImageLoading && (
              <div className="absolute inset-0 bg-zinc-900/30 flex items-center justify-center">
                <span className="text-zinc-500 text-sm">Loading...</span>
              </div>
            )}
            <img
              src={image_url}
              alt={name}
              className={`absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100
                transition-all duration-700 ease-out ${isImageLoading ? 'opacity-0' : 'opacity-80'}`}
              onError={() => setImageError(true)}
              onLoad={() => setIsImageLoading(false)}
            />
          </>
        ) : (
          <div className="w-full h-full bg-zinc-900/30 flex items-center justify-center">
            <span className="text-zinc-500 text-sm">
              {imageError ? 'Failed to load image' : 'No image'}
            </span>
          </div>
        )}
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 
          transition-opacity duration-700 ease-out" />

        {/* Product Info Overlay */}
        <div className="absolute inset-0 p-6 flex flex-col justify-between
          opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out">
          <div>
            <p className="text-xs text-zinc-400 uppercase tracking-wider mb-2">
              {category || 'Uncategorized'}
            </p>
            <h3 className="text-xl font-medium tracking-tight text-white">{name}</h3>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-baseline">
              <p className="text-lg font-medium tracking-tight text-white">
                ${(price / 100).toFixed(2)}
              </p>
              <span className="text-xs text-zinc-400 uppercase tracking-wider">
                View Details →
              </span>
            </div>
            {stock !== undefined && stock > 0 && (
              <p className="text-xs text-zinc-400 uppercase tracking-wider">
                {stock} Available
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
} 