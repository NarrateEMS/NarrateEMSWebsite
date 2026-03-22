"use client"

export const dynamic = 'force-dynamic'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Lock, CheckCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"

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
    // Supabase client detects the recovery token from the URL hash automatically
    // via detectSessionInUrl: true in the client config.
    // Listen for the PASSWORD_RECOVERY event to know the session is ready.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setSessionReady(true)
        setCheckingSession(false)
      }
    })

    // Also check if there's already a session (in case event fired before listener)
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setSessionReady(true)
      }
      setCheckingSession(false)
    }

    // Give Supabase a moment to process the URL hash
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
      setError("Password must be at least 6 characters")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password })
      if (updateError) throw updateError
      setSuccess(true)
    } catch (err: any) {
      setError(err.message || "Failed to update password")
    } finally {
      setLoading(false)
    }
  }

  // Loading state while checking for recovery session
  if (checkingSession) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center">
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      {/* Gradient Orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px]" />

      <div className="relative z-10 w-full max-w-md mx-auto px-6">
        {/* Back to Home */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/NarrateEMS_Logo_Transparent_White-edQRVIFGqJxTAPGBJm2kUfBX3Lctuf.png"
              alt="NarrateEMS Logo"
              className="h-10 w-auto mx-auto mb-6"
            />

            {success ? (
              <>
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-400" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">Password Updated</h1>
                <p className="text-white/50 mb-6">Your password has been successfully reset.</p>
                <Button
                  onClick={() => router.push("/login")}
                  className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 rounded-lg"
                >
                  Go to Login
                </Button>
              </>
            ) : !sessionReady ? (
              <>
                <h1 className="text-2xl font-bold text-white mb-2">Invalid or Expired Link</h1>
                <p className="text-white/50 mb-6">
                  This password reset link is invalid or has expired. Please request a new one.
                </p>
                <Button
                  onClick={() => router.push("/login")}
                  variant="outline"
                  className="w-full border-white/10 text-white hover:bg-white/10"
                >
                  Back to Login
                </Button>
              </>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-white mb-2">Reset Password</h1>
                <p className="text-white/50">Enter your new password below</p>
              </>
            )}
          </div>

          {/* Form - only show when session is ready and not yet successful */}
          {sessionReady && !success && (
            <>
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
                  <p className="text-red-400 text-sm text-center">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-white/70 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/30" />
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-teal-500 focus:ring-teal-500/20"
                      required
                      minLength={6}
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-white/70 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/30" />
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-teal-500 focus:ring-teal-500/20"
                      required
                      minLength={6}
                      disabled={loading}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 rounded-lg transition-all duration-300"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      Updating...
                    </>
                  ) : (
                    "Update Password"
                  )}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
