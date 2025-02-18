import { NextResponse } from 'next/server';
import { squareClient } from '@/src/lib/square-server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const catalogResponse = await squareClient.catalog.search({
      objectTypes: ['IMAGE']
    });

    // Convert BigInt values to strings in the response
    const serializedResponse = JSON.parse(JSON.stringify(
      catalogResponse,
      (key, value) => typeof value === 'bigint' ? value.toString() : value
    ));

    const image = serializedResponse.objects?.find(
      (obj: any) => obj.id === params.id && obj.type === 'IMAGE'
    );

    if (!image?.imageData?.url) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      );
    }

    return NextResponse.redirect(image.imageData.url);
  } catch (error) {
    console.error('Error fetching image:', error);
    return NextResponse.json(
      { error: 'Failed to fetch image' },
      { status: 500 }
    );
  }
} 