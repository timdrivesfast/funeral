import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Insert into Supabase
    const { error } = await supabase
      .from('subscribers')
      .insert([{ email }])

    if (error) {
      // If email already exists
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'You are already subscribed' },
          { status: 400 }
        )
      }

      console.error('Subscription error:', error)
      return NextResponse.json(
        { error: 'Failed to subscribe' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed'
    })
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    )
  }
} 