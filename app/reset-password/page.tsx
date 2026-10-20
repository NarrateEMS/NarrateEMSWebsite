"use client"

export const dynamic = "force-dynamic"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { AuthShell, btn, outlineBtn, field, label, navLink } from "@/components/app-ui"
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
          <div className="text-[17px] text-ink-muted">
            Verifying reset link
          </div>
        </div>
      </div>
    )
  }

  return (
    <AuthShell
      nav={
        <Link href="/login" className={navLink}>
          <ArrowLeft className="h-4 w-4" />
          Back to login
        </Link>
      }
    >
          {success ? (
            <div className="text-center">
              <CheckCircle className="h-8 w-8 text-success mx-auto mb-5" aria-hidden />
              <h1 className="text-[32px] font-semibold tracking-tight text-ink mb-3 leading-[1.1] text-balance">
                New password set.
              </h1>
              <p className="text-[17px] text-ink-muted mb-8">
                Use it the next time you sign in.
              </p>
              <button
                onClick={() => router.push("/login")}
                className={`${btn} w-full`}
              >
                Go to login
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : !sessionReady ? (
            <div className="text-center">
              <AlertCircle className="h-8 w-8 text-ink mx-auto mb-5" aria-hidden />
              <h1 className="text-[32px] font-semibold tracking-tight text-ink mb-3 leading-[1.1] text-balance">
                This link won't work.
              </h1>
              <p className="text-[17px] text-ink-muted mb-8">
                Reset links are good for an hour. Request a fresh one and try again.
              </p>
              <button
                onClick={() => router.push("/login")}
                className={`${outlineBtn} w-full`}
              >
                Back to login
              </button>
            </div>
          ) : (
            <>
              <h1 className="text-[34px] lg:text-[40px] font-semibold tracking-tight text-ink leading-[1.05] mb-3 text-balance">
                Pick a new password.
              </h1>
              <p className="text-[17px] text-ink-muted mb-8">At least 6 characters.</p>

              {error && (
                <div className="bg-paper-tint border border-rule-strong rounded-field p-3.5 mb-5 flex items-start gap-2.5">
                  <AlertCircle className="h-4 w-4 text-ink mt-0.5 shrink-0" />
                  <p className="text-[15px] text-ink">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="password"
                    className={label}
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
                    className={field}
                  />
                </div>

                <div>
                  <label
                    htmlFor="confirm-password"
                    className={label}
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
                    className={field}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`${btn} w-full`}
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
    </AuthShell>
  )
}
