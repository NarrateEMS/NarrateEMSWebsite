import { NextRequest, NextResponse } from 'next/server'
import { PRICE_CONFIG, startCheckout, supabaseAdmin } from '@/lib/checkout'
import { userFromRequest } from '@/lib/auth'

// Individual checkout, only once an agency has approved this user.
export async function POST(request: NextRequest) {
  const user = await userFromRequest(request)
  if (!user) return NextResponse.json({ error: 'Please log in again.' }, { status: 401 })

  const [{ data: sub }, { data: auths, error }] = await Promise.all([
    supabaseAdmin.from('user_subscriptions').select('subscription_status').eq('user_id', user.id).maybeSingle(),
    supabaseAdmin
      .from('individual_authorizations')
      .select('id, agencies!inner(status)')
      .eq('user_id', user.id)
      .eq('status', 'approved')
      .eq('agencies.status', 'approved')
      .limit(1),
  ])
  if (error) return NextResponse.json({ error: 'Could not check your agency. Try again.' }, { status: 503 })
  if (sub?.subscription_status === 'active' || sub?.subscription_status === 'trialing') {
    return NextResponse.json({ error: 'You already have an active subscription.' }, { status: 400 })
  }
  if (!auths?.length) {
    return NextResponse.json({ error: "Your agency hasn't approved NarrateEMS yet." }, { status: 403 })
  }

  return startCheckout(request.headers.get('origin'), {
    userId: user.id,
    email: user.email,
    planType: 'individual_monthly',
    planConfig: PRICE_CONFIG.individual_monthly,
  })
}
