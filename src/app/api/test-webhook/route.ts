import { NextResponse } from 'next/server';

// This is a test endpoint to simulate a Square webhook
// In production, you would remove this endpoint
export async function GET(request: Request) {
  try {
    // Create a simulated inventory update webhook payload
    const payload = {
      type: 'inventory.count.updated',
      data: {
        object: {
          inventory_counts: [
            {
              catalog_object_id: 'FXUHFLEAHXLDN5OHVEZ3XBMN', // V1.08 ID
              quantity: '0',
              state: 'IN_STOCK'
            }
          ]
        }
      }
    };

    // Make a direct call to our webhook handler
    const webhookUrl = new URL('/api/webhooks/square', request.url);
    
    console.log(`Testing webhook by sending POST to ${webhookUrl.toString()}`);
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Webhook test failed with status: ${response.status}, message: ${errorText}`);
    }

    const result = await response.json();
    return NextResponse.json({ 
      success: true, 
      message: 'Webhook test sent successfully',
      webhookResponse: result
    });
  } catch (error) {
    console.error('Error testing webhook:', error);
    return NextResponse.json({ 
      error: 'Failed to test webhook',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
