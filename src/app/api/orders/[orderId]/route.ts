import { NextRequest, NextResponse } from 'next/server';
import { squareClient } from '@/src/lib/square-server';

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

    // Using a simpler approach with minimal API calls to avoid TypeScript errors
    let orderData: any = null;
    try {
      // Retrieve order details using the correct method signature
      const response = await fetch(
        `https://connect.squareup.com/v2/orders/${orderId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.SQUARE_ACCESS_TOKEN}`,
            'Accept': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Error fetching order: ${response.statusText}`);
      }
      
      const data = await response.json();
      orderData = data.order;
    } catch (orderError) {
      console.error('Error retrieving order:', orderError);
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (!orderData) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Log for debugging
    console.log('Order found:', JSON.stringify(orderData, null, 2));

    // Retrieve customer details if available
    let customerData = null;
    if (orderData.customer_id) {
      try {
        const response = await fetch(
          `https://connect.squareup.com/v2/customers/${orderData.customer_id}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.SQUARE_ACCESS_TOKEN}`,
              'Accept': 'application/json'
            }
          }
        );
        
        if (response.ok) {
          const data = await response.json();
          customerData = data.customer;
        }
      } catch (customerError) {
        console.error('Error retrieving customer:', customerError);
      }
    }

    // Extract line items with basic info
    const enhancedLineItems = orderData.line_items || [];

    // Additional details for line items can be simplified to avoid errors
    // You can enhance this part once the basic API connectivity is working

    // Convert BigInt to string in the response
    const orderWithDetails = {
      ...orderData,
      lineItems: enhancedLineItems,
      customer: customerData
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
