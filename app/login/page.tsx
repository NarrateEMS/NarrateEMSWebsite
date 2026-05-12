"use client"

export const dynamic = "force-dynamic"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { Wordmark } from "@/components/wordmark"
import {
  Loader2,
  ArrowLeft,
  ArrowUpRight,
  AlertCircle,
  Mail,
  Lock,
  Download,
} from "lucide-react"

const CHROME_EXTENSION_URL =
  "https://chromewebstore.google.com/detail/narrateems-ai-medic-voice/nokdpnigpfafepjbdinggckgcdekdjkm"

type PageState = "login" | "loading" | "no-account" | "wrong-password" | "pending-invite"

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
        if (authError.message.includes("Invalid login credentials")) {
          try {
            const checkResponse = await fetch(
              `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/check-email-exists`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
                },
                body: JSON.stringify({ email: email.trim() }),
              },
            )
            const checkResult = await checkResponse.json()
            if (checkResult.exists && checkResult.hasPendingInvite) {
              setPageState("pending-invite")
            } else if (checkResult.exists) {
              setPageState("wrong-password")
            } else if (checkResult.hasPendingInvite) {
              setPageState("pending-invite")
            } else {
              setPageState("no-account")
            }
          } catch (checkErr) {
            console.error("Error checking email:", checkErr)
            setError("Invalid email or password. Please try again.")
            setPageState("login")
          }
          return
        }
        setError(authError.message)
        setPageState("login")
        return
      }

      if (data.session) router.push("/account")
    } catch (err) {
      console.error("Login error:", err)
      setError("An unexpected error occurred. Please try again.")
      setPageState("login")
    }
  }

  // Shared shell — paper background, decorative side rail
  const Shell = ({ children }: { children: React.ReactNode }) => (
    <div className="min-h-screen bg-paper text-ink antialiased flex flex-col">
      <header className="border-b border-rule">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 h-16 flex items-center justify-between">
          <Wordmark href="/" size="md" />
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to site
          </Link>
        </div>
      </header>
      <main className="flex-1 grid lg:grid-cols-[1fr_minmax(0,520px)_1fr] items-stretch">
        {/* Left rail — editorial detail */}
        <aside className="hidden lg:flex flex-col justify-between border-r border-rule bg-paper-tint p-12">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft mb-8">
              ↳ Welcome back
            </div>
            <h2 className="font-serif text-5xl leading-[1] text-ink text-balance">
              Go back to <span className="italic">running calls,</span>
              <br />
              not running reports.
            </h2>
            <p className="mt-6 text-ink-muted leading-relaxed max-w-sm">
              Your account, your squad, your charts. All HIPAA-encrypted and
              waiting where you left them.
            </p>
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft space-y-2">
            <div className="flex items-center gap-2">
              <Lock className="h-3 w-3" /> Encrypted end to end
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block h-px w-3 bg-ink-soft/60" />
              Trusted by Kendall Park First Aid Squad
            </div>
          </div>
        </aside>

        {/* Center — content */}
        <div className="flex items-center justify-center px-6 py-16 lg:py-20">
          <div className="w-full max-w-[440px]">{children}</div>
        </div>

        {/* Right rail — paper grain */}
        <aside className="hidden lg:block border-l border-rule bg-grain" />
      </main>
      <footer className="border-t border-rule">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 h-14 flex items-center justify-between text-xs text-ink-soft">
          <span className="font-mono uppercase tracking-[0.16em]">© 2026 NarrateEMS</span>
          <div className="flex items-center gap-4">
            <Link href="/privacy-policy" className="hover:text-ink transition-colors">
              Privacy
            </Link>
            <Link href="/terms-of-service" className="hover:text-ink transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )

  // ----- State: WRONG PASSWORD -----
  if (pageState === "wrong-password") {
    return (
      <Shell>
        <div className="text-center">
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft mb-6">
            ↳ Account found
          </div>
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-md bg-paper-tint border border-rule mb-6">
            <Lock className="h-6 w-6 text-ink" />
          </div>
          <h1 className="font-serif text-4xl text-ink mb-3 leading-tight">
            That's not <span className="italic">your password.</span>
          </h1>
          <p className="text-ink-muted leading-relaxed max-w-sm mx-auto">
            We found an account for{" "}
            <span className="text-ink font-medium break-all">{email}</span>, but the
            password didn't match.
          </p>
          <div className="mt-8 flex flex-col gap-3">
            <button
              onClick={() => {
                setPageState("login")
                setError(null)
                setPassword("")
              }}
              className="w-full inline-flex items-center justify-center gap-2 bg-hi-vis text-hi-vis-ink py-3.5 text-sm font-semibold rounded-md hover:bg-hi-vis-deep hover:text-paper transition-colors focus-hi-vis"
            >
              Try again
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
            <Link
              href="/reset-password"
              className="text-sm text-ink-muted hover:text-ink transition-colors"
            >
              Reset password →
            </Link>
          </div>
        </div>
      </Shell>
    )
  }

  // ----- State: PENDING INVITE -----
  if (pageState === "pending-invite") {
    return (
      <Shell>
        <div className="text-center">
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft mb-6">
            ↳ Invite waiting
          </div>
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-md bg-paper-tint border border-rule mb-6">
            <Mail className="h-6 w-6 text-ink" />
          </div>
          <h1 className="font-serif text-4xl text-ink mb-3 leading-tight">
            Check your <span className="italic">inbox.</span>
          </h1>
          <p className="text-ink-muted leading-relaxed max-w-sm mx-auto">
            A squad invitation was sent to{" "}
            <span className="text-ink font-medium break-all">{email}</span>. Open the
            invite link from NarrateEMS to set your password and join your squad.
          </p>
          <div className="mt-8 flex flex-col gap-3">
            <button
              onClick={() => {
                setPageState("login")
                setError(null)
                setPassword("")
              }}
              className="text-sm text-ink-muted hover:text-ink transition-colors"
            >
              ← Use different credentials
            </button>
          </div>
        </div>
      </Shell>
    )
  }

  // ----- State: NO ACCOUNT -----
  if (pageState === "no-account") {
    return (
      <Shell>
        <div className="text-center">
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft mb-6">
            ↳ No account yet
          </div>
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-md bg-paper-tint border border-rule mb-6">
            <AlertCircle className="h-6 w-6 text-ink" />
          </div>
          <h1 className="font-serif text-4xl text-ink mb-3 leading-tight">
            We don't know <span className="italic">{email.split("@")[0] || "you"}</span> yet.
          </h1>
          <p className="text-ink-muted leading-relaxed max-w-sm mx-auto">
            No account on file for that email. Install the Chrome extension and your
            account is ready in under a minute.
          </p>
          <div className="mt-8 flex flex-col gap-3">
            <a
              href={CHROME_EXTENSION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 bg-hi-vis text-hi-vis-ink py-3.5 text-sm font-semibold rounded-md hover:bg-hi-vis-deep hover:text-paper transition-colors focus-hi-vis"
            >
              <Download className="h-4 w-4" />
              Install Chrome extension
            </a>
            <button
              onClick={() => {
                setPageState("login")
                setError(null)
              }}
              className="text-sm text-ink-muted hover:text-ink transition-colors"
            >
              ← Use different credentials
            </button>
          </div>
        </div>
      </Shell>
    )
  }

  // ----- State: LOGIN -----
  return (
    <Shell>
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft mb-6">
        ↳ Log in
      </div>
      <h1 className="font-serif text-4xl lg:text-5xl text-ink leading-[1.05] mb-3">
        Welcome back, <span className="italic">medic.</span>
      </h1>
      <p className="text-ink-muted leading-relaxed mb-8">
        Sign in to manage your squad, plan, and charts.
      </p>

      {error && (
        <div className="bg-paper-tint border border-rule-strong rounded-md p-3.5 mb-5 flex items-start gap-2.5">
          <AlertCircle className="h-4 w-4 text-ink mt-0.5 shrink-0" />
          <p className="text-sm text-ink-muted">{error}</p>
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label
            htmlFor="email"
            className="block font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft mb-2"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@yourservice.org"
            disabled={pageState === "loading"}
            required
            className="w-full px-4 py-3.5 bg-surface border border-rule rounded-md text-ink placeholder:text-ink-soft/60 focus:outline-none focus:border-ink transition-colors disabled:opacity-60"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="password"
              className="block font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft"
            >
              Password
            </label>
            <Link
              href="/reset-password"
              className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-soft hover:text-ink transition-colors"
            >
              Forgot?
            </Link>
          </div>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            disabled={pageState === "loading"}
            required
            className="w-full px-4 py-3.5 bg-surface border border-rule rounded-md text-ink placeholder:text-ink-soft/60 focus:outline-none focus:border-ink transition-colors disabled:opacity-60"
          />
        </div>

        <button
          type="submit"
          disabled={pageState === "loading"}
          className="w-full inline-flex items-center justify-center gap-2 bg-hi-vis text-hi-vis-ink py-3.5 text-base font-semibold rounded-md hover:bg-hi-vis-deep hover:text-paper transition-colors focus-hi-vis disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {pageState === "loading" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Signing in…
            </>
          ) : (
            <>
              Log in <ArrowUpRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-rule"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="px-4 bg-paper font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft">
            No account yet?
          </span>
        </div>
      </div>

      <a
        href={CHROME_EXTENSION_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full inline-flex items-center justify-center gap-2 bg-paper border border-ink text-ink py-3.5 text-sm font-semibold rounded-md hover:bg-ink hover:text-paper transition-colors"
      >
        <Download className="h-4 w-4" />
        Install the Chrome extension
      </a>
    </Shell>
  )
}
