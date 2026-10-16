"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Wordmark } from "@/components/wordmark"
import { STORE_URL, h2, body, primaryBtn } from "./home/shared"
import { Testimonial } from "./home/Testimonial"
import { Why } from "./home/Why"
import { Squads } from "./home/Squads"
import { Pricing } from "./home/Pricing"
import { Security } from "./home/Security"
import { Faq } from "./home/Faq"
import { Start } from "./home/Start"
import { Footer } from "./home/Footer"
import { Mail, Play, ArrowUpRight, X, Plus, Minus, Mic } from "lucide-react"


const TRANSCRIPT =
  "Sample call, fictional patient. Called for a fall at home. Adult male, alert and oriented times four, left wrist pain, no head strike. BP 138 over 84, pulse 88, respirations 16, SpO2 98 percent on room air. Splinted the left wrist, transported BLS, no change en route."

const CHIPS = ["1", "2", "3", "4", "5", "8", "N"]

const FIELDS = [
  ["Chief complaint", "Left wrist pain after fall"],
  ["Mechanism", "Fall from standing"],
  ["Mental status", "Alert, oriented x4"],
  ["Head strike", "No"],
  ["Blood pressure", "138/84"],
  ["Pulse", "88"],
  ["Respirations", "16"],
  ["SpO2", "98% room air"],
  ["Treatment", "Splint, left wrist"],
  ["Disposition", "Transported BLS"],
] as const

const PAGES = [
  ["1", "Page 1: Dispatch", [["Location", "Residence"], ["Complaint", "Fall"]]],
  ["2", "Page 2: CC/HPI", [["Chief complaint", "Left wrist pain"], ["Onset", "Fall from standing"]]],
  ["3", "Page 3: Neuro/Airway", [["Mental status", "Alert, oriented x4"], ["Airway", "Patent"]]],
  ["4", "Page 4: Resp/Cardio", [["Respirations", "16"], ["Pulse", "88"]]],
  ["5", "Page 5: Physical Exam", [["Left wrist", "Pain, splinted"], ["Head", "No strike"]]],
  ["8", "Page 8: Vitals", [["BP", "138/84"], ["SpO2", "98% room air"]]],
  ["N", "Narrative Summary", [["Narrative", "Called for a fall at home."], ["Transport", "BLS, no change"]]],
] as const

const clamp = (n: number) => Math.min(1, Math.max(0, n))
const ease = (t: number) => t * t * (3 - 2 * t)

// Keyframes: [progress, x, y, rotateX, rotateY, rotateZ, scale, opacity]; eased between stops.
type Frame = number[]
function at(p: number, frames: Frame[]): number[] {
  if (p <= frames[0][0]) return frames[0].slice(1)
  for (let i = 1; i < frames.length; i++) {
    const a = frames[i - 1]
    const b = frames[i]
    if (p <= b[0]) {
      const t = ease((p - a[0]) / (b[0] - a[0] || 1))
      return a.slice(1).map((v, j) => v + (b[j + 1] - v) * t)
    }
  }
  return frames[frames.length - 1].slice(1)
}

function buildTimeline(w: number, h: number, objW: number, objH: number, heroBottom: number) {
  const desk = w >= 1024
  const side = w >= 1280
  const fit = Math.min(1, (h * (side ? 0.62 : 0.42)) / objH, side ? (w * 0.36) / (objW + 32) : 1)
  const oy = side ? 0 : h * 0.22
  // Hero: the tilted object's top edge sits just under the CTAs.
  const layerCenter = 64 + (h - 64) / 2
  const heroY = Math.max(oy, heroBottom + 40 - layerCenter + ((objH * fit) / 2) * 0.55)
  const fade = (a: number, b: number, c: number, d: number, dy = 24): Frame[] => [
    [a, 0, dy, 0, 0, 0, 1, 0],
    [b, 0, 0, 0, 0, 0, 1, 1],
    [c, 0, 0, 0, 0, 0, 1, 1],
    [d, 0, -dy, 0, 0, 0, 1, 0],
  ]
  const scatter = desk
    ? [[-0.3, -0.3], [0.02, -0.31], [0.31, -0.27], [-0.36, 0.26], [-0.08, 0.31], [0.2, 0.29], [0.4, 0.21]]
    : [[-0.24, -0.32], [0.24, -0.29], [-0.22, -0.17], [0.24, -0.15], [-0.24, 0.2], [0.24, 0.25], [0, 0.34]]
  const rz = [-10, 6, 12, 8, -6, -12, 9]
  const ry = [18, -14, 22, -20, 12, -16, 20]
  const cs = desk ? 1 : 0.62
  const cards: Frame[][] = scatter.map(([sx, sy], i) => {
    const x = sx * w
    const y = sy * h
    const k = i - 3
    const stackY = desk ? -h * 0.04 : -h * 0.02
    return [
      [0.56, 0, oy, 0, 0, 0, cs * 0.5, 0],
      [0.63, x, y, 0, ry[i], rz[i], cs, 1],
      [0.8, x * 1.06, y * 1.04, 0, -ry[i] * 0.4, rz[i] + 8 * Math.sign(k || 1), cs, 1],
      [0.83, x * 1.06, y * 1.04, 0, -ry[i] * 0.4, rz[i] + 8 * Math.sign(k || 1), cs, 1],
      [0.91, k * 7, stackY + k * -6, 0, 0, k * 1.2, cs * 0.94, 1],
      [1, k * 7, stackY + k * -6, 0, 0, k * 1.2, cs * 0.94, 1],
    ]
  })
  return {
    hero: [[0, 0, 0, 0, 0, 0, 1, 1], [0.07, 0, -h * 0.12, 0, 0, 0, 1, 0]] as Frame[],
    object: [
      [0, 0, heroY, 58, 0, -4, fit, 1],
      [0.13, 0, oy + h * 0.02, 16, -6, -2, fit, 1],
      [0.36, 0, oy, 8, 4, 0, fit, 1],
      [0.44, 0, oy, 0, 0, 0, fit, 1],
      [0.56, 0, oy, 0, 0, 0, fit, 1],
      [0.64, 0, oy + h * 0.04, -10, 0, 0, fit * 0.5, 0],
    ] as Frame[],
    steps: [fade(0.12, 0.16, 0.25, 0.29), fade(0.27, 0.31, 0.39, 0.43), fade(0.43, 0.47, 0.53, 0.56)],
    headline: fade(0.58, 0.63, 0.8, 0.83, 20),
    stats: [
      [0.88, 0, h * 0.28 + 20, 0, 0, 0, 1, 0],
      [0.92, 0, h * 0.28, 0, 0, 0, 1, 1],
      [1, 0, h * 0.28, 0, 0, 0, 1, 1],
    ] as Frame[],
    cards,
  }
}

function write(el: HTMLElement | null, v: number[]) {
  if (!el) return
  const [x, y, rx, ry, rz, s, o] = v
  el.style.setProperty(
    "--tf",
    `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) rotateZ(${rz.toFixed(2)}deg) scale(${s.toFixed(3)})`,
  )
  el.style.setProperty("--o", o.toFixed(3))
  el.style.visibility = o < 0.01 ? "hidden" : ""
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[#4A5568]">{label}</div>
      <div className="mt-0.5 h-6 border border-[#C9CED6] bg-white">
        <span
          data-field
          data-on="1"
          className="block h-full truncate bg-hi-vis px-1.5 leading-6 font-medium transition-opacity duration-300 motion-reduce:transition-none data-[on=0]:opacity-0"
        >
          {value}
        </span>
      </div>
    </div>
  )
}

function ChartObject() {
  return (
    <div className="relative w-[min(560px,calc(100vw-3rem))] pb-20 [transform-style:preserve-3d]">
      <div data-ui className="bg-white text-ink border border-[#C9CED6] text-[12px] leading-snug">
        <div className="flex items-center justify-between bg-[#DDE3EA] px-3 py-2 font-semibold">
          <span>emsCharts, Page 2: CC/HPI</span>
          <span className="font-normal">Sample chart</span>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-2 p-3">
          {FIELDS.map(([label, value]) => (
            <Field key={label} label={label} value={value} />
          ))}
        </div>
      </div>
      <div
        data-ui
        className="absolute right-0 bottom-0 w-[60%] min-w-[220px] bg-paper text-ink border border-ink text-[12px] sm:-right-8"
        style={{ transform: "translateZ(70px)" }}
      >
        <div className="flex items-center justify-between bg-ink px-3 py-2">
          <span className="inline-flex items-baseline gap-1 font-semibold text-paper">
            <span className="text-[15px]">narrate</span>
            <span className="bg-paper px-1 text-ink">ems</span>
          </span>
          <span className="border border-paper/40 px-1.5 text-paper">Reset</span>
        </div>
        <div className="px-3 pt-2.5 font-semibold">Chart page</div>
        <div className="mx-3 mt-1 grid grid-cols-7 border border-[#D6D2C7] bg-white">
          {CHIPS.map((chip) => (
            <span
              key={chip}
              data-chip
              data-state="complete"
              className="py-1 text-center font-semibold border-b-2 transition-colors motion-reduce:transition-none data-[state=pending]:border-transparent data-[state=pending]:text-[#4A5568] data-[state=processing]:bg-ink data-[state=processing]:text-paper data-[state=processing]:border-hi-vis data-[state=complete]:bg-[#F0FDF4] data-[state=complete]:text-success data-[state=complete]:border-success"
            >
              {chip}
            </span>
          ))}
        </div>
        <div
          data-speak
          data-rec="0"
          className="group/speak mx-3 mt-2.5 flex items-center justify-center gap-1.5 py-2 font-semibold border border-transparent bg-hi-vis data-[rec=1]:bg-paper data-[rec=1]:border-recording"
        >
          <Mic className="h-3.5 w-3.5 group-data-[rec=1]/speak:text-recording" aria-hidden />
          <span className="group-data-[rec=1]/speak:hidden">Start narrating</span>
          <span className="hidden group-data-[rec=1]/speak:inline">Stop narrating</span>
        </div>
        <div className="px-3 pt-2.5 font-semibold">Transcript</div>
        <p data-transcript className="mx-3 mt-1 h-[92px] overflow-hidden border border-[#D6D2C7] bg-white p-2">
          {TRANSCRIPT}
        </p>
        <div data-actions data-on="1" className="mx-3 mt-2 mb-3 flex gap-2 transition-opacity duration-300 motion-reduce:transition-none data-[on=0]:opacity-0">
          <span className="flex-1 border border-[#D6D2C7] py-1.5 text-center font-semibold">Cancel</span>
          <span className="flex-[2] bg-ink py-1.5 text-center font-semibold text-paper">Fill the chart</span>
        </div>
      </div>
    </div>
  )
}

function PageCard({ title, fields }: { title: string; fields: readonly (readonly [string, string])[] }) {
  return (
    <div data-ui className="w-[230px] h-[160px] bg-white text-ink border border-[#C9CED6] text-[12px] leading-snug">
      <div className="flex items-center justify-between bg-[#DDE3EA] px-3 py-2 font-semibold">
        <span>{title}</span>
        <span className="text-success">Filled</span>
      </div>
      <div className="space-y-2 p-3">
        {fields.map(([label, value]) => (
          <div key={label}>
            <div className="text-[#4A5568]">{label}</div>
            <div className="mt-0.5 truncate bg-hi-vis px-1.5 leading-6 font-medium">{value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function HomePage() {

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

  const storyRef = useRef<HTMLElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const objectRef = useRef<HTMLDivElement>(null)
  const stepRefs = useRef<(HTMLDivElement | null)[]>([])
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const statsRef = useRef<HTMLDListElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

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
        return "Individual, $29.99 / month"
      case "pilot_annual":
        return "Pilot, $1,000 / year · 500 charts"
      case "small_squad_annual":
        return "Small Squad, $3,000 / year · 2,000 charts"
      case "large_squad_annual":
        return "Large Squad, $6,000 / year · 5,000 charts"
      case "high_volume_annual":
        return "High Volume, $10,000 / year · 10,000 charts"
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


  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId)
    const story = storyRef.current
    const progress = el?.dataset.progress
    if (el && story && progress && story.dataset.motion === "on") {
      const span = story.offsetHeight - window.innerHeight
      window.scrollTo({ top: story.offsetTop + span * Number(progress), behavior: "smooth" })
    } else {
      el?.scrollIntoView({ behavior: "smooth" })
    }
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

  // One rAF loop scrubs the story: it eases toward the track's scroll progress and writes CSS custom properties.
  // No scroll listener and no React state per frame. Without JS or with reduced motion the static, filled flow stays.
  useEffect(() => {
    const story = storyRef.current
    const object = objectRef.current
    if (!story || !object || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    story.dataset.motion = "on"

    const transcript = object.querySelector<HTMLElement>("[data-transcript]")
    const speak = object.querySelector<HTMLElement>("[data-speak]")
    const actions = object.querySelector<HTMLElement>("[data-actions]")
    const fields = [...object.querySelectorAll<HTMLElement>("[data-field]")]
    const chips = [...object.querySelectorAll<HTMLElement>("[data-chip]")]
    const heroBottom = () => {
      const hero = heroRef.current
      return hero ? 64 + (window.innerWidth >= 1024 ? 80 : 48) + hero.offsetHeight : 0
    }
    let tl = buildTimeline(window.innerWidth, window.innerHeight, object.offsetWidth, object.offsetHeight, heroBottom())
    let current = -1
    let typed = -1
    let frame = 0
    let last = performance.now()
    let visible = true

    const target = () => {
      const r = story.getBoundingClientRect()
      return clamp(-r.top / Math.max(r.height - window.innerHeight, 1))
    }

    const render = (p: number) => {
      write(heroRef.current, at(p, tl.hero))
      write(object, at(p, tl.object))
      tl.steps.forEach((f, i) => write(stepRefs.current[i], at(p, f)))
      write(headlineRef.current, at(p, tl.headline))
      write(statsRef.current, at(p, tl.stats))
      tl.cards.forEach((f, i) => write(cardRefs.current[i], at(p, f)))

      const chars = Math.round(clamp((p - 0.15) / 0.19) * TRANSCRIPT.length)
      if (transcript && chars !== typed) {
        typed = chars
        transcript.textContent = TRANSCRIPT.slice(0, chars)
      }
      if (speak) speak.dataset.rec = p > 0.15 && p < 0.35 ? "1" : "0"
      if (actions) actions.dataset.on = p > 0.35 ? "1" : "0"
      fields.forEach((el, i) => (el.dataset.on = p >= 0.4 + i * 0.012 ? "1" : "0"))
      chips.forEach((el, i) => {
        const s = 0.4 + i * 0.018
        el.dataset.state = p >= s + 0.03 ? "complete" : p >= s ? "processing" : "pending"
      })
    }

    const tick = (now: number) => {
      frame = 0
      const dt = Math.min(now - last, 64)
      last = now
      const goal = target()
      const next = current < 0 ? goal : current + (goal - current) * (1 - Math.exp(-dt / 90))
      const settled = Math.abs(goal - next) < 0.0004
      current = settled ? goal : next
      render(current)
      if (visible || !settled) frame = requestAnimationFrame(tick)
    }
    const start = () => {
      if (!frame) {
        last = performance.now()
        frame = requestAnimationFrame(tick)
      }
    }

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) start()
    })
    io.observe(story)
    const onResize = () => {
      tl = buildTimeline(window.innerWidth, window.innerHeight, object.offsetWidth, object.offsetHeight, heroBottom())
      start()
    }
    window.addEventListener("resize", onResize)
    start()

    return () => {
      if (frame) cancelAnimationFrame(frame)
      io.disconnect()
      window.removeEventListener("resize", onResize)
      delete story.dataset.motion
    }
  }, [])

  const navLink = "text-[17px] text-paper hover:underline underline-offset-4"
  const steps = [
    {
      title: "Narrate the call.",
      body: "Once you're clear of the call, open the extension and walk through it the way you'd brief your partner: demographics, chief complaint, vitals, interventions, transport. Talk normally.",
      detail: "Mobile compatible. Use it on your phone or laptop.",
    },
    {
      title: "AI structures the chart.",
      body: "Medical-terminology-trained transcription parses your narration into the right Zoll ePCR fields: demographics, chief complaint, assessment, treatment, transport, each placed where it belongs.",
      detail: "Each page fills in under 10 seconds.",
    },
    {
      title: "Chart is in Zoll. You're done.",
      body: "Fields land directly inside your Zoll ePCR. Review, sign, submit. Done in minutes, not the hour you used to spend typing.",
      detail: "Direct Zoll integration. HIPAA encrypted.",
    },
  ]

  return (
    <div className="min-h-svh bg-paper text-ink antialiased overflow-x-clip">
      {/* NAV */}
      <nav className="sticky top-0 z-40 bg-ink text-paper">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-6 lg:px-10">
          <Wordmark href="/" size="md" variant="paper" />
          <div className="hidden lg:flex items-center gap-6 whitespace-nowrap">
            <button onClick={() => scrollToSection("how")} className={navLink}>How it works</button>
            <button onClick={() => scrollToSection("squads")} className={navLink}>For squads</button>
            <button onClick={() => scrollToSection("pricing")} className={navLink}>Pricing</button>
            <button onClick={() => scrollToSection("security")} className={navLink}>Security</button>
            <Link href="/login" className={navLink}>Log in</Link>
            <a href={STORE_URL} target="_blank" rel="noopener noreferrer" className="bg-hi-vis text-hi-vis-ink px-4 py-2 text-[17px] font-semibold hover:bg-paper focus-hi-vis">
              Install
            </a>
          </div>
          <button
            className="lg:hidden text-paper p-2 -mr-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="square" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 7h16M4 12h16M4 17h16"} />
            </svg>
          </button>
        </div>
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-ink px-6 pb-6 space-y-1">
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
                className="block w-full text-left py-2.5 text-[17px] text-paper"
              >
                {label}
              </button>
            ))}
            <Link href="/login" className="block py-2.5 text-[17px] text-paper">Log in</Link>
            <a href={STORE_URL} target="_blank" rel="noopener noreferrer" className={`${primaryBtn} mt-2 w-full`}>
              Install Chrome extension
            </a>
          </div>
        )}
      </nav>

      {/* STORY: one persistent object scrubbed across hero, narrate, fill, scatter and stack */}
      <section ref={storyRef} className="story relative bg-ink text-paper">
        <div className="story-stage">
          <div className="story-layer story-hero text-center">
            <div ref={heroRef} data-tl className="flex flex-col items-center">
              <h1 className="max-w-4xl text-[44px] lg:text-[64px] font-semibold leading-[1.0] tracking-tight text-balance">
                The chart writes itself.
              </h1>
              <p className="mt-6 max-w-xl text-[17px] leading-[1.6] text-paper">
                After the call, narrate what happened. NarrateEMS writes your Zoll ePCR for you.
              </p>
              <div className="mt-9 flex flex-col sm:flex-row items-center gap-5">
                <a href={STORE_URL} target="_blank" rel="noopener noreferrer" className={primaryBtn}>
                  Install Chrome extension
                  <ArrowUpRight className="h-4 w-4" />
                </a>
                <button
                  onClick={() => setShowVideoModal(true)}
                  className="inline-flex items-center gap-2 text-[17px] font-semibold text-paper hover:underline underline-offset-4 focus-hi-vis"
                >
                  <Play className="h-4 w-4 fill-current" />
                  Watch the demo
                </button>
              </div>
            </div>
          </div>

          <div className="story-layer" aria-hidden>
            <div ref={objectRef} data-tl>
              <ChartObject />
            </div>
          </div>
          <p className="sr-only">
            Animation: a sample NarrateEMS popup records a fictional narration, then fills a Zoll emsCharts page and
            every chart page.
          </p>

          {steps.map((step, i) => (
            <div key={step.title} className={`story-layer ${i === 1 ? "story-step-r" : "story-step-l"}`}>
              <div
                id={i === 0 ? "how" : undefined}
                data-progress={i === 0 ? "0.2" : undefined}
                ref={(el) => {
                  stepRefs.current[i] = el
                }}
                data-tl
                className="max-w-xl"
              >
                {i === 0 && <h2 className={`${h2} mb-6`}>Three steps, after the call.</h2>}
                <h3 className="text-[22px] font-semibold leading-tight">{step.title}</h3>
                <p className="mt-3 text-[17px] leading-[1.6] text-paper">{step.body}</p>
                <p className="mt-3 text-[13px] text-paper">{step.detail}</p>
              </div>
            </div>
          ))}

          <div className="story-layer text-center">
            <h2 ref={headlineRef} data-tl className="max-w-4xl text-[34px] lg:text-[64px] font-semibold leading-[1.02] tracking-tight text-balance">
              Each page filled in under 10 seconds.
            </h2>
          </div>

          <div className="story-layer" aria-hidden>
            <div className="story-cards">
              {PAGES.map(([chip, title, fields], i) => (
                <div
                  key={chip}
                  className="story-card"
                  ref={(el) => {
                    cardRefs.current[i] = el
                  }}
                  data-tl
                >
                  <PageCard title={title} fields={fields} />
                </div>
              ))}
            </div>
          </div>

          <div className="story-layer">
            <dl ref={statsRef} data-tl className="grid grid-cols-3 gap-8 text-center">
              {[
                ["70%", "Faster charting"],
                ["<10s", "Per chart page"],
                ["1hr+", "Saved per shift"],
              ].map(([figure, label]) => (
                <div key={label}>
                  <dt className="text-[34px] lg:text-[44px] font-semibold leading-none tracking-tight tabular-nums">{figure}</dt>
                  <dd className="mt-2 text-[13px] text-paper">{label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <Testimonial />
      <Why />
      <Squads scrollToSection={scrollToSection} />
      <Pricing onSelectPlan={handlePlanSelect} />
      <Security />
      <Faq />
      <Start />

      <Footer />

      {/* VIDEO MODAL */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 bg-ink/95 flex items-center justify-center p-4" onClick={() => setShowVideoModal(false)}>
          <button
            onClick={() => setShowVideoModal(false)}
            className="absolute top-5 right-5 text-paper p-2 hover:bg-paper/10 focus-hi-vis"
            aria-label="Close video"
          >
            <X className="h-6 w-6" />
          </button>
          <div className="relative w-full max-w-5xl aspect-video bg-black" onClick={(e) => e.stopPropagation()}>
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

      {/* CHECKOUT MODAL */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 bg-ink/80 flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-paper p-8">
            <button
              onClick={() => setShowCheckoutModal(false)}
              className="absolute top-4 right-4 text-ink p-1.5 hover:bg-paper-tint focus-hi-vis"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            <p className="text-[13px] font-semibold">Step 1 of 2: create your account</p>
            <h3 className="mt-3 text-[34px] font-semibold leading-tight tracking-tight">Get started.</h3>
            <p className={`mt-2 ${body}`}>{selectedPlan?.type && getPlanDisplayInfo(selectedPlan.type)}</p>
            <form onSubmit={handleCheckout} className="mt-8 space-y-4">
              <label className="block">
                <span className="text-[13px] font-semibold">Email</span>
                <input
                  type="email"
                  required
                  value={checkoutEmail}
                  onChange={(e) => setCheckoutEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="mt-1.5 w-full bg-paper-tint px-4 py-3 text-[17px] text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-ink"
                />
              </label>
              <label className="block">
                <span className="text-[13px] font-semibold">Password</span>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={checkoutPassword}
                  onChange={(e) => setCheckoutPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="mt-1.5 w-full bg-paper-tint px-4 py-3 text-[17px] text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-ink"
                />
              </label>
              {checkoutError && <div className="bg-[#FEF2F2] px-3 py-2.5 text-[17px] text-danger">{checkoutError}</div>}
              <button type="submit" disabled={isCheckoutLoading} className={`${primaryBtn} w-full disabled:opacity-60`}>
                {isCheckoutLoading ? "Processing…" : "Continue to payment →"}
              </button>
              <p className="text-[13px] text-ink">
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
