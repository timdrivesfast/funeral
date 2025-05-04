import { NextRequest, NextResponse } from 'next/server';
import { squareClient } from '@/src/lib/square-server';
import type { Square } from 'square';

export async function GET(
  req: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const { orderId } = params;

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Log for debugging
    console.log(`Fetching order details for order ID: ${orderId}`);

    // Retrieve order details
    const orderResponse = await squareClient.orders.get(orderId);
    const order = orderResponse.order;

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Log for debugging
    console.log('Order found:', JSON.stringify(order, null, 2));

    // Retrieve customer details if available
    let customer = null;
    if (order.customerId) {
      try {
        const customerResponse = await squareClient.customers.retrieve(order.customerId);
        customer = customerResponse.customer;
        console.log('Customer found:', JSON.stringify(customer, null, 2));
      } catch (error) {
        console.error('Error retrieving customer:', error);
        // Continue with null customer
      }
    }

    // Extract and enhance line items with image URLs if available
    const enhancedLineItems = await Promise.all(
      (order.lineItems || []).map(async (item: any) => {
        let imageUrl = '';
        let variation = null;

        try {
          if (item.catalogObjectId) {
            // Retrieve catalog object for this line item
            const variationResponse = await squareClient.catalog.object.get(item.catalogObjectId);
            variation = variationResponse.object;

            if (variation?.type === 'ITEM_VARIATION' && variation.itemVariationData?.itemId) {
              // Get parent item to find the image
              const itemResponse = await squareClient.catalog.object.get(variation.itemVariationData.itemId);
              const catalogItem = itemResponse.object;

              if (catalogItem?.type === 'ITEM' && catalogItem.itemData?.imageIds?.length) {
                // Get image URL
                const imageId = catalogItem.itemData.imageIds[0];
                const imageResponse = await squareClient.catalog.object.get(imageId);
                
                if (imageResponse.object?.type === 'IMAGE') {
                  imageUrl = imageResponse.object.imageData?.url || '';
                }
              }
            }
          }
        } catch (error) {
          console.error('Error fetching catalog image:', error);
          // Continue without image
        }

        return {
          ...item,
          imageUrl,
          variationName: variation?.itemVariationData?.name || ''
        };
      })
    );

    // Convert BigInt to string in the response
    const orderWithDetails = {
      ...order,
      lineItems: enhancedLineItems,
      customer
    };

    // Return formatted order details
    return NextResponse.json(
      JSON.parse(JSON.stringify(orderWithDetails, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
      )),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching order details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order details' },
      { status: 500 }
    );
  }
}
