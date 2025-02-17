import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { sendDropEmail } from '@/src/lib/resend'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: Request) {
  try {
    // Verify admin authorization (you should implement proper auth)
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !process.env.ADMIN_API_KEY || authHeader !== `Bearer ${process.env.ADMIN_API_KEY}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const dropDetails = await request.json()
    
    // Validate drop details
    if (!dropDetails.name || !dropDetails.description || !dropDetails.imageUrl || !dropDetails.date) {
      return NextResponse.json(
        { error: 'Missing required drop details' },
        { status: 400 }
      )
    }

    // Get all subscribers
    const { data: subscribers, error: fetchError } = await supabase
      .from('subscribers')
      .select('email')

    if (fetchError) {
      throw fetchError
    }

    // Send email to each subscriber
    const emailPromises = subscribers.map(subscriber =>
      sendDropEmail(subscriber.email, dropDetails)
    )

    await Promise.all(emailPromises)

    return NextResponse.json({
      message: `Drop announcement sent to ${subscribers.length} subscribers`
    })
  } catch (error) {
    console.error('Error announcing drop:', error)
    return NextResponse.json(
      { error: 'Failed to announce drop' },
      { status: 500 }
    )
  }
} 