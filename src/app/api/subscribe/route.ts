import { NextResponse } from 'next/server'
import { supabase } from '@/src/lib/supabase'
import { sendWelcomeEmail } from '@/src/lib/resend'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Insert into Supabase
    const { error } = await supabase
      .from('subscribers')
      .insert([{ email }])

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
    try {
      await sendWelcomeEmail(email)
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError)
      // Don't fail the subscription if email fails
    }

    return NextResponse.json({ 
      message: 'Subscribed successfully' 
    })
  } catch (error) {
    console.error('Subscription error:', error)
    return NextResponse.json(
      { error: 'Failed to subscribe' },
      { status: 500 }
    )
  }
} 