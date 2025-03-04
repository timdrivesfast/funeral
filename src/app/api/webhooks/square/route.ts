import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { squareClient } from '@/src/lib/square-server';

// Square webhook signature verification
const verifySquareSignature = (
  signatureHeader: string,
  body: string,
  signingKey: string
): boolean => {
  try {
    if (!signatureHeader || !body || !signingKey) {
      console.error('Missing required parameters for signature verification');
      return false;
    }

    // Create an HMAC-SHA256 signature of the request body using the webhook signature key
    const hmac = crypto.createHmac('sha256', signingKey);
    const generatedSignature = hmac.update(body).digest('base64');

    // Compare the generated signature with the one provided in the request header
    return crypto.timingSafeEqual(
      Buffer.from(generatedSignature),
      Buffer.from(signatureHeader)
    );
  } catch (error) {
    console.error('Error verifying Square signature:', error);
    return false;
  }
};

export async function POST(request: Request) {
  console.log('Square webhook received');
  
  try {
    // Get the request body as text for signature verification
    const bodyText = await request.text();
    
    // Parse the body as JSON
    const body = JSON.parse(bodyText);
    
    // Get the Square-Signature header
    const squareSignature = request.headers.get('Square-Signature');
    
    // Get the webhook signature key from environment variables
    const signingKey = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY;
    
    // Verify the signature if we have a signature key
    if (signingKey && squareSignature) {
      const isValid = verifySquareSignature(squareSignature, bodyText, signingKey);
      
      if (!isValid) {
        console.error('Invalid Square webhook signature');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    } else {
      console.warn('Square webhook signature verification skipped - missing signature key or header');
    }
    
    // Log the webhook event
    console.log('Square webhook event:', body.type);
    
    // Handle different event types
    switch (body.type) {
      case 'inventory.count.updated':
        await handleInventoryUpdate(body);
        break;
      default:
        console.log(`Unhandled webhook event type: ${body.type}`);
    }
    
    // Return a 200 response to acknowledge receipt of the webhook
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing Square webhook:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Add a GET handler for testing purposes
export async function GET(request: Request) {
  console.log('Square webhook GET request received - for testing only');
  return NextResponse.json({ 
    message: 'Square webhook endpoint is working. Use POST for actual webhook events.'
  });
}

async function handleInventoryUpdate(event: any) {
  try {
    console.log('Processing inventory update event');
    
    // Extract inventory counts from the event
    const inventoryCounts = event.data?.object?.inventory_counts;
    
    if (!inventoryCounts || !Array.isArray(inventoryCounts)) {
      console.error('No inventory counts found in event');
      return;
    }
    
    // Log each inventory update
    inventoryCounts.forEach(count => {
      const { catalog_object_id, quantity, state } = count;
      console.log(`Inventory updated for item ${catalog_object_id}: ${quantity} (${state})`);
      
      // Special handling for V1.08
      if (catalog_object_id === 'FXUHFLEAHXLDN5OHVEZ3XBMN') {
        console.log(`Note: Item ${catalog_object_id} should always show as sold out regardless of actual inventory`);
      }
    });
    
    console.log('Inventory update processed successfully');
  } catch (error) {
    console.error('Error handling inventory update:', error);
  }
}
