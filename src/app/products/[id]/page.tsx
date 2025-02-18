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

  return {
    id: product.id,
    name: itemData?.name || '',
    description: itemData?.description || '',
    price,
    stock: product.quantity,
    image_url: itemData?.imageIds?.[0] ? `/api/images/${itemData.imageIds[0]}` : '',
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