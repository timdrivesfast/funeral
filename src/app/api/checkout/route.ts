import { NextResponse } from 'next/server'
import { getCatalogItemsWithInventory } from '@/src/lib/square-server'
import { createPaymentLink } from '@/src/lib/square-server'

export async function POST(request: Request) {
  try {
    const { productId, quantity = 1 } = await request.json()

    // Fetch product details from Square
    const items = await getCatalogItemsWithInventory()
    const product = items.find(item => item.id === productId)
    
    if (!product || product.type !== 'ITEM') {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Check stock
    if (product.quantity !== undefined && product.quantity < quantity) {
      return NextResponse.json(
        { error: 'Insufficient stock' },
        { status: 400 }
      )
    }

    const itemData = product.itemData
    const variation = itemData?.variations?.[0]?.itemVariationData
    const price = variation?.priceMoney?.amount ? Number(variation.priceMoney.amount) : 0

    // Create Square payment link
    const paymentLink = await createPaymentLink({
      amount: price * quantity,
      orderName: itemData?.name || 'Product Purchase'
    })

    if (!paymentLink?.url) {
      throw new Error('Failed to create payment link')
    }

    return NextResponse.json({ url: paymentLink.url })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 