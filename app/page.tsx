"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Wordmark } from "@/components/wordmark"
import {
  Mic,
  FileText,
  Mail,
  Play,
  ArrowUpRight,
  X,
  Lock,
  WifiOff,
  ShieldCheck,
  Plus,
  Minus,
  Users,
  HeartPulse,
  Smartphone,
} from "lucide-react"

export default function HomePage() {
  // Contact form
  const [formData, setFormData] = useState({ name: "", email: "", company: "", message: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Mobile nav
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Checkout modal
  const [showCheckoutModal, setShowCheckoutModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<{ type: string } | null>(null)
  const [checkoutEmail, setCheckoutEmail] = useState("")
  const [checkoutPassword, setCheckoutPassword] = useState("")
  const [checkoutError, setCheckoutError] = useState("")
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false)

  // Demo video modal
  const [showVideoModal, setShowVideoModal] = useState(false)

  // Pricing tab
  const [pricingTab, setPricingTab] = useState<"individual" | "squad">("squad")

  // FAQ open state
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const handlePlanSelect = (planType: string) => {
    setSelectedPlan({ type: planType })
    setCheckoutEmail("")
    setCheckoutPassword("")
    setCheckoutError("")
    setShowCheckoutModal(true)
  }

  const getPlanDisplayInfo = (planType: string) => {
    switch (planType) {
      case "individual_monthly":
        return "Individual — $29.99 / month"
      case "pilot_annual":
        return "Pilot — $1,000 / year · 500 charts"
      case "small_squad_annual":
        return "Small Squad — $3,000 / year · 2,000 charts"
      case "large_squad_annual":
        return "Large Squad — $6,000 / year · 5,000 charts"
      case "high_volume_annual":
        return "High Volume — $10,000 / year · 10,000 charts"
      default:
        return ""
    }
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    setCheckoutError("")
    setIsCheckoutLoading(true)
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: checkoutEmail,
          password: checkoutPassword,
          planType: selectedPlan?.type,
        }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Failed to start checkout")
      if (data.url) window.location.href = data.url
    } catch (error) {
      setCheckoutError(error instanceof Error ? error.message : "Something went wrong")
    } finally {
      setIsCheckoutLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const response = await fetch("https://formspree.io/f/xblynzkd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (response.ok) {
        alert("Thank you. We'll be in touch.")
        setFormData({ name: "", email: "", company: "", message: "" })
      } else {
        alert("Something went wrong. Please try again.")
      }
    } catch {
      alert("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" })
    window.history.pushState(null, "", `#${sectionId}`)
  }

  // Lock body scroll when modal open
  useEffect(() => {
    const locked = showCheckoutModal || showVideoModal || isMobileMenuOpen
    document.body.style.overflow = locked ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [showCheckoutModal, showVideoModal, isMobileMenuOpen])

  return (
    <div className="min-h-screen bg-paper text-ink antialiased">
      {/* ============================================================
          NAV
          ============================================================ */}
      <nav className="sticky top-0 z-40 bg-paper/85 backdrop-blur-md border-b border-rule">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="flex h-16 items-center justify-between">
            <Wordmark href="/" size="md" />

            <div className="hidden md:flex items-center gap-8">
              <button
                onClick={() => scrollToSection("how")}
                className="text-sm text-ink-muted hover:text-ink transition-colors"
              >
                How it works
              </button>
              <button
                onClick={() => scrollToSection("squads")}
                className="text-sm text-ink-muted hover:text-ink transition-colors"
              >
                For squads
              </button>
              <button
                onClick={() => scrollToSection("pricing")}
                className="text-sm text-ink-muted hover:text-ink transition-colors"
              >
                Pricing
              </button>
              <button
                onClick={() => scrollToSection("security")}
                className="text-sm text-ink-muted hover:text-ink transition-colors"
              >
                Security
              </button>
              <div className="h-5 w-px bg-rule-strong" aria-hidden />
              <Link href="/login" className="text-sm text-ink-muted hover:text-ink transition-colors">
                Log in
              </Link>
              <a
                href="https://chromewebstore.google.com/detail/narrateems-ai-medic-voice/nokdpnigpfafepjbdinggckgcdekdjkm"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-ink text-paper px-4 py-2 text-sm font-medium rounded-md hover:bg-ink-2 transition-colors"
              >
                Install
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>

            <button
              className="md:hidden text-ink p-2 -mr-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.75}
                  d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 7h16M4 12h16M4 17h16"}
                />
              </svg>
            </button>
          </div>

          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-rule py-4 space-y-1">
              {[
                ["how", "How it works"],
                ["squads", "For squads"],
                ["pricing", "Pricing"],
                ["security", "Security"],
              ].map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => {
                    scrollToSection(id)
                    setIsMobileMenuOpen(false)
                  }}
                  className="block w-full text-left px-3 py-2.5 text-base text-ink-muted hover:text-ink hover:bg-paper-tint rounded-md"
                >
                  {label}
                </button>
              ))}
              <Link
                href="/login"
                className="block px-3 py-2.5 text-base text-ink-muted hover:text-ink"
              >
                Log in
              </Link>
              <a
                href="https://chromewebstore.google.com/detail/narrateems-ai-medic-voice/nokdpnigpfafepjbdinggckgcdekdjkm"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 mx-3 inline-flex items-center justify-center gap-1.5 bg-ink text-paper px-4 py-3 text-sm font-medium rounded-md w-[calc(100%-1.5rem)]"
              >
                Install Chrome extension
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          )}
        </div>
      </nav>

      {/* ============================================================
          HERO
          ============================================================ */}
      <section className="relative bg-paper bg-grain overflow-hidden">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 pt-20 pb-16 lg:pt-28 lg:pb-24">
          {/* Eyebrow */}
          <div className="reveal" style={{ animationDelay: "0ms" }}>
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.18em] text-ink-muted">
              <span className="inline-block h-px w-6 bg-ink-muted/40" />
              By medics. For medics.
            </div>
          </div>

          {/* H1 */}
          <h1
            className="reveal mt-6 font-serif text-[14vw] leading-[0.95] tracking-tight text-ink sm:text-7xl md:text-8xl lg:text-[7.5rem] text-balance"
            style={{ animationDelay: "80ms" }}
          >
            The chart
            <br />
            <span className="italic">writes itself.</span>
          </h1>

          {/* Sub */}
          <p
            className="reveal mt-8 max-w-2xl text-lg md:text-xl text-ink-muted leading-[1.55]"
            style={{ animationDelay: "160ms" }}
          >
            After the call, just narrate what happened. NarrateEMS writes your Zoll ePCR for
            you —{" "}
            <span className="text-ink font-medium">70% faster on average</span>, each page
            filled in <span className="text-ink font-medium">under 10 seconds</span>.
          </p>

          {/* CTAs */}
          <div
            className="reveal mt-10 flex flex-col sm:flex-row sm:items-center gap-4"
            style={{ animationDelay: "240ms" }}
          >
            <a
              href="https://chromewebstore.google.com/detail/narrateems-ai-medic-voice/nokdpnigpfafepjbdinggckgcdekdjkm"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-2 bg-hi-vis text-hi-vis-ink px-7 py-4 text-base font-semibold rounded-md hover:bg-hi-vis-deep hover:text-paper transition-colors focus-hi-vis"
            >
              Install Chrome extension
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <button
              onClick={() => setShowVideoModal(true)}
              className="group inline-flex items-center justify-center gap-2.5 text-ink px-2 py-4 text-base font-medium hover:text-ink-2 transition-colors"
            >
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-ink/20 group-hover:border-ink group-hover:bg-ink group-hover:text-paper transition-all">
                <Play className="h-3.5 w-3.5 fill-current ml-0.5" />
              </span>
              Watch the demo
            </button>
          </div>

          {/* Compliance row */}
          <div
            className="reveal mt-12 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-mono uppercase tracking-[0.14em] text-ink-soft"
            style={{ animationDelay: "320ms" }}
          >
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5" /> HIPAA compliant
            </span>
            <span className="h-3 w-px bg-rule-strong" aria-hidden />
            <span className="inline-flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5" /> End-to-end encrypted
            </span>
            <span className="h-3 w-px bg-rule-strong" aria-hidden />
            <span className="inline-flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5" /> Direct Zoll ePCR
            </span>
            <span className="h-3 w-px bg-rule-strong" aria-hidden />
            <span className="inline-flex items-center gap-1.5">
              <WifiOff className="h-3.5 w-3.5" /> Mobile compatible
            </span>
          </div>
        </div>

        {/* Demo video — browser chrome frame */}
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 pb-24 lg:pb-32">
          <div
            className="reveal relative rounded-xl border border-rule-strong bg-surface shadow-[0_30px_80px_-30px_rgba(10,22,40,0.18),0_8px_24px_-8px_rgba(10,22,40,0.08)] overflow-hidden"
            style={{ animationDelay: "400ms" }}
          >
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-rule bg-paper-tint">
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
                <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
                <span className="h-3 w-3 rounded-full bg-[#28C840]" />
              </div>
              <div className="ml-4 flex-1 max-w-md mx-auto">
                <div className="flex items-center justify-center gap-1.5 bg-paper rounded-md px-3 py-1 border border-rule">
                  <Lock className="h-3 w-3 text-ink-soft" />
                  <span className="text-xs font-mono text-ink-soft">zoll.com/epcr/active</span>
                </div>
              </div>
              <div className="w-12" aria-hidden />
            </div>

            {/* Video canvas — placeholder until self-hosted MP4 is dropped at /demo.mp4 */}
            <div className="relative aspect-video bg-ink overflow-hidden">
              {/* Placeholder content (visible until video is added) */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-paper">
                <button
                  onClick={() => setShowVideoModal(true)}
                  className="group flex flex-col items-center gap-5 focus-hi-vis rounded-2xl p-4"
                  aria-label="Play demo video"
                >
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-hi-vis/20 blur-2xl group-hover:bg-hi-vis/30 transition-colors" />
                    <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-hi-vis text-hi-vis-ink shadow-lg group-hover:scale-105 transition-transform">
                      <Play className="h-7 w-7 fill-current ml-1" />
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-mono text-xs uppercase tracking-[0.2em] text-paper/60 mb-2">
                      Live product walkthrough
                    </div>
                    <div className="font-serif text-2xl italic">See a real call become a real chart.</div>
                  </div>
                </button>
              </div>

              {/* Subtle scanline grid */}
              <div
                className="absolute inset-0 opacity-[0.04] pointer-events-none"
                style={{
                  backgroundImage:
                    "linear-gradient(to bottom, rgba(250,204,21,0.6) 1px, transparent 1px)",
                  backgroundSize: "100% 32px",
                }}
              />

              {/* Recording indicator (sits on top-right of frame for product feel) */}
              <div className="absolute top-5 right-5 inline-flex items-center gap-2 bg-ink/80 backdrop-blur-sm border border-paper/10 px-3 py-1.5 rounded-full">
                <span className="h-2 w-2 rounded-full bg-recording pulse-dot" />
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-paper/80">
                  Narrating
                </span>
              </div>
            </div>

            {/* Caption strip */}
            <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 border-t border-rule bg-paper">
              <p className="text-sm text-ink-muted">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft mr-2">
                  Demo
                </span>
                Post-call narration → structured transcript → Zoll chart fields, filled.
              </p>
              <button
                onClick={() => setShowVideoModal(true)}
                className="text-sm font-medium text-ink hover:text-hi-vis-deep inline-flex items-center gap-1"
              >
                Play <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          HOW IT WORKS — "What it does" in 3 moves
          ============================================================ */}
      <section id="how" className="relative bg-paper-tint border-y border-rule">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-24 lg:py-32">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-4">
              <div className="font-mono text-xs uppercase tracking-[0.18em] text-ink-soft mb-4">
                ↳ How it works
              </div>
              <h2 className="font-serif text-5xl lg:text-6xl leading-[0.98] tracking-tight text-ink text-balance">
                Three steps,
                <br />
                <span className="italic">after the call.</span>
              </h2>
              <p className="mt-6 text-ink-muted leading-relaxed max-w-md">
                You worked the call. Now you talk it through once — into your phone or
                laptop — and NarrateEMS handles the rest. No new dashboard, no extra tab.
              </p>
            </div>

            <ol className="lg:col-span-8 space-y-px bg-rule">
              {[
                {
                  step: "01",
                  title: "Narrate the call.",
                  body:
                    "Once you're clear of the call, open the extension and walk through it the way you'd brief your partner — demographics, chief complaint, vitals, interventions, transport. Talk normally.",
                  detail: "Mobile compatible · Use it on your phone or laptop",
                  icon: <Mic className="h-5 w-5" />,
                },
                {
                  step: "02",
                  title: "AI structures the chart.",
                  body:
                    "Medical-terminology-trained transcription parses your narration into the right Zoll ePCR fields: demographics, chief complaint, assessment, treatment, transport — placed where they belong.",
                  detail: "Each page fills in under 10 seconds",
                  icon: <FileText className="h-5 w-5" />,
                },
                {
                  step: "03",
                  title: "Chart is in Zoll. You're done.",
                  body:
                    "Fields land directly inside your Zoll ePCR. Review, sign, submit — done in minutes, not the hour you used to spend typing.",
                  detail: "Direct Zoll integration · HIPAA encrypted",
                  icon: <ArrowUpRight className="h-5 w-5" />,
                },
              ].map((item) => (
                <li
                  key={item.step}
                  className="group relative bg-paper hover:bg-paper-tint transition-colors"
                >
                  <div className="grid grid-cols-[auto_1fr_auto] items-start gap-6 lg:gap-10 p-6 lg:p-10">
                    <div className="font-mono text-sm text-ink-soft tabular-nums pt-1">
                      {item.step}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-ink text-paper">
                          {item.icon}
                        </span>
                        <h3 className="font-serif text-2xl lg:text-3xl text-ink leading-tight">
                          {item.title}
                        </h3>
                      </div>
                      <p className="text-ink-muted leading-relaxed max-w-xl">{item.body}</p>
                      <div className="mt-4 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-soft">
                        <span className="h-px w-4 bg-ink-soft/60" />
                        {item.detail}
                      </div>
                    </div>
                    <ArrowUpRight className="hidden lg:block h-5 w-5 text-ink-soft/40 group-hover:text-ink group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ============================================================
          FROM THE FIELD — testimonial with circular EMT medallion
          ============================================================ */}
      <section id="field" className="bg-paper border-t border-rule">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-24 lg:py-32">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Circular medallion */}
            <div className="lg:col-span-5">
              <div className="relative inline-block">
                {/* Outer hi-vis ring */}
                <div className="absolute -inset-3 rounded-full border border-hi-vis/40" aria-hidden />
                <div className="absolute -inset-6 rounded-full border border-rule" aria-hidden />

                {/* Tick marks around the medallion — subtle, like an analog meter */}
                <svg
                  className="absolute -inset-10 w-[calc(100%+5rem)] h-[calc(100%+5rem)] text-ink-soft/30"
                  viewBox="0 0 100 100"
                  fill="none"
                  aria-hidden
                >
                  {Array.from({ length: 36 }).map((_, i) => {
                    const angle = (i * 360) / 36
                    return (
                      <line
                        key={i}
                        x1="50"
                        y1="2"
                        x2="50"
                        y2={i % 3 === 0 ? "5" : "3.5"}
                        stroke="currentColor"
                        strokeWidth="0.4"
                        transform={`rotate(${angle} 50 50)`}
                      />
                    )
                  })}
                </svg>

                {/* The photo */}
                <div className="relative w-[280px] sm:w-[360px] lg:w-[420px] aspect-square rounded-full overflow-hidden bg-ink-2 ring-1 ring-rule-strong">
                  <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Image.jpg-zZeluLIQJ3rB3PKe7tKcfoKfekukF6.jpeg"
                    alt="EMT providing patient care in the field"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {/* Caption pill on the medallion */}
                  <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-ink text-paper px-3 py-1.5 rounded-full font-mono text-[10px] uppercase tracking-[0.18em] whitespace-nowrap">
                    ● In the field
                  </div>
                </div>
              </div>
            </div>

            {/* Quote */}
            <div className="lg:col-span-7">
              <div className="font-mono text-xs uppercase tracking-[0.18em] text-ink-soft mb-6">
                ↳ From the field
              </div>

              <blockquote className="font-serif text-4xl lg:text-5xl leading-[1.1] tracking-tight text-ink text-balance">
                <span className="text-hi-vis-deep">"</span>
                Saved me hours of documentation.
                <span className="text-hi-vis-deep">"</span>
              </blockquote>

              <div className="mt-8 flex items-center gap-4">
                <div className="h-px w-10 bg-ink-soft/60" aria-hidden />
                <div>
                  <div className="font-medium text-ink">Kendall Park First Aid Squad</div>
                  <div className="font-mono text-xs uppercase tracking-[0.14em] text-ink-soft mt-0.5">
                    New Jersey · EMS provider
                  </div>
                </div>
              </div>

              {/* Stats strip */}
              <div className="mt-10 grid grid-cols-3 divide-x divide-rule border-y border-rule">
                <div className="py-5 pr-5">
                  <div className="font-serif text-4xl text-ink leading-none">70%</div>
                  <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-soft">
                    Faster charting
                  </div>
                </div>
                <div className="py-5 px-5">
                  <div className="font-serif text-4xl text-ink leading-none">
                    &lt;10<span className="text-xl text-ink-soft">s</span>
                  </div>
                  <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-soft">
                    Per chart page
                  </div>
                </div>
                <div className="py-5 pl-5">
                  <div className="font-serif text-4xl text-ink leading-none">
                    1<span className="text-xl text-ink-soft">hr+</span>
                  </div>
                  <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-soft">
                    Saved per shift
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          BUILT BY MEDICS
          ============================================================ */}
      <section id="why" className="bg-ink text-paper relative overflow-hidden">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-24 lg:py-32">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-5">
              <div className="font-mono text-xs uppercase tracking-[0.18em] text-paper/50 mb-6">
                ↳ Why us
              </div>
              <h2 className="font-serif text-5xl lg:text-7xl leading-[0.98] tracking-tight text-balance">
                We built it
                <br />
                <span className="italic">for ourselves first.</span>
              </h2>
            </div>

            <div className="lg:col-span-7 lg:pt-2">
              <p className="text-xl lg:text-2xl text-paper/80 leading-[1.5] font-light max-w-xl">
                Six-plus years working calls. We know exactly what charting feels
                like at the end of a sixteen-hour shift — because we lived it. NarrateEMS
                is the tool we wished we had when we were the ones typing.
              </p>

              <div className="mt-12 grid sm:grid-cols-3 gap-px bg-paper/10">
                <div className="bg-ink p-6">
                  <div className="font-serif text-4xl text-paper mb-3">
                    6<span className="text-xl text-paper/40">+yrs</span>
                  </div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-paper/50">
                    Field experience
                    <br />
                    on the team
                  </div>
                </div>
                <div className="bg-ink p-6">
                  <div className="font-serif text-4xl text-paper mb-3">
                    1<span className="text-xl text-paper/40">hr</span>
                  </div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-paper/50">
                    Old way:
                    <br />
                    typing per call
                  </div>
                </div>
                <div className="bg-ink p-6">
                  <div className="font-serif text-4xl text-paper mb-3">
                    &lt;3<span className="text-xl text-paper/40">min</span>
                  </div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-paper/50">
                    New way:
                    <br />
                    narrate, sign, done
                  </div>
                </div>
              </div>

              <div className="mt-10 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-paper/40">
                <span className="h-px w-6 bg-paper/40" />
                Made in New Jersey
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          FOR SQUADS
          ============================================================ */}
      <section id="squads" className="bg-paper border-t border-rule">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-24 lg:py-32">
          <div className="max-w-3xl">
            <div className="font-mono text-xs uppercase tracking-[0.18em] text-ink-soft mb-6">
              ↳ For squads
            </div>
            <h2 className="font-serif text-5xl lg:text-7xl leading-[0.98] tracking-tight text-ink text-balance">
              Run a department?
              <br />
              <span className="italic">We've got you.</span>
            </h2>
            <p className="mt-6 text-lg text-ink-muted leading-relaxed">
              One squad code. One bill. Every medic charting faster from day one.
              No per-seat math, no provisioning meetings.
            </p>
          </div>

          <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-rule border border-rule">
            {[
              {
                icon: <Users className="h-5 w-5" />,
                title: "Squad codes",
                body:
                  "Hand out one code at orientation. New medics join your plan in a click — no email back-and-forth.",
              },
              {
                icon: <FileText className="h-5 w-5" />,
                title: "Chart bundles",
                body:
                  "Plans start at 500 charts and scale to 10,000+. Pay for what your squad actually runs, with simple overage pricing.",
              },
              {
                icon: <HeartPulse className="h-5 w-5" />,
                title: "Real-time usage",
                body:
                  "See how many charts your squad has filed this period. No surprises at renewal.",
              },
              {
                icon: <Lock className="h-5 w-5" />,
                title: "HIPAA from day one",
                body:
                  "End-to-end encryption on every recording and chart. Patient data never leaves the secure pipeline.",
              },
              {
                icon: <Smartphone className="h-5 w-5" />,
                title: "Works on what you've got",
                body:
                  "Chrome on the rig laptop, phone on the bench, tablet at the station. Same login, same workflow.",
              },
              {
                icon: <ShieldCheck className="h-5 w-5" />,
                title: "Squad admin controls",
                body:
                  "Promote leads, revoke former members, transfer billing. Run it like you run shifts.",
              },
            ].map((f) => (
              <div key={f.title} className="bg-paper p-8 lg:p-10 hover:bg-paper-tint transition-colors">
                <div className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-ink text-paper mb-5">
                  {f.icon}
                </div>
                <h3 className="font-serif text-2xl text-ink leading-tight mb-3">{f.title}</h3>
                <p className="text-ink-muted leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-x-4 gap-y-3">
            <button
              onClick={() => scrollToSection("pricing")}
              className="inline-flex items-center gap-2 bg-ink text-paper px-6 py-3 text-sm font-medium rounded-md hover:bg-ink-2 transition-colors"
            >
              See squad pricing
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
            <a
              href="https://calendly.com/narrateems/narrateems"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-ink px-4 py-3 text-sm font-medium hover:text-hi-vis-deep transition-colors"
            >
              Book a squad walkthrough
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* ============================================================
          PRICING — redesigned
          ============================================================ */}
      <section id="pricing" className="bg-paper-tint border-t border-rule">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-24 lg:py-32">
          <div className="grid lg:grid-cols-12 gap-10 items-end mb-12">
            <div className="lg:col-span-7">
              <div className="font-mono text-xs uppercase tracking-[0.18em] text-ink-soft mb-6">
                ↳ Pricing
              </div>
              <h2 className="font-serif text-5xl lg:text-7xl leading-[0.98] tracking-tight text-ink text-balance">
                Pay for charts.
                <br />
                <span className="italic">Not seats.</span>
              </h2>
            </div>
            <div className="lg:col-span-5">
              <p className="text-ink-muted leading-relaxed max-w-md">
                Individuals get a flat monthly rate. Squads pay annually with a chart
                bundle that fits your call volume. Simple overage if you go over.
              </p>
              <div className="mt-5 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft bg-paper border border-rule rounded-full px-3 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-hi-vis" /> 7-day free trial on every plan
              </div>
            </div>
          </div>

          {/* Tab toggle */}
          <div className="inline-flex bg-paper border border-rule-strong rounded-md p-1 mb-10">
            <button
              onClick={() => setPricingTab("individual")}
              className={`px-5 py-2 rounded text-sm font-medium transition-all ${
                pricingTab === "individual"
                  ? "bg-ink text-paper"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              Individual medic
            </button>
            <button
              onClick={() => setPricingTab("squad")}
              className={`px-5 py-2 rounded text-sm font-medium transition-all ${
                pricingTab === "squad"
                  ? "bg-ink text-paper"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              Squad / Department
            </button>
          </div>

          {pricingTab === "individual" && (
            <div className="max-w-lg">
              <div className="bg-paper border border-rule-strong rounded-xl p-8 lg:p-10">
                <div className="flex items-baseline justify-between gap-4 mb-6 pb-6 border-b border-rule">
                  <div>
                    <h3 className="font-serif text-3xl text-ink leading-none">Individual</h3>
                    <p className="text-ink-soft text-sm mt-2">For solo medics</p>
                  </div>
                  <div className="text-right">
                    <div className="font-serif text-5xl text-ink leading-none">
                      $29.99
                    </div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-soft mt-2">
                      / month
                    </div>
                  </div>
                </div>
                <ul className="space-y-3 mb-8">
                  {[
                    "Unlimited voice narrations",
                    "Direct Zoll ePCR integration",
                    "Chrome extension + mobile",
                    "HIPAA encrypted, end to end",
                    "Cancel any time",
                  ].map((line) => (
                    <li key={line} className="flex items-start gap-3 text-ink-muted">
                      <span className="mt-2 h-1 w-3 bg-ink shrink-0" aria-hidden />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handlePlanSelect("individual_monthly")}
                  className="w-full inline-flex items-center justify-center gap-2 bg-hi-vis text-hi-vis-ink py-4 text-base font-semibold rounded-md hover:bg-hi-vis-deep hover:text-paper transition-colors focus-hi-vis"
                >
                  Start 7-day free trial
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {pricingTab === "squad" && (
            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
              {[
                {
                  id: "pilot_annual",
                  name: "Pilot",
                  blurb: "Test it with a small crew",
                  price: "1,000",
                  charts: "500",
                  overage: "$2.50",
                  popular: false,
                },
                {
                  id: "small_squad_annual",
                  name: "Small Squad",
                  blurb: "Volunteer + small services",
                  price: "3,000",
                  charts: "2,000",
                  overage: "$1.90",
                  popular: true,
                },
                {
                  id: "large_squad_annual",
                  name: "Large Squad",
                  blurb: "City and county departments",
                  price: "6,000",
                  charts: "5,000",
                  overage: "$1.40",
                  popular: false,
                },
                {
                  id: "high_volume_annual",
                  name: "High Volume",
                  blurb: "Regional and 911 contractors",
                  price: "10,000",
                  charts: "10,000",
                  overage: "$1.15",
                  popular: false,
                },
              ].map((p) => (
                <div
                  key={p.id}
                  className={`relative bg-paper rounded-xl p-7 flex flex-col ${
                    p.popular
                      ? "border-2 border-hi-vis shadow-[0_20px_40px_-20px_rgba(202,138,4,0.25)]"
                      : "border border-rule-strong"
                  }`}
                >
                  {p.popular && (
                    <div className="absolute -top-3 left-7 bg-hi-vis text-hi-vis-ink text-[10px] font-mono uppercase tracking-[0.18em] px-2 py-1 rounded">
                      Most chosen
                    </div>
                  )}
                  <div className="pb-5 border-b border-rule">
                    <h3 className="font-serif text-2xl text-ink leading-none">{p.name}</h3>
                    <p className="text-xs text-ink-soft mt-2">{p.blurb}</p>
                  </div>
                  <div className="py-6">
                    <div className="flex items-baseline gap-1">
                      <span className="font-mono text-sm text-ink-soft">$</span>
                      <span className="font-serif text-5xl text-ink leading-none tabular-nums">
                        {p.price}
                      </span>
                    </div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-soft mt-2">
                      / year
                    </div>
                  </div>
                  <ul className="space-y-2.5 text-sm text-ink-muted mb-7 flex-1">
                    <li className="flex items-start gap-2">
                      <span className="mt-2 h-1 w-2.5 bg-ink shrink-0" aria-hidden />
                      <span>
                        <span className="text-ink font-medium tabular-nums">{p.charts}</span>{" "}
                        charts included
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-2 h-1 w-2.5 bg-ink shrink-0" aria-hidden />
                      <span>
                        <span className="text-ink font-medium">{p.overage}</span> per extra
                        chart
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-2 h-1 w-2.5 bg-ink shrink-0" aria-hidden />
                      <span>Squad codes &amp; admin controls</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-2 h-1 w-2.5 bg-ink shrink-0" aria-hidden />
                      <span>One bill, billed annually</span>
                    </li>
                  </ul>
                  <button
                    onClick={() => handlePlanSelect(p.id)}
                    className={`w-full inline-flex items-center justify-center gap-2 py-3 text-sm font-semibold rounded-md transition-colors ${
                      p.popular
                        ? "bg-hi-vis text-hi-vis-ink hover:bg-hi-vis-deep hover:text-paper"
                        : "bg-ink text-paper hover:bg-ink-2"
                    }`}
                  >
                    Start free trial
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <p className="mt-8 text-xs text-ink-soft font-mono uppercase tracking-[0.14em]">
            Need a custom plan or county-wide contract?{" "}
            <a
              href="mailto:narrateems@gmail.com"
              className="text-ink hover:text-hi-vis-deep underline underline-offset-4"
            >
              Talk to a medic →
            </a>
          </p>
        </div>
      </section>

      {/* ============================================================
          SECURITY
          ============================================================ */}
      <section id="security" className="bg-paper border-t border-rule">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-24 lg:py-32">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5">
              <div className="font-mono text-xs uppercase tracking-[0.18em] text-ink-soft mb-6">
                ↳ Security &amp; privacy
              </div>
              <h2 className="font-serif text-5xl lg:text-6xl leading-[0.98] tracking-tight text-ink text-balance">
                Patient data
                <br />
                <span className="italic">is sacred.</span>
              </h2>
              <p className="mt-6 text-ink-muted leading-relaxed max-w-md">
                We built this for the same patients we used to treat. The security
                posture matches the trust the badge carries.
              </p>
              <a
                href="mailto:narrateems@gmail.com?subject=Security%20questions"
                className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-ink hover:text-hi-vis-deep transition-colors"
              >
                Security questions? Email a medic
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>

            <div className="lg:col-span-7 grid sm:grid-cols-2 gap-px bg-rule border border-rule">
              {[
                {
                  label: "HIPAA",
                  title: "HIPAA compliant",
                  body:
                    "Built to HIPAA standards from day one. We sign BAAs with squads and services.",
                },
                {
                  label: "Encryption",
                  title: "Encrypted end to end",
                  body:
                    "Recordings, transcripts, and chart data are encrypted in transit and at rest.",
                },
                {
                  label: "Auth",
                  title: "Your data, your account",
                  body:
                    "Only you and your authorized squad members can see your charts. Period.",
                },
                {
                  label: "No resale",
                  title: "Never sold. Never trained on.",
                  body:
                    "Patient data is not sold and is not used to train third-party models.",
                },
              ].map((item) => (
                <div key={item.label} className="bg-paper p-8">
                  <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft mb-4">
                    {item.label}
                  </div>
                  <h3 className="font-serif text-2xl text-ink mb-3 leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-ink-muted leading-relaxed text-sm">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          FAQ
          ============================================================ */}
      <section id="faq" className="bg-paper-tint border-t border-rule">
        <div className="mx-auto max-w-[1100px] px-6 lg:px-10 py-24 lg:py-32">
          <div className="grid lg:grid-cols-12 gap-10 mb-12">
            <div className="lg:col-span-5">
              <div className="font-mono text-xs uppercase tracking-[0.18em] text-ink-soft mb-6">
                ↳ Common questions
              </div>
              <h2 className="font-serif text-5xl lg:text-6xl leading-[0.98] tracking-tight text-ink text-balance">
                Things medics
                <br />
                <span className="italic">actually ask us.</span>
              </h2>
            </div>
            <div className="lg:col-span-7 flex items-end">
              <p className="text-ink-muted leading-relaxed">
                Can't find what you're looking for?{" "}
                <a
                  href="mailto:narrateems@gmail.com"
                  className="text-ink underline underline-offset-4 hover:text-hi-vis-deep"
                >
                  Email us
                </a>{" "}
                — a real medic from the team writes back.
              </p>
            </div>
          </div>

          <ol className="border-t border-rule">
            {[
              {
                q: "Do I have to narrate during the call?",
                a: "No — and you shouldn't. Work the call. Once you're clear, open NarrateEMS and narrate what happened the way you'd brief your partner. The chart writes from your post-call narration.",
              },
              {
                q: "Does it actually work with my service's Zoll setup?",
                a: "Yes. The Chrome extension sits on top of your active Zoll ePCR session and writes directly into the same fields you'd type into. No custom integration, no IT ticket.",
              },
              {
                q: "Who can hear my recordings?",
                a: "Only you. Recordings are end-to-end encrypted, stored against your account, and never sold or used to train third-party models. Squad admins see usage counts, not recordings.",
              },
              {
                q: "What if I'm on my phone, not the rig laptop?",
                a: "Use it. NarrateEMS works on mobile browsers too — narrate from your phone, sign off later from your laptop, or stay on mobile the whole time. Same account, same chart.",
              },
              {
                q: "How much faster is it really?",
                a: "Squads we work with report 70% faster charting on average, with each chart page filling in under 10 seconds. That's the difference between an hour of typing after a shift and getting home on time.",
              },
              {
                q: "What happens during the free trial?",
                a: "7 days, no card required upfront for individuals. Full product. If it doesn't save you time, cancel before day 7 and you're not charged.",
              },
              {
                q: "Can my whole squad use one account?",
                a: "No — every medic gets their own login (records belong to them), but a squad code lets all your medics roll up to a single annual plan and one bill.",
              },
            ].map((item, i) => {
              const isOpen = openFaq === i
              return (
                <li key={item.q} className="border-b border-rule">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full text-left py-6 lg:py-7 flex items-start gap-6 group focus-hi-vis rounded-sm"
                    aria-expanded={isOpen}
                  >
                    <span className="font-mono text-sm text-ink-soft tabular-nums pt-1 w-8">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1 font-serif text-xl lg:text-2xl text-ink leading-tight">
                      {item.q}
                    </span>
                    <span className="mt-1 inline-flex items-center justify-center w-7 h-7 rounded-full border border-ink/20 group-hover:border-ink transition-colors shrink-0">
                      {isOpen ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="pb-7 pl-14 pr-14 -mt-1 max-w-3xl">
                      <p className="text-ink-muted leading-relaxed">{item.a}</p>
                    </div>
                  )}
                </li>
              )
            })}
          </ol>
        </div>
      </section>

      {/* ============================================================
          FINAL CTA + CONTACT
          ============================================================ */}
      <section id="start" className="bg-ink text-paper relative overflow-hidden">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-24 lg:py-32">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <div className="font-mono text-xs uppercase tracking-[0.18em] text-paper/50 mb-6">
                ↳ Start now
              </div>
              <h2 className="font-serif text-5xl lg:text-7xl leading-[0.98] tracking-tight text-balance">
                Go home an hour
                <br />
                <span className="italic">earlier tonight.</span>
              </h2>
              <p className="mt-6 text-lg text-paper/70 leading-relaxed max-w-xl">
                Install the Chrome extension, run your next call, and narrate it on
                the way back. Your Zoll chart will be ready by the time you sit down.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row sm:items-center gap-4">
                <a
                  href="https://chromewebstore.google.com/detail/narrateems-ai-medic-voice/nokdpnigpfafepjbdinggckgcdekdjkm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-hi-vis text-hi-vis-ink px-7 py-4 text-base font-semibold rounded-md hover:bg-paper transition-colors focus-hi-vis"
                >
                  Install Chrome extension
                  <ArrowUpRight className="h-4 w-4" />
                </a>
                <a
                  href="https://calendly.com/narrateems/narrateems"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 text-paper px-4 py-4 text-base font-medium hover:text-hi-vis transition-colors"
                >
                  Or book a squad walkthrough
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Quick-contact card */}
            <div className="lg:col-span-5">
              <div className="bg-ink-2 border border-paper/10 rounded-xl p-7">
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-paper/50 mb-4">
                  Or send us a note
                </div>
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="px-3.5 py-3 bg-ink border border-paper/15 rounded-md text-paper placeholder:text-paper/40 text-sm focus:outline-none focus:border-hi-vis"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="px-3.5 py-3 bg-ink border border-paper/15 rounded-md text-paper placeholder:text-paper/40 text-sm focus:outline-none focus:border-hi-vis"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Squad / Department"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    required
                    className="w-full px-3.5 py-3 bg-ink border border-paper/15 rounded-md text-paper placeholder:text-paper/40 text-sm focus:outline-none focus:border-hi-vis"
                  />
                  <textarea
                    placeholder="What does your charting workflow look like today?"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={3}
                    className="w-full px-3.5 py-3 bg-ink border border-paper/15 rounded-md text-paper placeholder:text-paper/40 text-sm focus:outline-none focus:border-hi-vis resize-none"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center gap-2 bg-paper text-ink px-4 py-3 text-sm font-semibold rounded-md hover:bg-hi-vis transition-colors disabled:opacity-60"
                  >
                    {isSubmitting ? "Sending…" : "Send message"}
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>
                  <div className="flex items-center justify-center gap-2 text-xs text-paper/40 pt-1">
                    <Mail className="h-3 w-3" />
                    narrateems@gmail.com
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          FOOTER
          ============================================================ */}
      <footer className="bg-ink text-paper">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <Wordmark variant="paper" size="md" />
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-paper/60">
              <Link href="/privacy-policy" className="hover:text-paper transition-colors">
                Privacy
              </Link>
              <Link href="/terms-of-service" className="hover:text-paper transition-colors">
                Terms
              </Link>
              <Link href="/sla" className="hover:text-paper transition-colors">
                SLA
              </Link>
              <a href="mailto:narrateems@gmail.com" className="hover:text-paper transition-colors">
                Contact
              </a>
              <span className="font-mono text-xs uppercase tracking-[0.14em] text-paper/40">
                © 2026 NarrateEMS
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* ============================================================
          VIDEO MODAL
          ============================================================ */}
      {showVideoModal && (
        <div
          className="fixed inset-0 bg-ink/95 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowVideoModal(false)}
        >
          <button
            onClick={() => setShowVideoModal(false)}
            className="absolute top-6 right-6 text-paper/60 hover:text-paper p-2"
            aria-label="Close video"
          >
            <X className="h-6 w-6" />
          </button>
          <div
            className="relative w-full max-w-5xl aspect-video bg-ink rounded-xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src="https://www.youtube.com/embed/qvp9YXTCtZA?autoplay=1&rel=0"
              title="NarrateEMS product demo"
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* ============================================================
          CHECKOUT MODAL
          ============================================================ */}
      {showCheckoutModal && (
        <div className="fixed inset-0 bg-ink/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-rule rounded-xl p-8 max-w-md w-full relative shadow-2xl">
            <button
              onClick={() => setShowCheckoutModal(false)}
              className="absolute top-5 right-5 text-ink-soft hover:text-ink p-1"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="font-mono text-xs uppercase tracking-[0.18em] text-ink-soft mb-3">
              Step 1 of 2 · Create account
            </div>
            <h3 className="font-serif text-3xl text-ink mb-2">Get started.</h3>
            <p className="text-sm text-ink-muted mb-6">
              {selectedPlan?.type && getPlanDisplayInfo(selectedPlan.type)}
            </p>

            <form onSubmit={handleCheckout} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-[0.14em] text-ink-soft mb-2">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={checkoutEmail}
                  onChange={(e) => setCheckoutEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 bg-paper border border-rule rounded-md text-ink placeholder:text-ink-soft/60 focus:outline-none focus:border-ink"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase tracking-[0.14em] text-ink-soft mb-2">
                  Password
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={checkoutPassword}
                  onChange={(e) => setCheckoutPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full px-4 py-3 bg-paper border border-rule rounded-md text-ink placeholder:text-ink-soft/60 focus:outline-none focus:border-ink"
                />
              </div>

              {checkoutError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2.5 rounded-md text-sm">
                  {checkoutError}
                </div>
              )}

              <button
                type="submit"
                disabled={isCheckoutLoading}
                className="w-full py-3 bg-hi-vis text-hi-vis-ink font-semibold rounded-md hover:bg-hi-vis-deep hover:text-paper transition-colors disabled:opacity-60"
              >
                {isCheckoutLoading ? "Processing…" : "Continue to payment →"}
              </button>

              <p className="text-xs text-ink-soft text-center pt-2">
                By continuing, you agree to our{" "}
                <Link href="/terms-of-service" className="underline hover:text-ink">
                  Terms
                </Link>{" "}
                and{" "}
                <Link href="/privacy-policy" className="underline hover:text-ink">
                  Privacy Policy
                </Link>
                .
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
