"use client"

import { useEffect, useRef, useState } from "react"
import { Plus, Minus } from "lucide-react"
import { h2, body } from "./shared"

// Hidden only after JS arms the section, so no-JS and reduced-motion users see the finished state.
export const rv =
  "motion-safe:transition-[opacity,translate] motion-safe:duration-700 motion-safe:ease-[cubic-bezier(0.16,1,0.3,1)] motion-safe:[[data-armed]_&]:opacity-0 motion-safe:[[data-armed]_&]:translate-y-6 [[data-armed][data-shown]_&]:opacity-100 [[data-armed][data-shown]_&]:translate-y-0"

export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || !("IntersectionObserver" in window)) return
    el.dataset.armed = ""
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        el.dataset.shown = ""
        io.disconnect()
      },
      { rootMargin: "0px 0px -15% 0px" },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return ref
}

const faqs = [
  { q: "Do I have to narrate during the call?", a: "No. Work the call, then narrate it after, like briefing your partner." },
  { q: "Does it work with my service's Zoll setup?", a: "Yes. The extension types into your open Zoll ePCR fields. No integration, no IT ticket." },
  { q: "Who can hear my recordings?", a: "Only you. Encrypted, kept on your account, never sold or used to train third-party models. Admins see usage counts." },
  { q: "What if I'm on my phone?", a: "Use it. Mobile browsers work too. Same account, same chart, phone or laptop." },
  { q: "How much faster is it really?", a: "Squads report 70% faster charting, under 10 seconds per chart page." },
  { q: "What happens during the free trial?", a: "7 days, full product. We take a card at checkout but only charge it on day 7, so cancel before then and pay nothing. Individuals check out once their agency signs our free BAA." },
  { q: "Can my whole squad use one account?", a: "No. Each medic owns their login and records. A squad code puts everyone on one annual bill." },
]

export function Faq() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const ref = useReveal<HTMLElement>()

  return (
    <section id="faq" ref={ref} className="bg-paper-tint">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-6 py-20 lg:grid-cols-12 lg:gap-10 lg:px-10 lg:py-28">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-24">
            <h2 className={`${h2} ${rv}`}>FAQs</h2>
            <p className={`mt-5 ${body} ${rv} delay-75`}>
              Not here?{" "}
              <a href="mailto:narrateems@gmail.com" className="font-semibold underline underline-offset-4 focus-hi-vis">
                Email us
              </a>
              . A medic writes back.
            </p>
            <a
              href="mailto:narrateems@gmail.com"
              className={`mt-10 block rounded-card bg-ink p-8 text-paper hover:bg-ink-2 transition-colors focus-hi-vis ${rv} delay-150`}
            >
              <span className="block text-[44px] font-semibold leading-none text-hi-vis lg:text-[64px]">?</span>
              <span className="mt-6 block text-[22px] font-semibold">narrateems@gmail.com</span>
              <span className="mt-1 block text-[17px] text-paper/70">A medic writes back.</span>
            </a>
          </div>
        </div>
        <ul className="space-y-2 lg:col-span-7">
          {faqs.map((item, i) => {
            const isOpen = openFaq === i
            return (
              <li key={item.q} className={`rounded-card ${rv} ${isOpen ? "bg-ink text-paper" : "text-ink"}`} style={{ transitionDelay: `${i * 60}ms` }}>
                <h3>
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-${i}`}
                    className="flex w-full items-center justify-between gap-6 rounded-card px-6 py-5 text-left text-[22px] font-semibold leading-snug focus-hi-vis lg:px-8 lg:py-6"
                  >
                    {item.q}
                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${isOpen ? "bg-hi-vis text-hi-vis-ink" : "bg-paper"}`}>
                      {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    </span>
                  </button>
                </h3>
                <p id={`faq-${i}`} hidden={!isOpen} className="max-w-[52ch] px-6 pb-6 text-[17px] leading-[1.6] text-paper lg:px-8 lg:pb-7">
                  {item.a}
                </p>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
