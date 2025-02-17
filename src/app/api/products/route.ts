import { NextResponse } from 'next/server';
import { getCatalogItemsWithInventory, squareClient } from '@/src/lib/square-server';
import type { Square } from 'square';

export async function GET() {
  try {
    // Test Square API connection
    try {
      console.log('Attempting to connect to Square API with location ID:', process.env.SQUARE_LOCATION_ID);
      const response = await squareClient.locations.list();
      
      // Log all available locations
      if (response.locations && response.locations.length > 0) {
        console.log('Available Square Locations:', response.locations.map(loc => ({
          id: loc.id,
          name: loc.name,
          status: loc.status
        })));
      } else {
        console.log('No locations found in Square account');
      }
      
      const location = response.locations?.find(loc => loc.id === process.env.SQUARE_LOCATION_ID);
      if (!location) {
        console.error(`Location ID ${process.env.SQUARE_LOCATION_ID} not found in available locations:`, 
          response.locations?.map(loc => ({ id: loc.id, name: loc.name }))
        );
        throw new Error(`Location ID ${process.env.SQUARE_LOCATION_ID} not found`);
      }
      console.log('Found matching location:', {
        id: location.id,
        name: location.name,
        status: location.status
      });
    } catch (locError) {
      console.error('Square API Connection Test Failed. Full error:', locError);
      if (locError instanceof Error) {
        console.error('Error message:', locError.message);
        console.error('Error stack:', locError.stack);
      }
      return NextResponse.json(
        { error: 'Failed to connect to Square API. Please check your Square Dashboard > Settings > Locations for the correct Location ID.' },
        { status: 500 }
      );
    }

    const catalogResponse = await squareClient.catalog.search({
      objectTypes: ['ITEM'],
      includeRelatedObjects: true
    });

    if (!catalogResponse.objects) {
      throw new Error('No items returned from Square');
    }

    // Convert BigInt values to strings in the response
    const serializedResponse = JSON.parse(JSON.stringify(
      {
        items: catalogResponse.objects,
        relatedObjects: catalogResponse.relatedObjects || []
      },
      (key, value) => typeof value === 'bigint' ? value.toString() : value
    ));

    return NextResponse.json(serializedResponse);
  } catch (error) {
    console.error('Error fetching products:', error);
    if (error && typeof error === 'object' && 'errors' in error) {
      const squareError = error as { errors: Array<{ message: string }> };
      console.error('Square API Error:', squareError.errors);
      return NextResponse.json(
        { error: squareError.errors[0]?.message || 'Square API Error' },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch products' },
      { status: 500 }
    );
  }
} 