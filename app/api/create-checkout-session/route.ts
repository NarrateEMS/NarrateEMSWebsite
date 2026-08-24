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

// Anon-key client used solely to verify a submitted password. The admin client
// must never be used for this: its service-role key would authenticate without
// checking the password at all.
const supabaseAnon = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

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

    // Look the email up by exact match rather than scanning listUsers(). That
    // call is unpaginated (default page size 50), so with more than 50 users an
    // existing account past the first page looked new and we attempted a
    // duplicate createUser.
    const normalizedEmail = email.toLowerCase().trim()
    const { data: existingUserId, error: lookupError } = await supabaseAdmin
      .rpc('auth_user_id_by_email', { p_email: normalizedEmail })

    if (lookupError) {
      console.error('Error looking up email:', lookupError)
      return NextResponse.json(
        { error: 'Could not verify that email. Please try again.' },
        { status: 503 }
      )
    }

    let userId: string

    if (existingUserId) {
      const { data: existingSub } = await supabaseAdmin
        .from('user_subscriptions')
        .select('subscription_status')
        .eq('user_id', existingUserId as string)
        .maybeSingle()

      if (existingSub?.subscription_status === 'active' || existingSub?.subscription_status === 'trialing') {
        return NextResponse.json(
          { error: 'You already have an active subscription. Please log in to manage it.' },
          { status: 400 }
        )
      }

      // An account that was started in the extension is left UNCONFIRMED, and
      // GoTrue refuses signInWithPassword on it -- so the password check below
      // could never pass and the buyer was told to "log in first", which also
      // fails. That is how 9 of the first 71 accounts ended up unconfirmed and
      // never signed in even once.
      //
      // Such a row is an empty shell: never confirmed, never signed in, no
      // subscription. Adopt it for the buyer -- set the password they just typed
      // and confirm the address -- instead of stranding them.
      const { data: existing } = await supabaseAdmin.auth.admin.getUserById(
        existingUserId as string
      )
      const isUnusedShell =
        !!existing?.user &&
        !existing.user.email_confirmed_at &&
        !existing.user.last_sign_in_at

      if (isUnusedShell) {
        const { error: adoptError } = await supabaseAdmin.auth.admin.updateUserById(
          existingUserId as string,
          {
            password,
            email_confirm: true,
            user_metadata: { ...(existing?.user?.user_metadata ?? {}), plan_type: planType },
          }
        )

        if (adoptError) {
          console.error('Error adopting unconfirmed account:', adoptError)
          return NextResponse.json(
            { error: 'Could not set up that account. Please try again.' },
            { status: 500 }
          )
        }

        userId = existingUserId as string
        return await startCheckout(request, { userId, email, planType, planConfig })
      }

      // Prove ownership before attaching a payment to this account.
      //
      // Previously the submitted password was silently DISCARDED here and the
      // existing user's id reused. Two consequences: paying with someone else's
      // email attached the subscription to THEIR account, and an honest buyer who
      // abandoned checkout and retried with a different password could never log
      // in with the password they had just typed.
      const { error: signInError } = await supabaseAnon.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      })

      if (signInError) {
        return NextResponse.json(
          {
            error: 'An account already exists for this email. Please log in first, then start your subscription.',
            code: 'account_exists',
          },
          { status: 401 }
        )
      }

      userId = existingUserId as string

      // /account reads plan_type to know a squad purchase is in flight while the
      // webhook is still writing squad_id; without it an existing buyer sees the
      // individual-plan panel for those seconds.
      const { error: stampError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
        user_metadata: { ...(existing?.user?.user_metadata ?? {}), plan_type: planType },
      })
      if (stampError) console.error('Could not stamp plan_type:', stampError)
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

    return await startCheckout(request, { userId, email, planType, planConfig })
  } catch (error) {
    console.error('Checkout session error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}

async function startCheckout(
  request: NextRequest,
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
      success_url: `${request.headers.get('origin')}/checkout/success?session_id={CHECKOUT_SESSION_ID}&plan=${planType}`,
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

