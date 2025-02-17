import { NextResponse } from 'next/server';
import { squareClient } from '@/src/lib/square-server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const imageId = params.id;
    
    // Search for the image in the catalog
    const catalogResponse = await squareClient.catalog.search({
      objectTypes: ['IMAGE'],
      includeDeletedObjects: false,
      includeRelatedObjects: false
    });

    const image = catalogResponse.objects?.find(obj => obj.id === imageId);
    
    if (!image || image.type !== 'IMAGE' || !image.imageData?.url) {
      console.error('Image not found or no URL available:', imageId);
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      );
    }

    // Redirect to the actual image URL
    return NextResponse.redirect(image.imageData.url);
  } catch (error) {
    console.error('Error fetching image:', error);
    // If the error is a specific Square error (like not found), return 404
    if (error && typeof error === 'object' && 'errors' in error) {
      const squareError = error as { errors: Array<{ category: string }> };
      if (squareError.errors.some(e => e.category === 'NOT_FOUND')) {
        return NextResponse.json(
          { error: 'Image not found' },
          { status: 404 }
        );
      }
    }
    // For other errors, return 500
    return NextResponse.json(
      { error: 'Failed to fetch image' },
      { status: 500 }
    );
  }
} 