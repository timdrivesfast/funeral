import { NextResponse } from 'next/server'
import { squareClient, getCatalogItemsWithInventory } from '@/src/lib/square-server';

export async function GET(request: Request) {
  console.log('API: /api/products GET request received');
  
  // Check environment variables first
  if (!process.env.SQUARE_ACCESS_TOKEN) {
    console.error('SQUARE_ACCESS_TOKEN is missing in environment variables');
    return NextResponse.json(
      { error: 'Square API configuration is incomplete: Missing access token' },
      { status: 500 }
    );
  }

  if (!process.env.SQUARE_LOCATION_ID) {
    console.error('SQUARE_LOCATION_ID is missing in environment variables');
    return NextResponse.json(
      { error: 'Square API configuration is incomplete: Missing location ID' },
      { status: 500 }
    );
  }
  
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
    const catalogItems = await getCatalogItemsWithInventory();
    console.log(`API: Retrieved ${catalogItems.length} catalog items with inventory`);

    // Transform catalog items to products
    const products = catalogItems
      .filter((item: any) => {
        const isItem = item.type === 'ITEM';
        console.log(`API: Item ${item.id} (${item.itemData?.name}) type: ${item.type}, isItem: ${isItem}`);
        return isItem;
      })
      .map((item: any) => {
        // Extract item data
        const { id, itemData, quantity } = item;
        
        // Log the raw quantity value
        console.log(`API: Processing item ${id} (${itemData?.name}), raw quantity: ${quantity}, type: ${typeof quantity}`);
        
        // Convert quantity to a number for stock
        let stock: number | undefined = undefined;
        
        if (quantity !== undefined) {
          // Handle both string and number types
          if (typeof quantity === 'string') {
            // Trim any whitespace and parse as integer
            stock = parseInt(quantity.trim(), 10);
            console.log(`API: Converted string quantity "${quantity}" to number ${stock}`);
          } else {
            stock = Number(quantity);
            console.log(`API: Converted quantity ${quantity} to stock ${stock}`);
          }
          
          // Check for NaN
          if (isNaN(stock)) {
            console.log(`API: Quantity "${quantity}" converted to NaN, setting to undefined`);
            stock = undefined;
          }
        } else {
          console.log(`API: Item ${id} (${itemData?.name}) has undefined quantity`);
        }

        // Extract image URLs
        const imageIds = itemData?.imageIds || [];
        const image_urls = imageIds.map((imageId: string) => `/api/images/${imageId}`);
        
        // Extract variations
        const variations = itemData?.variations || [];
        const firstVariation = variations[0];
        
        // Get price in cents from Square
        let price = 0;
        if (firstVariation?.itemVariationData?.priceMoney?.amount) {
          const priceInCents = firstVariation.itemVariationData.priceMoney.amount;
          // Convert cents to dollars
          price = Number(priceInCents) / 100;
          console.log(`API: Item ${id} (${itemData?.name}) price: ${priceInCents} cents = $${price.toFixed(2)}`);
        } else {
          console.log(`API: Item ${id} (${itemData?.name}) has no price information`);
        }
        
        // Create product object
        const product = {
          id,
          name: itemData?.name || '',
          description: itemData?.description || '',
          price,
          stock,
          image_url: image_urls[0] || null,
          image_urls: image_urls.length > 0 ? image_urls : null,
          category: itemData?.category || 'Uncategorized',
        };
        
        // Special case handling for known sold out items
        if (id === 'FXUHFLEAHXLDN5OHVEZ3XBMN') { // V1.08 ID
          console.log(`API: Forcing product ${id} (${product.name}) to show as sold out`);
          product.stock = 0;
        }
        
        console.log(`API: Transformed product ${id} (${product.name}): stock=${product.stock}, price=${product.price}`);
        return product;
      });

    // Log inventory data for debugging
    console.log('Raw inventory data from Square:');
    catalogItems.forEach((item: any) => {
      if (item.itemData?.name) {
        console.log(`Product: ${item.itemData.name}, ID: ${item.id}, Stock: ${item.quantity === undefined ? 'undefined' : item.quantity === null ? 'null' : item.quantity}`);
      }
    });

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    
    // Filter by category if specified
    let filteredProducts = products;
    if (category) {
      filteredProducts = products.filter((product: any) => product.category === category);
    }

    // Sort products by name to match Square dashboard order
    const sortedProducts = filteredProducts.sort((a: any, b: any) => {
      // Extract numeric part from product names (e.g., "V1.01" -> 1.01)
      const getNumericValue = (name: string): number => {
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

    console.log(`API: Returning ${sortedProducts.length} products`);
    return NextResponse.json(sortedProducts, {
      headers: {
        'Cache-Control': 'no-store, max-age=0, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    
    // Provide more detailed error messages depending on the error type
    if (error && typeof error === 'object') {
      if ('errors' in error) {
        const squareError = error as { errors: Array<{ message: string }> };
        console.error('Square API Error:', squareError.errors);
        
        // Return the actual Square API error messages
        return NextResponse.json(
          { 
            error: 'Square API Error', 
            details: squareError.errors.map(e => e.message).join(', ')
          },
          { status: 500 }
        );
      } else if (error instanceof Error) {
        // Return the error message from the Error object
        return NextResponse.json(
          { 
            error: 'Server Error', 
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
          },
          { status: 500 }
        );
      }
    }
    
    // Generic error fallback
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}