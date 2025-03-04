import { notFound } from 'next/navigation'
import { getCatalogItemsWithInventory } from '@/src/lib/square-server'
import type { Square } from 'square'
import ProductDisplay from './ProductDisplay'

interface Props {
  params: {
    id: string
  }
}

async function getProduct(id: Promise<string>) {
  const productId = await id;
  const items = await getCatalogItemsWithInventory()
  const product = items.find(item => item.id === productId)
  if (!product || product.type !== 'ITEM') return null

  const itemData = product.itemData
  const variation = itemData?.variations?.[0]
  const price = variation?.type === 'ITEM_VARIATION' ? Number(variation.itemVariationData?.priceMoney?.amount) || 0 : 0
  
  // Get all image URLs instead of just the first one
  const imageUrls = itemData?.imageIds?.map(imageId => `/api/images/${imageId}`) || [];

  return {
    id: product.id,
    name: itemData?.name || '',
    description: itemData?.description || '',
    price,
    stock: product.quantity,
    image_url: imageUrls[0] || '', // Keep the main image URL for backward compatibility
    image_urls: imageUrls, // Add all image URLs as an array
    category: itemData?.categoryId || 'Uncategorized'
  }
}

export default async function ProductPage({ params }: Props) {
  const product = await getProduct(Promise.resolve(params.id))
  
  if (!product) {
    notFound()
  }

  return <ProductDisplay product={product} />
}