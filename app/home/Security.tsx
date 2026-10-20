"use client"

import { ArrowUpRight, Check, FileText, Lock, Mic } from "lucide-react"
import { h2, body } from "./shared"
import { reveal, useReveal } from "./Squads"

const path = [
  { name: "Recording", note: "Chrome or mobile", icon: Mic },
  { name: "Transcript", note: "Encrypted at rest", icon: FileText },
  { name: "Zoll ePCR", note: "Direct to your chart", icon: Check },
]

const access: [string, boolean][] = [
  ["You", true],
  ["Your authorized squad", true],
  ["Data buyers", false],
  ["Third-party model training", false],
]

export function Security() {
  const ref = useReveal<HTMLDivElement>()
  return (
    <section id="security" className="bg-paper">
      <div ref={ref} className="mx-auto max-w-[1400px] px-6 py-20 lg:px-10 lg:py-28">
        <div data-reveal className={`max-w-2xl ${reveal}`}>
          <h2 className={h2}>Patient data is sacred.</h2>
          <p className={`mt-5 ${body}`}>Built by medics for the same patients we used to treat.</p>
        </div>

        <div className="mt-14 grid gap-4 lg:grid-cols-12">
          <img
            src="/photos/light-trail-detail.jpg"
            alt="Close-up of a blue emergency light streak on a dark road"
            className="h-[260px] w-full rounded-card object-cover lg:col-span-4 lg:row-span-2 lg:h-full"
            loading="lazy"
          />

          <div data-reveal className={`navy-tex rounded-card bg-ink p-6 text-paper lg:col-span-8 lg:p-10 ${reveal}`}>
            <h3 className="text-[22px] font-semibold leading-tight lg:text-[28px]">Encrypted end to end.</h3>
            <p className="mt-2 text-[17px] leading-[1.6] text-paper">Recordings, transcripts and chart data, in transit and at rest.</p>
            <ol data-ui className="mt-8 grid gap-2 sm:grid-cols-[4fr_3fr_3fr] sm:gap-3" aria-label="Encrypted data path">
              {path.map(({ name, note, icon: Icon }, i) => (
                <li key={name} className="flex items-center justify-between gap-4 rounded-field bg-ink-2 p-4 sm:flex-col sm:items-start sm:p-5">
                  <span className="flex items-center gap-2 text-[15px] font-semibold leading-tight sm:text-[19px]">
                    <Icon className="h-5 w-5 shrink-0" aria-hidden />
                    {name}
                  </span>
                  <span className="flex items-center gap-2 text-[13px] leading-snug text-paper sm:text-[14px]">
                    {i === 0 ? (
                      <span className="pulse-dot h-2.5 w-2.5 rounded-full shrink-0 bg-recording motion-reduce:animate-none" aria-hidden />
                    ) : (
                      <Lock className="h-3.5 w-3.5 shrink-0 text-hi-vis" aria-hidden />
                    )}
                    {note}
                  </span>
                </li>
              ))}
            </ol>
            <p className="mt-3 flex items-center gap-2 text-[14px] text-paper">
              <span className="h-1 flex-1 rounded-full bg-hi-vis" aria-hidden />
              <Lock className="h-3.5 w-3.5 text-hi-vis" aria-hidden />
              Encrypted in transit
              <span className="h-1 flex-1 rounded-full bg-hi-vis" aria-hidden />
            </p>
          </div>

          <div data-reveal className={`grid gap-6 rounded-card bg-paper-tint p-6 sm:grid-cols-[1fr_auto] lg:col-span-4 lg:grid-cols-1 lg:p-8 ${reveal}`} style={{ transitionDelay: "80ms" }}>
            <div>
              <h3 className="text-[22px] font-semibold leading-tight">HIPAA compliant.</h3>
              <p className="mt-2 text-[17px] leading-[1.6]">Built to HIPAA standards. We sign BAAs with squads and services.</p>
            </div>
            <div data-ui aria-hidden className="w-full max-w-[260px] -rotate-2 rounded-field bg-surface p-4 text-[13px] leading-snug sm:w-[240px] lg:w-full">
              <span className="block text-[15px] font-semibold">Business Associate Agreement</span>
              <span className="mt-3 flex justify-between gap-2"><span>Covered entity</span><span className="font-semibold">Your squad</span></span>
              <span className="mt-1 flex justify-between gap-2"><span>Business associate</span><span className="font-semibold">NarrateEMS</span></span>
              <span className="mt-4 flex items-end justify-between gap-2">
                <span className="text-[20px] italic leading-none">Signed</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-success px-2.5 py-1 font-semibold text-paper">
                  <Check className="h-3 w-3" />
                  Executed
                </span>
              </span>
            </div>
          </div>

          <div data-reveal className={`rounded-card bg-surface p-6 lg:col-span-4 lg:p-8 ${reveal}`} style={{ transitionDelay: "160ms" }}>
            <h3 className="text-[22px] font-semibold leading-tight">Your charts. Your squad.</h3>
            <ul data-ui className="mt-5 space-y-2 text-[15px]" aria-label="Who can see your charts">
              {access.map(([who, ok]) => (
                <li key={who} className={`flex items-center justify-between gap-3 rounded-field px-3 py-2.5 ${ok ? "bg-paper" : "bg-paper-tint text-ink-muted"}`}>
                  <span>{who}</span>
                  <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[13px] font-semibold ${ok ? "bg-success text-paper" : "bg-ink-muted text-paper"}`}>
                    {ok ? "Can see" : "No access"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div data-reveal className={`mt-4 flex flex-col gap-6 navy-tex rounded-card bg-ink p-6 text-paper sm:flex-row sm:items-center sm:justify-between lg:px-10 lg:py-12 ${reveal}`}>
          <p className="text-[34px] font-semibold leading-[1.05] tracking-tight lg:text-[44px]">Never sold. Never trained on.</p>
          <a
            href="mailto:narrateems@gmail.com?subject=Security%20questions"
            className="shrink-0 text-[17px] font-semibold underline underline-offset-4 hover:text-hi-vis focus-hi-vis"
          >
            Security questions? Email a{" "}
            <span className="whitespace-nowrap">
              medic
              <ArrowUpRight className="ml-1.5 inline h-4 w-4 align-[-2px]" />
            </span>
          </a>
        </div>
      </div>
    </section>
  )
}
