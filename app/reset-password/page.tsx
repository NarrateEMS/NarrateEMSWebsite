"use client"

export const dynamic = "force-dynamic"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { Wordmark } from "@/components/wordmark"
import { Loader2, CheckCircle, ArrowLeft, ArrowUpRight, AlertCircle } from "lucide-react"

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sessionReady, setSessionReady] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setSessionReady(true)
        setCheckingSession(false)
      }
    })

    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (session) setSessionReady(true)
      setCheckingSession(false)
    }
    const timeout = setTimeout(checkSession, 1000)

    return () => {
      subscription.unsubscribe()
      clearTimeout(timeout)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (password.length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.")
      return
    }
    setLoading(true)
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password })
      if (updateError) throw updateError
      setSuccess(true)
    } catch (err: any) {
      setError(err.message || "Failed to update password.")
    } finally {
      setLoading(false)
    }
  }

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-6 w-6 animate-spin text-ink" />
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft">
            Verifying reset link
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-paper text-ink antialiased flex flex-col">
      <header className="border-b border-rule">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 h-16 flex items-center justify-between">
          <Wordmark href="/" size="md" />
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to login
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-16 lg:py-20">
        <div className="w-full max-w-[440px]">
          {success ? (
            <div className="text-center">
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft mb-6">
                ↳ Done
              </div>
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-md bg-paper-tint border border-rule mb-6">
                <CheckCircle className="h-6 w-6 text-success" />
              </div>
              <h1 className="font-serif text-4xl text-ink mb-3 leading-tight">
                New password <span className="italic">set.</span>
              </h1>
              <p className="text-ink-muted mb-8">
                Use it the next time you sign in.
              </p>
              <button
                onClick={() => router.push("/login")}
                className="w-full inline-flex items-center justify-center gap-2 bg-hi-vis text-hi-vis-ink py-3.5 text-sm font-semibold rounded-md hover:bg-hi-vis-deep hover:text-paper transition-colors focus-hi-vis"
              >
                Go to login
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : !sessionReady ? (
            <div className="text-center">
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft mb-6">
                ↳ Link expired
              </div>
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-md bg-paper-tint border border-rule mb-6">
                <AlertCircle className="h-6 w-6 text-ink" />
              </div>
              <h1 className="font-serif text-4xl text-ink mb-3 leading-tight">
                This link <span className="italic">won't work.</span>
              </h1>
              <p className="text-ink-muted mb-8">
                Reset links are good for an hour. Request a fresh one and try again.
              </p>
              <button
                onClick={() => router.push("/login")}
                className="w-full inline-flex items-center justify-center gap-2 bg-paper border border-ink text-ink py-3.5 text-sm font-semibold rounded-md hover:bg-ink hover:text-paper transition-colors"
              >
                Back to login
              </button>
            </div>
          ) : (
            <>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft mb-6">
                ↳ Reset password
              </div>
              <h1 className="font-serif text-4xl lg:text-5xl text-ink leading-[1.05] mb-3">
                Pick a new <span className="italic">password.</span>
              </h1>
              <p className="text-ink-muted mb-8">At least 6 characters.</p>

              {error && (
                <div className="bg-paper-tint border border-rule-strong rounded-md p-3.5 mb-5 flex items-start gap-2.5">
                  <AlertCircle className="h-4 w-4 text-ink mt-0.5 shrink-0" />
                  <p className="text-sm text-ink-muted">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="password"
                    className="block font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft mb-2"
                  >
                    New password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    disabled={loading}
                    className="w-full px-4 py-3.5 bg-surface border border-rule rounded-md text-ink placeholder:text-ink-soft/60 focus:outline-none focus:border-ink transition-colors disabled:opacity-60"
                  />
                </div>

                <div>
                  <label
                    htmlFor="confirm-password"
                    className="block font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft mb-2"
                  >
                    Confirm new password
                  </label>
                  <input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    disabled={loading}
                    className="w-full px-4 py-3.5 bg-surface border border-rule rounded-md text-ink placeholder:text-ink-soft/60 focus:outline-none focus:border-ink transition-colors disabled:opacity-60"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 bg-hi-vis text-hi-vis-ink py-3.5 text-base font-semibold rounded-md hover:bg-hi-vis-deep hover:text-paper transition-colors focus-hi-vis disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Updating…
                    </>
                  ) : (
                    <>
                      Update password <ArrowUpRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            </>
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
