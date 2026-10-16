"use client"

import { useCallback, useEffect, useState } from "react"
import type { FormEvent } from "react"
import { supabase } from "@/lib/supabase"

type Authorization = {
  id: string
  status: "pending" | "approved" | "revoked"
  agencies: { name: string; service_code: string; status: string } | null
}

const LABEL: Record<string, string> = {
  approved: "Approved",
  pending: "Waiting for agency to sign",
  revoked: "Revoked",
}

const inputClass =
  "w-full px-3 py-2 bg-paper border border-rule rounded-md text-sm text-ink placeholder:text-ink-soft/60 focus:outline-none focus:border-ink"

async function authedPost(path: string, body?: object) {
  const { data } = await supabase.auth.getSession()
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${data.session?.access_token ?? ""}` },
    body: JSON.stringify(body ?? {}),
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(json.error || "Something went wrong")
  return json
}

// Individual plans only cover agencies that signed the BAA.
export function AgencyPanel({ subscriptionStatus }: { subscriptionStatus: string }) {
  const [auths, setAuths] = useState<Authorization[]>([])
  const [agencyName, setAgencyName] = useState("")
  const [serviceCode, setServiceCode] = useState("")
  const [repEmail, setRepEmail] = useState("")
  const [needsRep, setNeedsRep] = useState(false)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState("")

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from("individual_authorizations")
      .select("id, status, agencies(name, service_code, status)")
      .order("created_at")
    if (error) console.error("Error loading agencies:", error)
    else setAuths(data as unknown as Authorization[])
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const live = subscriptionStatus === "active" || subscriptionStatus === "trialing"
  const canPay = !live && auths.some((a) => a.status === "approved")

  const finishPayment = async () => {
    setBusy(true)
    setMessage("")
    try {
      const { url } = await authedPost("/api/finish-payment")
      window.location.href = url
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Could not start checkout.")
      setBusy(false)
    }
  }

  const addAgency = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setBusy(true)
    setMessage("")
    try {
      const { status } = await authedPost("/api/agency-access", { agencyName, serviceCode, repEmail })
      if (status === "needs_rep") {
        setNeedsRep(true)
      } else {
        setMessage(status === "pending" ? `We emailed ${repEmail} to sign for ${agencyName}.` : `${agencyName} added.`)
        setAgencyName("")
        setServiceCode("")
        setRepEmail("")
        setNeedsRep(false)
        await load()
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Could not add the agency.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mt-6 pt-5 border-t border-rule space-y-4">
      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft">Your agencies</div>
      {auths.length > 0 && (
        <ul className="space-y-2 text-sm">
          {auths.map((a) => (
            <li key={a.id} className="flex justify-between gap-3">
              <span className="text-ink">
                {a.agencies?.name} <span className="text-ink-soft">({a.agencies?.service_code})</span>
              </span>
              <span className="text-ink-muted">{LABEL[a.status]}</span>
            </li>
          ))}
        </ul>
      )}

      {canPay && (
        <button
          onClick={finishPayment}
          disabled={busy}
          className="w-full py-3 bg-hi-vis text-hi-vis-ink font-semibold rounded-md hover:bg-hi-vis-deep hover:text-paper transition-colors disabled:opacity-60"
        >
          Finish payment and activate →
        </button>
      )}

      <form onSubmit={addAgency} className="space-y-2">
        <div className="text-sm text-ink-muted">Work for another agency? Add it here.</div>
        <input required maxLength={120} value={agencyName} onChange={(e) => setAgencyName(e.target.value)} placeholder="EMS agency name" className={inputClass} />
        <input
          required
          pattern="[A-Za-z0-9]{2,32}"
          value={serviceCode}
          onChange={(e) => {
            setServiceCode(e.target.value)
            setNeedsRep(false)
          }}
          placeholder="EMS Charts service code, e.g. S2643"
          className={inputClass}
        />
        {needsRep && (
          <>
            <div className="text-sm text-ink-muted">
              This agency hasn't approved NarrateEMS yet. Enter your chief's or another authorized representative's email.
            </div>
            <input required type="email" value={repEmail} onChange={(e) => setRepEmail(e.target.value)} placeholder="chief@agency.org" className={inputClass} />
          </>
        )}
        <button type="submit" disabled={busy} className="w-full py-2 border border-rule rounded-md text-sm hover:border-ink disabled:opacity-60">
          {needsRep ? "Send to my agency" : "Add agency"}
        </button>
      </form>
      {message && <div className="text-sm text-ink">{message}</div>}
    </div>
  )
}
