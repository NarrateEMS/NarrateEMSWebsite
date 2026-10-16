import { NextRequest, NextResponse } from 'next/server'
import { requestAgencyAccess, validateAgencyInput } from '@/lib/agency'
import { userFromRequest } from '@/lib/auth'
import { errorMessage, logEvent } from '@/lib/observability'

// Signed-in user adds (or re-requests) an agency from /account.
export async function POST(request: NextRequest) {
  const user = await userFromRequest(request)
  if (!user) return NextResponse.json({ error: 'Please log in again.' }, { status: 401 })

  const input = validateAgencyInput(await request.json().catch(() => ({})))
  if ('error' in input) return NextResponse.json({ error: input.error }, { status: 400 })

  try {
    const result = await requestAgencyAccess({
      ...input,
      userId: user.id,
      email: user.email,
      origin: request.headers.get('origin') ?? '',
    })
    if (result.status === 'error') return NextResponse.json({ error: result.error }, { status: 400 })
    return NextResponse.json({ status: result.status })
  } catch (error) {
    logEvent({ event: 'agency_access_failed', level: 'error', userId: user.id, statusCode: 500, properties: { reason: errorMessage(error) } })
    return NextResponse.json({ error: 'Could not submit your agency. Please try again.' }, { status: 500 })
  }
}
