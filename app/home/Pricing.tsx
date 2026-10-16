"use client"

import { useState } from "react"
import { ArrowUpRight } from "lucide-react"
import { h2, body, inkBtn } from "./shared"

export function Pricing({ onSelectPlan }: { onSelectPlan: (planType: string) => void }) {
  const [pricingTab, setPricingTab] = useState<"individual" | "squad">("squad")

  return (
    <>
      {/* PRICING */}
      <section id="pricing" className="bg-paper-tint">
        <div className="mx-auto max-w-4xl px-6 py-20 lg:py-28">
          <div className="text-center">
            <h2 className={h2}>Pay for charts. Not seats.</h2>
            <p className={`mx-auto mt-6 max-w-xl ${body}`}>
              Individuals get a flat monthly rate. Squads pay annually with a chart bundle that fits your call volume.
              Simple overage if you go over.
            </p>
            <p className="mt-4 text-[17px] font-semibold">7-day free trial on every plan.</p>
            <div className="mt-8 inline-flex bg-paper p-1" role="group" aria-label="Plan type">
              {(
                [
                  ["individual", "Individual medic"],
                  ["squad", "Squad / Department"],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setPricingTab(key)}
                  aria-pressed={pricingTab === key}
                  className={`px-5 py-2.5 text-[17px] font-semibold transition-colors focus-hi-vis ${
                    pricingTab === key ? "bg-ink text-paper" : "text-ink hover:bg-paper-tint"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {pricingTab === "individual" && (
            <div className="mx-auto mt-14 max-w-md bg-paper p-8">
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
              <button onClick={() => onSelectPlan("individual_monthly")} className={`${inkBtn} mt-10 w-full`}>
                Start 7-day free trial
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {pricingTab === "squad" && (
            <div className="mt-14 space-y-3">
              {[
                { id: "pilot_annual", name: "Pilot", blurb: "Test it with a small crew", price: "1,000", charts: "500", overage: "$2.50", popular: false },
                { id: "small_squad_annual", name: "Small Squad", blurb: "Volunteer + small services", price: "3,000", charts: "2,000", overage: "$1.90", popular: true },
                { id: "large_squad_annual", name: "Large Squad", blurb: "City and county departments", price: "6,000", charts: "5,000", overage: "$1.40", popular: false },
                { id: "high_volume_annual", name: "High Volume", blurb: "Regional and 911 contractors", price: "10,000", charts: "10,000", overage: "$1.15", popular: false },
              ].map((p) => (
                <div key={p.id} className="grid gap-4 bg-paper p-6 sm:grid-cols-[1fr_auto_auto] sm:items-center sm:gap-8">
                  <div>
                    <h3 className="text-[22px] font-semibold leading-tight">{p.name}</h3>
                    <p className={body}>
                      {p.blurb}
                      {p.popular && <span className="font-semibold">. Most chosen</span>}
                    </p>
                    <p className="mt-2 text-[13px] text-ink">
                      {p.charts} charts included, {p.overage} per extra chart. Squad codes &amp; admin controls. One
                      bill, billed annually.
                    </p>
                  </div>
                  <p className="sm:text-right">
                    <span className="text-[34px] lg:text-[44px] font-semibold leading-none tracking-tight tabular-nums">${p.price}</span>
                    <span className="block text-[13px]">/ year</span>
                  </p>
                  <button
                    onClick={() => onSelectPlan(p.id)}
                    className="inline-flex items-center justify-center gap-1.5 bg-ink text-paper px-4 py-2.5 text-[17px] font-semibold hover:bg-ink-2 focus-hi-vis"
                  >
                    Start free trial
                  </button>
                </div>
              ))}
            </div>
          )}

          <p className={`mt-12 text-center ${body}`}>
            Need a custom plan or county-wide contract?{" "}
            <a href="mailto:narrateems@gmail.com" className="font-semibold underline underline-offset-4">
              Talk to a medic
            </a>
          </p>
        </div>
      </section>

    </>
  )
}
