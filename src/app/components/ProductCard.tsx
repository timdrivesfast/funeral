"use client";

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number | string;
  stock?: number | string;
  image_url?: string;
  image_urls?: string[];
  category?: string;
}

interface Props {
  product: Product
}

export default function ProductCard({ product }: Props) {
  const { id, name, price, image_url, category, stock } = product
  const [imageError, setImageError] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [finalImageUrl, setFinalImageUrl] = useState(image_url);
  
  // Add a timestamp to the image URL to prevent caching issues
  useEffect(() => {
    if (image_url) {
      setFinalImageUrl(`${image_url}?t=${Date.now()}`);
    }
  }, [image_url]);
  
  // Handle image retry logic
  const handleImageError = () => {
    console.error(`Failed to load image for product: ${name} (${id}), URL: ${finalImageUrl}`);
    
    if (retryCount < 2 && image_url) {
      // Retry loading the image with a new timestamp
      setRetryCount(prev => prev + 1);
      setFinalImageUrl(`${image_url}?retry=${retryCount + 1}&t=${Date.now()}`);
      console.log(`Retrying image load (attempt ${retryCount + 1}): ${finalImageUrl}`);
    } else {
      setImageError(true);
      setIsImageLoading(false);
    }
  };
  
  // Format price for display
  const formattedPrice = typeof price === 'string' 
    ? `$${parseFloat(price).toFixed(2)}` 
    : `$${price.toFixed(2)}`;
  
  return (
    <Link 
      href={`/products/${id}`}
      className="group relative block aspect-square bg-transparent 
        transition-all duration-700 ease-out"
    >
      {/* Image Container */}
      <div className="relative w-full h-full">
        {finalImageUrl && !imageError ? (
          <>
            {isImageLoading && (
              <div className="absolute inset-0 bg-zinc-900/30 flex items-center justify-center">
                <span className="text-zinc-500 text-sm">Loading...</span>
              </div>
            )}
            <img
              src={finalImageUrl}
              alt={name}
              className={`absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100
                transition-all duration-700 ease-out ${isImageLoading ? 'opacity-0' : 'opacity-80'}`}
              onError={handleImageError}
              onLoad={() => {
                console.log(`Image loaded successfully for product: ${name}`);
                setIsImageLoading(false);
              }}
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
                {formattedPrice}
              </p>
              <span className="text-xs text-zinc-400 uppercase tracking-wider">
                View Details →
              </span>
            </div>
            {(stock === 0 || stock === '0' || (typeof stock === 'string' && stock.trim() === '0')) && (
              <p className="text-xs text-red-500 uppercase tracking-wider font-medium">
                Sold Out
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}