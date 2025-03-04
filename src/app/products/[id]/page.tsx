import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import ProductDisplay from './ProductDisplay'
import { getCatalogItemsWithInventory, squareClient } from '@/src/lib/square-server'
import type { Square } from 'square'

interface Props {
  params: {
    id: string
  }
}

async function getProduct(id: Promise<string>) {
  const productId = await id
  console.log(`getProduct function called with ID: ${productId}`);
  
  try {
    // Get catalog items with inventory directly from Square
    const items = await getCatalogItemsWithInventory()
    console.log(`Fetched ${items.length} products from Square API`);
    
    const product = items.find(item => item.id === productId)
    
    if (product) {
      // Log detailed inventory information
      console.log(`Found product: ${product.itemData?.name}, Raw inventory data:`, JSON.stringify({
        quantity: product.quantity,
        type: typeof product.quantity
      }));
      
      // Force inventory check with Square
      if (product.id) {
        try {
          // Get real-time inventory data
          const inventoryResponse = await squareClient.inventory.batchGetCounts({
            catalogObjectIds: [product.id],
            locationIds: [process.env.SQUARE_LOCATION_ID!]
          });
          
          // Check if we got inventory data
          if (inventoryResponse.data && inventoryResponse.data.length > 0) {
            const inventoryCount = inventoryResponse.data[0];
            console.log(`Direct inventory check for ${product.itemData?.name}: ${inventoryCount.quantity} (${typeof inventoryCount.quantity})`);
            
            // Update the product's quantity with the latest data
            product.quantity = inventoryCount.quantity;
          } else {
            console.log(`No direct inventory data found for ${product.itemData?.name}`);
          }
        } catch (error) {
          console.error(`Error fetching direct inventory for ${product.itemData?.name}:`, error);
        }
      }
    } else {
      console.log(`Product with ID ${productId} not found in API response`);
      return null;
    }
    
    if (!product || product.type !== 'ITEM') return null

    const itemData = product.itemData
    const variation = itemData?.variations?.[0]
    const price = variation?.type === 'ITEM_VARIATION' ? Number(variation.itemVariationData?.priceMoney?.amount) / 100 || 0 : 0
    
    // Get all image URLs instead of just the first one
    const imageUrls = itemData?.imageIds?.map(imageId => `/api/images/${imageId}`) || [];

    return {
      id: product.id,
      name: itemData?.name || '',
      description: itemData?.description || '',
      price: price.toFixed(2), // Format price to two decimal places
      stock: product.quantity,
      image_url: imageUrls[0] || '', // Keep the main image URL for backward compatibility
      image_urls: imageUrls, // Add all image URLs as an array
      category: itemData?.categoryId || 'Uncategorized'
    }
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export default async function ProductPage({ params }: Props) {
  const { id } = params;
  console.log(`Product page loading for ID: ${id}`);
  
  const product = await getProduct(Promise.resolve(params.id))
  
  console.log(`Received product data from API: ${JSON.stringify(product)}`);
  
  if (!product) {
    console.error(`Product with ID ${id} not found`);
    notFound()
  }

  return <ProductDisplay product={product} />
}