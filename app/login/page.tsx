"use client"

export const dynamic = "force-dynamic"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { AuthShell, btn, outlineBtn, textLink, field, label, navLink } from "@/components/app-ui"
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

type PageState =
  | "login"
  | "loading"
  | "no-account"
  | "wrong-password"
  | "pending-invite"
  | "unconfirmed"

// Must stay at module scope: defined inside the component it is a new type on
// every render, so React unmounts the form and the focused input loses focus
// after a single keystroke.
const Shell = ({ children }: { children: React.ReactNode }) => (
  <AuthShell
    nav={
      <Link href="/" className={navLink}>
        <ArrowLeft className="h-4 w-4" />
        Back to site
      </Link>
    }
  >
    {children}
  </AuthShell>
)

export default function LoginPage() {
  const router = useRouter()
  const [pageState, setPageState] = useState<PageState>("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [resendState, setResendState] = useState<"idle" | "sending" | "sent" | "failed">(
    "idle",
  )

  const resendConfirmation = async () => {
    setResendState("sending")
    const { error: resendError } = await supabase.auth.resend({
      type: "signup",
      email: email.trim(),
    })
    setResendState(resendError ? "failed" : "sent")
  }

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
        // An account created in the extension stays unconfirmed until its link is
        // clicked, and GoTrue refuses the password grant until then. Printing the
        // raw "Email not confirmed" left people with nothing to click, so offer
        // the resend here instead.
        if (
          (authError as { code?: string }).code === "email_not_confirmed" ||
          authError.message.toLowerCase().includes("not confirmed")
        ) {
          setResendState("idle")
          setPageState("unconfirmed")
          return
        }

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

  // ----- State: WRONG PASSWORD -----
  if (pageState === "wrong-password") {
    return (
      <Shell>
        <div className="text-center">
          <Lock className="h-8 w-8 text-ink mx-auto mb-5" aria-hidden />
          <h1 className="text-[32px] font-semibold tracking-tight text-ink mb-3 leading-[1.1] text-balance">
            That's not your password.
          </h1>
          <p className="text-[17px] text-ink-muted leading-relaxed max-w-sm mx-auto">
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
              className={`${btn} w-full`}
            >
              Try again
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
            <Link
              href="/reset-password"
              className={textLink}
            >
              Reset password →
            </Link>
          </div>
        </div>
      </Shell>
    )
  }

  // ----- State: UNCONFIRMED EMAIL -----
  if (pageState === "unconfirmed") {
    return (
      <Shell>
        <div className="text-center">
          <Mail className="h-8 w-8 text-ink mx-auto mb-5" aria-hidden />
          <h1 className="text-[32px] font-semibold tracking-tight text-ink mb-3 leading-[1.1] text-balance">
            Confirm your email.
          </h1>
          <p className="text-[17px] text-ink-muted leading-relaxed max-w-sm mx-auto">
            <span className="text-ink font-medium break-all">{email}</span> was
            registered but never confirmed, so we can't sign you in yet. Open the
            confirmation link we sent, then come back here.
          </p>
          <div className="mt-8 flex flex-col gap-3">
            <button
              onClick={resendConfirmation}
              disabled={resendState === "sending" || resendState === "sent"}
              className={`${btn} w-full`}
            >
              {resendState === "sending" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending
                </>
              ) : resendState === "sent" ? (
                "Confirmation sent"
              ) : (
                <>
                  Resend confirmation email
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
            {resendState === "failed" && (
              <p className="text-[15px] text-ink-muted">
                We couldn't send it right now. Wait a minute and try again, or
                contact support.
              </p>
            )}
            <button
              onClick={() => {
                setPageState("login")
                setError(null)
                setPassword("")
              }}
              className={textLink}
            >
              ← Use different credentials
            </button>
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
          <Mail className="h-8 w-8 text-ink mx-auto mb-5" aria-hidden />
          <h1 className="text-[32px] font-semibold tracking-tight text-ink mb-3 leading-[1.1] text-balance">
            Check your inbox.
          </h1>
          <p className="text-[17px] text-ink-muted leading-relaxed max-w-sm mx-auto">
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
              className={textLink}
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
          <AlertCircle className="h-8 w-8 text-ink mx-auto mb-5" aria-hidden />
          <h1 className="text-[32px] font-semibold tracking-tight text-ink mb-3 leading-[1.1] text-balance">
            We don't know {email.split("@")[0] || "you"} yet.
          </h1>
          <p className="text-[17px] text-ink-muted leading-relaxed max-w-sm mx-auto">
            No account on file for that email. Install the Chrome extension and your
            account is ready in under a minute.
          </p>
          <div className="mt-8 flex flex-col gap-3">
            <a
              href={CHROME_EXTENSION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`${btn} w-full`}
            >
              <Download className="h-4 w-4" />
              Install Chrome extension
            </a>
            <button
              onClick={() => {
                setPageState("login")
                setError(null)
              }}
              className={textLink}
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
      <h1 className="text-[34px] lg:text-[40px] font-semibold tracking-tight text-ink leading-[1.05] mb-3 text-balance">
        Welcome back, medic.
      </h1>
      <p className="text-[17px] text-ink-muted leading-relaxed mb-8">
        Sign in to manage your squad, plan, and charts.
      </p>

      {error && (
        <div className="bg-paper-tint border border-rule-strong rounded-field p-3.5 mb-5 flex items-start gap-2.5">
          <AlertCircle className="h-4 w-4 text-ink mt-0.5 shrink-0" />
          <p className="text-[15px] text-ink">{error}</p>
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label
            htmlFor="email"
            className={label}
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
            className={field}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label
              htmlFor="password"
              className={`${label} mb-0`}
            >
              Password
            </label>
            <Link
              href="/reset-password"
              className={textLink}
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
            className={field}
          />
        </div>

        <button
          type="submit"
          disabled={pageState === "loading"}
          className={`${btn} w-full`}
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

      <p className="mt-8 mb-3 text-center text-[15px] text-ink-muted">No account yet?</p>

      <a
        href={CHROME_EXTENSION_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={`${outlineBtn} w-full`}
      >
        <Download className="h-4 w-4" />
        Install the Chrome extension
      </a>
    </Shell>
  )
}
