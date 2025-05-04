import { NextResponse } from 'next/server'
import { createPaymentLink } from '@/src/lib/square-server'

export async function POST(request: Request) {
  console.log('Checkout API: POST request received');
  
  try {
    const body = await request.json();
    const { productId, quantity = 1 } = body;
    
    console.log(`Checkout API: Processing checkout for productId: ${productId}, quantity: ${quantity}`);

    // Validate required fields
    if (!productId) {
      console.error('Checkout API: Missing required field: productId');
      return NextResponse.json({ error: 'Missing required field: productId' }, { status: 400 });
    }

    // Create Square payment link directly (let Square handle inventory)
    console.log('Checkout API: Creating payment link');
    const paymentLink = await createPaymentLink({
      productId,
      quantity
    });
    
    if (!paymentLink?.url) {
      throw new Error('Failed to create payment link')
    }

    console.log(`Checkout API: Payment link created: ${paymentLink.url}`);
    return NextResponse.json({ url: paymentLink.url })
  } catch (error) {
    console.error('Checkout API: Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}