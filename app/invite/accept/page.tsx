"use client"

export const dynamic = "force-dynamic"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { Wordmark } from "@/components/wordmark"
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
        return () => {
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
      const hasExistingPassword = user.identities?.some(
        (i: any) => i.provider === "email" && i.identity_data?.email_verified === true,
      )
      if (hasExistingPassword) {
        setIsExistingUser(true)
        setPageState("confirm-join")
      } else {
        setIsExistingUser(false)
        setPageState("set-password")
      }
    }

    handleInviteToken()
  }, [])

  const acceptInvite = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/accept-squad-invite`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          user_id: session?.user?.id,
          squad_id: squadId,
          invite_id: inviteId,
        }),
      },
    )
    return response.json()
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
      const { error: updateError } = await supabase.auth.updateUser({ password })
      if (updateError) {
        setError("Couldn't set password: " + updateError.message)
        setPageState("set-password")
        return
      }
      await acceptInvite()
      setPageState("success")
      setTimeout(() => router.push("/account"), 2000)
    } catch (err) {
      setError("Something unexpected happened. Try again.")
      setPageState("set-password")
    }
  }

  const handleJoinSquad = async () => {
    setPageState("processing")
    try {
      await acceptInvite()
      setPageState("success")
      setTimeout(() => router.push("/account"), 2000)
    } catch (err) {
      setError("Something unexpected happened. Try again.")
      setPageState("confirm-join")
    }
  }

  return (
    <div className="min-h-screen bg-paper text-ink antialiased flex flex-col">
      <header className="border-b border-rule">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 h-16 flex items-center justify-between">
          <Wordmark href="/" size="md" />
          <Link href="/" className="text-sm text-ink-muted hover:text-ink transition-colors">
            Back to site
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-16 lg:py-20">
        <div className="w-full max-w-[480px]">
          {pageState === "loading" && (
            <div className="text-center">
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft mb-6">
                ↳ Verifying invite
              </div>
              <Loader2 className="h-6 w-6 animate-spin text-ink mx-auto" />
            </div>
          )}

          {pageState === "set-password" && (
            <>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft mb-6">
                ↳ Squad invite
              </div>
              <h1 className="font-serif text-4xl lg:text-5xl text-ink leading-[1.05] mb-3">
                Joining <span className="italic">{squadName}.</span>
              </h1>
              <p className="text-ink-muted mb-8">Set a password and you're in.</p>

              {error && (
                <div className="bg-paper-tint border border-rule-strong rounded-md p-3.5 mb-5 flex items-start gap-2.5">
                  <AlertCircle className="h-4 w-4 text-ink mt-0.5 shrink-0" />
                  <p className="text-sm text-ink-muted">{error}</p>
                </div>
              )}

              <form onSubmit={handleSetPassword} className="space-y-5">
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full px-4 py-3.5 bg-paper-tint border border-rule rounded-md text-ink-muted"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft mb-2">
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
                      className="w-full px-4 py-3.5 pr-12 bg-surface border border-rule rounded-md text-ink placeholder:text-ink-soft/60 focus:outline-none focus:border-ink"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft hover:text-ink"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft mb-2">
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
                      className="w-full px-4 py-3.5 pr-12 bg-surface border border-rule rounded-md text-ink placeholder:text-ink-soft/60 focus:outline-none focus:border-ink"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft hover:text-ink"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 bg-hi-vis text-hi-vis-ink py-3.5 text-base font-semibold rounded-md hover:bg-hi-vis-deep hover:text-paper transition-colors focus-hi-vis"
                >
                  Create account &amp; join squad
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </form>
            </>
          )}

          {pageState === "confirm-join" && (
            <div className="text-center">
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft mb-6">
                ↳ Squad invite
              </div>
              <h1 className="font-serif text-4xl lg:text-5xl text-ink leading-[1.05] mb-3">
                Join <span className="italic">{squadName}?</span>
              </h1>
              <p className="text-ink-muted mb-8">
                Signed in as{" "}
                <span className="text-ink font-medium break-all">{email}</span>.
              </p>

              {error && (
                <div className="bg-paper-tint border border-rule-strong rounded-md p-3.5 mb-5 flex items-start gap-2.5 text-left">
                  <AlertCircle className="h-4 w-4 text-ink mt-0.5 shrink-0" />
                  <p className="text-sm text-ink-muted">{error}</p>
                </div>
              )}

              <button
                onClick={handleJoinSquad}
                className="w-full inline-flex items-center justify-center gap-2 bg-hi-vis text-hi-vis-ink py-3.5 text-base font-semibold rounded-md hover:bg-hi-vis-deep hover:text-paper transition-colors focus-hi-vis"
              >
                Join {squadName}
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {pageState === "processing" && (
            <div className="text-center">
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft mb-6">
                ↳ Setting up
              </div>
              <Loader2 className="h-6 w-6 animate-spin text-ink mx-auto" />
            </div>
          )}

          {pageState === "success" && (
            <div className="text-center">
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft mb-6">
                ↳ You're in
              </div>
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-md bg-paper-tint border border-rule mb-6">
                <CheckCircle className="h-6 w-6 text-success" />
              </div>
              <h1 className="font-serif text-4xl text-ink leading-tight mb-3">
                Welcome to the <span className="italic">squad.</span>
              </h1>
              <p className="text-ink-muted">
                {isExistingUser
                  ? "You can use NarrateEMS with your existing login. Taking you to your account…"
                  : "Open the Chrome extension and log in with your new password. Taking you to your account…"}
              </p>
            </div>
          )}

          {pageState === "error" && (
            <div className="text-center">
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft mb-6">
                ↳ Something's off
              </div>
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-md bg-paper-tint border border-rule mb-6">
                <XCircle className="h-6 w-6 text-ink" />
              </div>
              <h1 className="font-serif text-4xl text-ink leading-tight mb-3">
                Couldn't process <span className="italic">that invite.</span>
              </h1>
              <p className="text-ink-muted mb-8">{error}</p>
              <button
                onClick={() => router.push("/")}
                className="w-full inline-flex items-center justify-center gap-2 bg-paper border border-ink text-ink py-3.5 text-sm font-semibold rounded-md hover:bg-ink hover:text-paper transition-colors"
              >
                Back to home
              </button>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-rule">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 h-14 flex items-center justify-between text-xs text-ink-soft">
          <span className="font-mono uppercase tracking-[0.16em]">© 2026 NarrateEMS</span>
        </div>
      </footer>
    </div>
  )
}
