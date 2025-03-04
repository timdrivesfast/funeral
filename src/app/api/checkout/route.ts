import { NextResponse } from 'next/server'
import { getCatalogItemsWithInventory } from '@/src/lib/square-server'
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

    // Fetch product details from Square - ensure we get fresh data
    console.log('Checkout API: Fetching product details from Square');
    const items = await getCatalogItemsWithInventory();
    const product = items.find(item => item.id === productId);
    
    if (!product || product.type !== 'ITEM') {
      console.error(`Checkout API: Product not found with ID: ${productId}`);
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    console.log(`Checkout API: Found product: ${product.itemData?.name}, Stock: ${product.quantity}`);

    // Check stock only if quantity is defined
    // If quantity is undefined or null, assume the product is available
    if (product.quantity !== undefined && product.quantity !== null) {
      const stockLevel = typeof product.quantity === 'string' 
        ? parseInt(product.quantity, 10) 
        : Number(product.quantity);
        
      console.log(`Checkout API: Current stock level: ${stockLevel} (${typeof stockLevel})`);
      
      if (stockLevel < quantity) {
        console.error(`Checkout API: Insufficient stock for ${product.itemData?.name}: requested ${quantity}, available ${stockLevel}`);
        return NextResponse.json({ error: 'Insufficient stock' }, { status: 400 });
      }
    } else {
      console.log(`Checkout API: Product ${product.itemData?.name} has no inventory tracking`);
    }

    // Get variation for price
    const itemData = product.itemData
    const variation = itemData?.variations?.[0]?.itemVariationData
    if (!variation) {
      console.error(`Checkout API: No variation found for product: ${product.itemData?.name}`);
      return NextResponse.json({ error: 'Product variation not found' }, { status: 404 });
    }

    const price = variation?.priceMoney?.amount ? Number(variation.priceMoney.amount) : 0
    const productName = itemData?.name || 'Product Purchase'
    const productDescription = itemData?.description || ''

    console.log(`Checkout API: Creating payment link for ${productName} at $${price/100} each, quantity ${quantity}`);

    // Create Square payment link with enhanced product details
    console.log('Checkout API: Creating payment link');
    const paymentLink = await createPaymentLink({
      amount: price * quantity,
      orderName: productName,
      description: productDescription,
      productId: productId
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