"use client"

export const dynamic = "force-dynamic"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { Wordmark } from "@/components/wordmark"
import {
  Loader2,
  LogOut,
  Download,
  CheckCircle,
  KeyRound,
  ArrowUpRight,
  Mail,
} from "lucide-react"

const CHROME_EXTENSION_URL =
  "https://chromewebstore.google.com/detail/narrateems/nokdpnigpfafepjbdinggckgcdekdjkm"

// plan_type is stamped on the user at checkout, before Stripe is ever called,
// so it is the one signal available while the subscription row is still being
// provisioned by the webhook.
const SQUAD_PLAN_TYPES = [
  "pilot_annual",
  "small_squad_annual",
  "large_squad_annual",
  "high_volume_annual",
]

const PROVISION_POLL_MS = 3000
const PROVISION_POLL_ATTEMPTS = 20

export default function AccountPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [squadName, setSquadName] = useState<string | null>(null)
  const [inSquad, setInSquad] = useState(false)
  const [squadUnlinked, setSquadUnlinked] = useState(false)
  const [isSquadAdmin, setIsSquadAdmin] = useState(false)
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>("none")
  const [squadProvisioning, setSquadProvisioning] = useState(false)
  const [resetSending, setResetSending] = useState(false)
  const [resetSent, setResetSent] = useState(false)

  useEffect(() => {
    let cancelled = false

    // Returns true once the panel has everything it will ever get, false while
    // a squad purchase is still waiting on the Stripe webhook to write squad_id.
    const loadUserData = async (): Promise<boolean> => {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()

        if (sessionError || !session) {
          router.push("/")
          return true
        }

        // getUser(), not session.user: the stored session's JWT was minted
        // before checkout, so its user_metadata has no plan_type for anyone who
        // was already signed in when they bought.
        const { data: fresh } = await supabase.auth.getUser()
        const authUser = fresh?.user ?? session.user
        setUser(authUser)

        const metadata = authUser.user_metadata || {}
        if (metadata.squad_name) setSquadName(metadata.squad_name)

        const { data: subscription } = await supabase
          .from("user_subscriptions")
          .select("subscription_status, squad_id, squad_names")
          .eq("user_id", session.user.id)
          .single()

        if (subscription) {
          setSubscriptionStatus(subscription.subscription_status)
          if (subscription.squad_names && subscription.squad_names.length > 0) {
            setSquadName(subscription.squad_names[0])
          }

          // squad_names is only filled in once the squad is linked to an EMS
          // Charts code, so the admin who just bought a squad plan has squad_id
          // and nothing else -- reading the panel off squad_names alone told them
          // they were a solo medic on an individual plan.
          if (subscription.squad_id) {
            setInSquad(true)

            const { data: squad, error: squadError } = await supabase
              .from("squads")
              .select("name, squad_code, admin_user_id")
              .eq("id", subscription.squad_id)
              .maybeSingle()

            if (squadError) {
              console.error("Error loading squad:", squadError)
            }

            if (squad) {
              if (squad.squad_code) {
                if (squad.name) setSquadName(squad.name)
              } else {
                setSquadUnlinked(true)
              }
              setIsSquadAdmin(squad.admin_user_id === session.user.id)
            }

            setSquadProvisioning(false)
            return true
          }
        }

        // No squad_id on the row. A squad buyer sits here for the seconds
        // between checkout and the webhook write, and the panel answered "Solo
        // medic. You're on an individual plan." to someone who had just paid for
        // a squad. The squads row is written before the admin's link, so looking
        // up by admin_user_id also recovers a purchase whose link write was
        // missed entirely.
        const { data: ownedSquad } = await supabase
          .from("squads")
          .select("name, squad_code, admin_user_id")
          .eq("admin_user_id", session.user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle()

        if (ownedSquad) {
          setInSquad(true)
          setIsSquadAdmin(true)
          if (ownedSquad.squad_code) {
            if (ownedSquad.name) setSquadName(ownedSquad.name)
          } else {
            setSquadUnlinked(true)
          }
          setSquadProvisioning(false)
          return true
        }

        const boughtSquadPlan = SQUAD_PLAN_TYPES.includes(metadata.plan_type)
        setSquadProvisioning(boughtSquadPlan)
        return !boughtSquadPlan
      } catch (err) {
        console.error("Error loading user data:", err)
        return true
      } finally {
        setLoading(false)
      }
    }
    const poll = async () => {
      for (let attempt = 0; attempt < PROVISION_POLL_ATTEMPTS; attempt++) {
        const settled = await loadUserData()
        if (settled || cancelled) return
        await new Promise((resolve) => setTimeout(resolve, PROVISION_POLL_MS))
        if (cancelled) return
      }
    }

    poll()

    return () => {
      cancelled = true
    }
  }, [router])

  const handleResetPassword = async () => {
    if (!user?.email) return
    setResetSending(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: "https://www.narrateems.com/reset-password",
      })
      if (error) throw error
      setResetSent(true)
    } catch (err) {
      console.error("Error sending reset email:", err)
    } finally {
      setResetSending(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-6 w-6 animate-spin text-ink" />
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft">
            Loading account
          </div>
        </div>
      </div>
    )
  }

  const isActive = subscriptionStatus === "active"
  const initials = (user?.email || "?")
    .split("@")[0]
    .split(/[._-]/)
    .map((s: string) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase()

  return (
    <div className="min-h-screen bg-paper text-ink antialiased">
      {/* Nav */}
      <nav className="border-b border-rule bg-paper/90 backdrop-blur-md sticky top-0 z-30">
        <div className="mx-auto max-w-[1100px] px-6 lg:px-10 h-16 flex items-center justify-between">
          <Wordmark href="/" size="md" />
          <div className="flex items-center gap-2">
            <a
              href={CHROME_EXTENSION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink transition-colors px-3 py-2"
            >
              <Download className="h-3.5 w-3.5" />
              Install
            </a>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink transition-colors px-3 py-2"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </button>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-[1100px] px-6 lg:px-10 py-12 lg:py-16">
        {/* Page header */}
        <div className="flex items-start justify-between gap-6 mb-12 pb-10 border-b border-rule">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft mb-4">
              ↳ Your account
            </div>
            <h1 className="font-serif text-5xl lg:text-6xl leading-[1] tracking-tight text-balance">
              {(() => {
                const handle = user?.email?.split("@")[0]
                return (
                  <>
                    Welcome,
                    <br />
                    <span className="italic">{handle || "medic"}.</span>
                  </>
                )
              })()}
            </h1>
          </div>
          <div className="hidden sm:flex items-center justify-center w-16 h-16 rounded-full bg-ink text-paper font-mono text-base tracking-widest shrink-0">
            {initials}
          </div>
        </div>

        {/* Two-column grid */}
        <div className="grid lg:grid-cols-12 gap-px bg-rule border border-rule">
          {/* Account info */}
          <section className="lg:col-span-7 bg-paper p-7 lg:p-10">
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft mb-6">
              ↳ Account
            </div>

            <dl className="space-y-6">
              <div className="flex items-baseline justify-between gap-6 pb-5 border-b border-rule">
                <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft">
                  Email
                </dt>
                <dd className="text-ink break-all text-right">{user?.email}</dd>
              </div>

              <div className="flex items-baseline justify-between gap-6 pb-5 border-b border-rule">
                <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft">
                  Subscription
                </dt>
                <dd className="inline-flex items-center gap-2">
                  {isActive ? (
                    <>
                      <span className="h-1.5 w-1.5 rounded-full bg-success pulse-dot" />
                      <span className="font-mono text-xs uppercase tracking-[0.16em] text-ink">
                        Active
                      </span>
                    </>
                  ) : (
                    <span className="font-mono text-xs uppercase tracking-[0.16em] text-ink-soft">
                      {subscriptionStatus || "none"}
                    </span>
                  )}
                </dd>
              </div>

              <div className="pb-2">
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft mb-3 flex items-center gap-1.5">
                  <KeyRound className="h-3 w-3" />
                  Password
                </div>
                {resetSent ? (
                  <div className="inline-flex items-center gap-2 text-sm text-ink bg-paper-tint border border-rule rounded-md px-3 py-2.5">
                    <CheckCircle className="h-4 w-4" />
                    Reset link sent to{" "}
                    <span className="font-medium break-all">{user?.email}</span>
                  </div>
                ) : (
                  <button
                    onClick={handleResetPassword}
                    disabled={resetSending}
                    className="inline-flex items-center gap-2 bg-paper border border-rule-strong text-ink px-4 py-2.5 text-sm font-medium rounded-md hover:bg-ink hover:text-paper hover:border-ink transition-colors disabled:opacity-60"
                  >
                    {resetSending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                    Send password reset email
                  </button>
                )}
              </div>
            </dl>
          </section>

          {/* Squad info */}
          <section className="lg:col-span-5 bg-paper p-7 lg:p-10">
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft mb-6">
              ↳ Squad
            </div>

            {squadProvisioning ? (
              <div>
                <div className="font-serif text-3xl text-ink leading-tight mb-3 inline-flex items-center gap-3">
                  <Loader2 className="h-5 w-5 animate-spin text-ink-soft" />
                  Setting up your squad.
                </div>
                <p className="text-sm text-ink-muted leading-relaxed">
                  Your payment went through and we're finishing your squad now. This
                  page updates itself within a few seconds -- no need to reload.
                </p>
              </div>
            ) : squadUnlinked ? (
              <div>
                <div className="font-serif text-3xl text-ink leading-tight mb-3">
                  One step left.
                </div>
                <p className="text-sm text-ink-muted leading-relaxed">
                  {isSquadAdmin
                    ? "Your squad is set up but not yet linked to an EMS Charts service. Open a chart on your own service in the extension -- that first chart links it, and it cannot be relinked without support. Invite your crew after that."
                    : "Your squad is set up but not yet linked to an EMS Charts service. Your squad admin needs to open a chart on your service before access turns on."}
                </p>
              </div>
            ) : squadName || inSquad ? (
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft mb-2">
                  You ride with
                </div>
                <div className="font-serif text-3xl text-ink leading-tight mb-6">
                  {squadName ?? "Your squad"}
                </div>
                <div className="pt-5 border-t border-rule text-sm text-ink-muted leading-relaxed">
                  {isSquadAdmin
                    ? "You are this squad's admin. Charts from every member roll up to this squad's billing; invite or remove members from the extension's squad panel."
                    : "Your charts roll up to this squad's billing. To leave or transfer, contact your squad admin."}
                </div>
              </div>
            ) : (
              <div>
                <div className="font-serif text-3xl text-ink leading-tight mb-3">
                  Solo medic.
                </div>
                <p className="text-sm text-ink-muted leading-relaxed">
                  You're on an individual plan. Want to roll up under a squad? Have
                  your captain send you an invite.
                </p>
              </div>
            )}
          </section>
        </div>

        {/* Extension callout */}
        <section className="mt-12 bg-ink text-paper rounded-xl p-8 lg:p-10 grid lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8">
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper/50 mb-3">
              ↳ Don't have it yet?
            </div>
            <h2 className="font-serif text-3xl lg:text-4xl leading-tight text-balance">
              Install the Chrome extension <span className="italic">on the rig laptop.</span>
            </h2>
            <p className="mt-3 text-paper/70 text-sm leading-relaxed max-w-md">
              Sign in once. Hit record after the next call. Your Zoll chart will be
              ready by the time you sit down.
            </p>
          </div>
          <div className="lg:col-span-4 flex lg:justify-end">
            <a
              href={CHROME_EXTENSION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-hi-vis text-hi-vis-ink px-6 py-3.5 text-sm font-semibold rounded-md hover:bg-paper transition-colors focus-hi-vis"
            >
              <Download className="h-4 w-4" />
              Install extension
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </section>

        {/* Help */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft hover:text-ink transition-colors"
          >
            ← Back to home
          </Link>
        </div>

        <div className="mt-6 text-center text-sm text-ink-soft inline-flex items-center justify-center gap-2 w-full">
          <Mail className="h-3.5 w-3.5" />
          Need help?{" "}
          <a
            href="mailto:narrateems@gmail.com"
            className="text-ink hover:text-hi-vis-deep underline underline-offset-4"
          >
            narrateems@gmail.com
          </a>
        </div>
      </main>

      <footer className="border-t border-rule mt-16">
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
