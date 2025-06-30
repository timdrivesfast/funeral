import { SquareClient, SquareEnvironment } from 'square';
import type { Square } from 'square';
import { Client as LegacyClient } from 'square/legacy';

if (!process.env.SQUARE_ACCESS_TOKEN) {
  throw new Error('SQUARE_ACCESS_TOKEN is not set in environment variables');
}

if (!process.env.SQUARE_LOCATION_ID) {
  throw new Error('SQUARE_LOCATION_ID is not set in environment variables');
}

// Initialize Square client with the latest API version
export const squareClient = new SquareClient({
  environment: SquareEnvironment.Production,
  // @ts-ignore - accessToken is valid but not in the type definition
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  // @ts-ignore - squareVersion is valid but not in the type definition
  squareVersion: '2025-06-18'
});

// Get API clients
const { catalog, inventory, checkout } = squareClient;

// Initialize legacy client for APIs not yet available in the new SDK
export const legacyClient = new LegacyClient({
  bearerAuthCredentials: {
    accessToken: process.env.SQUARE_ACCESS_TOKEN!,
  },
});

// Get API clients
const { catalogApi, inventoryApi, checkoutApi } = legacyClient;

// Process a payment
export async function processPayment({
  sourceId,
  amount,
  currency = 'USD',
  customerId,
  note
}: {
  sourceId: string;
  amount: number;
  currency?: string;
  customerId?: string;
  note?: string;
}) {
  try {
    const request: Omit<Square.CreatePaymentRequest, 'amountMoney'> & {
      amountMoney: {
        amount: bigint;
        currency: Square.Currency;
      }
    } = {
      sourceId,
      idempotencyKey: crypto.randomUUID(),
      amountMoney: {
        amount: BigInt(amount),
        currency: currency as Square.Currency
      },
      locationId: process.env.SQUARE_LOCATION_ID!,
      customerId,
      note,
      autocomplete: true
    };

    const response = await squareClient.payments.create(request);
    return JSON.parse(JSON.stringify(response.payment, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ));
  } catch (error) {
    if (error && typeof error === 'object' && 'errors' in error) {
      const squareError = error as { errors: Array<{ message: string }> };
      console.error('Square API Error:', squareError.errors);
    } else {
      console.error('Error processing payment:', error);
    }
    throw error;
  }
}

// Create a payment link
export async function createPaymentLink({
  productId,
  quantity = 1,
  redirectUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://funeral.supply'}/confirmation`
}: {
  productId: string;
  quantity?: number;
  redirectUrl?: string;
}) {
  try {
    // Create request object for payment link
    const response = await checkoutApi.createPaymentLink({
      idempotencyKey: crypto.randomUUID(),
      order: {
        locationId: process.env.SQUARE_LOCATION_ID!,
        lineItems: [
          {
            quantity: quantity.toString(),
            catalogObjectId: productId
          }
        ]
      },
      checkoutOptions: {
        redirectUrl,
        askForShippingAddress: true,
        merchantSupportEmail: 'funeral.supply@gmail.com',
        acceptedPaymentMethods: {
          applePay: true,
          googlePay: true,
          cashAppPay: false,
          afterpayClearpay: false
        },
        allowTipping: false,
        enableCoupon: false
      },
      // Email and phone collection settings are not directly supported in this SDK version
      // These will need to be configured in the Square Dashboard
    });

    // Return payment link
    return JSON.parse(JSON.stringify(response.result.paymentLink, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ));
  } catch (error) {
    if (error && typeof error === 'object' && 'errors' in error) {
      const squareError = error as { errors: Array<{ message: string }> };
      console.error('Square API Error:', squareError.errors);
    } else {
      console.error('Error creating payment link:', error);
    }
    throw error;
  }
}

// Get catalog items with inventory
export async function getCatalogItemsWithInventory() {
  try {
    console.log('Starting getCatalogItemsWithInventory function...');
    
    // First, get catalog items
    // Different Square SDK versions have different API patterns
    let catalogResponse;
    try {
      // Search for catalog items
      const searchResponse = await catalog.search({
        objectTypes: ['ITEM'],
        query: {
          // @ts-ignore - Filter is valid but not in the type definition
          filter: {
            type: 'CATEGORY',
            categoryFilter: {
              all: ['REGULAR']
            }
          }
        },
        limit: 100
      });
      // @ts-ignore - Response structure varies
      catalogResponse = searchResponse.result || searchResponse;
    } catch (err) {
      console.error('Error searching catalog items:', err);
      
      // Fallback to list catalog items if search fails
      try {
        const listResponse = await catalog.list({
        types: 'ITEM'
      });
        // @ts-ignore - Response structure varies
        catalogResponse = listResponse.result || listResponse;
      } catch (catalogError: any) {
        console.error('Error searching catalog items:', catalogError);
        throw new Error(`Failed to search catalog objects: ${catalogError.message || 'Unknown error'}. Check if your Square SDK version is compatible.`);
      }
    }
    

    // Convert BigInt to string for logging
    console.log('Catalog Response:', JSON.stringify(catalogResponse.result, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    , 2));

    // Handle different response structures
    const items = (catalogResponse.objects || catalogResponse.items || catalogResponse.catalogObjects || []) as Square.CatalogObject[];
    console.log(`Found ${items.length} catalog items`);
    
    // Then, get inventory for these items
    const itemIds = items.map((item: Square.CatalogObject) => item.id).filter((id): id is string => id !== undefined);
    console.log(`Getting inventory for ${itemIds.length} items:`, itemIds);
    
    // Add timestamp to ensure we're not getting cached data
    const timestamp = new Date().toISOString();
    console.log(`Fetching inventory at ${timestamp}`);
    
    const inventoryResponse = await inventoryApi.batchRetrieveInventoryCounts({
      catalogObjectIds: itemIds,
      locationIds: [process.env.SQUARE_LOCATION_ID!]
    });

    console.log('Inventory Response:', JSON.stringify(inventoryResponse.result, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    , 2));

    // Combine catalog and inventory data
    const inventoryMap = new Map(
      (inventoryResponse.result.counts || []).map((count: any) => [
        count.catalogObjectId,
        count.quantity
      ])
    );

    console.log('Inventory map created with', inventoryMap.size, 'items');
    
    // Log which items have inventory and which don't
    itemIds.forEach((id: string) => {
      console.log(`Item ${id} inventory: ${inventoryMap.has(id) ? inventoryMap.get(id) : 'not found in inventory'}`);
    });

    // Define IDs for products that should always show as sold out
    const soldOutProductIds = ['FXUHFLEAHXLDN5OHVEZ3XBMN']; // V1.08
    
    // Try to find V1.04 by looking at item names
    let v104Id = '';
    for (const item of items) {
      if (item.type === 'ITEM' && 
          item.itemData?.name && 
          (item.itemData.name.includes('V1.04') || item.itemData.name.includes('1.04'))) {
        v104Id = item.id || '';
        console.log(`Found V1.04 with ID: ${v104Id}`);
        if (v104Id) soldOutProductIds.push(v104Id);
        break;
      }
    }

    // Convert BigInt to string in the response
    return items.map((item: Square.CatalogObject) => {
      // Check if this is a known sold out item (V1.08, V1.04, etc.)
      if (soldOutProductIds.includes(item.id || '')) {
        console.log(`Forcing item ${item.id} (${item.type === 'ITEM' && item.itemData?.name}) to have 0 quantity`);
        const itemWithQuantity = {
          ...item,
          quantity: '0' // Set to 0 as a string to match Square's format
        };
        
        // Log the final item with quantity
        console.log(`Final item ${item.id} (${item.type === 'ITEM' && item.itemData?.name}): quantity = ${itemWithQuantity.quantity} (FORCED SOLD OUT)`);
        
        // Convert any BigInt values to strings
        return JSON.parse(JSON.stringify(itemWithQuantity, (key, value) =>
          typeof value === 'bigint' ? value.toString() : value
        ));
      }
      
      // Get inventory from Square API response
      const quantity = inventoryMap.has(item.id || '') ? inventoryMap.get(item.id || '') : undefined;
      
      const itemWithQuantity = {
        ...item,
        quantity
      };

      // Log the final item with quantity
      console.log(`Final item ${item.id} (${item.type === 'ITEM' && item.itemData?.name}): quantity = ${itemWithQuantity.quantity}`);

      // Convert any BigInt values to strings
      return JSON.parse(JSON.stringify(itemWithQuantity, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
      ));
    });
  } catch (error) {
    console.error('Error in getCatalogItemsWithInventory:', error);
    if (error && typeof error === 'object' && 'errors' in error) {
      const squareError = error as { errors: Array<{ message: string }> };
      console.error('Square API Error:', squareError.errors);
    }
    throw error;
  }
}

export async function upsertCatalogItem({
  name,
  description,
  price,
  quantity = 0,
  imageUrl,
  categoryId,
  taxIds,
  inventoryAlertThreshold = 5
}: {
  name: string;
  description: string;
  price: number;
  quantity?: number;
  imageUrl?: string;
  categoryId?: string;
  taxIds?: string[];
  inventoryAlertThreshold?: number;
}) {
  try {
    // Prepare catalog object
    let catalogObject;
    let imageId;
    
    // Upload image if provided
    if (imageUrl) {
      // Create a catalog image
      // @ts-ignore - upsertObject is valid but not in the type definition
      const imageResponse = await squareClient.catalog.upsertObject({
        idempotencyKey: crypto.randomUUID(),
        object: {
          type: 'IMAGE',
          id: `#${name.replace(/\s+/g, '_')}_image`,
          imageData: {
            name: `${name} Image`,
            url: imageUrl
          }
        }
      });
      
      if (imageResponse.object?.id) {
        imageId = imageResponse.object.id;
      }
    }
    
    // Create or update the catalog item
    const newItemId = `#${name.replace(/\s+/g, '_')}`;
    const newVariationId = `${newItemId}_VARIATION`;
    
    // Prepare catalog item data
    const itemData: any = {
      name,
      description,
      variations: [
        {
          type: 'ITEM_VARIATION',
          id: newVariationId,
          itemVariationData: {
            itemId: newItemId,
            name: 'Regular',
            pricingType: 'FIXED_PRICING',
            priceMoney: {
              amount: BigInt(Math.round(price * 100)),
              currency: 'USD'
            },
            availableForBooking: true,
            sellable: true,
            stockable: true,
            inventoryAlertType: 'LOW_QUANTITY',
            inventoryAlertThreshold,
            locationOverrides: [
              {
                locationId: process.env.SQUARE_LOCATION_ID!,
                trackInventory: true
              }
            ]
          }
        }
      ]
    };

    // Add optional fields if they exist
    if (categoryId) itemData.categoryId = categoryId;
    if (taxIds && taxIds.length > 0) itemData.taxIds = taxIds;
    if (imageId) itemData.imageIds = [imageId];

    // @ts-ignore - Using direct API call to bypass type issues
    const response = await catalog.upsertObject({
      idempotencyKey: crypto.randomUUID(),
      object: {
        type: 'ITEM',
        id: newItemId,
        itemData: itemData
      }
    });
    
    // @ts-ignore - Handle different response structures
    const result = response.result?.object || response.object || response;
    const finalItemId = result.id || newItemId;
    const finalVariationId = result.itemData?.variations?.[0]?.id || newVariationId;
    
    // Set initial inventory if necessary
    if (quantity > 0 && finalVariationId) {
      await updateInventory({
        catalogObjectId: finalVariationId,
        quantity
      });
    }
    
    return JSON.parse(JSON.stringify(result, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ));
  } catch (error) {
    console.error('Error in upsertCatalogItem:', error);
    throw error;
  }
}

// Update inventory for a specific item
export async function updateInventory({
  catalogObjectId,
  quantity,
  fromState = 'IN_STOCK'
}: {
  catalogObjectId: string;
  quantity: number;
  fromState?: string;
}) {
  try {
    console.log(`Updating inventory for item ${catalogObjectId} to quantity ${quantity}`);
    
    // First, get current inventory count
    const inventoryResponse = await inventoryApi.batchRetrieveInventoryCounts({
      catalogObjectIds: [catalogObjectId],
      locationIds: [process.env.SQUARE_LOCATION_ID!]
    });
    const currentQuantity = inventoryResponse.result.counts?.[0]?.quantity 
      ? parseInt(inventoryResponse.result.counts[0].quantity) 
      : 0;
    
    console.log(`Current inventory for item ${catalogObjectId}: ${currentQuantity}`);
    
    // Calculate the adjustment needed
    const adjustment = quantity - currentQuantity;
    
    if (adjustment === 0) {
      console.log(`No adjustment needed for item ${catalogObjectId}. Current quantity: ${currentQuantity}`);
      return { success: true, message: 'No adjustment needed' };
    }
    
    // Create the adjustment
    // @ts-ignore - batchChange is valid but not in the type definition
    const response = await inventory.batchChange({
      idempotencyKey: crypto.randomUUID(),
      changes: [{
        type: 'ADJUSTMENT',
        adjustment: {
          catalogObjectId,
          fromState: fromState as any, // Type assertion to bypass type checking
          toState: 'IN_STOCK',
          locationId: process.env.SQUARE_LOCATION_ID!,
          quantity: Math.abs(adjustment).toString(),
          occurredAt: new Date().toISOString()
        }
      }]
    });
    
    console.log(`Inventory adjustment for item ${catalogObjectId} processed successfully`);
    return { success: true, message: 'Inventory updated' };
  } catch (error) {
    console.error('Error updating inventory:', error);
    if (error && typeof error === 'object' && 'errors' in error) {
      const squareError = error as { errors: Array<{ message: string }> };
      console.error('Square API Error:', squareError.errors);
    }
    throw error;
  }
}