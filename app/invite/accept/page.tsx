"use client"

export const dynamic = "force-dynamic"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { AuthShell, btn, outlineBtn, textLink, field, label, navLink } from "@/components/app-ui"
import { Loader2, CheckCircle, XCircle, Eye, EyeOff, ArrowUpRight, AlertCircle } from "lucide-react"

type PageState = "loading" | "set-password" | "confirm-join" | "processing" | "success" | "error"

export default function AcceptInvitePage() {
  const router = useRouter()
  const [pageState, setPageState] = useState<PageState>("loading")
  const [email, setEmail] = useState("")
  const [squadName, setSquadName] = useState("")
  const [squadId, setSquadId] = useState("")
  const [inviteId, setInviteId] = useState("")
  const [isExistingUser, setIsExistingUser] = useState(false)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const processedRef = useRef(false)
  const cleanupRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    const handleInviteToken = async () => {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()
        if (sessionError) {
          setError("We couldn't process your invite link. Try opening it again or email a medic.")
          setPageState("error")
          return
        }
        if (session) {
          await processSession(session)
          return
        }

        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, newSession) => {
          if ((event === "SIGNED_IN" || event === "TOKEN_REFRESHED") && newSession && !processedRef.current) {
            processedRef.current = true
            subscription.unsubscribe()
            await processSession(newSession)
          }
        })

        let attempts = 0
        const maxAttempts = 10
        const pollInterval = setInterval(async () => {
          attempts++
          if (processedRef.current) {
            clearInterval(pollInterval)
            return
          }
          const {
            data: { session: retrySession },
          } = await supabase.auth.getSession()
          if (retrySession) {
            clearInterval(pollInterval)
            if (!processedRef.current) {
              processedRef.current = true
              subscription.unsubscribe()
              await processSession(retrySession)
            }
          } else if (attempts >= maxAttempts) {
            clearInterval(pollInterval)
            if (!processedRef.current) {
              subscription.unsubscribe()
              setError("Invite link is invalid or expired. Ask your squad admin to send a fresh one.")
              setPageState("error")
            }
          }
        }, 1000)
        // Hand teardown to the effect. Returning it from this inner async
        // function did nothing: the effect calls handleInviteToken() bare, so
        // the returned function was discarded and both the poll interval and
        // the auth subscription leaked for the page's lifetime.
        cleanupRef.current = () => {
          clearInterval(pollInterval)
          subscription.unsubscribe()
        }
      } catch (err) {
        console.error("Error handling invite:", err)
        setError("Something unexpected happened. Try again.")
        setPageState("error")
      }
    }

    const processSession = async (session: any) => {
      const user = session.user
      setEmail(user.email || "")
      const metadata = user.user_metadata || {}
      setSquadName(metadata.squad_name || "your squad")
      setSquadId(metadata.squad_id || "")
      setInviteId(metadata.invite_id || "")
      // invite-squad-member marks links it issued to people with no password:
      // ?setup=1 on the URL, needs_password in the metadata for good measure.
      //
      // This used to be inferred from identity_data.email_verified, which GoTrue
      // flips to true as soon as an invite link is opened. Every brand-new
      // invitee therefore looked like an existing account, went straight to
      // "Join squad", and ended up in the squad with no password they could sign
      // in with -- while the website's own buyers, who DO have a password, come
      // through with email_verified false.
      const setupFlag =
        typeof window !== "undefined" &&
        new URLSearchParams(window.location.search).get("setup") === "1"
      const needsPassword = setupFlag || metadata.needs_password === true

      if (needsPassword) {
        setIsExistingUser(false)
        setPageState("set-password")
      } else {
        setIsExistingUser(true)
        setPageState("confirm-join")
      }
    }

    handleInviteToken()

    return () => {
      cleanupRef.current?.()
      cleanupRef.current = null
    }
  }, [])

  const acceptInvite = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // The invite id arrives as ?invite=<id>, set by invite-squad-member as the
    // redirect target. GoTrue silently DISCARDS user_metadata when it re-sends
    // to an already-existing user, so metadata is structurally unreliable -- a
    // second squad's invite would carry the first squad's ids. Read the query
    // string directly rather than via useSearchParams(), which would force this
    // page into a Suspense boundary to prerender. Metadata stays as a fallback
    // for links issued before ?invite= existed.
    const inviteIdFromUrl =
      typeof window !== "undefined"
        ? (new URLSearchParams(window.location.search).get("invite") ?? "")
        : ""
    const effectiveInviteId = inviteIdFromUrl || inviteId

    if (!effectiveInviteId) {
      throw new Error(
        "This invite link is missing its invitation reference. Ask your squad admin to send a fresh one.",
      )
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/accept-squad-invite`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        // invite_id only. The edge function derives the caller from the verified
        // JWT and the squad from the invite row, so user_id and squad_id were
        // both redundant -- and trusting them was how any authenticated caller
        // could join any active squad.
        body: JSON.stringify({ invite_id: effectiveInviteId }),
      },
    )

    const result = await response.json().catch(() => ({}))

    if (!response.ok) {
      // This used to `return response.json()` unconditionally, so BOTH callers
      // then showed the full success screen to someone who had not been added
      // to any squad.
      console.error("Accept invite failed:", response.status, result)
      throw new Error(
        result?.error ||
          "We couldn't add you to the squad. Ask your squad admin to send a fresh invitation.",
      )
    }

    return result
  }

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (password.length < 8) {
      setError("Password must be at least 8 characters.")
      return
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.")
      return
    }
    setPageState("processing")
    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password,
        data: { needs_password: false },
      })
      if (updateError) {
        setError("Couldn't set password: " + updateError.message)
        setPageState("set-password")
        return
      }
      const result = await acceptInvite()
      if (result?.squad_name) setSquadName(result.squad_name)
      setPageState("success")
      setTimeout(() => router.push("/account"), 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something unexpected happened. Try again.")
      // The password was already set, so returning them to that form would
      // invite a pointless resubmit.
      setPageState("error")
    }
  }

  const handleJoinSquad = async () => {
    setPageState("processing")
    try {
      const result = await acceptInvite()
      if (result?.squad_name) setSquadName(result.squad_name)
      setPageState("success")
      setTimeout(() => router.push("/account"), 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something unexpected happened. Try again.")
      setPageState("error")
    }
  }

  return (
    <AuthShell
      nav={
        <Link href="/" className={navLink}>
          Back to site
        </Link>
      }
    >
          {pageState === "loading" && (
            <div className="text-center">
              <Loader2 className="h-6 w-6 animate-spin text-ink mx-auto" />
            </div>
          )}

          {pageState === "set-password" && (
            <>
              <h1 className="text-[34px] lg:text-[40px] font-semibold tracking-tight text-ink leading-[1.05] mb-3 text-balance">
                Joining {squadName}.
              </h1>
              <p className="text-[17px] text-ink-muted mb-8">Set a password and you're in.</p>

              {error && (
                <div className="bg-paper-tint border border-rule-strong rounded-field p-3.5 mb-5 flex items-start gap-2.5">
                  <AlertCircle className="h-4 w-4 text-ink mt-0.5 shrink-0" />
                  <p className="text-[15px] text-ink">{error}</p>
                </div>
              )}

              <form onSubmit={handleSetPassword} className="space-y-5">
                <div>
                  <label className={label}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className={`${field} bg-paper-tint text-ink-muted`}
                  />
                </div>

                <div>
                  <label className={label}>
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 8 characters"
                      required
                      minLength={8}
                      className={`${field} pr-14`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-0.5 top-1/2 -translate-y-1/2 inline-flex h-11 w-11 items-center justify-center rounded-full text-ink-muted hover:text-ink focus-hi-vis"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className={label}>
                    Confirm password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Same password again"
                      required
                      minLength={8}
                      className={`${field} pr-14`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-0.5 top-1/2 -translate-y-1/2 inline-flex h-11 w-11 items-center justify-center rounded-full text-ink-muted hover:text-ink focus-hi-vis"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className={`${btn} w-full`}
                >
                  Create account &amp; join squad
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </form>
            </>
          )}

          {pageState === "confirm-join" && (
            <div className="text-center">
              <h1 className="text-[34px] lg:text-[40px] font-semibold tracking-tight text-ink leading-[1.05] mb-3 text-balance">
                Join {squadName}?
              </h1>
              <p className="text-[17px] text-ink-muted mb-8">
                Signed in as{" "}
                <span className="text-ink font-medium break-all">{email}</span>.
              </p>

              {error && (
                <div className="bg-paper-tint border border-rule-strong rounded-field p-3.5 mb-5 flex items-start gap-2.5 text-left">
                  <AlertCircle className="h-4 w-4 text-ink mt-0.5 shrink-0" />
                  <p className="text-[15px] text-ink">{error}</p>
                </div>
              )}

              <button
                onClick={handleJoinSquad}
                className={`${btn} w-full`}
              >
                Join {squadName}
                <ArrowUpRight className="h-4 w-4" />
              </button>

              {/* Escape hatch for invites issued before ?setup=1 existed, and
                  for anyone who never set a password of their own. */}
              <button
                type="button"
                onClick={() => setPageState("set-password")}
                className={`${textLink} mt-3 underline`}
              >
                I don't have a password yet -- set one
              </button>
            </div>
          )}

          {pageState === "processing" && (
            <div className="text-center">
              <Loader2 className="h-6 w-6 animate-spin text-ink mx-auto" />
            </div>
          )}

          {pageState === "success" && (
            <div className="text-center">
              <CheckCircle className="h-8 w-8 text-success mx-auto mb-5" aria-hidden />
              <h1 className="text-[32px] font-semibold tracking-tight text-ink mb-3 leading-[1.1] text-balance">
                Welcome to the squad.
              </h1>
              <p className="text-[17px] text-ink-muted">
                {isExistingUser
                  ? "You can use NarrateEMS with your existing login. Taking you to your account…"
                  : "Open the Chrome extension and log in with your new password. Taking you to your account…"}
              </p>
            </div>
          )}

          {pageState === "error" && (
            <div className="text-center">
              <XCircle className="h-8 w-8 text-ink mx-auto mb-5" aria-hidden />
              <h1 className="text-[32px] font-semibold tracking-tight text-ink mb-3 leading-[1.1] text-balance">
                Couldn't process that invite.
              </h1>
              <p className="text-[17px] text-ink-muted mb-8">{error}</p>
              <button
                onClick={() => router.push("/")}
                className={`${outlineBtn} w-full`}
              >
                Back to home
              </button>
            </div>
          )}
    </AuthShell>
  )
}
