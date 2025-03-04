'use client';

import { useState } from 'react'

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock?: number;
  image_url?: string;
  image_urls?: string[]; 
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
  const [quantity] = useState(1); 
  const [isBuying, setIsBuying] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const details = formatProductDetails(product.description);
  
  // Get all available images (either from image_urls or fallback to image_url)
  const images = product.image_urls?.length ? product.image_urls : (product.image_url ? [product.image_url] : []);
  const currentImage = images[currentImageIndex];
  
  // Check if product is sold out (stock is explicitly 0)
  // If stock is undefined or null, we assume it's available
  const isSoldOut = product.stock === 0;
  console.log(`ProductDisplay - Product: ${product.name}, Stock: ${product.stock}, isSoldOut: ${isSoldOut}`);

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
        {/* Product Image Gallery */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-square bg-transparent">
            {currentImage && !imageError ? (
              <>
                {isImageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-zinc-500 text-sm">Loading...</span>
                  </div>
                )}
                <img
                  src={currentImage}
                  alt={`${product.name} - Image ${currentImageIndex + 1}`}
                  className={`absolute inset-0 w-full h-full object-cover opacity-80 hover:opacity-100
                    transition-all duration-700 ease-out ${isImageLoading ? 'opacity-0' : 'opacity-80'}`}
                  onError={() => setImageError(true)}
                  onLoad={() => setIsImageLoading(false)}
                />
                
                {/* Sold Out Overlay */}
                {isSoldOut && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 z-10">
                    <span className="text-white text-2xl font-bold uppercase tracking-widest">Sold Out</span>
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-zinc-500 text-sm">
                  {imageError ? 'Failed to load image' : 'No image available'}
                </span>
              </div>
            )}
          </div>
          
          {/* Thumbnail Gallery */}
          {images.length > 1 && (
            <div className="flex overflow-x-auto space-x-2 py-2">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentImageIndex(index);
                    setImageError(false);
                    setIsImageLoading(true);
                  }}
                  className={`relative w-16 h-16 flex-shrink-0 border-2 ${
                    index === currentImageIndex ? 'border-white' : 'border-transparent'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Hide just this thumbnail on error
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </button>
              ))}
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
            {/* Availability Status */}
            <p className="text-sm text-zinc-400 uppercase tracking-wider">
              {isSoldOut ? (
                <span className="text-red-500">Sold Out</span>
              ) : (
                "Available"
              )}
            </p>
            
            {/* Quantity Selector - Only show if not sold out */}
            {!isSoldOut && (
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center border border-zinc-800 rounded-md">
                  <button
                    className="px-3 py-2 text-zinc-400 transition-colors cursor-not-allowed opacity-50"
                    disabled={true}
                  >
                    -
                  </button>
                  <span className="w-12 text-center">{quantity}</span>
                  <button
                    className="px-3 py-2 text-zinc-400 transition-colors cursor-not-allowed opacity-50"
                    disabled={true}
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-col space-y-4">
              {/* Buy Now Button - Disabled if sold out */}
              <button
                onClick={handleBuyNow}
                disabled={isSoldOut || isBuying}
                className={`relative select-none cursor-pointer px-8 py-3 text-sm uppercase tracking-[0.2em] transition-all duration-500 ease-out disabled:opacity-50 disabled:cursor-not-allowed group ${
                  isSoldOut ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <div className={`absolute inset-0 ${isSoldOut ? 'bg-zinc-800' : 'bg-white opacity-90 group-hover:opacity-100'} transition-opacity duration-500`} />
                <div className={`absolute inset-0 blur-xl opacity-30 ${isSoldOut ? 'bg-zinc-800' : 'bg-white'} group-hover:opacity-40 transition-opacity duration-500`} />
                <div className={`relative ${isSoldOut ? 'text-zinc-500' : 'text-black'}`}>
                  {isBuying ? 'Processing...' : isSoldOut ? 'Sold Out' : 'Buy Now'}
                </div>
                {!isSoldOut && (
                  <div className="absolute inset-0 opacity-0 animate-[flicker_4s_infinite] bg-white/50 mix-blend-overlay" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}