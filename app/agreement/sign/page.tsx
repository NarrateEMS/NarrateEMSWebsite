"use client"

import { Suspense, useEffect, useState } from "react"
import type { FormEvent } from "react"
import { useSearchParams } from "next/navigation"
import { Wordmark } from "@/components/wordmark"

type Agreement = {
  agencyName: string
  serviceCode: string
  repEmail: string
  agreementVersion: string
  documents: { title: string; href: string }[]
}

const inputClass =
  "w-full px-4 py-3 bg-paper border border-rule rounded-md text-ink placeholder:text-ink-soft/60 focus:outline-none focus:border-ink"

function SignAgreement() {
  const token = useSearchParams().get("token") ?? ""
  const [agreement, setAgreement] = useState<Agreement | null>(null)
  const [error, setError] = useState("")
  const [legalName, setLegalName] = useState("")
  const [address, setAddress] = useState("")
  const [signerName, setSignerName] = useState("")
  const [signerTitle, setSignerTitle] = useState("")
  const [authorityConfirmed, setAuthorityConfirmed] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [busy, setBusy] = useState(false)
  const [signed, setSigned] = useState(false)

  useEffect(() => {
    fetch(`/api/agency-agreement?token=${encodeURIComponent(token)}`)
      .then(async (res) => {
        const json = await res.json()
        if (!res.ok) throw new Error(json.error)
        setAgreement(json)
        setLegalName(json.agencyName)
      })
      .catch((err) => setError(err.message || "This link is invalid."))
  }, [token])

  const sign = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setBusy(true)
    setError("")
    try {
      const res = await fetch("/api/agency-agreement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, legalName, address, signerName, signerTitle, authorityConfirmed, agreed }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      setSigned(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign.")
    } finally {
      setBusy(false)
    }
  }

  if (signed) {
    return (
      <p className="text-ink leading-relaxed">
        Thank you. <b>{agreement?.agencyName}</b> is now approved, and your medics can start using NarrateEMS.
        No further action is needed.
      </p>
    )
  }
  if (!agreement) return <p className="text-ink-muted">{error || "Loading…"}</p>

  return (
    <form onSubmit={sign} className="space-y-5">
      <h1 className="font-serif text-3xl text-ink">
        Authorize NarrateEMS for {agreement.agencyName}
      </h1>
      <p className="text-sm text-ink-muted leading-relaxed">
        NarrateEMS drafts EMS Charts narratives from a medic's dictation. Charts hold patient information, so
        before your medics can use it we need a Business Associate Agreement and your authorization for
        individual use. There is no cost to your agency.
      </p>
      <ul className="border border-rule rounded-md p-4 space-y-2 text-sm bg-surface">
        {agreement.documents.map((doc) => (
          <li key={doc.href}>
            <a href={doc.href} target="_blank" rel="noopener noreferrer" className="underline text-ink hover:text-ink-muted">
              {doc.title} (PDF)
            </a>
          </li>
        ))}
      </ul>
      <div className="text-xs text-ink-soft">
        Agency service code {agreement.serviceCode} · Version {agreement.agreementVersion} · Signing as {agreement.repEmail}
      </div>
      <input required maxLength={160} value={legalName} onChange={(e) => setLegalName(e.target.value)} placeholder="Agency legal name" className={inputClass} />
      <input required maxLength={300} value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Agency mailing address" className={inputClass} />
      <input required maxLength={120} value={signerName} onChange={(e) => setSignerName(e.target.value)} placeholder="Full name" className={inputClass} />
      <input required maxLength={120} value={signerTitle} onChange={(e) => setSignerTitle(e.target.value)} placeholder="Title, e.g. Chief" className={inputClass} />
      <label className="flex gap-3 text-sm text-ink">
        <input type="checkbox" required checked={authorityConfirmed} onChange={(e) => setAuthorityConfirmed(e.target.checked)} />
        I confirm I am authorized to sign on behalf of {legalName || agreement.agencyName}.
      </label>
      <label className="flex gap-3 text-sm text-ink">
        <input type="checkbox" required checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
        I have read and agree to both documents above, and authorize individual NarrateEMS use by our medics.
      </label>
      <p className="text-xs text-ink-soft">
        Your name, title and the agency details will be printed on both documents as your electronic signature.
      </p>
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2.5 rounded-md text-sm">{error}</div>}
      <button type="submit" disabled={busy} className="w-full py-3 bg-hi-vis text-hi-vis-ink font-semibold rounded-md hover:bg-hi-vis-deep hover:text-paper transition-colors disabled:opacity-60">
        {busy ? "Signing…" : "Sign agreement"}
      </button>
    </form>
  )
}

export default function SignAgreementPage() {
  return (
    <div className="min-h-screen bg-paper">
      <header className="px-6 py-5 border-b border-rule">
        <Wordmark />
      </header>
      <main className="max-w-xl mx-auto px-6 py-12">
        <Suspense fallback={<p className="text-ink-muted">Loading…</p>}>
          <SignAgreement />
        </Suspense>
      </main>
    </div>
  )
}
