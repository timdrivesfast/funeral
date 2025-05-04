import { NextRequest, NextResponse } from 'next/server';
import { squareClient } from '@/lib/square-server';
import { verifySquareSignature } from '@/lib/verify-webhook';

/**
 * Handle Square webhook notifications
 * 
 * Endpoint: /api/webhooks/square
 * Method: POST
 * 
 * This endpoint receives webhook notifications from Square for events like:
 * - payment.created
 * - payment.updated
 * - inventory.count.updated
 */
export async function POST(request: NextRequest) {
  console.log('Square webhook received');
  
  try {
    // Get the raw request body as text for signature verification
    const rawBody = await request.text();
    
    // Verify the webhook signature
    const signature = request.headers.get('x-square-hmacsha256-signature');
    const url = request.headers.get('x-square-url');
    
    if (!signature || !url) {
      console.error('Square webhook: Missing signature or URL headers');
      return new NextResponse('Unauthorized', { status: 401 });
    }
    
    const isValid = await verifySquareSignature(
      signature,
      url,
      rawBody
    );
    
    if (!isValid) {
      console.error('Square webhook: Invalid signature');
      return new NextResponse('Invalid signature', { status: 401 });
    }
    
    // Parse the JSON body
    const payload = JSON.parse(rawBody);
    console.log('Square webhook payload:', JSON.stringify(payload, null, 2));
    
    // Process the webhook event
    const type = payload.type;
    const eventId = payload.event_id;
    const data = payload.data;
    
    console.log(`Processing webhook event: ${type}, ID: ${eventId}`);
    
    switch (type) {
      case 'payment.created':
        await handlePaymentCreated(data);
        break;
      case 'payment.updated':
        await handlePaymentUpdated(data);
        break;
      case 'inventory.count.updated':
        await handleInventoryCountUpdated(data);
        break;
      default:
        console.log(`Unhandled webhook event type: ${type}`);
        // We still return 200 for unhandled events to acknowledge receipt
    }
    
    // Return a success response to acknowledge receipt
    return new NextResponse('Webhook received', { status: 200 });
  } catch (error) {
    console.error('Error processing Square webhook:', error);
    return new NextResponse('Error processing webhook', { status: 500 });
  }
}

/**
 * Handle payment.created event
 * 
 * This is triggered when a new payment is created.
 */
async function handlePaymentCreated(data: any) {
  try {
    const { object, type } = data;
    
    if (type !== 'payment') {
      console.error(`Unexpected object type for payment.created: ${type}`);
      return;
    }
    
    const payment = object;
    console.log(`New payment created: ${payment.id}, status: ${payment.status}`);
    
    // Get associated order if available
    if (payment.order_id) {
      try {
        const orderResponse = await squareClient.ordersApi.retrieveOrder(payment.order_id);
        const order = orderResponse.order;
        
        if (order) {
          console.log(`Associated order: ${order.id}`);
          console.log(`Order total: ${order.totalMoney?.amount} ${order.totalMoney?.currency}`);
          console.log(`Number of line items: ${order.lineItems?.length || 0}`);
          
          // Update inventory for the purchased items
          if (order.lineItems?.length) {
            for (const item of order.lineItems) {
              if (item.catalogObjectId && item.quantity) {
                console.log(`Updating inventory for item: ${item.catalogObjectId}, quantity: ${item.quantity}`);
                // Here you would update your inventory
                // This is handled automatically by Square if you use their inventory system
              }
            }
          }
        }
      } catch (orderError) {
        console.error(`Error retrieving order ${payment.order_id}:`, orderError);
      }
    }
    
    // Additional business logic can be added here
    // For example, sending an order confirmation email
  } catch (error) {
    console.error('Error handling payment.created webhook:', error);
    throw error;
  }
}

/**
 * Handle payment.updated event
 * 
 * This is triggered when an existing payment is updated (e.g., status changes).
 */
async function handlePaymentUpdated(data: any) {
  try {
    const { object, type } = data;
    
    if (type !== 'payment') {
      console.error(`Unexpected object type for payment.updated: ${type}`);
      return;
    }
    
    const payment = object;
    console.log(`Payment updated: ${payment.id}, status: ${payment.status}`);
    
    // If the payment is now COMPLETED, process the completed order
    if (payment.status === 'COMPLETED') {
      console.log(`Payment ${payment.id} is now COMPLETED`);
      
      // Get associated order if available
      if (payment.order_id) {
        try {
          const orderResponse = await squareClient.ordersApi.retrieveOrder(payment.order_id);
          const order = orderResponse.order;
          
          if (order) {
            console.log(`Processing completed order: ${order.id}`);
            // Mark the order as fulfilled or process it as needed
            // This would be your custom business logic
          }
        } catch (orderError) {
          console.error(`Error retrieving order ${payment.order_id}:`, orderError);
        }
      }
      
      // Additional processing for completed payments
      // For example, sending a receipt email or updating internal systems
    }
  } catch (error) {
    console.error('Error handling payment.updated webhook:', error);
    throw error;
  }
}

/**
 * Handle inventory.count.updated event
 * 
 * This is triggered when inventory counts are updated.
 */
async function handleInventoryCountUpdated(data: any) {
  try {
    const { object, type } = data;
    
    if (type !== 'inventory_count') {
      console.error(`Unexpected object type for inventory.count.updated: ${type}`);
      return;
    }
    
    const inventoryCount = object;
    console.log(`Inventory updated for catalog object: ${inventoryCount.catalog_object_id}`);
    console.log(`New quantity: ${inventoryCount.quantity}`);
    
    // Update your local inventory records or take other actions
    // For example, if quantity is 0, you might want to mark the item as sold out on your website
  } catch (error) {
    console.error('Error handling inventory.count.updated webhook:', error);
    throw error;
  }
}

// Add a GET handler for testing purposes
export async function GET(request: NextRequest) {
  console.log('Square webhook GET request received - for testing only');
  return new NextResponse('Square webhook endpoint is working. Use POST for actual webhook events.', { status: 200 });
}
