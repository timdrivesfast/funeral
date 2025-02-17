import { NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'
import { sendWelcomeEmail } from '../../../lib/resend'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    console.log('Attempting to insert email:', email)
    
    // Insert into Supabase
    const { data, error } = await supabase
      .from('subscribers')
      .insert([{ email }])
      .select()

    if (error) {
      console.error('Supabase error:', error)
      
      // If the error is a unique violation, return a nicer message
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'You are already subscribed' },
          { status: 400 }
        )
      }
      
      return NextResponse.json(
        { error: 'Database error: ' + error.message },
        { status: 500 }
      )
    }

    console.log('Successfully inserted email:', data)

    // Send welcome email
    try {
      await sendWelcomeEmail(email)
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError)
      // Don't fail the subscription if email fails
    }

    return NextResponse.json({ 
      message: 'Subscribed successfully',
      data
    })
  } catch (error) {
    console.error('Subscription error:', error)
    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again.' },
      { status: 500 }
    )
  }
} 