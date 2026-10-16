"use client"

import { useEffect, useRef, useState } from "react"
import { h2, body, inkBtn } from "./shared"

const SQUAD_PLANS = [
  { id: "pilot_annual", name: "Pilot", blurb: "Test with a small crew", price: "1,000", charts: 500, overage: "$2.50" },
  { id: "small_squad_annual", name: "Small Squad", blurb: "Volunteer + small services", price: "3,000", charts: 2000, overage: "$1.90", popular: true },
  { id: "large_squad_annual", name: "Large Squad", blurb: "City + county departments", price: "6,000", charts: 5000, overage: "$1.40" },
  { id: "high_volume_annual", name: "High Volume", blurb: "Regional + 911 contractors", price: "10,000", charts: 10000, overage: "$1.15" },
]
const MAX_CHARTS = 10000
const SQUAD_COLS = ["xl:col-start-3", "xl:col-start-4", "xl:col-start-5", "xl:col-start-6"]

const card = "flex flex-col gap-6 p-6 xl:row-span-4 xl:row-start-2 xl:grid xl:grid-rows-subgrid xl:gap-6 xl:p-5"
const price = "text-[44px] font-semibold leading-none tracking-tight tabular-nums"
const rise = "motion-safe:transition-[transform,opacity] motion-safe:duration-700 motion-safe:ease-[cubic-bezier(0.16,1,0.3,1)]"

export function Pricing({ onSelectPlan }: { onSelectPlan: (planType: string) => void }) {
  const ref = useRef<HTMLElement>(null)
  // Content renders finished; only arm the entrance when JS runs and the section is still below the fold.
  const [armed, setArmed] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return
    if (el.getBoundingClientRect().top < innerHeight) return
    setArmed(true)
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setArmed(false)
        io.disconnect()
      },
      { threshold: 0.2 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const enter = (i: number) => ({
    className: `${rise} ${armed ? "translate-y-6 opacity-0" : ""}`,
    style: { transitionDelay: `${i * 80}ms` },
  })

  return (
    <section id="pricing" ref={ref} className="bg-paper-tint">
      <div className="mx-auto max-w-xl px-6 py-20 md:max-w-3xl lg:py-28 xl:max-w-[1400px] xl:px-10">
        <h2 className={h2}>Pay for charts. Not seats.</h2>
        <p className="mt-4 text-[22px] font-semibold">7-day free trial on every plan.</p>

        <div className="mt-14 grid gap-3 xl:grid-cols-[minmax(0,1fr)_1.5rem_repeat(4,minmax(0,1fr))] xl:gap-x-3 xl:gap-y-0">
          <div className="xl:col-start-1 xl:row-start-1 xl:pb-5">
            <h3 className="text-[22px] font-semibold leading-tight">Solo medics, billed monthly</h3>
          </div>

          <article className={`${card} bg-paper md:grid md:grid-cols-2 md:gap-x-8 xl:col-start-1 xl:grid-cols-none xl:gap-x-0 ${enter(0).className}`} style={enter(0).style}>
            <h4 className="text-[22px] font-semibold leading-tight md:col-start-1 xl:col-start-auto">Individual</h4>
            <p className="md:col-start-1 xl:col-start-auto">
              <span className={price}>$29.99</span>
              <span className={`mt-2 block ${body}`}>per month</span>
            </p>
            <ul className="space-y-1.5 md:col-start-2 md:row-span-3 md:row-start-1 md:self-center xl:col-start-auto xl:row-span-1 xl:row-start-auto xl:self-auto">
              {["Unlimited narrations", "Direct Zoll ePCR", "Chrome + mobile", "HIPAA, end-to-end encrypted", "Cancel any time"].map((line) => (
                <li key={line} className="text-[17px] leading-snug">{line}</li>
              ))}
            </ul>
            <button onClick={() => onSelectPlan("individual_monthly")} className={`${inkBtn} mt-auto w-full self-end md:col-start-1 xl:col-start-auto`}>
              Start trial
            </button>
          </article>

          <div className="mt-11 xl:col-span-4 xl:col-start-3 xl:row-start-1 xl:mt-0 xl:pb-5">
            <h3 className="text-[22px] font-semibold leading-tight">Squads, billed annually</h3>
            <p className={body}>One bill. Squad codes. Admin controls.</p>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:contents">
          {SQUAD_PLANS.map((p, i) => (
            <article
              key={p.id}
              className={`${card} ${SQUAD_COLS[i]} ${p.popular ? "bg-hi-vis text-hi-vis-ink" : "bg-paper"} ${enter(i + 1).className}`}
              style={enter(i + 1).style}
            >
              <h4 className="text-[22px] font-semibold leading-tight">{p.name}</h4>
              <p>
                <span className={price}>${p.price}</span>
                <span className={`mt-2 block ${body}`}>per year</span>
              </p>
              <div>
                <p className="mb-4 text-[17px] leading-snug">
                  {p.blurb}
                  {p.popular && <strong className="font-semibold">. Most chosen</strong>}
                </p>
                <div className={`h-2.5 overflow-hidden ${p.popular ? "bg-paper" : "bg-paper-tint"}`} aria-hidden>
                  <div
                    className="h-full origin-left bg-ink motion-safe:transition-transform motion-safe:duration-1000 motion-safe:ease-[cubic-bezier(0.16,1,0.3,1)]"
                    style={{ transform: `scaleX(${armed ? 0 : p.charts / MAX_CHARTS})`, transitionDelay: `${300 + i * 120}ms` }}
                  />
                </div>
                <p className="mt-3 text-[17px] font-semibold tabular-nums">{p.charts.toLocaleString("en-US")} charts</p>
                <p className="text-[15px] tabular-nums">+{p.overage} per extra</p>
              </div>
              <button onClick={() => onSelectPlan(p.id)} className={`${inkBtn} mt-auto w-full self-end`}>
                Start trial
              </button>
            </article>
          ))}
          </div>
        </div>

        <p className={`mt-12 ${body}`}>
          Custom or county-wide?{" "}
          <a href="mailto:narrateems@gmail.com" className="whitespace-nowrap font-semibold underline underline-offset-4 focus-hi-vis">
            Talk to a medic
          </a>
        </p>
      </div>
    </section>
  )
}
