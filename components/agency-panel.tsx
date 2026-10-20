"use client"

import { useCallback, useEffect, useState } from "react"
import type { FormEvent } from "react"
import { supabase } from "@/lib/supabase"
import { btn, field, outlineBtn } from "@/components/app-ui"

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
      <h3 className="text-[17px] font-semibold">Your agencies</h3>
      {auths.length > 0 && (
        <ul className="space-y-2 text-[15px]">
          {auths.map((a) => (
            <li key={a.id} className="flex items-center justify-between gap-3">
              <span className="text-ink">
                {a.agencies?.name} <span className="text-ink-soft">({a.agencies?.service_code})</span>
              </span>
              <span className="shrink-0 rounded-full bg-paper-tint px-3 py-1 text-[14px] font-medium">{LABEL[a.status]}</span>
            </li>
          ))}
        </ul>
      )}

      {canPay && (
        <button
          onClick={finishPayment}
          disabled={busy}
          className={`${btn} w-full`}
        >
          Finish payment and activate →
        </button>
      )}

      <form onSubmit={addAgency} className="space-y-2">
        <div className="text-[15px] text-ink-muted">Work for another agency? Add it here.</div>
        <input required maxLength={120} value={agencyName} onChange={(e) => setAgencyName(e.target.value)} placeholder="EMS agency name" className={field} />
        <input
          required
          pattern="[A-Za-z0-9]{2,32}"
          value={serviceCode}
          onChange={(e) => {
            setServiceCode(e.target.value)
            setNeedsRep(false)
          }}
          placeholder="EMS Charts service code, e.g. S2643"
          className={field}
        />
        {needsRep && (
          <>
            <div className="text-[15px] text-ink-muted">
              This agency hasn't approved NarrateEMS yet. Enter your chief's or another authorized representative's email.
            </div>
            <input required type="email" value={repEmail} onChange={(e) => setRepEmail(e.target.value)} placeholder="chief@agency.org" className={field} />
          </>
        )}
        <button type="submit" disabled={busy} className={`${outlineBtn} w-full`}>
          {needsRep ? "Send to my agency" : "Add agency"}
        </button>
      </form>
      {message && <div role="status" className="text-[15px] text-ink">{message}</div>}
    </div>
  )
}
