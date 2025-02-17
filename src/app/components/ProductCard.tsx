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
  const { id, name, price, image_url, category } = product
  const [imageError, setImageError] = useState(false);
  
  return (
    <Link 
      href={`/products/${id}`}
      className="group relative block bg-zinc-900/50 backdrop-blur-sm rounded-lg overflow-hidden 
        hover:bg-zinc-800/50 transition-all duration-500 ease-out"
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden">
        {image_url && !imageError ? (
          <Image
            src={image_url}
            alt={name}
            fill
            className="object-cover transform transition-transform duration-700 ease-out
              group-hover:scale-105 will-change-transform"
            onError={() => setImageError(true)}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
            <span className="text-zinc-500 text-sm">
              {imageError ? 'Failed to load image' : 'No image'}
            </span>
          </div>
        )}
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 
          transition-opacity duration-500 ease-out" />
      </div>
      
      {/* Product Info */}
      <div className="p-6 space-y-2">
        <h3 className="text-lg font-medium tracking-tight group-hover:text-white 
          transition-colors duration-300">{name}</h3>
        <div className="flex justify-between items-center">
          <p className="text-sm text-zinc-400 group-hover:text-zinc-300 
            transition-colors duration-300">{category || 'Uncategorized'}</p>
          <p className="text-sm font-medium tracking-wide group-hover:text-white 
            transition-colors duration-300">
            ${(price / 100).toFixed(2)}
          </p>
        </div>
      </div>
    </Link>
  )
} 