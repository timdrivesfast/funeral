import { NextResponse } from 'next/server';
import { squareClient } from '@/src/lib/square-server';
import type { Square } from 'square';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const productIds = url.searchParams.get('ids')?.split(',');

    if (!productIds || productIds.length === 0) {
      return NextResponse.json({ items: [] });
    }

    const catalogResponse = await squareClient.catalog.searchCatalogItems({
      enabled: true,
      productTypes: ['REGULAR'],
      customAttributeFilters: [
        {
          customAttributeDefinitionId: productIds[0],
          stringFilter: 'EXACT'
        }
      ]
    });

    const products = catalogResponse.items || [];
    const productDetails = products.map((product) => {
      if (product.itemData) {
        const variation = product.itemData.variations?.[0];
        const price = variation?.itemVariationData?.priceMoney?.amount || 0;

        return {
          id: product.id,
          name: product.itemData.name || 'Unknown Product',
          price: Number(price)
        };
      }
      return null;
    }).filter(Boolean);

    return NextResponse.json({ items: productDetails });
  } catch (error) {
    console.error('Error fetching cart items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cart items' },
      { status: 500 }
    );
  }
} 