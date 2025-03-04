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
  amount,
  currency = 'USD',
  orderName = 'Online Order',
  description = '',
  productId = ''
}: {
  amount: number;
  currency?: string;
  orderName?: string;
  description?: string;
  productId?: string;
}) {
  try {
    // Get product image if available
    let imageUrl = '';
    if (productId) {
      try {
        const catalogResponse = await squareClient.catalog.retrieveCatalogObject(productId);
        const item = catalogResponse.object;
        if (item?.itemData?.imageIds?.length) {
          const imageId = item.itemData.imageIds[0];
          // Get image URL from Square
          const imageResponse = await squareClient.catalog.retrieveCatalogObject(imageId);
          if (imageResponse.object?.type === 'IMAGE') {
            imageUrl = imageResponse.object.imageData?.url || '';
          }
        }
      } catch (err) {
        console.error('Error fetching product image:', err);
        // Continue without image if there's an error
      }
    }

    const request = {
      idempotencyKey: crypto.randomUUID(),
      quickPay: {
        name: orderName,
        priceMoney: {
          amount: BigInt(amount),
          currency: currency as Square.Currency
        },
        locationId: process.env.SQUARE_LOCATION_ID!
      },
      checkoutOptions: {
        askForShippingAddress: true,
        redirectUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://funeral.supply',
        merchantSupportEmail: 'funeral.supply@gmail.com',
        allowTipping: false,
        enableCoupon: false,
        acceptedPaymentMethods: {
          applePay: true,
          googlePay: true
        }
      }
    };

    // Add note about the product if description is available
    if (description) {
      request.note = description;
    }

    const response = await squareClient.checkout.paymentLinks.create(request);
    return JSON.parse(JSON.stringify(response.paymentLink, (key, value) =>
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
    // First, get catalog items
    const catalogResponse = await squareClient.catalog.search({
      objectTypes: ['ITEM'],
      includeRelatedObjects: true  // This will include category information
    });

    // Convert BigInt to string for logging
    console.log('Catalog Response:', JSON.stringify(catalogResponse, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    , 2));

    const items = catalogResponse.objects || [];
    
    // Then, get inventory for these items
    const itemIds = items.map((item: Square.CatalogObject) => item.id).filter((id): id is string => id !== undefined);
    const inventoryResponse = await squareClient.inventory.batchGetCounts({
      catalogObjectIds: itemIds,
      locationIds: [process.env.SQUARE_LOCATION_ID!]
    });

    // Convert BigInt to string for logging
    console.log('Inventory Response:', JSON.stringify(inventoryResponse, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    , 2));

    // Combine catalog and inventory data
    const inventoryMap = new Map(
      (inventoryResponse.data || []).map((count: Square.InventoryCount) => [
        count.catalogObjectId,
        count.quantity
      ])
    );

    // Convert BigInt to string in the response
    return items.map((item: Square.CatalogObject) => {
      const itemWithQuantity = {
        ...item,
        quantity: inventoryMap.has(item.id) ? inventoryMap.get(item.id) : undefined
      };

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
    // Create or update catalog item
    const catalogResponse = await squareClient.catalog.batchUpsert({
      idempotencyKey: crypto.randomUUID(),
      batches: [{
        objects: [{
          type: 'ITEM',
          id: itemId || `#${name.toLowerCase().replace(/\s+/g, '_')}`,
          itemData: {
            name,
            description,
            variations: [
              {
                type: 'ITEM_VARIATION',
                id: `#${name.toLowerCase().replace(/\s+/g, '_')}_variation`,
                itemVariationData: {
                  priceMoney: {
                    amount: BigInt(price),
                    currency: 'USD' as Square.Currency
                  },
                  pricingType: 'FIXED_PRICING'
                }
              }
            ]
          }
        }]
      }]
    });

    const newItemId = catalogResponse.objects?.[0]?.id;
    if (!newItemId) {
      throw new Error('Failed to create catalog item');
    }

    // Update inventory
    await squareClient.inventory.batchCreateChanges({
      idempotencyKey: crypto.randomUUID(),
      changes: [
        {
          type: 'ADJUSTMENT',
          adjustment: {
            catalogObjectId: newItemId,
            quantity: quantity.toString(),
            locationId: process.env.SQUARE_LOCATION_ID!
          }
        }
      ]
    });

    return catalogResponse.objects?.[0] || null;
  } catch (error) {
    if (error && typeof error === 'object' && 'errors' in error) {
      const squareError = error as { errors: Array<{ message: string }> };
      console.error('Square API Error:', squareError.errors);
    } else {
      console.error('Error upserting catalog item:', error);
    }
    throw error;
  }
} 