import { NextResponse } from 'next/server'
import { supabase } from '@/src/lib/supabase'

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .limit(1)

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ 
      message: 'Supabase connection successful!',
      firstProduct: data[0] 
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Failed to connect to Supabase' },
      { status: 500 }
    )
  }
} 