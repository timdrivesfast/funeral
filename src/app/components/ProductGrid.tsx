"use client";

import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import type { Square } from 'square';

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

function transformSquareItem(item: Square.CatalogObject & { quantity: number }, relatedObjects?: Square.CatalogObject[]): Product {
  if (item.type !== 'ITEM' || !item.itemData) {
    throw new Error('Invalid catalog item type');
  }

  const itemData = item.itemData;
  const variation = itemData.variations?.[0];
  const price = variation?.type === 'ITEM_VARIATION' && variation.itemVariationData?.priceMoney?.amount 
    ? Number(variation.itemVariationData.priceMoney.amount) 
    : 0;

  // Find the category object and get its name
  const categoryId = itemData.categories?.[0]?.id;
  const categoryObject = relatedObjects?.find(obj => 
    obj.type === 'CATEGORY' && obj.id === categoryId
  );
  
  let categoryName = 'Uncategorized';
  if (categoryObject?.type === 'CATEGORY') {
    const categoryData = categoryObject as unknown as { categoryData: { name: string } };
    categoryName = categoryData.categoryData?.name || 'Uncategorized';
  }

  // Find the image object and get its URL
  const imageId = itemData.imageIds?.[0];
  
  // Log the image information for debugging
  console.log(`Product ${itemData.name} (${item.id}) has imageId: ${imageId}`);
  
  // If we have an imageId, construct the URL to our API endpoint
  const imageUrl = imageId ? `/api/images/${imageId}` : undefined;
  
  return {
    id: item.id,
    name: itemData.name || '',
    description: itemData.description || '',
    price,
    stock: item.quantity,
    image_url: imageUrl,
    category: categoryName
  };
}

export default function ProductGrid({ category }: { category?: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/products');
        if (!response.ok) {
          const errorData = await response.json();
          console.error('API Error Response:', errorData);
          
          // Extract detailed error message if available
          let errorMessage = 'Failed to fetch products';
          if (errorData.error) {
            errorMessage = errorData.error;
            if (errorData.message) {
              errorMessage += `: ${errorData.message}`;
            }
            if (errorData.details) {
              errorMessage += ` (${errorData.details})`;
            }
          }
          
          throw new Error(errorMessage);
        }
        
        // Get the products directly from the API response
        const products = await response.json();
        console.log('Products Response:', products);
        
        // Check if products is an array
        if (!Array.isArray(products)) {
          throw new Error('Invalid response format: expected an array of products');
        }
        
        // Set the products directly
        setProducts(products);
      } catch (err) {
        console.error('Detailed fetch error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load products.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-6">
        <p className="text-red-500 font-medium text-center p-4 animate-fade-in">{error}</p>
        <div className="mt-4 text-sm text-zinc-400 max-w-lg">
          <p className="mb-2">This error is occurring in your local development environment, but may not affect your live site.</p>
          <p className="mb-2">Possible causes:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Missing environment variables (SQUARE_ACCESS_TOKEN, SQUARE_LOCATION_ID)</li>
            <li>Invalid Square API credentials</li>
            <li>Network connectivity issues</li>
          </ul>
          <p className="mt-2">Check your .env.local file to ensure all required variables are set correctly.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse aspect-square">
            <div className="bg-zinc-900/30 h-full w-full" />
          </div>
        ))}
      </div>
    );
  }

  const filteredProducts = category
    ? products.filter(product => product.category?.toLowerCase() === category.toLowerCase())
    : products;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16 animate-fade-in">
      {filteredProducts.length === 0 ? (
        <div className="col-span-full flex items-center justify-center min-h-[400px]">
          <p className="text-zinc-500 text-center">No products found</p>
        </div>
      ) : (
        filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))
      )}
    </div>
  );
}