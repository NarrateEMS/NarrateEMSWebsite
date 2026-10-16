import type { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/checkout'

// Verifies the caller's Supabase JWT; never trust a user id from the body.
export async function userFromRequest(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '')
  if (!token) return null
  const { data, error } = await supabaseAdmin.auth.getUser(token)
  if (error || !data.user?.email) return null
  return { id: data.user.id, email: data.user.email }
}
