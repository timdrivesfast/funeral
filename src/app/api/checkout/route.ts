import { NextResponse } from 'next/server'
import { getCatalogItemsWithInventory } from '@/src/lib/square-server'
import { createPaymentLink } from '@/src/lib/square-server'

export async function POST(request: Request) {
  try {
    const { productId, quantity = 1 } = await request.json()
    console.log(`Checkout request for product ${productId}, quantity ${quantity}`)

    // Fetch product details from Square - ensure we get fresh data
    console.log('Fetching latest inventory data from Square')
    const items = await getCatalogItemsWithInventory()
    const product = items.find(item => item.id === productId)
    
    if (!product || product.type !== 'ITEM') {
      console.error(`Product not found: ${productId}`)
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    console.log(`Product found: ${product.itemData?.name}, current stock: ${product.quantity}`)

    // Check stock only if quantity is defined
    // If quantity is undefined or null, assume the product is available
    if (product.quantity !== undefined && product.quantity !== null && product.quantity < quantity) {
      console.error(`Insufficient stock for ${product.itemData?.name}: requested ${quantity}, available ${product.quantity}`)
      return NextResponse.json(
        { error: 'Insufficient stock' },
        { status: 400 }
      )
    }

    const itemData = product.itemData
    const variation = itemData?.variations?.[0]?.itemVariationData
    const price = variation?.priceMoney?.amount ? Number(variation.priceMoney.amount) : 0
    const productName = itemData?.name || 'Product Purchase'
    const productDescription = itemData?.description || ''

    console.log(`Creating payment link for ${productName} at $${price/100} each, quantity ${quantity}`)

    // Create Square payment link with enhanced product details
    const paymentLink = await createPaymentLink({
      amount: price * quantity,
      orderName: productName,
      description: productDescription,
      productId: productId
    })

    if (!paymentLink?.url) {
      throw new Error('Failed to create payment link')
    }

    console.log(`Payment link created successfully: ${paymentLink.url}`)
    return NextResponse.json({ url: paymentLink.url })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}