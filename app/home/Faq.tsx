"use client"

import { useState } from "react"
import { Plus, Minus } from "lucide-react"
import { h2, body } from "./shared"

export function Faq() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  return (
    <>
      {/* FAQ */}
      <section id="faq" className="bg-paper-tint">
        <div className="mx-auto max-w-3xl px-6 py-20 lg:py-28">
          <h2 className={h2}>Things medics actually ask us.</h2>
          <p className={`mt-6 ${body}`}>
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
        </div>
      </section>

    </>
  )
}
