import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { sendWelcomeEmail } from '@/src/lib/resend'

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

    const { error } = await supabase
      .from('subscribers')
      .insert([{ email, subscribed_at: new Date().toISOString() }])

    if (error) {
      // If the error is a unique violation, return a nicer message
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'You are already subscribed' },
          { status: 400 }
        )
      }
      throw error
    }

    // Send welcome email
    await sendWelcomeEmail(email)

    return NextResponse.json({ message: 'Subscribed successfully' })
  } catch (error) {
    console.error('Subscription error:', error)
    return NextResponse.json(
      { error: 'Failed to subscribe' },
      { status: 500 }
    )
  }
} 