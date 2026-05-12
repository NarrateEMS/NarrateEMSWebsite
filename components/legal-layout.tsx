"use client"

import type React from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Wordmark } from "@/components/wordmark"

type LegalLayoutProps = {
  title: string
  meta?: string
  children: React.ReactNode
}

/**
 * Brand-consistent shell for static legal pages.
 * Applies serif H1, paper background, and an editorial prose treatment to the
 * inner article content via the `.legal-prose` class defined in globals.css.
 */
export function LegalLayout({ title, meta, children }: LegalLayoutProps) {
  return (
    <div className="min-h-screen bg-paper text-ink antialiased flex flex-col">
      <header className="border-b border-rule bg-paper/90 backdrop-blur-md sticky top-0 z-30">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 h-16 flex items-center justify-between">
          <Wordmark href="/" size="md" />
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to home
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <div className="mx-auto max-w-[820px] px-6 lg:px-10 py-16 lg:py-24">
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft mb-6">
            ↳ Legal
          </div>
          <h1 className="font-serif text-5xl lg:text-7xl leading-[0.98] tracking-tight text-ink text-balance">
            {title}
          </h1>
          {meta && (
            <p className="mt-6 font-mono text-xs uppercase tracking-[0.16em] text-ink-soft">
              {meta}
            </p>
          )}
          <div className="mt-12 h-px bg-rule-strong" />
          <article className="legal-prose">{children}</article>
        </div>
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
            <Link href="/sla" className="hover:text-ink transition-colors">
              SLA
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
