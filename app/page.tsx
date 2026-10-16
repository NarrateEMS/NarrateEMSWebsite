"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Wordmark } from "@/components/wordmark"
import { X } from "lucide-react"

const STORE_URL =
  "https://chromewebstore.google.com/detail/narrateems-ai-medic-voice/nokdpnigpfafepjbdinggckgcdekdjkm"
const CALENDLY_URL = "https://calendly.com/narrateems/narrateems"
const MEDIC_PHOTO =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Image.jpg-zZeluLIQJ3rB3PKe7tKcfoKfekukF6.jpeg"

const PAGES = ["1", "2", "3", "4", "5", "8", "N"]
type ChipState = "idle" | "filling" | "filled" | "failed"
type PopState = "rec" | "fill" | "done"
const STATUS: Record<PopState, string> = {
  rec: "Recording 0:42",
  fill: "Filling the chart",
  done: "Chart filled",
}

// Made-up sample calls. No patient data.
const NARRATIONS = [
  {
    label: "Chest pain",
    text: "Sixty-four year old male, chest pain that started at rest about thirty minutes ago. Pulse 96, BP 152 over 90, SpO2 95 on room air. Gave 324 of aspirin. Transported to County General, no lights.",
    fields: [
      ["Age / sex", "64 / M"],
      ["Chief complaint", "Chest pain at rest"],
      ["Pulse", "96"],
      ["Blood pressure", "152/90"],
      ["SpO2", "95% RA"],
      ["Treatment", "Aspirin 324 mg PO"],
    ],
    narrative:
      "64 y/o M c/o chest pain, onset at rest ~30 min PTA. HR 96, BP 152/90, SpO2 95% RA. ASA 324 mg PO. Transported non-emergent to County General.",
  },
  {
    label: "Fall from a ladder",
    text: "Twenty-nine year old female, fell about eight feet from a ladder onto her left arm. Left wrist pain and deformity, no loss of consciousness. Pulse 88, BP 124 over 78, SpO2 99. Splinted the left wrist. Transported to County General.",
    fields: [
      ["Age / sex", "29 / F"],
      ["Chief complaint", "Fall, left wrist injury"],
      ["Pulse", "88"],
      ["Blood pressure", "124/78"],
      ["SpO2", "99% RA"],
      ["Treatment", "Splint, left wrist"],
    ],
    narrative:
      "29 y/o F s/p fall ~8 ft from ladder onto L arm. L wrist pain and deformity, denies LOC. HR 88, BP 124/78, SpO2 99% RA. L wrist splinted. Transported to County General.",
  },
  {
    label: "Short of breath",
    text: "Seventy-one year old male, short of breath since this morning, history of COPD. Pulse 110, BP 138 over 84, SpO2 88, up to 94 on four liters nasal cannula. Transported to County General.",
    fields: [
      ["Age / sex", "71 / M"],
      ["Chief complaint", "Shortness of breath"],
      ["Pulse", "110"],
      ["Blood pressure", "138/84"],
      ["SpO2", "88% RA, 94% on O2"],
      ["Treatment", "O2 4 L/min NC"],
    ],
    narrative:
      "71 y/o M c/o SOB since AM, hx COPD. HR 110, BP 138/84, SpO2 88% RA, 94% on O2 4 L/min NC. Transported to County General.",
  },
]

const HOW_STEPS = [
  {
    name: "Narrate",
    title: "Narrate the call.",
    body: "Once you're clear of the call, open the extension and walk through it the way you'd brief your partner: demographics, chief complaint, vitals, interventions, transport. Talk normally.",
    detail: "Mobile compatible. Use it on your phone or laptop.",
  },
  {
    name: "Structure",
    title: "AI structures the chart.",
    body: "Medical-terminology-trained transcription parses your narration into the right Zoll ePCR fields: demographics, chief complaint, assessment, treatment, transport, each placed where it belongs.",
    detail: "Each page fills in under 10 seconds.",
  },
  {
    name: "In Zoll",
    title: "Chart is in Zoll. You're done.",
    body: "Fields land directly inside your Zoll ePCR. Review, sign, submit. Done in minutes, not the hour you used to spend typing.",
    detail: "Direct Zoll integration. HIPAA encrypted.",
  },
]
const HOW_POPUP: { state: PopState; chips: ChipState[]; transcript: string }[] = [
  { state: "rec", chips: Array(7).fill("idle"), transcript: NARRATIONS[0].text.slice(0, 92) + "…" },
  {
    state: "fill",
    chips: ["filled", "filled", "filled", "filling", "idle", "idle", "idle"],
    transcript: NARRATIONS[0].text,
  },
  { state: "done", chips: Array(7).fill("filled"), transcript: NARRATIONS[0].text },
]

const SQUAD_BANDS = [
  ["Squad codes", "Hand out one code at orientation. New medics join your plan in a click, no email back-and-forth."],
  ["Chart bundles", "Plans start at 500 charts and scale to 10,000+. Pay for what your squad actually runs, with simple overage pricing."],
  ["Real-time usage", "See how many charts your squad has filed this period. No surprises at renewal."],
  ["HIPAA from day one", "End-to-end encryption on every recording and chart. Patient data never leaves the secure pipeline."],
  ["Works on what you've got", "Chrome on the rig laptop, phone on the bench, tablet at the station. Same login, same workflow."],
  ["Squad admin controls", "Promote leads, revoke former members, transfer billing. Run it like you run shifts."],
]

const SQUAD_PLANS = [
  { id: "pilot_annual", name: "Pilot", blurb: "Test it with a small crew", price: "1,000", charts: "500", overage: "$2.50", popular: false },
  { id: "small_squad_annual", name: "Small Squad", blurb: "Volunteer + small services", price: "3,000", charts: "2,000", overage: "$1.90", popular: true },
  { id: "large_squad_annual", name: "Large Squad", blurb: "City and county departments", price: "6,000", charts: "5,000", overage: "$1.40", popular: false },
  { id: "high_volume_annual", name: "High Volume", blurb: "Regional and 911 contractors", price: "10,000", charts: "10,000", overage: "$1.15", popular: false },
]

const SECURITY = [
  { phrase: "HIPAA compliant", title: "HIPAA compliant", body: "Built to HIPAA standards from day one. We sign BAAs with squads and services." },
  { phrase: "encrypted end to end", title: "Encrypted end to end", body: "Recordings, transcripts, and chart data are encrypted in transit and at rest." },
  { phrase: "seen only by you and your squad", title: "Your data, your account", body: "Only you and your authorized squad members can see your charts. Period." },
  { phrase: "never sold, never trained on", title: "Never sold. Never trained on.", body: "Patient data is not sold and is not used to train third-party models." },
]

const FAQS = [
  { q: "Do I have to narrate during the call?", a: "No, and you shouldn't. Work the call. Once you're clear, open NarrateEMS and narrate what happened the way you'd brief your partner. The chart writes from your post-call narration." },
  { q: "Does it actually work with my service's Zoll setup?", a: "Yes. The Chrome extension sits on top of your active Zoll ePCR session and writes directly into the same fields you'd type into. No custom integration, no IT ticket." },
  { q: "Who can hear my recordings?", a: "Only you. Recordings are end-to-end encrypted, stored against your account, and never sold or used to train third-party models. Squad admins see usage counts, not recordings." },
  { q: "What if I'm on my phone, not the rig laptop?", a: "Use it. NarrateEMS works on mobile browsers too. Narrate from your phone, sign off later from your laptop, or stay on mobile the whole time. Same account, same chart." },
  { q: "How much faster is it really?", a: "Squads we work with report 70% faster charting on average, with each chart page filling in under 10 seconds. That's the difference between an hour of typing after a shift and getting home on time." },
  { q: "What happens during the free trial?", a: "7 days, no card required upfront for individuals. Full product. If it doesn't save you time, cancel before day 7 and you're not charged." },
  { q: "Can my whole squad use one account?", a: "No. Every medic gets their own login (records belong to them), but a squad code lets all your medics roll up to a single annual plan and one bill." },
]

const PHOTO_CREDITS = [
  { what: "Ewing Township EMS ambulance, Mercer County, New Jersey", by: "Famartin", lic: "CC BY-SA 4.0", href: "https://commons.wikimedia.org/w/index.php?curid=132152147" },
  { what: "Ramsey Ambulance Corps, New Jersey", by: "Captain-tucker", lic: "CC BY-SA 3.0", href: "https://commons.wikimedia.org/w/index.php?curid=7021403" },
  { what: "Ambulance interior", by: "Ypy31", lic: "public domain", href: "https://commons.wikimedia.org/wiki/File:Ambulance-interior.jpg" },
]

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const ease = (v: number) => 1 - Math.pow(1 - v, 3)

function MiniPopup({
  state,
  chips,
  transcript,
  label,
}: {
  state: PopState
  chips: ChipState[]
  transcript: string
  label: string
}) {
  return (
    <div data-ui="NarrateEMS extension popup (replica)" aria-label={label} role="img" className="rp" data-state={state} data-pop>
      <div className="rp-head">
        <span className="rp-mark">
          narrate<b>ems</b>
        </span>
        <span className="rp-avatar" />
      </div>
      <div className="rp-tabs">
        <span className="on">Recording</span>
        <span>Checklist</span>
        <span>Samples</span>
        <span>Settings</span>
      </div>
      <div className="rp-body">
        <div className="rp-label">Chart page</div>
        <div className="rp-chips">
          {PAGES.map((p, i) => (
            <span key={p} data-chip data-state={chips[i]}>
              {p}
            </span>
          ))}
        </div>
        <div className="rp-speak">
          <span className="rp-dot" />
          <span className="rp-when-rec">Stop narrating</span>
          <span className="rp-when-idle">Start narrating</span>
        </div>
        <div className="rp-label">Transcript</div>
        <div className="rp-transcript">
          <span data-transcript>{transcript}</span>
        </div>
        <div className="rp-actions">
          <span>Cancel</span>
          <span className="rp-fill">Fill the chart</span>
        </div>
        <p className="rp-status" data-status>
          {STATUS[state]}
        </p>
      </div>
    </div>
  )
}

function ChartFragment({ n }: { n: (typeof NARRATIONS)[number] }) {
  return (
    <div data-ui="Zoll emsCharts chart page (replica)" className="zc" role="img" aria-label="Zoll emsCharts chart page, filled from the sample narration">
      <div className="zc-bar">
        <b>emsCharts</b>
        <span>Patient care report, sample call</span>
      </div>
      <div className="zc-tabs">
        {["Page 1", "2", "3", "4", "5", "8", "Narrative"].map((t, i) => (
          <span key={t} className={i === 0 ? "on" : undefined}>
            {t}
          </span>
        ))}
      </div>
      <div className="zc-grid">
        {n.fields.map(([l, v]) => (
          <div key={l} className="zc-f" data-field data-state="filled">
            <span className="zc-l">{l}</span>
            <span className="zc-v">{v}</span>
          </div>
        ))}
      </div>
      <div className="zc-narr zc-f" data-field data-state="filled">
        <span className="zc-l">Narrative</span>
        <span className="zc-v">{n.narrative}</span>
      </div>
    </div>
  )
}

export default function HomePage() {
  const [formData, setFormData] = useState({ name: "", email: "", company: "", message: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showCheckoutModal, setShowCheckoutModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<{ type: string } | null>(null)
  const [checkoutEmail, setCheckoutEmail] = useState("")
  const [checkoutPassword, setCheckoutPassword] = useState("")
  const [checkoutError, setCheckoutError] = useState("")
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false)
  const [showVideoModal, setShowVideoModal] = useState(false)
  const [pricingTab, setPricingTab] = useState<"individual" | "squad">("squad")

  const [narration, setNarration] = useState(0)
  const [howStep, setHowStep] = useState(0)
  const [litPhrase, setLitPhrase] = useState(0)
  const heroRef = useRef<HTMLElement>(null)
  const replayRef = useRef<(i: number) => void>(() => {})

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

  useEffect(() => {
    const locked = showCheckoutModal || showVideoModal || isMobileMenuOpen
    document.body.style.overflow = locked ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [showCheckoutModal, showVideoModal, isMobileMenuOpen])

  // The live thing: the stage grows out of the sentence, flattens, and the chart fills as you scroll.
  // Without JS or with reduced motion, nothing here runs and the markup shows the filled chart.
  useEffect(() => {
    const hero = heroRef.current
    if (!hero || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const pin = hero.querySelector<HTMLElement>(".hero-pin")!
    const stage = hero.querySelector<HTMLElement>(".stage")!
    const inner = hero.querySelector<HTMLElement>(".stage-3d")!
    const slot = hero.querySelector<HTMLElement>(".slot")!
    const fade = hero.querySelector<HTMLElement>(".hero-fade")!
    const after = hero.querySelector<HTMLElement>(".hero-after")!
    const wide = window.matchMedia("(min-width: 1024px) and (min-height: 640px)")
    hero.classList.add("is-motion")

    let live = false
    let geo = { sx: 0, sy: 0, s0: 0.05, s1: 1, ty: 0, lift: 0 }
    let text = ""
    let typed = -1
    let replayFrom: number | null = null
    let raf = 0
    let els = { pop: stage, chips: [] as HTMLElement[], fields: [] as HTMLElement[], tr: stage, st: stage }

    const collect = () => {
      els = {
        pop: stage.querySelector<HTMLElement>("[data-pop]")!,
        chips: Array.from(stage.querySelectorAll<HTMLElement>("[data-chip]")),
        fields: Array.from(stage.querySelectorAll<HTMLElement>("[data-field]")),
        tr: stage.querySelector<HTMLElement>("[data-transcript]")!,
        st: stage.querySelector<HTMLElement>("[data-status]")!,
      }
      typed = -1
    }

    const measure = () => {
      live = wide.matches
      hero.classList.toggle("is-live", live)
      stage.style.transform = ""
      fade.style.transform = ""
      if (!live) return
      const pr = pin.getBoundingClientRect()
      const sr = slot.getBoundingClientRect()
      geo = {
        sx: sr.left + sr.width / 2 - (pr.left + pr.width / 2),
        sy: sr.top + sr.height / 2 - (pr.top + pr.height / 2),
        s0: Math.min(sr.height / 680, sr.width / 1200) * 0.8,
        s1: Math.min(1, (pr.width * 0.92) / 1200, (pr.height * 0.78) / 680),
        ty: -pr.height * 0.05,
        lift: pr.height,
      }
    }

    const fill = (f: number) => {
      const n = Math.round(clamp01(f / 0.45) * text.length)
      if (n !== typed) {
        typed = n
        els.tr.textContent = text.slice(0, n)
      }
      const state: PopState = f < 0.45 ? "rec" : f < 1 ? "fill" : "done"
      if (els.pop.dataset.state !== state) {
        els.pop.dataset.state = state
        els.st.textContent = STATUS[state]
      }
      const step = 0.55 / els.chips.length
      els.chips.forEach((c, i) => {
        const at = 0.45 + (i + 1) * step
        c.dataset.state = f >= at - 0.001 ? "filled" : f >= at - step ? "filling" : "idle"
      })
      const fstep = 0.55 / els.fields.length
      els.fields.forEach((el, i) => {
        el.dataset.state = f >= 0.45 + (i + 1) * fstep - 0.001 ? "filled" : "idle"
      })
    }

    const frame = (now: number) => {
      raf = 0
      const vh = window.innerHeight
      let f: number
      if (live) {
        const r = hero.getBoundingClientRect()
        const p = clamp01(-r.top / Math.max(1, hero.offsetHeight - vh))
        const g = ease(clamp01(p / 0.5))
        const t = 1 - ease(clamp01(p / 0.62))
        const s = geo.s0 + (geo.s1 - geo.s0) * g
        stage.style.transform = `translate(${geo.sx * (1 - g)}px, ${geo.sy * (1 - g) + geo.ty * g}px) scale(${s})`
        stage.style.opacity = "1"
        inner.style.transform = `rotateX(${24 * t}deg) rotateY(${-20 * t}deg)`
        const out = clamp01((p - 0.02) / 0.22)
        fade.style.opacity = String(1 - out)
        fade.style.transform = `translateY(${-out * geo.lift}px)`
        const a = clamp01((p - 0.84) / 0.1)
        after.style.opacity = String(a)
        after.style.pointerEvents = a > 0.5 ? "auto" : "none"
        f = clamp01((p - 0.12) / 0.7)
      } else {
        const r = stage.getBoundingClientRect()
        const q = clamp01((vh - r.top) / (vh * 0.85))
        inner.style.transform = `rotateX(${18 * (1 - ease(q))}deg)`
        f = clamp01((q - 0.25) / 0.75)
      }
      if (replayFrom !== null) {
        const rf = clamp01((now - replayFrom) / 2800)
        if (rf >= 1) replayFrom = null
        else raf = requestAnimationFrame(frame)
        f = Math.min(f, rf)
      }
      fill(f)
    }

    const kick = () => {
      if (!raf) raf = requestAnimationFrame(frame)
    }
    const onResize = () => {
      measure()
      kick()
    }

    replayRef.current = (i: number) => {
      text = NARRATIONS[i].text
      collect()
      replayFrom = performance.now()
      kick()
    }
    text = NARRATIONS[0].text
    collect()
    measure()
    kick()
    document.fonts?.ready.then(onResize)
    window.addEventListener("scroll", kick, { passive: true })
    window.addEventListener("resize", onResize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("scroll", kick)
      window.removeEventListener("resize", onResize)
      hero.classList.remove("is-motion", "is-live")
      replayRef.current = () => {}
    }
  }, [])

  useEffect(() => {
    replayRef.current(narration)
  }, [narration])

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const id = window.setInterval(() => setLitPhrase((i) => (i + 1) % SECURITY.length), 2600)
    return () => window.clearInterval(id)
  }, [])

  const n = NARRATIONS[narration]
  const how = HOW_POPUP[howStep]
  const navLinks: [string, string][] = [
    ["how", "How it works"],
    ["squads", "For squads"],
    ["pricing", "Pricing"],
    ["security", "Security"],
    ["faq", "FAQ"],
  ]

  return (
    <div className="home min-h-svh bg-paper text-ink antialiased">
      <nav className="relative z-40 bg-paper">
        <div className="wrap flex items-center justify-between gap-6 py-5">
          <Wordmark href="/" size="md" />
          <div className="hidden lg:flex items-center gap-7 t-body font-semibold">
            {navLinks.map(([id, label]) => (
              <button key={id} onClick={() => scrollToSection(id)} className="hover:text-blue">
                {label}
              </button>
            ))}
            <Link href="/login" className="hover:text-blue">
              Log in
            </Link>
            <a href={STORE_URL} target="_blank" rel="noopener noreferrer" className="btn btn-blue">
              Install
            </a>
          </div>
          <button
            className="lg:hidden btn btn-tint"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? "Close" : "Menu"}
          </button>
        </div>
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute inset-x-0 top-full bg-paper-tint">
            <div className="wrap flex flex-col gap-1 py-4 t-lead font-semibold">
              {navLinks.map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => {
                    scrollToSection(id)
                    setIsMobileMenuOpen(false)
                  }}
                  className="text-left py-2"
                >
                  {label}
                </button>
              ))}
              <Link href="/login" className="py-2">
                Log in
              </Link>
              <a href={STORE_URL} target="_blank" rel="noopener noreferrer" className="btn btn-blue mt-2">
                Install Chrome extension
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* HERO: the sentence holds the chart in its slot */}
      <section ref={heroRef} className="hero relative">
        <div className="hero-pin">
          <div className="hero-fade wrap pt-[4vh] lg:pt-[6vh]">
            <h1 className="t-display">
              <span className="block whitespace-nowrap">
                The chart{" "}
                <span className="slot" aria-hidden="true">
                  <span className="slot-mini">
                    {PAGES.map((p) => (
                      <i key={p} />
                    ))}
                  </span>
                </span>
              </span>
              <span className="block whitespace-nowrap">writes itself.</span>
            </h1>
            <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,40rem)_auto] lg:items-end lg:justify-between">
              <p className="t-lead">
                After the call, just narrate what happened. NarrateEMS writes your Zoll ePCR for you: 70% faster on
                average, each page filled in under 10 seconds. Built by medics, for medics.
              </p>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
                <a href={STORE_URL} target="_blank" rel="noopener noreferrer" className="btn btn-blue">
                  Install Chrome extension
                </a>
                <button onClick={() => setShowVideoModal(true)} className="t-body font-semibold ulink">
                  Watch the demo
                </button>
              </div>
            </div>
            <p className="t-small mt-6 font-semibold">
              HIPAA compliant. End-to-end encrypted. Direct Zoll ePCR. Mobile compatible.
            </p>
          </div>

          <div className="wrap lg:px-0">
            <div className="stage">
              <div className="stage-3d">
                <ChartFragment key={`c${narration}`} n={n} />
                <div className="stage-pop">
                  <MiniPopup
                    key={`p${narration}`}
                    state="done"
                    chips={Array(7).fill("filled")}
                    transcript={n.text}
                    label="NarrateEMS popup with the sample transcript"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="hero-after">
            <div className="wrap flex flex-wrap items-baseline justify-center gap-x-5 gap-y-2 pt-6 lg:pt-0 pb-10 lg:pb-0 t-body">
              <span className="font-semibold">Sample calls, made up for this page:</span>
              {NARRATIONS.map((s, i) => (
                <button
                  key={s.label}
                  onClick={() => setNarration(i)}
                  aria-pressed={narration === i}
                  className={narration === i ? "font-bold text-blue ulink" : "font-semibold ulink"}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS: drag through the stages */}
      <section id="how" className="bg-paper-tint py-24 lg:py-32">
        <div className="wrap">
          <h2 className="t-head max-w-[14ch]">Three steps, after the call.</h2>
          <p className="t-body mt-6 max-w-[42rem]">
            You worked the call. Now you talk it through once, into your phone or laptop, and NarrateEMS handles the
            rest. No new dashboard, no extra tab.
          </p>
          <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,1fr)_26rem] lg:items-start">
            <div>
              <label htmlFor="how-range" className="t-body font-semibold">
                Drag through the stages
              </label>
              <input
                id="how-range"
                type="range"
                min={0}
                max={2}
                step={1}
                value={howStep}
                onChange={(e) => setHowStep(Number(e.target.value))}
                className="how-range mt-2"
                aria-valuetext={HOW_STEPS[howStep].name}
              />
              <ol className="mt-6 grid gap-3">
                {HOW_STEPS.map((s, i) => (
                  <li key={s.name}>
                    <button
                      onClick={() => setHowStep(i)}
                      aria-current={howStep === i ? "step" : undefined}
                      className={`w-full text-left rounded-[4px] p-6 lg:p-8 ${howStep === i ? "bg-ink text-white" : "bg-paper"}`}
                    >
                      <span className="t-lead font-bold block">{s.title}</span>
                      <span className="t-body block mt-3 max-w-[44rem]">{s.body}</span>
                      <span className="t-small font-semibold block mt-3">{s.detail}</span>
                    </button>
                  </li>
                ))}
              </ol>
            </div>
            <div className="lg:sticky lg:top-8">
              <MiniPopup
                state={how.state}
                chips={how.chips}
                transcript={how.transcript}
                label={`NarrateEMS popup at the ${HOW_STEPS[howStep].name} stage`}
              />
            </div>
          </div>
        </div>
      </section>

      {/* FROM THE FIELD: the quotation, edge to edge */}
      <section id="field" className="bg-paper pt-24 lg:pt-32">
        <div className="wrap">
          <blockquote className="t-head quote">Saved me hours of documentation.</blockquote>
          <p className="t-body mt-8">
            <span className="font-bold">Kendall Park First Aid Squad</span>, New Jersey, EMS provider
          </p>
          <dl className="mt-16 grid grid-cols-3 gap-6 lg:max-w-[64rem]">
            {[
              ["70%", "faster charting"],
              ["<10s", "per chart page"],
              ["1hr+", "saved per shift"],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="t-head">{k}</dt>
                <dd className="t-body mt-2">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <figure className="mt-20">
          <img
            src="/photos/ewing-ambulance.jpg"
            width={1600}
            height={1200}
            alt="A white Ewing Township EMS ambulance with the blue Star of Life parked on a tree-lined New Jersey street"
            loading="lazy"
            decoding="async"
            className="block w-full h-[56vw] max-h-[44rem] object-cover"
          />
          <figcaption className="wrap t-small pt-3 pb-8">
            Ewing Township EMS, Mercer County, New Jersey. Photo: Famartin, CC BY-SA 4.0.
          </figcaption>
        </figure>
      </section>

      {/* WHY: portrait as drop cap */}
      <section id="why" className="bg-paper-tint py-24 lg:py-32">
        <div className="wrap grid gap-14 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div>
            <h2 className="t-head max-w-[16ch]">We built it for ourselves first.</h2>
            <p className="t-lead mt-10 max-w-[46rem]">
              <img
                src={MEDIC_PHOTO}
                alt="EMT providing patient care in the field"
                loading="lazy"
                decoding="async"
                className="float-left mr-5 mb-2 mt-1 w-[7.5rem] h-[7.5rem] lg:w-[9.5rem] lg:h-[9.5rem] object-cover rounded-[4px]"
              />
              Six-plus years working calls. We know exactly what charting feels like at the end of a sixteen-hour
              shift, because we lived it. NarrateEMS is the tool we wished we had when we were the ones typing.
            </p>
          </div>
          <dl className="grid gap-8 content-start">
            {[
              ["6+ yrs", "field experience on the team"],
              ["1hr", "old way: typing per call"],
              ["<3min", "new way: narrate, sign, done"],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="t-head">{k}</dt>
                <dd className="t-body mt-2">{v}</dd>
              </div>
            ))}
            <p className="t-body font-bold">Made in New Jersey</p>
          </dl>
        </div>
      </section>

      {/* SQUADS: sentences in bands */}
      <section id="squads" className="bg-paper pt-24 lg:pt-32">
        <div className="wrap">
          <h2 className="t-head max-w-[16ch]">Run a department? We&apos;ve got you.</h2>
          <p className="t-lead mt-6 max-w-[42rem]">
            One squad code. One bill. Every medic charting faster from day one. No per-seat math, no provisioning
            meetings.
          </p>
        </div>
        <ul className="mt-14">
          {SQUAD_BANDS.map(([title, body], i) => (
            <li key={title} className={i % 2 ? "bg-paper" : "bg-paper-tint"}>
              <div className="wrap grid gap-3 py-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-baseline lg:gap-12">
                <h3 className="t-lead font-bold">{title}</h3>
                <p className="t-body">{body}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="wrap grid gap-10 py-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:items-center">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
            <button onClick={() => scrollToSection("pricing")} className="btn btn-ink">
              See squad pricing
            </button>
            <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="t-body font-semibold ulink">
              Book a squad walkthrough
            </a>
          </div>
          <figure>
            <img
              src="/photos/ramsey-ambulance-corps-2001.jpg"
              width={1600}
              height={1062}
              alt="The white clapboard building of the Ramsey Ambulance Corps in New Jersey, with its blue sign out front"
              loading="lazy"
              decoding="async"
              className="block w-full aspect-[3/2] object-cover rounded-[4px]"
            />
            <figcaption className="t-small pt-3">
              Ramsey Ambulance Corps, New Jersey. Photo: Captain-tucker, CC BY-SA 3.0.
            </figcaption>
          </figure>
        </div>
      </section>

      {/* PRICING: one plan as a sentence, squads as a typographic table */}
      <section id="pricing" className="bg-paper-tint py-24 lg:py-32">
        <div className="wrap">
          <h2 className="t-head">Pay for charts. Not seats.</h2>
          <p className="t-lead mt-6 max-w-[44rem]">
            Individuals get a flat monthly rate. Squads pay annually with a chart bundle that fits your call volume.
            Simple overage if you go over. 7-day free trial on every plan.
          </p>
          <div className="mt-10 inline-flex gap-1 rounded-[4px] bg-paper p-1" role="tablist" aria-label="Plan type">
            {(
              [
                ["individual", "Individual medic"],
                ["squad", "Squad / Department"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                role="tab"
                aria-selected={pricingTab === key}
                onClick={() => setPricingTab(key)}
                className={`btn ${pricingTab === key ? "btn-ink" : "bg-paper text-ink"}`}
              >
                {label}
              </button>
            ))}
          </div>

          {pricingTab === "individual" && (
            <div className="mt-12">
              <p className="t-head max-w-[18ch]">One medic, $29.99 a month.</p>
              <p className="t-lead mt-6 max-w-[48rem]">
                For solo medics: unlimited voice narrations, direct Zoll ePCR integration, Chrome extension and mobile,
                HIPAA encrypted end to end. Cancel any time.
              </p>
              <button onClick={() => handlePlanSelect("individual_monthly")} className="btn btn-blue mt-8">
                Start 7-day free trial
              </button>
            </div>
          )}

          {pricingTab === "squad" && (
            <div className="mt-12">
              <p className="t-head">Squads from $1,000 a year.</p>
              <ul className="mt-10 grid gap-1">
                {SQUAD_PLANS.map((p) => (
                  <li
                    key={p.id}
                    className="grid gap-4 rounded-[4px] bg-paper p-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)_auto] lg:items-center lg:gap-8 lg:px-8"
                  >
                    <div>
                      <h3 className="t-lead font-bold">
                        {p.name}
                        {p.popular && <span className="t-small font-semibold text-blue ml-3">Most chosen</span>}
                      </h3>
                      <p className="t-body">{p.blurb}</p>
                    </div>
                    <p className="t-body">
                      <span className="t-lead font-bold">${p.price}</span> / year
                    </p>
                    <p className="t-body">
                      <span className="font-bold">{p.charts} charts</span> included,{" "}
                      <span className="font-bold">{p.overage}</span> per extra chart
                    </p>
                    <button
                      onClick={() => handlePlanSelect(p.id)}
                      className={`btn ${p.popular ? "btn-blue" : "btn-ink"}`}
                    >
                      Start free trial
                    </button>
                  </li>
                ))}
              </ul>
              <p className="t-body mt-6">Every squad plan: squad codes and admin controls, one bill, billed annually.</p>
            </div>
          )}

          <p className="t-body mt-10">
            Need a custom plan or county-wide contract?{" "}
            <a href="mailto:narrateems@gmail.com" className="font-semibold ulink">
              Talk to a medic
            </a>
          </p>
        </div>
      </section>

      {/* SECURITY: the claims as one sentence */}
      <section id="security" className="bg-paper py-24 lg:py-32">
        <div className="wrap">
          <h2 className="t-head">Patient data is sacred.</h2>
          <p className="t-lead font-semibold mt-8 max-w-[52rem]">
            {SECURITY.map((s, i) => (
              <span key={s.phrase}>
                <span
                  className={`rounded-[4px] px-[0.15em] -mx-[0.15em] ${litPhrase === i ? "bg-blue text-white" : ""}`}
                  onMouseEnter={() => setLitPhrase(i)}
                >
                  {i === 0 ? s.phrase.charAt(0).toUpperCase() + s.phrase.slice(1) : s.phrase}
                </span>
                {i < SECURITY.length - 1 ? ", " : "."}
              </span>
            ))}
          </p>
          <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {SECURITY.map((s) => (
              <div key={s.title}>
                <h3 className="t-body font-bold">{s.title}</h3>
                <p className="t-body mt-2">{s.body}</p>
              </div>
            ))}
          </div>
          <p className="t-body mt-12 max-w-[44rem]">
            We built this for the same patients we used to treat. The security posture matches the trust the badge
            carries.{" "}
            <a href="mailto:narrateems@gmail.com?subject=Security%20questions" className="font-semibold ulink">
              Security questions? Email a medic
            </a>
          </p>
        </div>
      </section>

      {/* FAQ: every answer open */}
      <section id="faq" className="bg-paper-tint py-24 lg:py-32">
        <div className="wrap">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16 lg:items-end">
            <h2 className="t-head">Things medics actually ask us.</h2>
            <p className="t-body">
              Can&apos;t find what you&apos;re looking for?{" "}
              <a href="mailto:narrateems@gmail.com" className="font-semibold ulink">
                Email us
              </a>
              . A real medic from the team writes back.
            </p>
          </div>
          <dl className="mt-16 grid gap-12">
            {FAQS.map((item) => (
              <div key={item.q} className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
                <dt className="t-lead font-bold">{item.q}</dt>
                <dd className="t-body">{item.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* START: a sentence with blanks */}
      <section id="start" className="bg-paper pt-24 lg:pt-32">
        <div className="wrap grid gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-end">
          <div>
            <h2 className="t-head max-w-[14ch]">Go home an hour earlier tonight.</h2>
            <p className="t-lead mt-6 max-w-[40rem]">
              Install the Chrome extension, run your next call, and narrate it on the way back. Your Zoll chart will be
              ready by the time you sit down.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
              <a href={STORE_URL} target="_blank" rel="noopener noreferrer" className="btn btn-blue">
                Install Chrome extension
              </a>
              <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="t-body font-semibold ulink">
                Or book a squad walkthrough
              </a>
            </div>
          </div>
          <figure>
            <img
              src="/photos/ambulance-interior.jpg"
              width={1600}
              height={1238}
              alt="The open back of an ambulance: stretcher, orange seats and stocked cabinets"
              loading="lazy"
              decoding="async"
              className="block w-full aspect-[4/3] object-cover rounded-[4px]"
            />
            <figcaption className="t-small pt-3">Ambulance interior. Photo: Ypy31, public domain.</figcaption>
          </figure>
        </div>
        <div className="wrap pt-20 pb-24 lg:pb-32">
          <form onSubmit={handleSubmit} className="t-lead font-semibold leading-[2.4]" aria-label="Send us a note">
            <span>Or send us a note. I&apos;m </span>
            <input
              type="text"
              aria-label="Name"
              placeholder="your name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="blank w-[12ch]"
            />
            <span> from </span>
            <input
              type="text"
              aria-label="Squad / Department"
              placeholder="squad / department"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              required
              className="blank w-[18ch]"
            />
            <span>. Reach me at </span>
            <input
              type="email"
              aria-label="Email"
              placeholder="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="blank w-[16ch]"
            />
            <span>. Today, my charting looks like </span>
            <textarea
              aria-label="What does your charting workflow look like today?"
              placeholder="what your charting workflow looks like today"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
              rows={2}
              className="blank block w-full mt-2 leading-snug"
            />
            <span className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
              <button type="submit" disabled={isSubmitting} className="btn btn-ink">
                {isSubmitting ? "Sending…" : "Send message"}
              </button>
              <a href="mailto:narrateems@gmail.com" className="t-body ulink">
                narrateems@gmail.com
              </a>
            </span>
          </form>
        </div>
      </section>

      <footer className="bg-ink text-white overflow-hidden">
        <div className="wrap pt-16 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
          <div className="flex flex-wrap gap-x-7 gap-y-3 t-body font-semibold">
            <Link href="/privacy-policy" className="hover:underline">
              Privacy
            </Link>
            <Link href="/terms-of-service" className="hover:underline">
              Terms
            </Link>
            <Link href="/sla" className="hover:underline">
              SLA
            </Link>
            <a href="mailto:narrateems@gmail.com" className="hover:underline">
              Contact
            </a>
            <span>© 2026 NarrateEMS</span>
          </div>
          <ul className="t-small grid gap-1">
            <li className="font-semibold">Photographs</li>
            {PHOTO_CREDITS.map((c) => (
              <li key={c.what}>
                <a href={c.href} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {c.what}
                </a>{" "}
                by {c.by}, {c.lic}, via Wikimedia Commons.
              </li>
            ))}
            <li>Field photo: NarrateEMS. Sample calls on this page are made up.</li>
          </ul>
        </div>
        <p
          className="t-display whitespace-nowrap select-none mt-12 -mb-[0.22em] pl-[var(--gutter)] text-[length:var(--t-display)]"
          aria-hidden="true"
        >
          narrate <span className="rounded-[4px] bg-blue px-[0.08em]">ems</span>
        </p>
      </footer>

      {showVideoModal && (
        <div
          className="fixed inset-0 bg-ink/95 z-50 flex items-center justify-center p-4"
          onClick={() => setShowVideoModal(false)}
        >
          <button
            onClick={() => setShowVideoModal(false)}
            className="absolute top-6 right-6 text-white p-2"
            aria-label="Close video"
          >
            <X className="h-6 w-6" />
          </button>
          <div
            className="relative w-full max-w-5xl aspect-video bg-ink rounded-[4px] overflow-hidden"
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

      {showCheckoutModal && (
        <div className="fixed inset-0 bg-ink/80 z-50 flex items-center justify-center p-4">
          <div className="bg-paper rounded-[4px] p-8 max-w-md w-full relative">
            <button
              onClick={() => setShowCheckoutModal(false)}
              className="absolute top-5 right-5 p-1"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            <p className="t-small font-semibold mb-3">Step 1 of 2: create account</p>
            <h3 className="t-lead font-bold mb-2">Get started.</h3>
            <p className="t-body mb-6">{selectedPlan?.type && getPlanDisplayInfo(selectedPlan.type)}</p>
            <form onSubmit={handleCheckout} className="space-y-4">
              <div>
                <label htmlFor="co-email" className="block t-small font-semibold mb-2">
                  Email
                </label>
                <input
                  id="co-email"
                  type="email"
                  required
                  value={checkoutEmail}
                  onChange={(e) => setCheckoutEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="blank w-full t-body"
                />
              </div>
              <div>
                <label htmlFor="co-password" className="block t-small font-semibold mb-2">
                  Password
                </label>
                <input
                  id="co-password"
                  type="password"
                  required
                  minLength={6}
                  value={checkoutPassword}
                  onChange={(e) => setCheckoutPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="blank w-full t-body"
                />
              </div>
              {checkoutError && (
                <p className="rounded-[4px] bg-[#DC2626] text-white px-3 py-2.5 t-small font-semibold">
                  {checkoutError}
                </p>
              )}
              <button type="submit" disabled={isCheckoutLoading} className="btn btn-blue w-full">
                {isCheckoutLoading ? "Processing…" : "Continue to payment"}
              </button>
              <p className="t-small text-center pt-2">
                By continuing, you agree to our{" "}
                <Link href="/terms-of-service" className="ulink">
                  Terms
                </Link>{" "}
                and{" "}
                <Link href="/privacy-policy" className="ulink">
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
