"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { AppNav, AppFooter, btn, outlineBtn, textLink, navLink } from "@/components/app-ui"
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
            <div className="text-[20px] font-semibold text-ink">
              Setting up your account
            </div>
            <p className="text-[17px] text-ink-muted">
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
        <section className="mx-auto max-w-[1100px] px-6 lg:px-10 pt-12 lg:pt-20 pb-10">
          <h1 className="text-[44px] lg:text-[64px] font-semibold leading-[1.02] tracking-tight text-balance max-w-3xl">
            Welcome to NarrateEMS.
          </h1>
          <p className="mt-6 text-[19px] text-ink-muted leading-relaxed max-w-2xl">
            {isSquadPlan
              ? "Your squad is provisioned. Five quick things and your whole crew is charting by voice."
              : "Your subscription is active. Three quick things and you're charting by voice on your next call."}
          </p>
        </section>

        <section className="mx-auto max-w-[1100px] px-6 lg:px-10 pb-16 lg:pb-24">
          <ol className="space-y-3">
            {[
              {
                title: "Install the Chrome extension.",
                body: "On the same laptop you use for Zoll ePCR. Takes ten seconds.",
                cta: (
                  <a
                    href="https://chromewebstore.google.com/detail/narrateems-ai-medic-voice/nokdpnigpfafepjbdinggckgcdekdjkm"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={btn}
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
                className="grid grid-cols-[auto_1fr] sm:grid-cols-[auto_1fr_auto] items-start gap-x-5 gap-y-4 lg:gap-x-10 rounded-card border border-rule bg-surface p-6 lg:p-8"
              >
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-ink text-paper text-[17px] font-semibold tabular-nums">
                  {i + 1}
                </div>
                <div>
                  <h3 className="text-[22px] lg:text-[26px] font-semibold tracking-tight text-ink leading-tight">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-[17px] text-ink-muted leading-relaxed max-w-xl">{step.body}</p>
                </div>
                {step.cta && <div className="col-start-2 sm:col-start-auto">{step.cta}</div>}
              </li>
            ))}
          </ol>

          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link
              href="/account"
              className={outlineBtn}
            >
              Go to your account
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
            <Link href="/" className={textLink}>
              Back to home
            </Link>
          </div>

          {sessionId && (
            <div className="mt-12 text-[15px] text-ink-muted break-all">
              Order · {sessionId.slice(0, 24)}…
            </div>
          )}
        </section>
      </main>

      <AppFooter sla />
    </div>
  )
}

function Header() {
  return (
    <AppNav>
      <Link href="/account" className={navLink}>
        Your account
        <ArrowUpRight className="h-4 w-4" />
      </Link>
    </AppNav>
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
