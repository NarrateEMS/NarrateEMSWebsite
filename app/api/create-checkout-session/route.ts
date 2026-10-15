import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { errorMessage, logEvent } from '@/lib/observability'
import { PRICE_CONFIG, startCheckout, supabaseAdmin, type PlanConfig } from '@/lib/checkout'
import { agencyStatus, requestAgencyAccess, validateAgencyInput } from '@/lib/agency'

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
    const body = await request.json()
    const { email, password, planType } = body

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

    // Individuals must name their agency. Nothing is charged until it has signed the BAA.
    let agency: { agencyName: string; serviceCode: string; repEmail: string } | null = null
    if (planConfig.type === 'individual') {
      const input = validateAgencyInput(body)
      if ('error' in input) {
        return NextResponse.json({ error: input.error }, { status: 400 })
      }
      agency = input
      const status = await agencyStatus(input.serviceCode)
      if (status === 'revoked') {
        return NextResponse.json(
          { error: "This agency's authorization was revoked. Contact support@narrateems.com." },
          { status: 400 }
        )
      }
      if (status !== 'approved' && !input.repEmail) {
        return NextResponse.json({ status: 'needs_rep' })
      }
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
      logEvent({
        event: 'signup_email_lookup_failed',
        level: 'error',
        statusCode: 503,
        properties: { plan_type: planType, reason: lookupError.message },
      })
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
          logEvent({
            event: 'shell_account_adoption_failed',
            level: 'error',
            userId: existingUserId as string,
            statusCode: 500,
            properties: { plan_type: planType, reason: adoptError.message },
          })
          return NextResponse.json(
            { error: 'Could not set up that account. Please try again.' },
            { status: 500 }
          )
        }

        userId = existingUserId as string
        logEvent({
          event: 'shell_account_adopted',
          userId,
          properties: { plan_type: planType },
        })
        return await continueSignup(request, { userId, email, planType, planConfig }, agency)
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
        logEvent({
          event: 'signup_password_rejected',
          level: 'warn',
          userId: existingUserId as string,
          statusCode: 401,
          properties: { plan_type: planType },
        })
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
        logEvent({
          event: 'user_creation_failed',
          level: 'error',
          statusCode: 500,
          properties: { plan_type: planType, reason: createError?.message },
        })
        return NextResponse.json(
          { error: createError?.message || 'Failed to create account' },
          { status: 500 }
        )
      }

      userId = newUser.user.id
    }

    return await continueSignup(request, { userId, email, planType, planConfig }, agency)
  } catch (error) {
    console.error('Checkout session error:', error)
    logEvent({
      event: 'checkout_route_threw',
      level: 'error',
      statusCode: 500,
      properties: { reason: errorMessage(error) },
    })
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}

async function continueSignup(
  request: NextRequest,
  args: { userId: string; email: string; planType: string; planConfig: PlanConfig },
  agency: { agencyName: string; serviceCode: string; repEmail: string } | null
) {
  const origin = request.headers.get('origin')
  if (agency) {
    const result = await requestAgencyAccess({ ...agency, userId: args.userId, email: args.email, origin: origin ?? '' })
    if (result.status === 'error') return NextResponse.json({ error: result.error }, { status: 400 })
    logEvent({ event: 'individual_agency_request', userId: args.userId, properties: { result: result.status } })
    if (result.status !== 'approved') return NextResponse.json({ status: result.status })
  }
  return startCheckout(origin, args)
}
