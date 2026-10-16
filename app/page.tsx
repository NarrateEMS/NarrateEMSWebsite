"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Wordmark } from "@/components/wordmark"
import { Mail, Play, ArrowUpRight, X, Lock, WifiOff, ShieldCheck, Plus, Minus, FileText, Mic } from "lucide-react"

const STORE_URL = "https://chromewebstore.google.com/detail/narrateems-ai-medic-voice/nokdpnigpfafepjbdinggckgcdekdjkm"
const CALENDLY_URL = "https://calendly.com/narrateems/narrateems"

const TRANSCRIPT =
  "Sample call, fictional patient. Called for a fall at home. Adult male, alert and oriented times four, left wrist pain, no head strike. BP 138 over 84, pulse 88, respirations 16, SpO2 98 percent on room air. Splinted the left wrist, transported BLS, no change en route."

const CHIPS = [
  ["1", "Page 1: Dispatch"],
  ["2", "Page 2: CC/HPI"],
  ["3", "Page 3: Neuro/Airway"],
  ["4", "Page 4: Resp/Cardio"],
  ["5", "Page 5: Physical Exam"],
  ["8", "Page 8: Vitals"],
  ["N", "Narrative Summary"],
] as const

const FIELDS = [
  ["Chief complaint", "Left wrist pain after fall", 0.34],
  ["Mechanism", "Fall from standing", 0.4],
  ["Mental status", "Alert, oriented x4", 0.46],
  ["Head strike", "No", 0.5],
  ["Blood pressure", "138/84", 0.56],
  ["Pulse", "88", 0.6],
  ["Respirations", "16", 0.64],
  ["SpO2", "98% room air", 0.68],
  ["Treatment", "Splint, left wrist", 0.76],
  ["Disposition", "Transported BLS", 0.84],
] as const

const clamp = (n: number) => Math.min(1, Math.max(0, n))

// Drives the stage from a 0..1 progress value by writing to the DOM directly (no re-render per frame).
function applyProgress(root: HTMLElement, p: number, tilt: boolean) {
  root.style.setProperty("--tilt", tilt ? String(1 - clamp(p / 0.85)) : "0")
  root.dataset.rec = p > 0.02 && p < 0.6 ? "1" : "0"
  const tx = root.querySelector<HTMLElement>("[data-transcript]")
  if (tx) tx.textContent = TRANSCRIPT.slice(0, Math.round(clamp(p / 0.6) * TRANSCRIPT.length))
  root.querySelectorAll<HTMLElement>("[data-at]").forEach((el) => {
    el.dataset.on = p >= Number(el.dataset.at) ? "1" : "0"
  })
  root.querySelectorAll<HTMLElement>("[data-chip]").forEach((el, i) => {
    const start = 0.3 + i * 0.075
    el.dataset.state = p >= start + 0.09 ? "complete" : p >= start ? "processing" : "pending"
  })
}

function ChartStage({ tilt }: { tilt: boolean }) {
  return (
    <div className="[perspective:1800px] w-full">
      <div
        className="relative mx-auto w-full max-w-[540px] [transform-style:preserve-3d] motion-safe:transition-transform motion-safe:duration-150 ease-out"
        style={{
          transform: tilt
            ? "rotateX(calc(var(--tilt, 0) * 30deg)) rotateY(calc(var(--tilt, 0) * -20deg)) rotateZ(calc(var(--tilt, 0) * 5deg))"
            : undefined,
        }}
      >
        <div data-ui className="bg-white text-ink border border-[#C9CED6] text-[12px] leading-snug">
          <div className="flex items-center justify-between bg-[#DDE3EA] px-3 py-2 font-semibold">
            <span>emsCharts · Page 2: CC/HPI</span>
            <span className="font-normal">Sample chart</span>
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-2 p-3">
            {FIELDS.map(([label, value, at]) => (
              <div key={label}>
                <div className="text-[#4A5568]">{label}</div>
                <div className="mt-0.5 h-6 border border-[#C9CED6] bg-white">
                  <span
                    data-at={at}
                    data-on="1"
                    className="block h-full truncate bg-hi-vis px-1.5 leading-6 font-medium motion-safe:transition-opacity motion-safe:duration-300 data-[on=0]:opacity-0"
                  >
                    {value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          data-ui
          className="absolute right-0 -bottom-20 w-[58%] min-w-[220px] bg-paper text-ink border border-[#0A1628] text-[12px] lg:-right-8"
          style={tilt ? { transform: "translateZ(calc(40px + var(--tilt, 0) * 90px))" } : undefined}
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
            {CHIPS.map(([chip, label]) => (
              <span
                key={chip}
                data-chip
                data-state="complete"
                title={label}
                className="py-1 text-center font-semibold border-b-2 motion-safe:transition-colors data-[state=pending]:border-transparent data-[state=pending]:text-[#4A5568] data-[state=processing]:bg-ink data-[state=processing]:text-paper data-[state=processing]:border-hi-vis data-[state=complete]:bg-[#F0FDF4] data-[state=complete]:text-success data-[state=complete]:border-success"
              >
                {chip}
              </span>
            ))}
          </div>
          <div className="mx-3 mt-2.5 flex items-center justify-center gap-1.5 py-2 font-semibold bg-hi-vis group-data-[rec=1]:bg-paper group-data-[rec=1]:border group-data-[rec=1]:border-recording">
            <Mic className="h-3.5 w-3.5 group-data-[rec=1]:text-recording" aria-hidden />
            <span className="group-data-[rec=1]:hidden">Start narrating</span>
            <span className="hidden group-data-[rec=1]:inline">Stop narrating</span>
          </div>
          <div className="px-3 pt-2.5 font-semibold">Transcript</div>
          <p data-transcript className="mx-3 mt-1 mb-3 h-[108px] overflow-hidden border border-[#D6D2C7] bg-white p-2">
            {TRANSCRIPT}
          </p>
        </div>
      </div>
    </div>
  )
}

function SquadStage() {
  const members = [
    ["Medic A", "Admin"],
    ["Medic B", "Member"],
    ["Medic C", "Member"],
  ]
  return (
    <div data-ui className="mx-auto w-full max-w-[360px] bg-paper text-ink border border-[#0A1628] text-[12px]">
      <div className="flex items-center justify-between bg-ink px-3 py-2 text-paper">
        <span className="text-[15px] font-semibold">Manage squad</span>
        <span aria-hidden>×</span>
      </div>
      <div className="space-y-1.5 p-3">
        <div className="flex justify-between"><span className="font-semibold">Squad name</span><span>Sample squad</span></div>
        <div className="flex justify-between"><span className="font-semibold">Squad code</span><span>SAMPLE</span></div>
      </div>
      <div className="px-3 font-semibold">Invite a team member</div>
      <div className="mx-3 mt-1 flex">
        <span className="flex-1 border border-[#D6D2C7] bg-white px-2 py-1.5 text-[#4A5568]">name@squad.org</span>
        <span className="bg-ink px-3 py-1.5 font-semibold text-paper">Invite</span>
      </div>
      <div className="px-3 pt-3 font-semibold">Members {members.length}</div>
      <ul className="m-3 mt-1 border border-[#D6D2C7] bg-white">
        {members.map(([name, role]) => (
          <li key={name} className="flex justify-between px-2 py-1.5 even:bg-[#F5F4F0]">
            <span>{name}</span>
            <span className="text-[#4A5568]">{role}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Chevrons({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 480 28" preserveAspectRatio="none" aria-hidden>
      {Array.from({ length: 12 }).map((_, i) => (
        <polygon key={i} points={`${i * 40},28 ${i * 40 + 20},28 ${i * 40 + 48},0 ${i * 40 + 28},0`} fill="currentColor" />
      ))}
    </svg>
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

  const stageRef = useRef<HTMLDivElement>(null)
  const mobileStageRef = useRef<HTMLDivElement>(null)
  const storyRef = useRef<HTMLDivElement>(null)

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

  // Scroll-linked stage. Without JS or with reduced motion the server-rendered final (filled, flat) state stays.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let frame = 0
    const update = () => {
      frame = 0
      const stage = stageRef.current
      const story = storyRef.current
      const squads = document.getElementById("squads")
      if (stage && story && squads && stage.offsetParent) {
        const end = squads.offsetTop - story.offsetTop - window.innerHeight
        applyProgress(stage, clamp((window.scrollY - story.offsetTop) / Math.max(end, 1)), true)
      }
      const mobile = mobileStageRef.current
      if (mobile && mobile.offsetParent) {
        const r = mobile.getBoundingClientRect()
        applyProgress(mobile, clamp((window.innerHeight * 0.85 - r.top) / (window.innerHeight * 0.75)), false)
      }
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && stageRef.current) {
            stageRef.current.dataset.scene = (entry.target as HTMLElement).dataset.scene
          }
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    )
    document.querySelectorAll("[data-scene]").forEach((el) => observer.observe(el))

    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      observer.disconnect()
    }
  }, [])

  const navLink = "text-[17px] text-ink hover:underline underline-offset-4"
  const h2 = "text-[34px] lg:text-[44px] font-semibold leading-[1.05] tracking-tight text-balance"
  const body = "text-[17px] leading-[1.6] text-ink"
  const primaryBtn =
    "inline-flex items-center justify-center gap-2 bg-hi-vis text-hi-vis-ink px-6 py-3.5 text-[17px] font-semibold hover:bg-ink hover:text-paper active:translate-y-px transition-colors focus-hi-vis"
  const inkBtn =
    "inline-flex items-center justify-center gap-2 bg-ink text-paper px-6 py-3.5 text-[17px] font-semibold hover:bg-ink-2 active:translate-y-px transition-colors focus-hi-vis"

  return (
    <div className="min-h-svh bg-paper text-ink antialiased overflow-x-clip">
      {/* Split stage: sticky navy stage left, reading column right */}
      <div className="lg:grid lg:grid-cols-2">
        <aside
          ref={stageRef}
          data-scene="chart"
          className="group hidden lg:block lg:sticky lg:top-0 lg:h-[100svh] bg-ink overflow-hidden"
          aria-label="Sample NarrateEMS popup filling a Zoll emsCharts page"
        >
          <div className="absolute inset-0 flex items-center justify-center px-12 pb-20 motion-safe:transition-opacity motion-safe:duration-700 group-data-[scene=squads]:opacity-0">
            <ChartStage tilt />
          </div>
          <div className="absolute inset-0 flex items-center justify-center px-12 pb-20 opacity-0 motion-safe:transition-opacity motion-safe:duration-700 group-data-[scene=squads]:opacity-100">
            <SquadStage />
          </div>
          <p className="absolute bottom-12 left-12 right-12 text-[13px] text-paper">
            Sample narration and fictional patient. No real chart data.
          </p>
          <Chevrons className="absolute bottom-0 left-0 h-7 w-full text-paper" />
        </aside>

        <div ref={storyRef}>
          {/* NAV */}
          <nav className="sticky top-0 z-40 bg-paper">
            <div className="flex h-16 items-center justify-between px-6 lg:px-12 xl:px-8">
              <Wordmark href="/" size="md" />
              <div className="hidden xl:flex items-center gap-3 whitespace-nowrap ml-4">
                <button onClick={() => scrollToSection("how")} className={navLink}>How it works</button>
                <button onClick={() => scrollToSection("squads")} className={navLink}>For squads</button>
                <button onClick={() => scrollToSection("pricing")} className={navLink}>Pricing</button>
                <button onClick={() => scrollToSection("security")} className={navLink}>Security</button>
                <Link href="/login" className={navLink}>Log in</Link>
                <a href={STORE_URL} target="_blank" rel="noopener noreferrer" className="bg-ink text-paper px-4 py-2 text-[17px] font-semibold hover:bg-ink-2 focus-hi-vis">
                  Install
                </a>
              </div>
              <button
                className="xl:hidden text-ink p-2 -mr-2"
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
              <div className="xl:hidden bg-paper px-6 pb-6 space-y-1 lg:px-12">
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
                    className="block w-full text-left py-2.5 text-[17px] text-ink"
                  >
                    {label}
                  </button>
                ))}
                <Link href="/login" className="block py-2.5 text-[17px] text-ink">Log in</Link>
                <a href={STORE_URL} target="_blank" rel="noopener noreferrer" className={`${inkBtn} mt-2 w-full`}>
                  Install Chrome extension
                </a>
              </div>
            )}
          </nav>

          {/* HERO */}
          <section data-scene="chart" className="px-6 pt-12 pb-16 lg:px-12 lg:pt-20 lg:pb-20">
            <h1 className="reveal text-[44px] lg:text-[64px] font-semibold leading-[1.0] tracking-tight text-balance">
              The chart writes itself.
            </h1>
            <p className={`reveal mt-6 max-w-xl ${body}`} style={{ animationDelay: "80ms" }}>
              After the call, narrate what happened. NarrateEMS writes your Zoll ePCR for you: 70% faster on
              average, each page filled in under 10 seconds. Built by medics, for medics.
            </p>
            <div className="reveal mt-9 flex flex-col sm:flex-row sm:items-center gap-5" style={{ animationDelay: "160ms" }}>
              <a href={STORE_URL} target="_blank" rel="noopener noreferrer" className={primaryBtn}>
                Install Chrome extension
                <ArrowUpRight className="h-4 w-4" />
              </a>
              <button
                onClick={() => setShowVideoModal(true)}
                className="inline-flex items-center gap-2 text-[17px] font-semibold text-ink hover:underline underline-offset-4 focus-hi-vis"
              >
                <Play className="h-4 w-4 fill-current" />
                Watch the demo
              </button>
            </div>
            <dl className="reveal mt-20 grid grid-cols-3 gap-6" style={{ animationDelay: "240ms" }}>
              {[
                ["70%", "Faster charting"],
                ["<10s", "Per chart page"],
                ["1hr+", "Saved per shift"],
              ].map(([figure, label]) => (
                <div key={label}>
                  <dt className="text-[34px] lg:text-[44px] font-semibold leading-none tracking-tight tabular-nums">{figure}</dt>
                  <dd className="mt-2 text-[13px] text-ink">{label}</dd>
                </div>
              ))}
            </dl>
            <ul className="reveal mt-12 flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-ink" style={{ animationDelay: "320ms" }}>
              <li className="inline-flex items-center gap-1.5"><ShieldCheck className="h-4 w-4" /> HIPAA compliant</li>
              <li className="inline-flex items-center gap-1.5"><Lock className="h-4 w-4" /> End-to-end encrypted</li>
              <li className="inline-flex items-center gap-1.5"><FileText className="h-4 w-4" /> Direct Zoll ePCR</li>
              <li className="inline-flex items-center gap-1.5"><WifiOff className="h-4 w-4" /> Mobile compatible</li>
            </ul>
          </section>

          {/* Phone: the same live object, flat, filling as it scrolls into view */}
          <div ref={mobileStageRef} className="group lg:hidden bg-ink px-6 pt-10 pb-24 overflow-hidden">
            <ChartStage tilt={false} />
            <p className="mt-24 text-[13px] text-paper">Sample narration and fictional patient. No real chart data.</p>
          </div>

          {/* HOW IT WORKS */}
          <section id="how" data-scene="chart" className="px-6 py-20 lg:px-12 lg:py-20">
            <h2 className={h2}>Three steps, after the call.</h2>
            <p className={`mt-6 max-w-xl ${body}`}>
              You worked the call. Now talk it through once, into your phone or laptop, and NarrateEMS handles the
              rest. No new dashboard, no extra tab.
            </p>
            <div className="mt-14 space-y-12 max-w-xl">
              {[
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
              ].map((step) => (
                <div key={step.title}>
                  <h3 className="text-[22px] font-semibold leading-tight">{step.title}</h3>
                  <p className={`mt-3 ${body}`}>{step.body}</p>
                  <p className="mt-3 text-[13px] text-ink">{step.detail}</p>
                </div>
              ))}
            </div>
            <figure className="mt-12">
              <img
                src="/photos/ambulance-interior.jpg"
                alt="Patient compartment inside an ambulance, stretcher and equipment"
                className="w-full aspect-[4/3] object-cover"
                loading="lazy"
              />
            </figure>
          </section>

          {/* FROM THE FIELD */}
          <section id="field" data-scene="chart" className="bg-paper-tint px-6 py-20 lg:px-12 lg:py-20">
            <blockquote className="text-[34px] lg:text-[44px] font-semibold leading-[1.1] tracking-tight text-balance">
              &ldquo;Saved me hours of documentation.&rdquo;
            </blockquote>
            <p className={`mt-5 ${body}`}>Kendall Park First Aid Squad, New Jersey EMS provider</p>
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Image.jpg-zZeluLIQJ3rB3PKe7tKcfoKfekukF6.jpeg"
              alt="EMT providing patient care in the field"
              className="mt-10 w-full aspect-[3/2] object-cover"
              loading="lazy"
            />
          </section>

          {/* BUILT BY MEDICS */}
          <section id="why" data-scene="chart" className="px-6 py-20 lg:px-12 lg:py-20">
            <h2 className={h2}>We built it for ourselves first.</h2>
            <p className={`mt-6 max-w-xl ${body}`}>
              Six-plus years working calls. We know what charting feels like at the end of a sixteen-hour shift,
              because we lived it. NarrateEMS is the tool we wished we had when we were the ones typing.
            </p>
            <dl className="mt-12 grid grid-cols-3 gap-6">
              {[
                ["6+ yrs", "Field experience on the team"],
                ["1hr", "Old way: typing per call"],
                ["<3min", "New way: narrate, sign, done"],
              ].map(([figure, label]) => (
                <div key={label}>
                  <dt className="text-[34px] lg:text-[44px] font-semibold leading-none tracking-tight tabular-nums">{figure}</dt>
                  <dd className="mt-2 text-[13px] text-ink">{label}</dd>
                </div>
              ))}
            </dl>
            <p className={`mt-12 ${body}`}>The NarrateEMS team. Made in New Jersey.</p>
            <figure className="mt-12">
              <img
                src="/photos/new-vernon-ambulance.jpg"
                alt="A volunteer first aid squad ambulance parked outside its station in New Jersey"
                className="w-full aspect-[4/3] object-cover"
                loading="lazy"
              />
              <figcaption className="mt-3 text-[13px] text-ink">
                New Vernon Volunteer First Aid Squad ambulance, Harding Township, New Jersey.
              </figcaption>
            </figure>
          </section>

          {/* FOR SQUADS */}
          <section id="squads" data-scene="squads" className="bg-paper-tint px-6 py-20 lg:px-12 lg:py-20">
            <h2 className={h2}>Run a department? We&apos;ve got you.</h2>
            <p className={`mt-6 max-w-xl ${body}`}>
              One squad code. One bill. Every medic charting faster from day one. No per-seat math, no
              provisioning meetings.
            </p>
            <div className="lg:hidden mt-12 bg-ink px-6 py-10">
              <SquadStage />
            </div>
            <dl className="mt-14 grid sm:grid-cols-2 gap-x-10 gap-y-10">
              {[
                ["Squad codes", "Hand out one code at orientation. New medics join your plan in a click, no email back-and-forth."],
                ["Chart bundles", "Plans start at 500 charts and scale to 10,000+. Pay for what your squad actually runs, with simple overage pricing."],
                ["Real-time usage", "See how many charts your squad has filed this period. No surprises at renewal."],
                ["HIPAA from day one", "End-to-end encryption on every recording and chart. Patient data never leaves the secure pipeline."],
                ["Works on what you've got", "Chrome on the rig laptop, phone on the bench, tablet at the station. Same login, same workflow."],
                ["Squad admin controls", "Promote leads, revoke former members, transfer billing. Run it like you run shifts."],
              ].map(([title, text]) => (
                <div key={title}>
                  <dt className="text-[22px] font-semibold leading-tight">{title}</dt>
                  <dd className={`mt-2 ${body}`}>{text}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-14 flex flex-col sm:flex-row sm:items-center gap-5">
              <button onClick={() => scrollToSection("pricing")} className={inkBtn}>
                See squad pricing
                <ArrowUpRight className="h-4 w-4" />
              </button>
              <a
                href={CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[17px] font-semibold text-ink underline underline-offset-4"
              >
                Book a squad walkthrough
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </section>
        </div>
      </div>

      {/* PRICING: the one section that breaks the split */}
      <section id="pricing" className="lg:grid lg:grid-cols-2">
        <div className="bg-ink text-paper px-6 py-20 lg:px-12 lg:py-20">
          <h2 className={h2}>Pay for charts. Not seats.</h2>
          <p className="mt-6 max-w-md text-[17px] leading-[1.6] text-paper">
            Individuals get a flat monthly rate. Squads pay annually with a chart bundle that fits your call volume.
            Simple overage if you go over.
          </p>
          <p className="mt-6 text-[17px] font-semibold text-paper">7-day free trial on every plan.</p>
          <div className="mt-10 inline-flex bg-paper/10 p-1" role="group" aria-label="Plan type">
            <button
              onClick={() => setPricingTab("individual")}
              aria-pressed={pricingTab === "individual"}
              className={`px-5 py-2.5 text-[17px] font-semibold transition-colors focus-hi-vis ${
                pricingTab === "individual" ? "bg-paper text-ink" : "text-paper hover:bg-paper/10"
              }`}
            >
              Individual medic
            </button>
            <button
              onClick={() => setPricingTab("squad")}
              aria-pressed={pricingTab === "squad"}
              className={`px-5 py-2.5 text-[17px] font-semibold transition-colors focus-hi-vis ${
                pricingTab === "squad" ? "bg-paper text-ink" : "text-paper hover:bg-paper/10"
              }`}
            >
              Squad / Department
            </button>
          </div>
        </div>

        <div className="px-6 py-20 lg:px-12 lg:py-20">
          {pricingTab === "individual" && (
            <div className="max-w-md">
              <h3 className="text-[22px] font-semibold">Individual</h3>
              <p className={`mt-1 ${body}`}>For solo medics</p>
              <p className="mt-8 flex items-baseline gap-2">
                <span className="text-[44px] lg:text-[64px] font-semibold leading-none tracking-tight tabular-nums">$29.99</span>
                <span className={body}>/ month</span>
              </p>
              <ul className="mt-8 space-y-2.5">
                {[
                  "Unlimited voice narrations",
                  "Direct Zoll ePCR integration",
                  "Chrome extension + mobile",
                  "HIPAA encrypted, end to end",
                  "Cancel any time",
                ].map((line) => (
                  <li key={line} className={body}>{line}</li>
                ))}
              </ul>
              <button onClick={() => handlePlanSelect("individual_monthly")} className={`${inkBtn} mt-10 w-full`}>
                Start 7-day free trial
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {pricingTab === "squad" && (
            <div className="space-y-10">
              {[
                { id: "pilot_annual", name: "Pilot", blurb: "Test it with a small crew", price: "1,000", charts: "500", overage: "$2.50", popular: false },
                { id: "small_squad_annual", name: "Small Squad", blurb: "Volunteer + small services", price: "3,000", charts: "2,000", overage: "$1.90", popular: true },
                { id: "large_squad_annual", name: "Large Squad", blurb: "City and county departments", price: "6,000", charts: "5,000", overage: "$1.40", popular: false },
                { id: "high_volume_annual", name: "High Volume", blurb: "Regional and 911 contractors", price: "10,000", charts: "10,000", overage: "$1.15", popular: false },
              ].map((p) => (
                <div key={p.id} className="grid grid-cols-[1fr_auto] items-end gap-x-6 gap-y-3">
                  <div>
                    <h3 className="text-[22px] font-semibold leading-tight">{p.name}</h3>
                    <p className={body}>
                      {p.blurb}
                      {p.popular && <span className="font-semibold">. Most chosen</span>}
                    </p>
                  </div>
                  <p className="text-right">
                    <span className="text-[34px] lg:text-[44px] font-semibold leading-none tracking-tight tabular-nums">${p.price}</span>
                    <span className="block text-[13px]">/ year</span>
                  </p>
                  <p className="max-w-[60ch] text-[13px] text-ink">
                    {p.charts} charts included · {p.overage} per extra chart · Squad codes &amp; admin controls · One bill,
                    billed annually
                  </p>
                  <button
                    onClick={() => handlePlanSelect(p.id)}
                    className="justify-self-end inline-flex items-center gap-1.5 bg-ink text-paper px-4 py-2.5 text-[17px] font-semibold hover:bg-ink-2 focus-hi-vis"
                  >
                    Start free trial
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <p className={`mt-12 ${body}`}>
            Need a custom plan or county-wide contract?{" "}
            <a href="mailto:narrateems@gmail.com" className="font-semibold underline underline-offset-4">
              Talk to a medic
            </a>
          </p>
        </div>
      </section>

      {/* Second split: sticky photograph left, security / FAQ / start right */}
      <div className="lg:grid lg:grid-cols-2">
        <div className="lg:sticky lg:top-0 lg:h-[100svh]">
          <img
            src="/photos/sunstar-paramedics.jpg"
            alt="Two paramedics standing beside their ambulance"
            className="w-full h-[56svh] lg:h-full object-cover"
            loading="lazy"
          />
        </div>

        <div>
          {/* SECURITY */}
          <section id="security" className="px-6 py-20 lg:px-12 lg:py-20">
            <h2 className={h2}>Patient data is sacred.</h2>
            <p className={`mt-6 max-w-xl ${body}`}>
              We built this for the same patients we used to treat. The security posture matches the trust the badge
              carries.
            </p>
            <dl className="mt-12 space-y-10 max-w-xl">
              {[
                ["HIPAA compliant", "Built to HIPAA standards from day one. We sign BAAs with squads and services."],
                ["Encrypted end to end", "Recordings, transcripts, and chart data are encrypted in transit and at rest."],
                ["Your data, your account", "Only you and your authorized squad members can see your charts. Period."],
                ["Never sold. Never trained on.", "Patient data is not sold and is not used to train third-party models."],
              ].map(([title, text]) => (
                <div key={title}>
                  <dt className="text-[22px] font-semibold leading-tight">{title}</dt>
                  <dd className={`mt-2 ${body}`}>{text}</dd>
                </div>
              ))}
            </dl>
            <a
              href="mailto:narrateems@gmail.com?subject=Security%20questions"
              className="mt-12 inline-flex items-center gap-1.5 text-[17px] font-semibold underline underline-offset-4"
            >
              Security questions? Email a medic
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </section>

          {/* FAQ */}
          <section id="faq" className="bg-paper-tint px-6 py-20 lg:px-12 lg:py-20">
            <h2 className={h2}>Things medics actually ask us.</h2>
            <p className={`mt-6 max-w-xl ${body}`}>
              Can&apos;t find what you&apos;re looking for?{" "}
              <a href="mailto:narrateems@gmail.com" className="font-semibold underline underline-offset-4">
                Email us
              </a>
              . A real medic from the team writes back.
            </p>
            <ul className="mt-12 space-y-2">
              {[
                {
                  q: "Do I have to narrate during the call?",
                  a: "No, and you shouldn't. Work the call. Once you're clear, open NarrateEMS and narrate what happened the way you'd brief your partner. The chart writes from your post-call narration.",
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
                  a: "Use it. NarrateEMS works on mobile browsers too. Narrate from your phone, sign off later from your laptop, or stay on mobile the whole time. Same account, same chart.",
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
                  a: "No. Every medic gets their own login (records belong to them), but a squad code lets all your medics roll up to a single annual plan and one bill.",
                },
              ].map((item, i) => {
                const isOpen = openFaq === i
                return (
                  <li key={item.q} className={isOpen ? "bg-paper" : ""}>
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      className="flex w-full items-start justify-between gap-6 px-4 py-4 text-left text-[17px] font-semibold focus-hi-vis"
                    >
                      {item.q}
                      {isOpen ? <Minus className="mt-1 h-4 w-4 shrink-0" /> : <Plus className="mt-1 h-4 w-4 shrink-0" />}
                    </button>
                    {isOpen && <p className={`px-4 pb-5 ${body}`}>{item.a}</p>}
                  </li>
                )
              })}
            </ul>
          </section>

          {/* FINAL CTA + CONTACT */}
          <section id="start" className="px-6 py-20 lg:px-12 lg:py-20">
            <h2 className={h2}>Go home an hour earlier tonight.</h2>
            <p className={`mt-6 max-w-xl ${body}`}>
              Install the Chrome extension, run your next call, and narrate it on the way back. Your Zoll chart will
              be ready by the time you sit down.
            </p>
            <div className="mt-9 flex flex-col sm:flex-row sm:items-center gap-5">
              <a href={STORE_URL} target="_blank" rel="noopener noreferrer" className={primaryBtn}>
                Install Chrome extension
                <ArrowUpRight className="h-4 w-4" />
              </a>
              <a
                href={CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[17px] font-semibold underline underline-offset-4"
              >
                Or book a squad walkthrough
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>

            <div className="mt-16 bg-paper-tint p-6 lg:p-8">
              <h3 className="text-[22px] font-semibold">Or send us a note</h3>
              <form onSubmit={handleSubmit} className="mt-6 space-y-3">
                {(
                  [
                    ["name", "text", "Name"],
                    ["email", "email", "Email"],
                    ["company", "text", "Squad / Department"],
                  ] as const
                ).map(([key, type, label]) => (
                  <input
                    key={key}
                    type={type}
                    placeholder={label}
                    aria-label={label}
                    value={formData[key]}
                    onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                    required
                    className="w-full bg-paper px-4 py-3 text-[17px] text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-ink"
                  />
                ))}
                <textarea
                  placeholder="What does your charting workflow look like today?"
                  aria-label="What does your charting workflow look like today?"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={3}
                  className="w-full bg-paper px-4 py-3 text-[17px] text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-ink resize-none"
                />
                <button type="submit" disabled={isSubmitting} className={`${inkBtn} w-full disabled:opacity-60`}>
                  {isSubmitting ? "Sending…" : "Send message"}
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </form>
              <a href="mailto:narrateems@gmail.com" className="mt-5 inline-flex items-center gap-2 text-[17px] underline underline-offset-4">
                <Mail className="h-4 w-4" />
                narrateems@gmail.com
              </a>
            </div>
          </section>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-ink text-paper">
        <Chevrons className="block h-7 w-full text-paper" />
        <div className="px-6 py-14 lg:px-12">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <Wordmark variant="paper" size="md" />
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-[17px]">
              <Link href="/privacy-policy" className="hover:underline underline-offset-4">Privacy</Link>
              <Link href="/terms-of-service" className="hover:underline underline-offset-4">Terms</Link>
              <Link href="/sla" className="hover:underline underline-offset-4">SLA</Link>
              <a href="mailto:narrateems@gmail.com" className="hover:underline underline-offset-4">Contact</a>
            </div>
          </div>
          <p className="mt-10 max-w-[60ch] text-[13px] leading-relaxed text-paper">
            Photos via Wikimedia Commons: &ldquo;Ambulance-interior&rdquo; by Ypy31, public domain. &ldquo;New Vernon
            Volunteer Ambulance&rdquo; by Mangocove, CC BY-SA 4.0. &ldquo;Pinellas SunStar Paramedics&rdquo; by
            ReenaLiftCarry, CC BY-SA 4.0.
          </p>
          <p className="mt-4 text-[13px] text-paper">© 2026 NarrateEMS</p>
        </div>
      </footer>

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
