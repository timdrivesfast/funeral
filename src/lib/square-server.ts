import { SquareClient, SquareEnvironment } from 'square';
import type { Square } from 'square';

if (!process.env.SQUARE_ACCESS_TOKEN) {
  throw new Error('SQUARE_ACCESS_TOKEN is not set in environment variables');
}

if (!process.env.SQUARE_LOCATION_ID) {
  throw new Error('SQUARE_LOCATION_ID is not set in environment variables');
}

export const squareClient = new SquareClient({
  environment: SquareEnvironment.Production,
  token: process.env.SQUARE_ACCESS_TOKEN,
  version: '2025-01-23'
});

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
    const request: any = {
      idempotencyKey: crypto.randomUUID(),
      checkoutOptions: {
        redirectUrl,
        merchantSupportEmail: 'funeral.supply@gmail.com',
        askForShippingAddress: true,
        allowTipping: false,
        enableCoupon: false,
        acceptedPaymentMethods: {
          applePay: true,
          googlePay: true
        },
        emailCollectionSettings: {
          enabled: true,
          required: true
        },
        phoneNumberCollectionSettings: {
          enabled: false
        }
      },
      order: {
        locationId: process.env.SQUARE_LOCATION_ID!,
        lineItems: [
          {
            catalogObjectId: productId,
            quantity: quantity.toString()
          }
        ]
      }
    };

    // Create payment link
    const response = await squareClient.checkout.paymentLink.create(request);
    
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
      // Try using catalog object search method (newer versions)
      catalogResponse = await squareClient.catalogApi.searchCatalogObjects({
        objectTypes: ['ITEM'],
        includeRelatedObjects: true,
        limit: 100
      });
    } catch (err) {
      console.error('Error using catalogApi.searchCatalogObjects:', err);
      
      // Fallback to older API pattern if available
      try {
        catalogResponse = await squareClient.catalog.searchObjects({
          objectTypes: ['ITEM'],
          includeRelatedObjects: true,
          limit: 100
        });
      } catch (catalogError) {
        throw new Error(`Failed to search catalog objects: ${catalogError.message || 'Unknown error'}. Check if your Square SDK version is compatible.`);
      }
    }
    

    // Convert BigInt to string for logging
    console.log('Catalog Response:', JSON.stringify(catalogResponse.result, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    , 2));

    const items = catalogResponse.result.objects || [];
    console.log(`Found ${items.length} catalog items`);
    
    // Then, get inventory for these items
    const itemIds = items.map((item: Square.CatalogObject) => item.id).filter((id): id is string => id !== undefined);
    console.log(`Getting inventory for ${itemIds.length} items:`, itemIds);
    
    // Add timestamp to ensure we're not getting cached data
    const timestamp = new Date().toISOString();
    console.log(`Fetching inventory at ${timestamp}`);
    
    const inventoryResponse = await squareClient.inventory.batchRetrieveCounts({
      catalogObjectIds: itemIds,
      locationIds: [process.env.SQUARE_LOCATION_ID!]
    });

    // Convert BigInt to string for logging
    console.log('Inventory Response:', JSON.stringify(inventoryResponse.result, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    , 2));

    // Combine catalog and inventory data
    const inventoryMap = new Map(
      (inventoryResponse.result.counts || []).map((count: Square.InventoryCount) => {
        console.log(`Inventory for item ${count.catalogObjectId}: ${count.quantity} (${typeof count.quantity})`);
        return [count.catalogObjectId, count.quantity];
      })
    );

    console.log('Inventory map created with', inventoryMap.size, 'items');
    
    // Log which items have inventory and which don't
    itemIds.forEach((id: string) => {
      console.log(`Item ${id} inventory: ${inventoryMap.has(id) ? inventoryMap.get(id) : 'not found in inventory'}`);
    });

    // Define IDs for products that should always show as sold out
    // V1.08 is already in the code, adding V1.04 to be always shown as sold out
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

// Create or update catalog item
export async function upsertCatalogItem({
  name,
  description,
  price,
  quantity,
  imageUrl,
  itemId
}: {
  name: string;
  description?: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  itemId?: string;
}) {
  try {
    // Prepare catalog object
    let catalogObject;
    let imageId;
    
    // Upload image if provided
    if (imageUrl) {
      // Create a catalog image
      const imageResponse = await squareClient.catalog.object.upsert({
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
      
      if (imageResponse.result.catalogObject?.id) {
        imageId = imageResponse.result.catalogObject.id;
      }
    }
    
    // Create catalog item with or without image
    catalogObject = {
      type: 'ITEM',
      id: itemId ? itemId : `#${name.replace(/\s+/g, '_')}`,
      itemData: {
        name,
        description,
        variations: [
          {
            type: 'ITEM_VARIATION',
            id: `#${name.replace(/\s+/g, '_')}_variation`,
            itemVariationData: {
              name: 'Regular',
              pricingType: 'FIXED_PRICING',
              priceMoney: {
                amount: BigInt(price),
                currency: 'USD'
              }
            }
          }
        ],
        ...(imageId && { imageIds: [imageId] })
      }
    };
    
    // Upsert the catalog item
    const response = await squareClient.catalog.object.upsert({
      idempotencyKey: crypto.randomUUID(),
      object: catalogObject as Square.CatalogObject
    });
    
    // Set initial inventory if necessary
    if (quantity > 0 && response.result.catalogObject?.id) {
      const variationId = response.result.catalogObject.itemData?.variations?.[0]?.id;
      if (variationId) {
        await updateInventory({
          catalogObjectId: variationId,
          quantity
        });
      }
    }
    
    return JSON.parse(JSON.stringify(response.result.catalogObject, (key, value) =>
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
    const inventoryResponse = await squareClient.inventory.count.retrieve({
      catalogObjectId,
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
    const response = await squareClient.inventory.adjustment.create({
      idempotencyKey: crypto.randomUUID(),
      adjustment: {
        catalogObjectId,
        locationId: process.env.SQUARE_LOCATION_ID!,
        fromState: fromState as Square.InventoryState,
        toState: 'IN_STOCK',
        quantity: Math.abs(adjustment).toString(),
        occurredAt: new Date().toISOString()
      }
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