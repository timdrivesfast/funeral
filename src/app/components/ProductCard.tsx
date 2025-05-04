"use client";

import Image from 'next/image'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import CheckoutButton from './CheckoutButton'

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
  const [finalImageUrl, setFinalImageUrl] = useState(image_url);
  
  // Add a timestamp to the image URL to prevent caching issues
  useEffect(() => {
    if (image_url) {
      setFinalImageUrl(image_url);
    }
  }, [image_url]);
  
  // Handle image error
  const handleImageError = () => {
    console.log(`Image failed to load for product: ${name} (${id})`);
    setImageError(true);
    setIsImageLoading(false);
  };
  
  // Format price for display
  const formattedPrice = typeof price === 'string' 
    ? `$${parseFloat(price).toFixed(2)}` 
    : `$${price.toFixed(2)}`;
  
  return (
    <Link 
      href={`/products/${id}`}
      className="group relative block aspect-square overflow-hidden transition-all duration-700 ease-out animate-[float_15s_ease-in-out_infinite] hover:scale-105 hover:-rotate-1"
    >
      {/* Frutiger Aero Glossy container */}
      <div className="relative w-full h-full rounded-lg overflow-hidden">
        {/* Glass-like background with bubble effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-blue-100/50 to-blue-200/30 backdrop-blur-sm shadow-2xl z-0"></div>
        <div className="absolute top-0 left-1/4 right-1/4 h-0.5 bg-white opacity-70"></div>
        {/* Animated internal reflection */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-transparent -translate-y-full animate-[bubble-shine_8s_ease-in-out_infinite]"></div>
        
        {/* Image Container */}
        <div className="relative w-full h-full">
          {finalImageUrl && !imageError ? (
            <>
              {isImageLoading && (
                <div className="absolute inset-0 bg-white/30 backdrop-blur-md flex items-center justify-center z-10">
                  <span className="text-white/70 text-sm">Loading...</span>
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center p-4 z-10">
                <div className="relative w-full h-full overflow-hidden rounded-lg">
                  <img
                    src={finalImageUrl}
                    alt={name}
                    className={`w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 ease-out p-2 ${isImageLoading ? 'opacity-0' : 'opacity-80'}`}
                    onError={handleImageError}
                    onLoad={() => {
                      console.log(`Image loaded successfully for product: ${name}`);
                      setIsImageLoading(false);
                    }}
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <span className="text-white/70 text-sm backdrop-blur-md p-2 rounded">
                {imageError ? 'Failed to load image' : 'No image'}
              </span>
            </div>
          )}
          
          {/* Small decorative bubbles */}
          <div className="absolute w-12 h-12 right-2 bottom-2 rounded-full overflow-hidden z-0 opacity-70 animate-[float_10s_ease-in-out_infinite]">
            <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-blue-100/60 to-blue-200/40 backdrop-blur-sm shadow-md"></div>
          </div>
          <div className="absolute w-8 h-8 left-3 top-3 rounded-full overflow-hidden z-0 opacity-70 animate-[float_12s_ease-in-out_infinite_1.5s]">
            <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-blue-100/60 to-blue-200/40 backdrop-blur-sm shadow-md"></div>
          </div>

          {/* Product Info Overlay - Glass panel */}
          <div className="absolute inset-0 p-6 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out z-20">
            <div className="relative glass-panel p-3 rounded-lg backdrop-blur-md bg-white/20 border border-white/40 shadow-lg">
              <p className="text-xs text-white uppercase tracking-wider mb-1">
                {category || 'Uncategorized'}
              </p>
              <h3 className="text-xl font-medium tracking-tight text-white">{name}</h3>
            </div>
            
            <div className="space-y-2">
              <div className="relative glass-panel p-3 rounded-lg backdrop-blur-md bg-white/20 border border-white/40 shadow-lg flex justify-between items-baseline">
                <p className="text-lg font-medium tracking-tight text-white">
                  {formattedPrice}
                </p>
                <span className="text-xs text-white uppercase tracking-wider font-light">
                  View Details →
                </span>
              </div>
              {(stock === 0 || stock === '0' || (typeof stock === 'string' && stock.trim() === '0')) && (
                <div className="relative glass-panel p-2 rounded-lg backdrop-blur-md bg-red-500/30 border border-white/40 shadow-lg text-center">
                  <p className="text-xs text-white uppercase tracking-wider font-medium">
                    Sold Out
                  </p>
                </div>
              )}
              {!(stock === 0 || stock === '0' || (typeof stock === 'string' && stock.trim() === '0')) && (
                <div className="pt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500" onClick={(e) => e.preventDefault()}>
                  <CheckoutButton 
                    productId={id} 
                    buttonText="Quick Buy" 
                    className="text-sm py-2 w-full backdrop-blur-md bg-gradient-to-r from-blue-400/50 to-pink-400/50 border border-white/40"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}