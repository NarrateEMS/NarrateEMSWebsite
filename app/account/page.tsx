"use client"

export const dynamic = "force-dynamic"

import { useCallback, useEffect, useState } from "react"
import type { FormEvent } from "react"
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
  RefreshCw,
  UserPlus,
  Users,
  Trash2,
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

interface SquadMember {
  user_id: string
  email: string
  status: string
  joined_at: string
  is_admin: boolean
}

interface PendingInvite {
  id: string
  email: string
  created_at: string
  expires_at: string
}

interface SquadAdminData {
  isAdmin: boolean
  squad: {
    id: string
    name: string
    squad_code: string | null
    subscription_status: string
  }
  seats: {
    active_members: number
    pending_invites: number
  }
  members: SquadMember[]
  pending_invites: PendingInvite[]
}

interface SquadFunctionError {
  error?: string
}

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
  const [squadAdminData, setSquadAdminData] = useState<SquadAdminData | null>(null)
  const [squadAdminLoading, setSquadAdminLoading] = useState(false)
  const [squadAdminError, setSquadAdminError] = useState("")
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteSending, setInviteSending] = useState(false)
  const [inviteMessage, setInviteMessage] = useState("")
  const [inviteMessageType, setInviteMessageType] = useState<"success" | "error">("success")
  const [confirmingMemberId, setConfirmingMemberId] = useState<string | null>(null)
  const [removingMemberId, setRemovingMemberId] = useState<string | null>(null)
  const [memberMessage, setMemberMessage] = useState("")
  const [memberMessageType, setMemberMessageType] = useState<"success" | "error">("success")

  const callSquadFunction = useCallback(
    async <T,>(functionName: string, body: Record<string, string>): Promise<T> => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        throw new Error("Your session expired. Sign in again to manage your squad.")
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/${functionName}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify(body),
        },
      )
      const result = (await response.json()) as T & SquadFunctionError

      if (!response.ok) {
        throw new Error(result.error || "Squad request failed. Please try again.")
      }

      return result
    },
    [],
  )

  const loadSquadAdminData = useCallback(async () => {
    setSquadAdminLoading(true)
    setSquadAdminError("")
    try {
      const data = await callSquadFunction<SquadAdminData>("get-squad-admin-data", {})
      if (!data.isAdmin) {
        throw new Error("This account is not a squad administrator.")
      }
      setSquadAdminData(data)
    } catch (err) {
      setSquadAdminError(err instanceof Error ? err.message : "Could not load your squad.")
    } finally {
      setSquadAdminLoading(false)
    }
  }, [callSquadFunction])

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

  useEffect(() => {
    if (isSquadAdmin) {
      loadSquadAdminData()
    }
  }, [isSquadAdmin, loadSquadAdminData])

  const sendSquadInvite = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const email = inviteEmail.trim().toLowerCase()

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setInviteMessageType("error")
      setInviteMessage("Enter a valid email address.")
      return
    }

    setInviteSending(true)
    setInviteMessage("")
    try {
      await callSquadFunction("invite-squad-member", { email })
      setInviteEmail("")
      setInviteMessageType("success")
      setInviteMessage(`Invite sent to ${email}.`)
      await loadSquadAdminData()
    } catch (err) {
      setInviteMessageType("error")
      setInviteMessage(err instanceof Error ? err.message : "Could not send the invite.")
    } finally {
      setInviteSending(false)
    }
  }

  const resendSquadInvite = async (email: string) => {
    setInviteSending(true)
    setInviteMessage("")
    try {
      await callSquadFunction("invite-squad-member", { email })
      setInviteMessageType("success")
      setInviteMessage(`Fresh invite sent to ${email}.`)
      await loadSquadAdminData()
    } catch (err) {
      setInviteMessageType("error")
      setInviteMessage(err instanceof Error ? err.message : "Could not resend the invite.")
    } finally {
      setInviteSending(false)
    }
  }

  const removeSquadMember = async (member: SquadMember) => {
    setRemovingMemberId(member.user_id)
    setMemberMessage("")
    try {
      await callSquadFunction("remove-squad-member", {
        member_user_id: member.user_id,
      })
      setConfirmingMemberId(null)
      setMemberMessageType("success")
      setMemberMessage(`${member.email} was removed from the squad.`)
      await loadSquadAdminData()
    } catch (err) {
      setMemberMessageType("error")
      setMemberMessage(err instanceof Error ? err.message : "Could not remove that member.")
    } finally {
      setRemovingMemberId(null)
    }
  }

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
                    ? "Your squad is set up but not linked yet. Open a chart for your squad's service in ZOLL, then open the NarrateEMS extension in that same browser. It will link the squad automatically; return here afterward to invite your crew."
                    : "Your squad is set up but not linked yet. Ask your squad admin to open a chart for your service in ZOLL, then open the NarrateEMS extension in that same browser."}
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
                    ? "You are this squad's admin. Charts from every member roll up to this squad's billing; manage your crew below or from the extension."
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

        {isSquadAdmin && (
          <section className="mt-12 border border-rule bg-paper">
            <div className="px-7 py-6 lg:px-10 border-b border-rule flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft mb-2">
                  ↳ Squad administration
                </div>
                <h2 className="font-serif text-3xl lg:text-4xl leading-tight">
                  Manage your <span className="italic">crew.</span>
                </h2>
              </div>
              {squadAdminData && (
                <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-soft">
                  {squadAdminData.seats.active_members} members ·{" "}
                  {squadAdminData.seats.pending_invites} pending
                </div>
              )}
            </div>

            {squadAdminLoading && !squadAdminData ? (
              <div className="px-7 py-10 lg:px-10 flex items-center gap-3 text-sm text-ink-muted">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading squad roster
              </div>
            ) : squadAdminError && !squadAdminData ? (
              <div className="px-7 py-10 lg:px-10">
                <p className="text-sm text-[var(--danger)] mb-4">{squadAdminError}</p>
                <button
                  onClick={loadSquadAdminData}
                  className="inline-flex items-center gap-2 border border-rule-strong rounded-md px-4 py-2.5 text-sm font-medium hover:bg-ink hover:text-paper transition-colors"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Try again
                </button>
              </div>
            ) : (
              <div className="grid lg:grid-cols-12">
                <div className="lg:col-span-5 px-7 py-8 lg:px-10 border-b lg:border-b-0 lg:border-r border-rule">
                  <div className="flex items-center gap-2 mb-4">
                    <UserPlus className="h-4 w-4" />
                    <h3 className="font-mono text-[10px] uppercase tracking-[0.18em]">
                      Invite a member
                    </h3>
                  </div>

                  {squadAdminData?.squad.squad_code ? (
                    <>
                      <p className="text-sm text-ink-muted leading-relaxed mb-5">
                        They will receive a secure link to join{" "}
                        <span className="text-ink">{squadAdminData.squad.name}</span>.
                      </p>
                      <form onSubmit={sendSquadInvite} className="flex flex-col sm:flex-row gap-2">
                        <label htmlFor="squad-invite-email" className="sr-only">
                          Member email address
                        </label>
                        <input
                          id="squad-invite-email"
                          type="email"
                          value={inviteEmail}
                          onChange={(event) => setInviteEmail(event.target.value)}
                          placeholder="name@squad.org"
                          disabled={inviteSending}
                          className="min-w-0 flex-1 bg-paper border border-rule-strong rounded-md px-3 py-2.5 text-sm outline-none focus:border-ink focus:ring-2 focus:ring-hi-vis/40 disabled:opacity-60"
                        />
                        <button
                          type="submit"
                          disabled={inviteSending || !inviteEmail.trim()}
                          className="inline-flex items-center justify-center gap-2 bg-hi-vis text-hi-vis-ink rounded-md px-4 py-2.5 text-sm font-semibold hover:bg-hi-vis-deep hover:text-paper transition-colors disabled:bg-paper-tint disabled:text-ink-soft"
                        >
                          {inviteSending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                          Send invite
                        </button>
                      </form>
                    </>
                  ) : (
                    <p className="text-sm text-ink-muted leading-relaxed">
                      Open a chart for your squad&apos;s service in ZOLL, then open the
                      NarrateEMS extension in that same browser. It will link the squad
                      automatically so you can invite members here.
                    </p>
                  )}

                  {inviteMessage && (
                    <div
                      role="status"
                      className={`mt-4 border-l-2 px-3 py-2 text-sm ${
                        inviteMessageType === "success"
                          ? "border-[var(--success)] bg-paper-tint text-[var(--success)]"
                          : "border-[var(--danger)] bg-paper-tint text-[var(--danger)]"
                      }`}
                    >
                      {inviteMessage}
                    </div>
                  )}
                </div>

                <div className="lg:col-span-7 px-7 py-8 lg:px-10">
                  <div className="flex items-center gap-2 mb-5">
                    <Users className="h-4 w-4" />
                    <h3 className="font-mono text-[10px] uppercase tracking-[0.18em]">
                      Members and pending invites
                    </h3>
                  </div>

                  {memberMessage && (
                    <div
                      role="status"
                      className={`mb-4 border-l-2 bg-paper-tint px-3 py-2 text-sm ${
                        memberMessageType === "success"
                          ? "border-[var(--success)] text-[var(--success)]"
                          : "border-[var(--danger)] text-[var(--danger)]"
                      }`}
                    >
                      {memberMessage}
                    </div>
                  )}

                  <div className="divide-y divide-rule border-y border-rule">
                    {squadAdminData?.members.map((member) => (
                      <div
                        key={member.user_id}
                        className="py-3 flex items-center justify-between gap-4"
                      >
                        <span className="text-sm break-all">{member.email}</span>
                        {member.is_admin ? (
                          <span className="shrink-0 font-mono text-[9px] uppercase tracking-[0.14em] text-ink-soft border border-rule-strong rounded-full px-2 py-1">
                            Admin
                          </span>
                        ) : confirmingMemberId === member.user_id ? (
                          <div className="shrink-0 flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setConfirmingMemberId(null)}
                              disabled={removingMemberId === member.user_id}
                              className="font-mono text-[9px] uppercase tracking-[0.12em] text-ink-soft hover:text-ink disabled:opacity-50"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => removeSquadMember(member)}
                              disabled={removingMemberId === member.user_id}
                              className="inline-flex items-center gap-1.5 rounded-full bg-[var(--danger)] text-white px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.12em] disabled:opacity-60"
                            >
                              {removingMemberId === member.user_id ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <Trash2 className="h-3 w-3" />
                              )}
                              Confirm remove
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmingMemberId(member.user_id)}
                            className="shrink-0 inline-flex items-center gap-1.5 border border-rule-strong rounded-full px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.12em] text-ink-muted hover:border-[var(--danger)] hover:text-[var(--danger)] transition-colors"
                          >
                            <Trash2 className="h-3 w-3" />
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                    {squadAdminData?.pending_invites.map((invite) => (
                      <div
                        key={invite.id}
                        className="py-3 flex items-center justify-between gap-4"
                      >
                        <div className="min-w-0">
                          <div className="text-sm text-ink-muted break-all">{invite.email}</div>
                          <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-ink-soft mt-1">
                            Invite pending
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => resendSquadInvite(invite.email)}
                          disabled={inviteSending}
                          className="shrink-0 inline-flex items-center gap-1.5 border border-rule-strong rounded-full px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.12em] hover:bg-ink hover:text-paper transition-colors disabled:opacity-50"
                        >
                          <RefreshCw className="h-3 w-3" />
                          Resend
                        </button>
                      </div>
                    ))}
                    {!squadAdminData?.members.length &&
                      !squadAdminData?.pending_invites.length && (
                        <div className="py-5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-soft">
                          No members or pending invites yet
                        </div>
                      )}
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

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
