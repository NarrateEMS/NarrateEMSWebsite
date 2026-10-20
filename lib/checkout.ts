// Server only: holds the service-role and Stripe clients.
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { errorMessage, logEvent } from '@/lib/observability'
import { squadCharts } from '@/lib/plans'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
})

export const supabaseAdmin = createClient(
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
export type PlanConfig = {
  type: 'individual'
  priceId: string
} | {
  type: 'squad'
  flatPriceId: string
  overagePriceId: string
  includedCharts: number
}

export const PRICE_CONFIG: Record<string, PlanConfig> = {
  individual_monthly: {
    type: 'individual',
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_INDIVIDUAL_MONTHLY!,
  },
  pilot_annual: {
    type: 'squad',
    flatPriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PILOT_FLAT!,
    overagePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PILOT_OVERAGE!,
    includedCharts: squadCharts('pilot_annual'),
  },
  small_squad_annual: {
    type: 'squad',
    flatPriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_SMALL_SQUAD_FLAT!,
    overagePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_SMALL_SQUAD_OVERAGE!,
    includedCharts: squadCharts('small_squad_annual'),
  },
  large_squad_annual: {
    type: 'squad',
    flatPriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_LARGE_SQUAD_FLAT!,
    overagePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_LARGE_SQUAD_OVERAGE!,
    includedCharts: squadCharts('large_squad_annual'),
  },
  high_volume_annual: {
    type: 'squad',
    flatPriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_HIGH_VOLUME_FLAT!,
    overagePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_HIGH_VOLUME_OVERAGE!,
    includedCharts: squadCharts('high_volume_annual'),
  },
}

export async function startCheckout(
  origin: string | null,
  args: { userId: string; email: string; planType: string; planConfig: PlanConfig }
) {
  const { userId, email, planType, planConfig } = args

  try {
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
        // Flexible bills already-reported overage at the old price on a mid-year plan change; classic drops it.
        billing_mode: { type: 'flexible' },
        trial_period_days: 7,
        metadata: {
          supabase_user_id: userId,
          plan_type: planType,
          included_charts: includedCharts.toString(),
        },
      },
      // plan carries through so the success page can show squad admins the two
      // steps that only apply to them: linking their EMS Charts service and
      // inviting their members.
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}&plan=${planType}`,
      cancel_url: `${origin}/#pricing`,
    })

    logEvent({
      event: 'checkout_session_created',
      userId,
      properties: {
        plan_type: planType,
        session_id: session.id,
        included_charts: includedCharts,
      },
    })

    return NextResponse.json({ url: session.url, sessionId: session.id })
  } catch (error) {
    console.error('Checkout session error:', error)
    logEvent({
      event: 'stripe_checkout_failed',
      level: 'error',
      userId,
      statusCode: 500,
      properties: { plan_type: planType, reason: errorMessage(error) },
    })
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}

