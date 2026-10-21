"use client"

import { useRef } from "react"
import { Smartphone } from "lucide-react"
import { reveal, useReveal } from "./Testimonial"

const chip = "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[13px] font-semibold text-paper"

const steps = [
  {
    dot: "bg-ink",
    title: (
      <>
        Open{" "}
        <span className="font-bold underline decoration-hi-vis decoration-[5px] underline-offset-[7px] [text-decoration-skip-ink:none]">
          narrateems.com/dictate
        </span>
        .
      </>
    ),
    line: "Any phone browser. Nothing to install.",
  },
  {
    dot: "bg-recording",
    title: "Talk it through.",
    line: "Words show up live. Fix any before you save.",
    chip: (
      <span className={`${chip} bg-recording`}>
        <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-paper motion-reduce:animate-none" />
        Recording
      </span>
    ),
  },
  {
    dot: "bg-success",
    title: "Pull it in on the laptop.",
    line: "Tap From phone in the extension. The chart fills.",
    chip: (
      <span className={`${chip} bg-ink`}>
        <Smartphone className="h-3.5 w-3.5" aria-hidden />
        From phone
      </span>
    ),
  },
]

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
              className="block aspect-[2/3] w-full object-cover sm:aspect-[5/4] lg:aspect-[6/7]"
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
                <p className="px-4 pt-2 text-[12px] text-ink-muted">Saved.</p>
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
            <h2 data-reveal className={`text-[44px] font-semibold leading-[0.95] tracking-[-0.03em] lg:text-[88px] ${reveal}`}>
              Narrate anywhere.
            </h2>
            <p data-reveal style={{ transitionDelay: "80ms" }} className={`mt-6 max-w-lg text-[22px] leading-[1.35] ${reveal}`}>
              On scene, in the rig, back at quarters.{" "}
              <span className="text-ink-muted">Your phone is the mic. The chart waits on the laptop.</span>
            </p>

            <ol className="relative mt-12 space-y-9 lg:space-y-11 before:absolute before:bottom-3 before:left-[5px] before:top-3 before:w-1 before:rounded-full before:bg-paper-tint">
              {steps.map((s, i) => (
                <li key={i} data-reveal style={{ transitionDelay: `${160 + i * 80}ms` }} className={`relative pl-9 ${reveal}`}>
                  <span aria-hidden className={`absolute left-0 top-2 h-3.5 w-3.5 rounded-full ring-4 ring-paper ${s.dot}`} />
                  <p className="text-[22px] font-semibold leading-tight tracking-tight lg:text-[26px]">{s.title}</p>
                  <p className="mt-1.5 text-[17px] leading-[1.6] text-ink-muted">{s.line}</p>
                  {s.chip && <div className="mt-3" aria-hidden>{s.chip}</div>}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}
