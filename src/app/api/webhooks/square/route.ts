import { NextRequest, NextResponse } from 'next/server';

/**
 * Handle Square webhook notifications
 * 
 * Endpoint: /api/webhooks/square
 * Method: POST
 * 
 * This is a simplified version to avoid build errors.
 * The full implementation will be added later.
 */
export async function POST(request: NextRequest) {
  console.log('Square webhook received');
  
  try {
    // Get the raw request body
    const rawBody = await request.text();
    
    // Log the webhook event (for debugging)
    try {
      const payload = JSON.parse(rawBody);
      console.log('Square webhook event type:', payload.type);
    } catch (parseError) {
      console.error('Error parsing webhook payload:', parseError);
    }
    
    // Return a success response
    return new NextResponse('Webhook received', { status: 200 });
  } catch (error) {
    console.error('Error processing Square webhook:', error);
    return new NextResponse('Error processing webhook', { status: 500 });
  }
}

// Add a GET handler for testing purposes
export async function GET(request: NextRequest) {
  return new NextResponse('Square webhook endpoint is working. Use POST for actual webhook events.', { status: 200 });
}
