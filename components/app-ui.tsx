import Link from "next/link"
import { Wordmark } from "@/components/wordmark"
import { cn } from "@/lib/utils"
import { primaryBtn } from "@/app/home/shared"

export const btn = cn(primaryBtn, "min-h-11 hover:bg-hi-vis-deep disabled:opacity-60 disabled:cursor-not-allowed")
export const outlineBtn =
  "inline-flex items-center justify-center gap-2 rounded-full border border-ink text-ink px-6 py-3 min-h-11 text-[17px] font-semibold hover:bg-ink hover:text-paper active:translate-y-px transition-colors focus-hi-vis disabled:opacity-60"
export const dangerBtn =
  "inline-flex items-center justify-center gap-2 rounded-full border border-danger text-danger px-5 min-h-11 text-[15px] font-semibold hover:bg-danger hover:text-paper transition-colors focus-hi-vis disabled:opacity-60"
export const textLink =
  "inline-flex items-center justify-center gap-1.5 min-h-11 text-[15px] font-medium text-ink underline-offset-4 hover:underline focus-hi-vis"
export const field =
  "w-full min-h-11 px-4 py-3 bg-surface border border-rule-strong rounded-field text-[17px] text-ink placeholder:text-ink-soft focus:outline-none focus:border-ink focus-hi-vis transition-colors disabled:opacity-60"
export const label = "block text-[15px] font-medium text-ink mb-2"
export const navLink =
  "inline-flex items-center gap-1.5 min-h-11 text-[17px] text-paper hover:underline underline-offset-4 focus-hi-vis"

export function AppNav({ children }: { children?: React.ReactNode }) {
  return (
    <nav className="sticky top-0 z-40 bg-ink text-paper">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-4 px-6 lg:px-10">
        <Wordmark href="/" size="md" variant="paper" />
        <div className="flex items-center gap-5">{children}</div>
      </div>
    </nav>
  )
}

export function AppFooter({ dark = false, sla = false }: { dark?: boolean; sla?: boolean }) {
  return (
    <footer className={dark ? "bg-ink text-paper" : "border-t border-rule bg-paper text-ink-muted"}>
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-4 flex flex-wrap items-center justify-between gap-x-6 text-[15px]">
        <span>© 2026 NarrateEMS</span>
        <div className="flex items-center gap-5">
          <Link href="/privacy-policy" className="inline-flex items-center min-h-11 hover:underline underline-offset-4 focus-hi-vis">
            Privacy
          </Link>
          <Link href="/terms-of-service" className="inline-flex items-center min-h-11 hover:underline underline-offset-4 focus-hi-vis">
            Terms
          </Link>
          {sla && (
            <Link href="/sla" className="inline-flex items-center min-h-11 hover:underline underline-offset-4 focus-hi-vis">
              SLA
            </Link>
          )}
        </div>
      </div>
    </footer>
  )
}

export function AuthShell({ nav, children }: { nav?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-ink text-ink antialiased flex flex-col">
      <AppNav>{nav}</AppNav>
      <main className="story-stage flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:py-20">
        <div className="w-full max-w-[480px] rounded-card bg-paper p-6 sm:p-10">{children}</div>
      </main>
      <AppFooter dark />
    </div>
  )
}
