"use client"

import { useRef } from "react"
import { Smartphone } from "lucide-react"
import { h2, body } from "./shared"
import { reveal, useReveal } from "./Testimonial"

const steps = [
  [
    <>
      Open{" "}
      <span className="font-bold underline decoration-hi-vis decoration-[5px] underline-offset-[7px] [text-decoration-skip-ink:none]">
        narrateems.com/dictate
      </span>
      .
    </>,
    "Any phone browser. Nothing to install.",
  ],
  ["Talk it through.", "Words show up live. Fix any before you save."],
  ["Pull it in on the laptop.", "Tap From phone in the extension. The chart fills."],
] as const

const facts = [
  ["No signal?", "It records anyway and sends when you're back."],
  ["Gone in 24 hours.", "Or delete it yourself, on the phone or the laptop."],
] as const

export function Anywhere() {
  const ref = useRef<HTMLElement>(null)
  useReveal(ref)
  return (
    <section ref={ref} id="anywhere" className="bg-paper text-ink">
      <div className="mx-auto max-w-[1400px] px-6 py-24 lg:px-10 lg:py-36">
        <div className="lg:grid lg:grid-cols-12 lg:items-center lg:gap-16">
          <div data-reveal className={`relative overflow-hidden rounded-card lg:col-span-6 ${reveal}`}>
            <img
              src="/photos/jump-bags.jpg"
              alt="Navy jump bags with reflective stripes in the back of a rig"
              className="block aspect-[4/5] w-full object-cover sm:aspect-[5/4] lg:aspect-[4/5]"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-ink/45" aria-hidden />
            <div
              data-ui
              role="img"
              aria-label="The NarrateEMS dictate page on a phone, with a saved narration"
              className="absolute left-1/2 top-1/2 w-[230px] -translate-x-1/2 -translate-y-1/2 rounded-[34px] bg-ink-2 p-2.5 sm:w-[260px]"
            >
              <div aria-hidden className="flex h-[440px] flex-col overflow-hidden rounded-[26px] bg-paper text-[13px] leading-snug sm:h-[490px]">
                <div className="mx-auto mt-2.5 h-1.5 w-16 rounded-full bg-ink/20" />
                <div className="flex items-center justify-between px-4 pt-3">
                  <span className="flex items-center gap-1 font-semibold">
                    narrate<span className="rounded-[3px] bg-ink px-1 text-paper">ems</span>
                  </span>
                  <span className="text-ink-muted">Sample call</span>
                </div>
                <p className="mx-3 mt-3 flex-1 overflow-hidden rounded-field bg-white p-3">
                  Called for a fall at home. Adult male, alert and oriented times four, left wrist pain, no head strike. BP
                  138 over 84, pulse 88, SpO2 98 percent on room air. Splinted the left wrist, transported BLS.
                  <span className="pulse-dot ml-0.5 inline-block h-4 w-0.5 translate-y-0.5 bg-ink motion-reduce:animate-none" />
                </p>
                <p className="px-4 pt-2 text-[12px] text-ink-muted">Saved. Deletes in 24 hours.</p>
                <div className="m-3 flex gap-2">
                  <span className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-recording py-2.5 font-semibold text-paper">
                    <span className="h-2 w-2 rounded-full bg-paper" />
                    Record
                  </span>
                  <span className="flex flex-1 items-center justify-center rounded-full bg-ink py-2.5 font-semibold text-paper">Save</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-14 lg:col-span-6 lg:mt-0">
            <h2 data-reveal className={`${h2} ${reveal}`}>Narrate anywhere.</h2>
            <p data-reveal style={{ transitionDelay: "80ms" }} className={`mt-5 max-w-lg ${body} ${reveal}`}>
              On scene, in the rig, back at quarters. Your phone is the mic. The chart waits on the laptop.
            </p>

            <ol className="mt-12 space-y-8">
              {steps.map(([title, line], i) => (
                <li key={i} data-reveal style={{ transitionDelay: `${160 + i * 80}ms` }} className={reveal}>
                  <p className="text-[22px] font-semibold leading-tight tracking-tight lg:text-[26px]">{title}</p>
                  <p className={`mt-1.5 ${body}`}>{line}</p>
                </li>
              ))}
            </ol>

            <dl data-reveal style={{ transitionDelay: "420ms" }} className={`mt-12 grid gap-3 sm:grid-cols-2 ${reveal}`}>
              {facts.map(([term, line]) => (
                <div key={term} className="rounded-card bg-paper-tint p-5">
                  <dt className="flex items-center gap-2 text-[17px] font-semibold">
                    {term === "No signal?" && <Smartphone className="h-4 w-4" aria-hidden />}
                    {term}
                  </dt>
                  <dd className="mt-1 text-[15px] leading-[1.5]">{line}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  )
}
