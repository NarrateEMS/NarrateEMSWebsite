import { supabase } from "@/lib/supabase"

const API_URL = process.env.NEXT_PUBLIC_NARRATION_API_URL

export class ApiError extends Error {
  constructor(public status: number, message?: string) {
    super(message || `Request failed (${status})`)
  }
}

export type NarrationMeta = {
  id: string
  label: string | null
  recordedAt: string
  createdAt: string
  expiresAt: string
  durationMs: number | null
  source: "live" | "offline"
  preview: string
  chars: number
}

async function accessToken(): Promise<string> {
  const { data } = await supabase.auth.getSession()
  if (!data.session) throw new ApiError(401)
  return data.session.access_token
}

async function call<T>(url: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { ...init.headers, Authorization: `Bearer ${await accessToken()}` },
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new ApiError(res.status, body.error)
  }
  return res.status === 204 ? (undefined as T) : res.json()
}

export const transcribe = (audio: Blob) =>
  call<{ text: string; durationMs: number }>(`${API_URL}/transcribe`, {
    method: "POST",
    headers: { "Content-Type": audio.type },
    body: audio,
  })

export const saveNarration = (body: {
  clientId: string
  text: string
  label?: string
  recordedAt: string
  durationMs?: number
  source: "live" | "offline"
}) =>
  call<NarrationMeta>(`${API_URL}/narrations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })

export const listNarrations = () => call<{ narrations: NarrationMeta[] }>(`${API_URL}/narrations`)

export const deleteNarration = (id: string) =>
  call<void>(`${API_URL}/narrations/${encodeURIComponent(id)}`, { method: "DELETE" })

export const getSpeechToken = () =>
  call<{ token: string; region: string; expiresInSeconds: number }>(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/get-speech-token`,
    { method: "POST", headers: { apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "" } },
  )
