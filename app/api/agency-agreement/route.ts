import { NextRequest, NextResponse } from 'next/server'
import { getAgreementRequest, signAgreement } from '@/lib/agency'
import { errorMessage, logEvent } from '@/lib/observability'

const INVALID = { error: 'This link is invalid, expired, or already used.' }

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token') ?? ''
  if (!token) return NextResponse.json(INVALID, { status: 404 })
  const agreement = await getAgreementRequest(token)
  return agreement ? NextResponse.json(agreement) : NextResponse.json(INVALID, { status: 404 })
}

export async function POST(request: NextRequest) {
  const { token, signerName, signerTitle, authorityConfirmed, agreed } = await request.json().catch(() => ({}))
  const name = typeof signerName === 'string' ? signerName.trim() : ''
  const title = typeof signerTitle === 'string' ? signerTitle.trim() : ''
  if (typeof token !== 'string' || !token) return NextResponse.json(INVALID, { status: 404 })
  if (!name || !title || name.length > 120 || title.length > 120) {
    return NextResponse.json({ error: 'Enter your full name and title.' }, { status: 400 })
  }
  if (authorityConfirmed !== true || agreed !== true) {
    return NextResponse.json({ error: 'Both boxes must be checked to sign.' }, { status: 400 })
  }

  try {
    const signed = await signAgreement({
      token,
      signerName: name,
      signerTitle: title,
      ip: request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? null,
      userAgent: request.headers.get('user-agent'),
      origin: request.nextUrl.origin,
    })
    if (!signed) return NextResponse.json(INVALID, { status: 404 })
    logEvent({ event: 'agency_agreement_signed' })
    return NextResponse.json({ signed: true })
  } catch (error) {
    logEvent({ event: 'agency_agreement_failed', level: 'error', statusCode: 500, properties: { reason: errorMessage(error) } })
    return NextResponse.json({ error: 'Could not record the signature. Please try again.' }, { status: 500 })
  }
}
