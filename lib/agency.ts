// Server only. Agency BAA onboarding: an individual can't pay or use PHI on an
// agency's charts until that agency has signed the BAA + individual-use authorization.
import { createHash, randomBytes } from 'crypto'
import { supabaseAdmin } from '@/lib/checkout'
import { escapeHtml, sendEmail } from '@/lib/email'
import { AGREEMENT_TEXT, AGREEMENT_VERSION } from '@/lib/agreement'

const LIVE = ['active', 'trialing']
const TOKEN_TTL_MS = 14 * 24 * 60 * 60 * 1000
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const normalizeServiceCode = (code: unknown) =>
  typeof code === 'string' ? code.trim().toUpperCase() : ''
export const isValidServiceCode = (code: string) => /^[A-Z0-9]{2,32}$/.test(code)
export const hashToken = (token: string) => createHash('sha256').update(token).digest('hex')

export type AgencyResult =
  | { status: 'approved' | 'pending' | 'needs_rep' }
  | { status: 'error'; error: string }

export async function agencyStatus(serviceCode: string): Promise<string | null> {
  const { data, error } = await supabaseAdmin
    .from('agencies')
    .select('status')
    .eq('service_code', serviceCode)
    .maybeSingle()
  if (error) throw error
  return data?.status ?? null
}

export function validateAgencyInput(input: { agencyName?: unknown; serviceCode?: unknown; repEmail?: unknown }) {
  const agencyName = typeof input.agencyName === 'string' ? input.agencyName.trim() : ''
  const serviceCode = normalizeServiceCode(input.serviceCode)
  const repEmail = typeof input.repEmail === 'string' ? input.repEmail.trim().toLowerCase() : ''
  if (!agencyName || agencyName.length > 120) return { error: 'Enter your EMS agency name.' }
  if (!isValidServiceCode(serviceCode)) return { error: 'Enter the EMS Charts service code, e.g. S2643.' }
  if (repEmail && !EMAIL_RE.test(repEmail)) return { error: "Enter a valid email for your agency's representative." }
  return { agencyName, serviceCode, repEmail }
}

// A user with a live plan who adds an approved agency gets it right away; the
// same subscription covers every approved agency. NULL/['ALL'] is already unrestricted.
async function addAgencyToLivePlan(userId: string, serviceCode: string): Promise<boolean> {
  const { data: sub, error } = await supabaseAdmin
    .from('user_subscriptions')
    .select('subscription_status, allowed_squads, squad_id')
    .eq('user_id', userId)
    .maybeSingle()
  if (error) throw error
  if (!sub || sub.squad_id || !LIVE.includes(sub.subscription_status)) return false
  const allowed: string[] | null = sub.allowed_squads
  if (!allowed || allowed.includes('ALL') || allowed.includes(serviceCode)) return true
  const { error: updateError } = await supabaseAdmin
    .from('user_subscriptions')
    .update({ allowed_squads: [...allowed, serviceCode], updated_at: new Date().toISOString() })
    .eq('user_id', userId)
  if (updateError) throw updateError
  return true
}

export async function requestAgencyAccess(args: {
  userId: string
  email: string
  agencyName: string
  serviceCode: string
  repEmail: string
  origin: string
}): Promise<AgencyResult> {
  const { userId, email, agencyName, serviceCode, repEmail, origin } = args

  const { data: existing, error } = await supabaseAdmin
    .from('agencies')
    .select('id, status')
    .eq('service_code', serviceCode)
    .maybeSingle()
  if (error) throw error

  if (existing?.status === 'revoked') {
    return { status: 'error', error: "This agency's authorization was revoked. Contact support@narrateems.com." }
  }

  if (existing?.status === 'approved') {
    const { error: authError } = await supabaseAdmin.from('individual_authorizations').upsert(
      {
        user_id: userId,
        agency_id: existing.id,
        status: 'approved',
        approved_at: new Date().toISOString(),
        sign_token_hash: null,
        sign_token_expires_at: null,
      },
      { onConflict: 'user_id,agency_id' }
    )
    if (authError) throw authError
    await addAgencyToLivePlan(userId, serviceCode)
    return { status: 'approved' }
  }

  if (!repEmail) return { status: 'needs_rep' }
  if (repEmail === email.toLowerCase()) {
    return { status: 'error', error: "Enter your chief's or another authorized representative's email, not your own." }
  }

  let agencyId = existing?.id as string | undefined
  if (!agencyId) {
    const { data: created, error: insertError } = await supabaseAdmin
      .from('agencies')
      .upsert({ name: agencyName, service_code: serviceCode }, { onConflict: 'service_code', ignoreDuplicates: true })
      .select('id')
      .maybeSingle()
    if (insertError) throw insertError
    agencyId = created?.id
    if (!agencyId) {
      const { data: raced, error: reread } = await supabaseAdmin
        .from('agencies').select('id').eq('service_code', serviceCode).single()
      if (reread) throw reread
      agencyId = raced.id
    }
  }

  const token = randomBytes(32).toString('base64url')
  const { error: authError } = await supabaseAdmin.from('individual_authorizations').upsert(
    {
      user_id: userId,
      agency_id: agencyId,
      status: 'pending',
      rep_email: repEmail,
      sign_token_hash: hashToken(token),
      sign_token_expires_at: new Date(Date.now() + TOKEN_TTL_MS).toISOString(),
    },
    { onConflict: 'user_id,agency_id' }
  )
  if (authError) throw authError

  const link = `${origin}/agreement/sign?token=${token}`
  await sendEmail(
    repEmail,
    `${agencyName}: authorize NarrateEMS for your medics`,
    `<p>Hello,</p>
<p>A medic at <b>${escapeHtml(agencyName)}</b> (${escapeHtml(email)}) wants to use NarrateEMS, a Chrome extension that drafts EMS Charts narratives from the medic's own dictation.</p>
<p>Because charts contain patient information, we need your agency to sign a Business Associate Agreement and authorize individual use. It takes a minute and costs your agency nothing.</p>
<p><a href="${link}">Review and sign</a></p>
<p>Once signed, other medics from your agency can use NarrateEMS without another agreement. If you did not expect this, you can ignore this email.</p>`
  )
  return { status: 'pending' }
}

async function findPendingRequest(token: string) {
  const { data, error } = await supabaseAdmin
    .from('individual_authorizations')
    .select('id, agency_id, rep_email, sign_token_expires_at, agencies!inner(name, service_code, status)')
    .eq('sign_token_hash', hashToken(token))
    .eq('status', 'pending')
    .maybeSingle()
  if (error) throw error
  if (!data || new Date(data.sign_token_expires_at) < new Date()) return null
  const agency = data.agencies as unknown as { name: string; service_code: string; status: string }
  if (agency.status !== 'pending') return null
  return { ...data, agency }
}

export async function getAgreementRequest(token: string) {
  const req = await findPendingRequest(token)
  if (!req) return null
  return {
    agencyName: req.agency.name,
    serviceCode: req.agency.service_code,
    repEmail: req.rep_email,
    agreementVersion: AGREEMENT_VERSION,
    agreementText: AGREEMENT_TEXT,
  }
}

export async function signAgreement(args: {
  token: string
  signerName: string
  signerTitle: string
  ip: string | null
  userAgent: string | null
  origin: string
}): Promise<boolean> {
  const req = await findPendingRequest(args.token)
  if (!req) return false

  // Flip pending -> approved first; only one concurrent signer wins.
  const { data: won, error } = await supabaseAdmin
    .from('agencies')
    .update({ status: 'approved', approved_at: new Date().toISOString() })
    .eq('id', req.agency_id)
    .eq('status', 'pending')
    .select('id')
  if (error) throw error
  if (!won?.length) return false

  const { error: agreementError } = await supabaseAdmin.from('agency_agreements').insert({
    agency_id: req.agency_id,
    agreement_version: AGREEMENT_VERSION,
    document_sha256: hashToken(`${AGREEMENT_VERSION}\n${AGREEMENT_TEXT}`),
    signer_name: args.signerName,
    signer_title: args.signerTitle,
    signer_email: req.rep_email,
    authority_confirmed: true,
    ip: args.ip,
    user_agent: args.userAgent,
  })
  if (agreementError) {
    await supabaseAdmin.from('agencies').update({ status: 'pending', approved_at: null }).eq('id', req.agency_id)
    throw agreementError
  }

  // Everyone waiting on this agency is approved with it.
  const { data: approved, error: approveError } = await supabaseAdmin
    .from('individual_authorizations')
    .update({ status: 'approved', approved_at: new Date().toISOString(), sign_token_hash: null, sign_token_expires_at: null })
    .eq('agency_id', req.agency_id)
    .eq('status', 'pending')
    .select('user_id')
  if (approveError) throw approveError

  for (const { user_id } of approved ?? []) {
    try {
      if (await addAgencyToLivePlan(user_id, req.agency.service_code)) continue
      const { data: user } = await supabaseAdmin.auth.admin.getUserById(user_id)
      if (!user?.user?.email) continue
      await sendEmail(
        user.user.email,
        `${req.agency.name} approved NarrateEMS`,
        `<p>Good news: <b>${escapeHtml(req.agency.name)}</b> signed the NarrateEMS agreement.</p>
<p><a href="${args.origin}/account">Log in to finish payment and activate your account</a>. Your 7-day free trial starts then.</p>`
      )
    } catch (err) {
      console.error('agency_approval_notify_failed', user_id, err)
    }
  }
  return true
}
