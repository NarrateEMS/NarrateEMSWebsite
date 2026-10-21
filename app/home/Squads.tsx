"use client"

import { useEffect, useRef } from "react"
import { ArrowUpRight, Copy, Lock, RefreshCw, Trash2, UserPlus, Users } from "lucide-react"
import { CALENDLY_URL, h2, primaryBtn } from "./shared"

// Reveals [data-reveal] children once as they scroll in; content stays visible without JS or with reduced motion.
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  useEffect(() => {
    const root = ref.current
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          e.target.removeAttribute("data-pending")
          io.unobserve(e.target)
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    )
    root.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight) return
      el.setAttribute("data-pending", "")
      io.observe(el)
    })
    return () => io.disconnect()
  }, [])
  return ref
}

export const reveal =
  "transition-[opacity,translate] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] data-[pending]:opacity-0 data-[pending]:translate-y-6 motion-reduce:transition-none"

const members: [string, "admin" | "member" | "pending"][] = [
  ["medic.a@squad.org", "admin"],
  ["medic.b@squad.org", "member"],
  ["medic.c@squad.org", "member"],
  ["medic.d@squad.org", "pending"],
]

function SquadStage() {
  return (
    <div
      data-ui
      data-reveal
      role="img"
      aria-label="Sample squad admin screen with squad code, chart usage, invite form and member list"
      className={`group w-full overflow-hidden rounded-ui bg-paper text-ink ${reveal}`}
    >
      <div className="flex items-center gap-3 bg-ink-2 px-4 py-3 text-[13px] text-paper">
        <Lock className="h-3.5 w-3.5 shrink-0" aria-hidden />
        <span className="truncate">narrateems.com/account</span>
      </div>

      <div className="flex flex-wrap items-end justify-between gap-2 px-5 pt-6 lg:px-8">
        <span className="text-[24px] font-semibold leading-none lg:text-[28px]">Your squad</span>
        <span className="text-[14px]">3 members, 1 pending</span>
      </div>

      <div className="grid gap-3 p-5 lg:grid-cols-12 lg:px-8 lg:pb-8">
        <div className="grid gap-3 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1 lg:grid-rows-[1fr_auto]">
          <div className="flex flex-col justify-between gap-4 rounded-field bg-surface p-5">
            <span className="block text-[14px]">Charts used this year</span>
            <span className="block">
              <span className="block text-[44px] font-semibold leading-none tabular-nums tracking-tight lg:text-[88px]">
                1,284 <span className="text-[17px] font-normal tracking-normal">of 2,000</span>
              </span>
              <span className="mt-4 block h-2.5 overflow-hidden rounded-full bg-paper-tint">
                <span className="block h-full w-[64%] origin-left bg-hi-vis transition-transform delay-300 duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-data-[pending]:scale-x-0 motion-reduce:transition-none" />
              </span>
            </span>
          </div>
          <div className="rounded-field bg-ink p-5 text-paper">
            <span className="block text-[14px]">Squad code</span>
            <span className="mt-3 flex items-center justify-between text-[26px] font-semibold leading-none tracking-tight">
              SAMPLE42
              <Copy className="h-4 w-4 text-hi-vis" aria-hidden />
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:col-span-7">
          <div className="rounded-field bg-surface p-4">
            <span className="flex items-center gap-2 text-[15px] font-semibold">
              <UserPlus className="h-4 w-4" aria-hidden />
              Invite a member
            </span>
            <span className="mt-3 flex min-w-0 overflow-hidden rounded-field">
              <span className="min-w-0 flex-1 truncate bg-paper px-3 py-2.5 text-[14px] text-ink-muted">name@squad.org</span>
              <span className="bg-hi-vis px-3 py-2.5 text-[14px] font-semibold text-hi-vis-ink">Send invite</span>
            </span>
          </div>
          <div className="flex-1 rounded-field bg-surface p-4">
            <span className="flex items-center gap-2 text-[15px] font-semibold">
              <Users className="h-4 w-4" aria-hidden />
              Members and pending invites
            </span>
            <span className="mt-2 block">
              {members.map(([email, status]) => (
                <span key={email} className="flex items-center justify-between gap-3 rounded-field px-2 py-2 text-[14px] even:bg-paper">
                  <span className={`truncate ${status === "pending" ? "text-ink-muted" : ""}`}>{email}</span>
                  {status === "admin" && <span className="shrink-0 rounded-full bg-ink px-2.5 py-1 text-[13px] text-paper">Admin</span>}
                  {status === "member" && (
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-paper-tint px-2.5 py-1 text-[13px]">
                      <Trash2 className="h-3 w-3" aria-hidden />
                      Remove
                    </span>
                  )}
                  {status === "pending" && (
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-paper-tint px-2.5 py-1 text-[13px]">
                      <RefreshCw className="h-3 w-3" aria-hidden />
                      Resend
                    </span>
                  )}
                </span>
              ))}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

const facts = [
  ["Everyone charts faster", "Each medic saves 1hr+ per shift."],
  ["Usage at a glance", "Real-time chart counts for your squad."],
  ["Invite or remove in a click", "One squad code. Resend or remove anytime."],
  ["One annual bill", "Chart bundles from 500 to 10,000+."],
]

export function Squads({ scrollToSection }: { scrollToSection: (id: string) => void }) {
  const ref = useReveal<HTMLDivElement>()
  return (
    <section id="squads" className="navy-tex bg-ink text-paper">
      <div ref={ref} className="mx-auto max-w-[1400px] px-6 py-20 lg:px-10 lg:py-28">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div data-reveal className={`max-w-2xl ${reveal}`}>
            <h2 className={h2}>Your whole squad on one screen.</h2>
            <p className="mt-5 text-[17px] leading-[1.6] text-paper">Less admin for you. Faster charting for your crew.</p>
          </div>
          <div data-reveal className={`flex flex-col gap-5 sm:flex-row sm:items-center ${reveal}`} style={{ transitionDelay: "80ms" }}>
            <button onClick={() => scrollToSection("pricing")} className={primaryBtn}>
              See squad pricing
              <ArrowUpRight className="h-4 w-4" />
            </button>
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[17px] font-semibold text-paper underline underline-offset-4 hover:text-hi-vis focus-hi-vis"
            >
              Book a squad walkthrough
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="mt-14">
          <SquadStage />
          <dl className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {facts.map(([title, text], i) => (
              <div key={title} data-reveal className={reveal} style={{ transitionDelay: `${120 + i * 70}ms` }}>
                <dt className="text-[20px] font-semibold leading-tight">{title}</dt>
                <dd className="mt-1 text-[17px] leading-[1.5] text-paper">{text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
