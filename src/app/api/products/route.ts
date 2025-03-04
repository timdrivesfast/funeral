import { NextResponse } from 'next/server'
import { squareClient, getCatalogItemsWithInventory } from '@/src/lib/square-server';

export async function GET(request: Request) {
  try {
    // Test Square API connection
    try {
      await squareClient.locations.list();
    } catch (e) {
      console.error('Failed to connect to Square API:', e);
      return NextResponse.json(
        { error: 'Failed to connect to Square API' },
        { status: 500 }
      );
    }

    // Get catalog items with inventory
    const items = await getCatalogItemsWithInventory();
    
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    
    // Filter and transform items
    const products = items
      .filter(item => {
        // Filter by category if specified
        if (category && item.itemData?.categoryId) {
          // We would need to check the category name from related objects
          // For now, we'll just pass all items since we don't have category info
          return true;
        }
        return true;
      })
      .map(item => {
        // Get variation data for price
        const variation = item.itemData?.variations?.[0]?.itemVariationData;
        const price = variation?.priceMoney?.amount 
          ? Number(variation.priceMoney.amount) 
          : 0;
        
        // Get image IDs
        const imageIds = item.itemData?.imageIds || [];
        
        // Get image URLs from image IDs
        const imageUrls = imageIds.map(
          (imageId: string) => `/api/images/${imageId}`
        );
        
        // Get primary image URL
        const imageUrl = imageUrls.length > 0 ? imageUrls[0] : undefined;
        
        // Get stock level from inventory data
        // If stock is not tracked, it will be undefined (which means available)
        const stock = typeof item.quantity === 'string' 
          ? parseInt(item.quantity, 10) 
          : (item.quantity !== undefined ? item.quantity : undefined);
        
        return {
          id: item.id,
          name: item.itemData?.name || 'Unnamed Product',
          description: item.itemData?.description,
          price,
          stock,
          image_url: imageUrl,
          image_urls: imageUrls.length > 0 ? imageUrls : undefined,
          category: 'All Products' // We'll use a default category for now
        }
      })
      // Sort products by name to match Square dashboard order
      .sort((a, b) => {
        // Extract numeric part from product names (e.g., "V1.01" -> 1.01)
        const getNumericValue = (name: string) => {
          const match = name.match(/V(\d+\.\d+)/);
          return match ? parseFloat(match[1]) : Infinity;
        };
        
        const numA = getNumericValue(a.name);
        const numB = getNumericValue(b.name);
        
        // Sort by numeric value if both have valid numeric parts
        if (numA !== Infinity && numB !== Infinity) {
          return numA - numB;
        }
        
        // Fall back to alphabetical sorting
        return a.name.localeCompare(b.name);
      });
    
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    if (error && typeof error === 'object' && 'errors' in error) {
      const squareError = error as { errors: Array<{ message: string }> };
      console.error('Square API Error:', squareError.errors);
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}