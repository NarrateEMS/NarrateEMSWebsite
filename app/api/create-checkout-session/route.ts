import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia',
})

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)

// Price configuration for all plan types
type PlanConfig = {
  type: 'individual'
  priceId: string
} | {
  type: 'squad'
  flatPriceId: string
  overagePriceId: string
  includedCharts: number
}

const PRICE_CONFIG: Record<string, PlanConfig> = {
  individual_monthly: {
    type: 'individual',
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_INDIVIDUAL_MONTHLY!,
  },
  pilot_annual: {
    type: 'squad',
    flatPriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PILOT_FLAT!,
    overagePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PILOT_OVERAGE!,
    includedCharts: 500,
  },
  small_squad_annual: {
    type: 'squad',
    flatPriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_SMALL_SQUAD_FLAT!,
    overagePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_SMALL_SQUAD_OVERAGE!,
    includedCharts: 2000,
  },
  large_squad_annual: {
    type: 'squad',
    flatPriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_LARGE_SQUAD_FLAT!,
    overagePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_LARGE_SQUAD_OVERAGE!,
    includedCharts: 5000,
  },
  high_volume_annual: {
    type: 'squad',
    flatPriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_HIGH_VOLUME_FLAT!,
    overagePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_HIGH_VOLUME_OVERAGE!,
    includedCharts: 10000,
  },
}

export async function POST(request: NextRequest) {
  try {
    const { email, password, planType } = await request.json()

    if (!email || !password || !planType) {
      return NextResponse.json(
        { error: 'Email, password, and planType are required' },
        { status: 400 }
      )
    }

    // Get price configuration for this plan type
    const planConfig = PRICE_CONFIG[planType]
    if (!planConfig) {
      return NextResponse.json(
        { error: 'Invalid plan type' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
    const existingUser = existingUsers?.users?.find(u => u.email === email)

    let userId: string

    if (existingUser) {
      // User exists - verify they don't already have an active subscription
      const { data: existingSub } = await supabaseAdmin
        .from('user_subscriptions')
        .select('subscription_status')
        .eq('user_id', existingUser.id)
        .single()

      if (existingSub?.subscription_status === 'active') {
        return NextResponse.json(
          { error: 'You already have an active subscription. Please log in to manage it.' },
          { status: 400 }
        )
      }

      userId = existingUser.id
    } else {
      // Create new user in Supabase
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // Auto-confirm email for paying customers
        user_metadata: {
          plan_type: planType,
        },
      })

      if (createError || !newUser.user) {
        console.error('Error creating user:', createError)
        return NextResponse.json(
          { error: createError?.message || 'Failed to create account' },
          { status: 500 }
        )
      }

      userId = newUser.user.id
    }

    // Build line items based on plan type
    let lineItems: Stripe.Checkout.SessionCreateParams.LineItem[]
    let includedCharts = 0

    if (planConfig.type === 'squad') {
      // Squad plans have two line items: flat annual fee + metered overage
      lineItems = [
        {
          price: planConfig.flatPriceId,
          quantity: 1,
        },
        {
          price: planConfig.overagePriceId,
          // No quantity for metered billing - Stripe handles this
        },
      ]
      includedCharts = planConfig.includedCharts
    } else {
      // Individual plan has single line item
      lineItems = [
        {
          price: planConfig.priceId,
          quantity: 1,
        },
      ]
    }

    // Create Stripe checkout session with client_reference_id for webhook linking
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer_email: email,
      client_reference_id: userId, // This is what the webhook uses to link payment to user!
      line_items: lineItems,
      subscription_data: {
        trial_period_days: 7,
        metadata: {
          supabase_user_id: userId,
          plan_type: planType,
          included_charts: includedCharts.toString(),
        },
      },
      success_url: `${request.headers.get('origin')}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get('origin')}/#pricing`,
    })

    return NextResponse.json({ url: session.url, sessionId: session.id })
  } catch (error) {
    console.error('Checkout session error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}

