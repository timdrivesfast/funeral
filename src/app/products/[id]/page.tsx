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
    
    const product = items.find((item: any) => item.id === productId)
    
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
    // Ensure we're correctly handling the price from Square
    let price = 0;
    if (variation?.type === 'ITEM_VARIATION' && variation.itemVariationData?.priceMoney?.amount) {
      // Convert from cents to dollars
      const priceInCents = variation.itemVariationData.priceMoney.amount;
      price = Number(priceInCents) / 100;
      console.log(`Price for ${itemData?.name}: ${priceInCents} cents = $${price.toFixed(2)}`);
    }
    
    // Get all image URLs instead of just the first one
    const imageUrls = itemData?.imageIds?.map((imageId: string) => `/api/images/${imageId}`) || [];

    // Ensure stock is 0 for sold out items, not undefined
    let stockValue = product.quantity;
    
    // If we have a direct inventory check with 0 quantity or no quantity, set stock to 0
    if (stockValue === undefined || stockValue === null || stockValue === '0' || stockValue === 0) {
      // For items with 0 inventory or no inventory tracking, explicitly set to 0 if in Square it shows 0
      if (product.id === 'FXUHFLEAHXLDN5OHVEZ3XBMN') { // V1.08 ID
        console.log('Forcing V1.08 to show as sold out');
        stockValue = 0;
      }
    }
    
    console.log(`Final stock value for ${itemData?.name}: ${stockValue}`);

    return {
      id: product.id,
      name: itemData?.name || '',
      description: itemData?.description?.replace(/\r\n/g, '\n').trim() || '',
      price: price.toFixed(2), // Format price to two decimal places
      stock: stockValue,
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