"use client"

export const dynamic = 'force-dynamic'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Mail, Lock, ArrowLeft, Download, AlertCircle } from "lucide-react"
import Link from "next/link"

const CHROME_EXTENSION_URL = "https://chromewebstore.google.com/detail/narrateems-ai-medic-voice/nokdpnigpfafepjbdinggckgcdekdjkm"

type PageState = "login" | "loading" | "no-account"

export default function LoginPage() {
  const router = useRouter()
  const [pageState, setPageState] = useState<PageState>("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setPageState("loading")

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        // Check if it's an invalid credentials error (user doesn't exist or wrong password)
        if (authError.message.includes("Invalid login credentials")) {
          // Check if user exists by trying to see if it's a password issue vs no account
          setPageState("no-account")
          return
        }
        setError(authError.message)
        setPageState("login")
        return
      }

      if (data.session) {
        router.push("/account")
      }
    } catch (err) {
      console.error("Login error:", err)
      setError("An unexpected error occurred. Please try again.")
      setPageState("login")
    }
  }

  // No Account Screen - Direct to Chrome Extension
  if (pageState === "no-account") {
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
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-red-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px]" />

        <div className="relative z-10 w-full max-w-md mx-auto px-6 text-center">
          {/* Logo */}
          <Link href="/" className="inline-block mb-8">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/NarrateEMS_Logo_Transparent_White-edQRVIFGqJxTAPGBJm2kUfBX3Lctuf.png"
              alt="NarrateEMS Logo"
              className="h-12 w-auto mx-auto"
            />
          </Link>

          {/* Alert Icon */}
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="h-10 w-10 text-red-400" />
          </div>

          <h1 className="text-3xl font-bold text-white mb-4">
            No Account Found
          </h1>
          
          <p className="text-white/60 text-lg mb-8 leading-relaxed">
            We couldn't find an account with those credentials. To get started with NarrateEMS, download our Chrome extension and create your account there.
          </p>

          {/* Download Extension Button */}
          <a
            href={CHROME_EXTENSION_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 text-lg font-semibold rounded-full hover:bg-white/90 transition-all duration-300 hover:scale-105 mb-6"
          >
            <Download className="h-5 w-5" />
            Get Chrome Extension
          </a>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => {
                setPageState("login")
                setError(null)
              }}
              className="text-white/60 hover:text-white transition-colors text-sm"
            >
              ← Try again with different credentials
            </button>
            
            <Link
              href="/"
              className="text-teal-400 hover:text-teal-300 transition-colors text-sm"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Login Form
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

        {/* Login Card */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/NarrateEMS_Logo_Transparent_White-edQRVIFGqJxTAPGBJm2kUfBX3Lctuf.png"
              alt="NarrateEMS Logo"
              className="h-10 w-auto mx-auto mb-6"
            />
            <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-white/50">Sign in to your account</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
              <p className="text-red-400 text-sm text-center">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white/70 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/30" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-teal-500 focus:ring-teal-500/20"
                  required
                  disabled={pageState === "loading"}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white/70 mb-2">
                Password
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
                  disabled={pageState === "loading"}
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={pageState === "loading"}
              className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 rounded-lg transition-all duration-300"
            >
              {pageState === "loading" ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Signing in...
                </>
              ) : (
                "Log In"
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-transparent text-white/40">Don't have an account?</span>
            </div>
          </div>

          {/* Get Extension CTA */}
          <a
            href={CHROME_EXTENSION_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium py-3 rounded-lg transition-all duration-300"
          >
            <Download className="h-4 w-4" />
            Get Started with Chrome Extension
          </a>
        </div>
      </div>
    </div>
  )
}

