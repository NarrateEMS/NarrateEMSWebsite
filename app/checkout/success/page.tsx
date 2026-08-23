"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Wordmark } from "@/components/wordmark"
import { Loader2, ArrowUpRight, Download } from "lucide-react"

function CheckoutSuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  // Squad plans provision a squad that is UNBOUND until its admin opens a chart
  // on their own EMS Charts service, and members cannot be invited before that.
  // Neither step was mentioned here, so squad admins were sent straight to
  // "hit record" with nobody on their squad.
  const isSquadPlan = (searchParams.get("plan") ?? "").endsWith("_annual")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-paper text-ink antialiased flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center px-6">
          <div className="flex flex-col items-center gap-4 max-w-md text-center">
            <Loader2 className="h-6 w-6 animate-spin text-ink" />
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft">
              Setting up your account
            </div>
            <p className="text-ink-muted text-sm">
              We're activating your subscription and provisioning your squad. Hang
              tight — this takes a couple seconds.
            </p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-paper text-ink antialiased flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="mx-auto max-w-[1100px] px-6 lg:px-10 pt-16 lg:pt-24 pb-12">
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft mb-6">
            ↳ You're in
          </div>
          <h1 className="font-serif text-6xl lg:text-7xl leading-[0.98] tracking-tight text-balance max-w-3xl">
            Welcome to <span className="italic">NarrateEMS.</span>
          </h1>
          <p className="mt-6 text-lg text-ink-muted leading-relaxed max-w-2xl">
            {isSquadPlan
              ? "Your squad is provisioned. Five quick things and your whole crew is charting by voice."
              : "Your subscription is active. Three quick things and you're charting by voice on your next call."}
          </p>
        </section>

        <section className="mx-auto max-w-[1100px] px-6 lg:px-10 pb-16 lg:pb-24">
          <ol className="border-y border-rule">
            {[
              {
                title: "Install the Chrome extension.",
                body: "On the same laptop you use for Zoll ePCR. Takes ten seconds.",
                cta: (
                  <a
                    href="https://chromewebstore.google.com/detail/narrateems-ai-medic-voice/nokdpnigpfafepjbdinggckgcdekdjkm"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-hi-vis text-hi-vis-ink px-5 py-3 text-sm font-semibold rounded-md hover:bg-hi-vis-deep hover:text-paper transition-colors focus-hi-vis"
                  >
                    <Download className="h-4 w-4" />
                    Install extension
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                ),
              },
              {
                title: "Sign in to the extension.",
                body: "Use the email and password you just created. Same account works on the web.",
                cta: null,
              },
              ...(isSquadPlan
                ? [
                    {
                      title: "Open a chart on your own service.",
                      body: "The first chart you open links your squad to that EMS Charts service code — so make sure it is your service. It cannot be relinked without support.",
                      cta: null,
                    },
                    {
                      title: "Invite your crew from the extension.",
                      body: "Squad panel → Invite members. Each one gets an email link, sets a password, and inherits your squad's access. Do this early: the trial runs 7 days.",
                      cta: null,
                    },
                  ]
                : []),
              {
                title: "Open your Zoll ePCR. Hit record. Narrate.",
                body: "Walk through the call the way you'd brief your partner. Your chart fills in as you talk.",
                cta: null,
              },
            ].map((step, i) => (
              <li
                key={step.title}
                className="grid grid-cols-[auto_1fr_auto] items-start gap-6 lg:gap-10 py-8 border-b border-rule last:border-b-0"
              >
                <div className="font-mono text-sm text-ink-soft tabular-nums pt-1">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div>
                  <h3 className="font-serif text-2xl lg:text-3xl text-ink leading-tight">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-ink-muted leading-relaxed max-w-xl">{step.body}</p>
                </div>
                <div>{step.cta}</div>
              </li>
            ))}
          </ol>

          <div className="mt-12 flex flex-wrap items-center gap-4">
            <Link
              href="/account"
              className="inline-flex items-center gap-2 bg-ink text-paper px-5 py-3 text-sm font-medium rounded-md hover:bg-ink-2 transition-colors"
            >
              Go to your account
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
            <Link href="/" className="text-sm text-ink-muted hover:text-ink transition-colors">
              Back to home
            </Link>
          </div>

          {sessionId && (
            <div className="mt-12 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-soft">
              Order · {sessionId.slice(0, 24)}…
            </div>
          )}
        </section>
      </main>

      <footer className="border-t border-rule">
        <div className="mx-auto max-w-[1100px] px-6 lg:px-10 h-14 flex items-center justify-between text-xs text-ink-soft">
          <span className="font-mono uppercase tracking-[0.16em]">© 2026 NarrateEMS</span>
          <div className="flex items-center gap-4">
            <Link href="/privacy-policy" className="hover:text-ink transition-colors">
              Privacy
            </Link>
            <Link href="/terms-of-service" className="hover:text-ink transition-colors">
              Terms
            </Link>
            <Link href="/sla" className="hover:text-ink transition-colors">
              SLA
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

function Header() {
  return (
    <header className="border-b border-rule">
      <div className="mx-auto max-w-[1100px] px-6 lg:px-10 h-16 flex items-center justify-between">
        <Wordmark href="/" size="md" />
        <Link
          href="/account"
          className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink transition-colors"
        >
          Your account
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </header>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-paper flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-ink" />
        </div>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  )
}
