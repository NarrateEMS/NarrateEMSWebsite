"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Wordmark } from "@/components/wordmark"
import { Mail, Play, ArrowUpRight, X } from "lucide-react"

const STORE_URL =
  "https://chromewebstore.google.com/detail/narrateems-ai-medic-voice/nokdpnigpfafepjbdinggckgcdekdjkm"

const NAV = [
  ["how", "How it works"],
  ["squads", "For squads"],
  ["pricing", "Pricing"],
  ["security", "Security"],
] as const

const STEPS = [
  {
    title: "Narrate the call.",
    body: "Once you're clear of the call, open the extension and walk through it the way you'd brief your partner: demographics, chief complaint, vitals, interventions, transport. Talk normally.",
    detail: "Mobile compatible. Use it on your phone or laptop.",
  },
  {
    title: "AI structures the chart.",
    body: "Medical-terminology-trained transcription parses your narration into the right Zoll ePCR fields: demographics, chief complaint, assessment, treatment, transport, placed where they belong.",
    detail: "Each page fills in under 10 seconds.",
  },
  {
    title: "Chart is in Zoll. You're done.",
    body: "Fields land directly inside your Zoll ePCR. Review, sign, submit. Done in minutes, not the hour you used to spend typing.",
    detail: "Direct Zoll integration. HIPAA encrypted.",
  },
]

const SQUAD_FEATURES = [
  { title: "Squad codes", body: "Hand out one code at orientation. New medics join your plan in a click, with no email back-and-forth." },
  { title: "Chart bundles", body: "Plans start at 500 charts and scale to 10,000+. Pay for what your squad actually runs, with simple overage pricing." },
  { title: "Real-time usage", body: "See how many charts your squad has filed this period. No surprises at renewal." },
  { title: "HIPAA from day one", body: "End-to-end encryption on every recording and chart. Patient data never leaves the secure pipeline." },
  { title: "Works on what you've got", body: "Chrome on the rig laptop, phone on the bench, tablet at the station. Same login, same workflow." },
  { title: "Squad admin controls", body: "Promote leads, revoke former members, transfer billing. Run it like you run shifts." },
]

const INDIVIDUAL_LINES = [
  "Unlimited voice narrations",
  "Direct Zoll ePCR integration",
  "Chrome extension + mobile",
  "HIPAA encrypted, end to end",
  "Cancel any time",
]

const SQUAD_PLANS = [
  { id: "pilot_annual", name: "Pilot", blurb: "Test it with a small crew", price: "1,000", charts: "500", overage: "$2.50", popular: false, tone: "bg-quarters text-ink", dark: false, height: "30rem" },
  { id: "small_squad_annual", name: "Small Squad", blurb: "Volunteer + small services", price: "3,000", charts: "2,000", overage: "$1.90", popular: true, tone: "bg-scene text-ink", dark: false, height: "33rem" },
  { id: "large_squad_annual", name: "Large Squad", blurb: "City and county departments", price: "6,000", charts: "5,000", overage: "$1.40", popular: false, tone: "bg-transport text-white", dark: true, height: "36rem" },
  { id: "high_volume_annual", name: "High Volume", blurb: "Regional and 911 contractors", price: "10,000", charts: "10,000", overage: "$1.15", popular: false, tone: "bg-dispatch text-paper", dark: true, height: "39rem" },
]

const STATS = [
  ["70%", "Faster charting"],
  ["<10s", "Per chart page"],
  ["1hr+", "Saved per shift"],
  ["6+ yrs", "Field experience"],
] as const

const SECURITY = [
  { title: "HIPAA compliant", body: "Built to HIPAA standards from day one. We sign BAAs with squads and services." },
  { title: "Encrypted end to end", body: "Recordings, transcripts, and chart data are encrypted in transit and at rest." },
  { title: "Your data, your account", body: "Only you and your authorized squad members can see your charts. Period." },
  { title: "Never sold. Never trained on.", body: "Patient data is not sold and is not used to train third-party models." },
]

const FAQ = [
  { q: "Do I have to narrate during the call?", a: "No, and you shouldn't. Work the call. Once you're clear, open NarrateEMS and narrate what happened the way you'd brief your partner. The chart writes from your post-call narration." },
  { q: "Does it actually work with my service's Zoll setup?", a: "Yes. The Chrome extension sits on top of your active Zoll ePCR session and writes directly into the same fields you'd type into. No custom integration, no IT ticket." },
  { q: "Who can hear my recordings?", a: "Only you. Recordings are end-to-end encrypted, stored against your account, and never sold or used to train third-party models. Squad admins see usage counts, not recordings." },
  { q: "What if I'm on my phone, not the rig laptop?", a: "Use it. NarrateEMS works on mobile browsers too. Narrate from your phone, sign off later from your laptop, or stay on mobile the whole time. Same account, same chart." },
  { q: "How much faster is it really?", a: "Squads we work with report 70% faster charting on average, with each chart page filling in under 10 seconds. That's the difference between an hour of typing after a shift and getting home on time." },
  { q: "What happens during the free trial?", a: "7 days, no card required upfront for individuals. Full product. If it doesn't save you time, cancel before day 7 and you're not charged." },
  { q: "Can my whole squad use one account?", a: "No. Every medic gets their own login (records belong to them), but a squad code lets all your medics roll up to a single annual plan and one bill." },
]

const CREDITS = [
  { title: "Chicago Ambulance at Night 6D2B5162", by: "Tony Webster", licence: "CC BY 3.0", href: "https://commons.wikimedia.org/w/index.php?curid=39468925" },
  { title: "New Vernon Volunteer Ambulance", by: "Mangocove", licence: "CC BY-SA 4.0", href: "https://commons.wikimedia.org/w/index.php?curid=133983475" },
  { title: "Ewing Township Emergency Medical Services ambulance along Forest Lane", by: "Famartin", licence: "CC BY-SA 4.0", href: "https://commons.wikimedia.org/w/index.php?curid=132152147" },
  { title: "US Navy EMT trainees load a patient", by: "U.S. Navy photo by Stacey Byington", licence: "public domain", href: "https://commons.wikimedia.org/wiki/File:US_Navy_120119-N-CD652-002_Emergency_technician_(EMT)_trainees_Hospital_Corpsmen_3rd_Class_Corey_Bynum_and_Stacey_Zimmerman_load_Hospitalman_Briar.jpg" },
]

const SAMPLE_TRANSCRIPT =
  "Sample call, fictional. Dispatched to a fall at a private residence. Found a 72-year-old male seated, alert and oriented times four, left wrist pain after tripping on a step. Denies head strike. BP 138 over 84, pulse 88, resp 16, SpO2 97 percent. Splinted the wrist, cold pack applied. Transported BLS without incident."

const PAGES = ["1", "2", "3", "4", "5", "8", "N"]

const CHART_FIELDS = [
  ["Incident type", "Fall, ground level"],
  ["Chief complaint", "Left wrist pain"],
  ["Mental status", "Alert, oriented x4"],
  ["Blood pressure", "138 / 84"],
  ["Pulse / Resp", "88 / 16"],
  ["SpO2", "97% room air"],
  ["Treatment", "Splint, cold pack"],
  ["Disposition", "Transported, BLS"],
]

const clamp01 = (n: number) => Math.min(1, Math.max(0, n))

function Replica({ f, turn }: { f: number; turn: number }) {
  const typed = Math.round(clamp01(f / 0.55) * SAMPLE_TRANSCRIPT.length)
  const fill = clamp01((f - 0.5) / 0.45)
  const pageStep = fill * PAGES.length
  const fieldsDone = Math.floor(fill * CHART_FIELDS.length + 0.001)
  const recording = f > 0.02 && f < 0.55
  const done = fill >= 1
  const t = 1 - turn
  return (
    <div className="cc-stage" aria-label="NarrateEMS popup filling a Zoll emsCharts page with a fictional sample call">
      <div
        className="cc-object"
        style={{ transform: `rotateX(${(16 * t).toFixed(2)}deg) rotateY(${(-26 * t).toFixed(2)}deg) rotateZ(${(4 * t).toFixed(2)}deg)` }}
      >
        <div className="cc-chart" data-ui aria-hidden>
          <div className="cc-chart-bar">
            <span className="font-semibold">emsCharts</span>
            <span>Page 1: Incident</span>
          </div>
          <div className="cc-chart-tabs">
            {PAGES.map((p, i) => (
              <span key={p} className={i === 0 ? "is-on" : ""}>
                {p === "N" ? "Narrative" : p}
              </span>
            ))}
          </div>
          <dl className="cc-chart-fields">
            {CHART_FIELDS.map(([label, value], i) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd className={i < fieldsDone ? "is-filled" : ""}>
                  <span>{value}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="cc-popup" data-ui aria-hidden>
          <div className="cc-popup-head">
            <span className="cc-popup-mark">
              narrate<b>ems</b>
            </span>
            <span>Squad plan</span>
          </div>
          <p className="cc-popup-label">Chart page</p>
          <div className="cc-chips">
            {PAGES.map((p, i) => {
              const state = i < Math.floor(pageStep) ? "is-filled" : i === Math.floor(pageStep) && fill > 0 && !done ? "is-filling" : ""
              return (
                <span key={p} className={state}>
                  {p}
                </span>
              )
            })}
          </div>
          <div className={`cc-mic ${recording ? "is-rec" : done ? "is-done" : ""}`}>
            {recording ? "Recording" : done ? "Chart filled" : f > 0.02 ? "Filling the chart" : "Start narrating"}
          </div>
          <p className="cc-popup-label">Transcript</p>
          <p className="cc-transcript">
            {SAMPLE_TRANSCRIPT.slice(0, typed)}
            {typed < SAMPLE_TRANSCRIPT.length && typed > 0 && <span className="cc-caret" />}
          </p>
          <div className="cc-popup-actions">
            <span>Cancel</span>
            <span className="is-primary">Fill the chart</span>
          </div>
        </div>
      </div>
    </div>
  )
}

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
        return "Individual: $29.99 / month"
      case "pilot_annual":
        return "Pilot: $1,000 / year · 500 charts"
      case "small_squad_annual":
        return "Small Squad: $3,000 / year · 2,000 charts"
      case "large_squad_annual":
        return "Large Squad: $6,000 / year · 5,000 charts"
      case "high_volume_annual":
        return "High Volume: $10,000 / year · 10,000 charts"
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

  // Scroll-driven "call progress": SSR/no-JS/reduced-motion render the filled, flat final state.
  const howRef = useRef<HTMLElement>(null)
  const [f, setF] = useState(1)
  const [heroTurn, setHeroTurn] = useState(1)
  const [howTurn, setHowTurn] = useState(1)

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let frame = 0
    const update = () => {
      frame = 0
      const how = howRef.current
      if (!how) return
      const vh = window.innerHeight
      const y = window.scrollY
      const end = how.offsetTop + how.offsetHeight - vh
      setF(Math.round(clamp01(y / Math.max(1, end)) * 400) / 400)
      setHeroTurn(Math.round(clamp01(y / (vh * 0.9)) * 200) / 200)
      const r = how.getBoundingClientRect()
      setHowTurn(Math.round(clamp01((vh - r.top) / (r.height * 0.8)) * 200) / 200)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)

    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("is-in")),
      { threshold: 0.2 },
    )
    document.querySelectorAll(".cc-mask").forEach((el) => io.observe(el))
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      if (frame) cancelAnimationFrame(frame)
      io.disconnect()
    }
  }, [])

  return (
    <div className="min-h-svh bg-dispatch text-ink antialiased">
      <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />

      <nav className="sticky top-0 z-40 bg-dispatch text-paper">
        <div className="cc-wrap flex h-16 items-center justify-between">
          <Wordmark href="/" size="md" variant="paper" />
          <div className="hidden md:flex items-center gap-8 text-base">
            {NAV.map(([id, label]) => (
              <button key={id} onClick={() => scrollToSection(id)} className="cc-link">
                {label}
              </button>
            ))}
            <Link href="/login" className="cc-link">
              Log in
            </Link>
            <a href={STORE_URL} target="_blank" rel="noopener noreferrer" className="cc-btn cc-btn-paper cc-btn-sm">
              Install
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
            className="md:hidden h-11 w-11 inline-flex items-center justify-center"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="square"
                strokeWidth={2}
                d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 7h16M4 12h16M4 17h16"}
              />
            </svg>
          </button>
        </div>
        {isMobileMenuOpen && (
          <div className="md:hidden bg-dispatch cc-wrap pb-6 flex flex-col gap-1 text-lg">
            {NAV.map(([id, label]) => (
              <button
                key={id}
                onClick={() => {
                  scrollToSection(id)
                  setIsMobileMenuOpen(false)
                }}
                className="text-left py-3"
              >
                {label}
              </button>
            ))}
            <Link href="/login" className="py-3">
              Log in
            </Link>
            <a href={STORE_URL} target="_blank" rel="noopener noreferrer" className="cc-btn cc-btn-paper mt-3">
              Install Chrome extension
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        )}
      </nav>

      {/* Dispatch */}
      <section className="cc-chapter bg-dispatch text-paper" data-chapter="dispatch">
        <div className="cc-wrap">
          <div className="cc-mosaic">
            <div className="cc-cell cc-cell-replica bg-scene">
              <Replica f={f} turn={heroTurn} />
            </div>
            <figure className="cc-cell cc-cell-a">
              <img src="/photos/chicago-ambulance-at-night-6d2b5162.jpg" width={1920} height={1231} alt="An ambulance with its lights on, crossing a city street at night" className="cc-photo" />
            </figure>
            <div className="cc-cell cc-cell-b bg-transport" aria-hidden />
            <figure className="cc-cell cc-cell-c">
              <img src="/photos/new-vernon-volunteer-ambulance.jpg" width={1920} height={1440} alt="Two New Vernon volunteer ambulances parked outside the squad building" className="cc-photo" />
            </figure>
            <figure className="cc-cell cc-cell-d">
              <img src="/photos/2023-05-20-15-50-02-ewing.jpg" width={1920} height={1440} alt="An Ewing Township EMS ambulance parked on a residential street" className="cc-photo" />
            </figure>
            <div className="cc-cell cc-cell-e bg-quarters" aria-hidden />
          </div>

          <div className="cc-grid pt-8 lg:pt-8 pb-16 lg:pb-12">
            <div className="col-span-12 cc-mask">
              <h1 className="cc-display cc-rise">The chart writes itself.</h1>
            </div>
            <p className="col-span-12 lg:col-span-8 mt-6 cc-lead">
              After the call, just narrate what happened. NarrateEMS writes your Zoll ePCR for you:
              70% faster on average, each page filled in under 10 seconds.
            </p>
            <div className="col-span-12 mt-6 flex flex-wrap items-center gap-4">
              <a href={STORE_URL} target="_blank" rel="noopener noreferrer" className="cc-btn cc-btn-paper">
                Install Chrome extension
                <ArrowUpRight className="h-5 w-5" />
              </a>
              <button onClick={() => setShowVideoModal(true)} className="cc-btn cc-btn-ghost-paper">
                <Play className="h-5 w-5" />
                Watch the demo
              </button>
            </div>
            <p className="col-span-12 mt-6 cc-small text-paper">
              HIPAA compliant. End-to-end encrypted. Direct Zoll ePCR. Mobile compatible.
            </p>
          </div>
        </div>
      </section>

      {/* On scene */}
      <section id="how" className="cc-chapter bg-scene text-ink" data-chapter="scene" ref={howRef}>
        <div className="cc-wrap cc-grid py-20 lg:py-28">
          <div className="col-span-12 lg:col-span-6 hidden lg:block">
            <div className="cc-pin">
              <Replica f={f} turn={howTurn} />
            </div>
          </div>
          <div className="col-span-12 lg:col-span-6">
            <div className="cc-mask">
              <h2 className="cc-h2 cc-rise">Three steps, after the call.</h2>
            </div>
            <p className="mt-6 cc-lead max-w-xl">
              You worked the call. Now you talk it through once, into your phone or laptop, and
              NarrateEMS handles the rest. No new dashboard, no extra tab.
            </p>
            <ol className="mt-16">
              {STEPS.map((s) => (
                <li key={s.title} className="cc-step">
                  <h3 className="cc-h3">{s.title}</h3>
                  <p className="mt-4 cc-body max-w-xl">{s.body}</p>
                  <p className="mt-5 cc-body font-semibold">{s.detail}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Transport */}
      <section id="field" className="cc-chapter bg-transport text-white" data-chapter="transport">
        <div className="cc-wrap cc-grid py-20 lg:py-28">
          <blockquote className="col-span-12 lg:col-span-10 cc-mask">
            <p className="cc-quote cc-rise">&ldquo;Saved me hours of documentation.&rdquo;</p>
          </blockquote>
          <p className="col-span-12 mt-8 cc-lead">
            Kendall Park First Aid Squad, New Jersey EMS provider
          </p>
        </div>
      </section>

      <section id="why" className="cc-chapter bg-transport text-paper pb-20 lg:pb-28" data-chapter="transport">
        <div className="cc-wrap">
          <div className="cc-grid bg-dispatch">
            <div className="col-span-12 lg:col-span-5">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Image.jpg-zZeluLIQJ3rB3PKe7tKcfoKfekukF6.jpeg"
                alt="EMT providing patient care in the field"
                className="cc-medic"
                loading="lazy"
              />
            </div>
            <div className="col-span-12 lg:col-span-7 p-8 lg:p-14 flex flex-col">
              <div className="cc-mask">
                <h2 className="cc-h2 cc-rise">We built it for ourselves first.</h2>
              </div>
              <p className="mt-6 cc-lead max-w-2xl">
                Six-plus years working calls. We know what charting feels like at the end of a
                sixteen-hour shift, because we lived it. NarrateEMS is the tool we wished we had
                when we were the ones typing.
              </p>
              <dl className="mt-auto pt-12 grid sm:grid-cols-3 gap-8">
                <div>
                  <dt className="cc-body">Field experience on the team</dt>
                  <dd className="cc-h3 mt-2 order-first">6+ yrs</dd>
                </div>
                <div>
                  <dt className="cc-body">Old way: typing per call</dt>
                  <dd className="cc-h3 mt-2">1 hr</dd>
                </div>
                <div>
                  <dt className="cc-body">New way: narrate, sign, done</dt>
                  <dd className="cc-h3 mt-2">&lt;3 min</dd>
                </div>
              </dl>
              <p className="mt-10 cc-body font-semibold">Made in New Jersey</p>
            </div>
          </div>
        </div>
      </section>

      {/* Back at quarters */}
      <section id="squads" className="cc-chapter bg-quarters text-ink" data-chapter="quarters">
        <div className="cc-wrap cc-grid py-20 lg:py-28">
          <div className="col-span-12 cc-mask mb-12">
            <h2 className="cc-h2 cc-rise">Run a department? We&apos;ve got you.</h2>
          </div>
          <div className="col-span-12 lg:col-span-7">
            <img
              src="/photos/us-navy-120119-n-cd652-002-emergency.jpg"
              width={1920}
              height={1371}
              alt="EMT trainees loading a patient on a stretcher into an ambulance"
              className="cc-plate"
              loading="lazy"
            />
            <div className="grid sm:grid-cols-2">
              <a href="https://calendly.com/narrateems/narrateems" target="_blank" rel="noopener noreferrer" className="cc-action bg-dispatch text-paper">
                Book a squad walkthrough
                <ArrowUpRight className="h-6 w-6" />
              </a>
              <button onClick={() => scrollToSection("pricing")} className="cc-action bg-scene text-ink">
                See squad pricing
                <ArrowUpRight className="h-6 w-6" />
              </button>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-5 mt-12 lg:mt-0">
            <p className="cc-lead">
              One squad code. One bill. Every medic charting faster from day one. No per-seat
              math, no provisioning meetings.
            </p>
            <dl className="mt-10 space-y-7">
              {SQUAD_FEATURES.map((s) => (
                <div key={s.title}>
                  <dt className="cc-body font-semibold">{s.title}</dt>
                  <dd className="cc-body mt-1">{s.body}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section id="pricing" className="cc-chapter bg-step text-ink" data-chapter="quarters">
        <div className="cc-wrap py-20 lg:py-28">
          <div className="cc-grid">
            <div className="col-span-12 lg:col-span-7 cc-mask">
              <h2 className="cc-h2 cc-rise">Pay for charts. Not seats.</h2>
            </div>
            <div className="col-span-12 lg:col-span-5 mt-6 lg:mt-0">
              <p className="cc-lead">
                Individuals get a flat monthly rate. Squads pay annually with a chart bundle that
                fits your call volume. Simple overage if you go over.
              </p>
              <p className="mt-4 cc-body font-semibold">7-day free trial on every plan</p>
            </div>
          </div>

          <div className="mt-12 inline-flex" role="group" aria-label="Plan type">
            {(
              [
                ["individual", "Individual medic"],
                ["squad", "Squad / Department"],
              ] as const
            ).map(([tab, label]) => (
              <button
                key={tab}
                onClick={() => setPricingTab(tab)}
                aria-pressed={pricingTab === tab}
                className={`cc-toggle ${pricingTab === tab ? "bg-dispatch text-paper" : "bg-quarters text-ink"}`}
              >
                {label}
              </button>
            ))}
          </div>

          {pricingTab === "individual" && (
            <div className="mt-10 cc-grid">
              <div className="col-span-12 md:col-span-6 lg:col-span-4 bg-quarters p-8 flex flex-col cc-tier" style={{ minHeight: "30rem" }}>
                <h3 className="cc-h3">Individual</h3>
                <p className="cc-body mt-1">For solo medics</p>
                <p className="cc-h2 mt-8 tabular-nums">$29.99</p>
                <p className="cc-body">/ month</p>
                <ul className="mt-8 space-y-2 cc-body flex-1">
                  {INDIVIDUAL_LINES.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
                <button onClick={() => handlePlanSelect("individual_monthly")} className="cc-btn cc-btn-navy mt-8 w-full">
                  Start 7-day free trial
                </button>
              </div>
            </div>
          )}

          {pricingTab === "squad" && (
            <div className="mt-10 grid md:grid-cols-2 xl:grid-cols-4 xl:items-end">
              {SQUAD_PLANS.map((p) => (
                <div key={p.id} className={`p-8 flex flex-col cc-tier ${p.tone}`} style={{ minHeight: p.height }}>
                  {p.popular && <p className="cc-body font-semibold mb-3">Most chosen</p>}
                  <h3 className="cc-h3">{p.name}</h3>
                  <p className="cc-body mt-1">{p.blurb}</p>
                  <p className="cc-h2 mt-8 tabular-nums">${p.price}</p>
                  <p className="cc-body">/ year</p>
                  <ul className="mt-8 space-y-2 cc-body flex-1">
                    <li>
                      <span className="font-semibold tabular-nums">{p.charts}</span> charts included
                    </li>
                    <li>
                      <span className="font-semibold">{p.overage}</span> per extra chart
                    </li>
                    <li>Squad codes &amp; admin controls</li>
                    <li>One bill, billed annually</li>
                  </ul>
                  <button
                    onClick={() => handlePlanSelect(p.id)}
                    className={`cc-btn mt-8 w-full ${p.dark ? "cc-btn-paper" : "cc-btn-navy"}`}
                  >
                    Start free trial
                  </button>
                </div>
              ))}
            </div>
          )}

          <p className="mt-10 cc-body">
            Need a custom plan or county-wide contract?{" "}
            <a href="mailto:narrateems@gmail.com" className="font-semibold underline underline-offset-4">
              Talk to a medic
            </a>
          </p>
        </div>
      </section>

      <section className="cc-chapter bg-scene text-ink" data-chapter="scene" aria-label="Results">
        <div className="cc-wrap py-16 lg:py-20">
          <dl className="cc-grid gap-y-10">
            {STATS.map(([value, label]) => (
              <div key={label} className="col-span-6 lg:col-span-3 flex flex-col-reverse">
                <dt className="cc-body mt-2">{label}</dt>
                <dd className="cc-h2 tabular-nums">{value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-10 cc-body max-w-2xl">
            Squads we work with report 70% faster charting on average, with each chart page filling
            in under 10 seconds.
          </p>
        </div>
      </section>

      <section id="security" className="cc-chapter bg-step text-ink" data-chapter="quarters">
        <div className="cc-wrap cc-grid py-20 lg:py-28">
          <div className="col-span-12 lg:col-span-5">
            <div className="cc-mask">
              <h2 className="cc-h2 cc-rise">Patient data is sacred.</h2>
            </div>
            <p className="mt-6 cc-lead max-w-md">
              We built this for the same patients we used to treat. The security posture matches the
              trust the badge carries.
            </p>
            <a href="mailto:narrateems@gmail.com?subject=Security%20questions" className="mt-8 inline-flex items-center gap-2 cc-body font-semibold underline underline-offset-4">
              Security questions? Email a medic
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
          <ul className="col-span-12 lg:col-span-7 mt-12 lg:mt-0 space-y-10">
            {SECURITY.map((item) => (
              <li key={item.title}>
                <h3 className="cc-h3">{item.title}</h3>
                <p className="mt-2 cc-body max-w-xl">{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="faq" className="cc-chapter bg-quarters text-ink" data-chapter="quarters">
        <div className="cc-wrap cc-grid py-20 lg:py-28">
          <div className="col-span-12 cc-mask mb-12">
            <h2 className="cc-h2 cc-rise">Things medics actually ask us.</h2>
          </div>
          <div className="col-span-12 lg:col-span-4">
            <p className="cc-body max-w-sm">
              Can&apos;t find what you&apos;re looking for?{" "}
              <a href="mailto:narrateems@gmail.com" className="font-semibold underline underline-offset-4">
                Email us
              </a>
              . A real medic from the team writes back.
            </p>
          </div>
          <ul className="col-span-12 lg:col-span-8 mt-12 lg:mt-0 space-y-2">
            {FAQ.map((item, i) => {
              const isOpen = openFaq === i
              return (
                <li key={item.q} className="bg-step">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between gap-6 text-left px-6 py-5 lg:px-8 cc-body font-semibold"
                  >
                    {item.q}
                    <span aria-hidden className="cc-h3 shrink-0 leading-none">{isOpen ? "−" : "+"}</span>
                  </button>
                  {isOpen && <p className="px-6 pb-6 lg:px-8 cc-body max-w-2xl">{item.a}</p>}
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      {/* Close */}
      <section id="start" className="cc-chapter bg-dispatch text-paper" data-chapter="dispatch">
        <div className="cc-wrap cc-grid py-20 lg:py-28">
          <div className="col-span-12 lg:col-span-6">
            <div className="cc-mask">
              <h2 className="cc-h2 cc-rise">Go home an hour earlier tonight.</h2>
            </div>
            <p className="mt-6 cc-lead max-w-xl">
              Install the Chrome extension, run your next call, and narrate it on the way back. Your
              Zoll chart will be ready by the time you sit down.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a href={STORE_URL} target="_blank" rel="noopener noreferrer" className="cc-btn cc-btn-paper">
                Install Chrome extension
                <ArrowUpRight className="h-5 w-5" />
              </a>
              <a href="https://calendly.com/narrateems/narrateems" target="_blank" rel="noopener noreferrer" className="cc-btn cc-btn-ghost-paper">
                Or book a squad walkthrough
                <ArrowUpRight className="h-5 w-5" />
              </a>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-5 lg:col-start-8 mt-12 lg:mt-0 bg-quarters text-ink p-8" data-ui>
            <h3 className="cc-h3">Or send us a note</h3>
            <form onSubmit={handleSubmit} className="mt-6 space-y-3">
              <div className="grid sm:grid-cols-2 gap-3">
                <input type="text" aria-label="Name" placeholder="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="cc-input" />
                <input type="email" aria-label="Email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required className="cc-input" />
              </div>
              <input type="text" aria-label="Squad or department" placeholder="Squad / Department" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} required className="cc-input" />
              <textarea aria-label="Message" placeholder="What does your charting workflow look like today?" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} required rows={3} className="cc-input resize-none" />
              <button type="submit" disabled={isSubmitting} className="cc-btn cc-btn-navy w-full disabled:opacity-60">
                {isSubmitting ? "Sending…" : "Send message"}
                <ArrowUpRight className="h-5 w-5" />
              </button>
              <a href="mailto:narrateems@gmail.com" className="flex items-center gap-2 pt-2 cc-body">
                <Mail className="h-4 w-4" />
                narrateems@gmail.com
              </a>
            </form>
          </div>
        </div>
      </section>

      <footer className="bg-dispatch text-paper">
        <div className="cc-wrap cc-grid pb-12 gap-y-8">
          <div className="col-span-12 md:col-span-4">
            <Wordmark variant="paper" size="lg" />
          </div>
          <div className="col-span-12 md:col-span-4 flex flex-wrap gap-x-6 gap-y-2 cc-body">
            <Link href="/privacy-policy" className="cc-link">Privacy</Link>
            <Link href="/terms-of-service" className="cc-link">Terms</Link>
            <Link href="/sla" className="cc-link">SLA</Link>
            <a href="mailto:narrateems@gmail.com" className="cc-link">Contact</a>
          </div>
          <p className="col-span-12 md:col-span-4 cc-body md:text-right">© 2026 NarrateEMS</p>
          <p className="col-span-12 cc-small cc-credits">
            Photos:{" "}
            {CREDITS.map((c, i) => (
              <span key={c.href}>
                <a href={c.href}>{c.title}</a> by {c.by}, {c.licence}, via Wikimedia Commons
                {i < CREDITS.length - 1 ? "; " : "."}
              </span>
            ))}
          </p>
        </div>
      </footer>

      {showVideoModal && (
        <div className="fixed inset-0 z-50 bg-dispatch/90 flex items-center justify-center p-4" onClick={() => setShowVideoModal(false)}>
          <button onClick={() => setShowVideoModal(false)} aria-label="Close video" className="absolute top-4 right-4 h-12 w-12 inline-flex items-center justify-center bg-quarters text-ink">
            <X className="h-6 w-6" />
          </button>
          <div className="relative w-full max-w-5xl aspect-video bg-black" onClick={(e) => e.stopPropagation()}>
            <iframe
              className="absolute inset-0 w-full h-full"
              src="https://www.youtube.com/embed/qvp9YXTCtZA?autoplay=1&rel=0"
              title="NarrateEMS product demo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 bg-dispatch/90 flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-quarters text-ink p-8">
            <button onClick={() => setShowCheckoutModal(false)} aria-label="Close" className="absolute top-3 right-3 h-11 w-11 inline-flex items-center justify-center">
              <X className="h-5 w-5" />
            </button>
            <p className="cc-body">Step 1 of 2: create account</p>
            <h3 className="cc-h3 mt-2">Get started.</h3>
            <p className="cc-body mt-2">{selectedPlan?.type && getPlanDisplayInfo(selectedPlan.type)}</p>
            <form onSubmit={handleCheckout} className="mt-6 space-y-4">
              <div>
                <label htmlFor="checkout-email" className="cc-body font-semibold">Email</label>
                <input id="checkout-email" type="email" required value={checkoutEmail} onChange={(e) => setCheckoutEmail(e.target.value)} placeholder="you@example.com" className="cc-input mt-1" />
              </div>
              <div>
                <label htmlFor="checkout-password" className="cc-body font-semibold">Password</label>
                <input id="checkout-password" type="password" required minLength={6} value={checkoutPassword} onChange={(e) => setCheckoutPassword(e.target.value)} placeholder="At least 6 characters" className="cc-input mt-1" />
              </div>
              {checkoutError && <p className="cc-body bg-transport text-white px-4 py-3">{checkoutError}</p>}
              <button type="submit" disabled={isCheckoutLoading} className="cc-btn cc-btn-navy w-full disabled:opacity-60">
                {isCheckoutLoading ? "Processing…" : "Continue to payment →"}
              </button>
              <p className="cc-small">
                By continuing, you agree to our{" "}
                <Link href="/terms-of-service" className="underline underline-offset-2">Terms</Link> and{" "}
                <Link href="/privacy-policy" className="underline underline-offset-2">Privacy Policy</Link>.
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
