"use client"

import Link from "next/link"
import { rv, useReveal } from "./Faq"

const links = [
  ["/privacy-policy", "Privacy"],
  ["/terms-of-service", "Terms"],
  ["/sla", "SLA"],
  ["mailto:narrateems@gmail.com", "Contact"],
] as const

export function Footer() {
  const ref = useReveal<HTMLElement>()
  return (
    <footer ref={ref} className="overflow-hidden bg-paper text-ink">
      <div className="mx-auto max-w-[1400px] px-6 pt-16 pb-10 lg:px-10 lg:pt-20">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <p className="max-w-[22ch] text-[22px] font-semibold leading-tight tracking-tight lg:text-[32px]">By medics. For medics.</p>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-8 gap-y-3 text-[17px] font-semibold">
            {links.map(([href, label]) =>
              href.startsWith("mailto:") ? (
                <a key={label} href={href} className="underline-offset-4 hover:underline focus-hi-vis">{label}</a>
              ) : (
                <Link key={label} href={href} className="underline-offset-4 hover:underline focus-hi-vis">{label}</Link>
              ),
            )}
          </nav>
        </div>

        <Link href="/" aria-label="NarrateEMS home" className={`mt-14 flex items-end gap-[2vw] leading-[0.8] tracking-tight focus-hi-vis ${rv}`}>
          <span aria-hidden className="text-[18vw] font-semibold lg:text-[248px]">narrate</span>
          <span aria-hidden className="mb-[1.2vw] bg-ink px-[1.4vw] py-[0.4vw] text-[8.5vw] font-semibold leading-none text-paper lg:mb-4 lg:px-5 lg:py-1 lg:text-[118px]">
            ems
          </span>
        </Link>

        <div className="mt-12 flex flex-col gap-4 text-[13px] leading-relaxed text-ink-muted md:flex-row md:justify-between md:gap-10">
          <p className="max-w-[60ch]">
            Photos: &ldquo;Ambulance at night&rdquo; by JumpV, CC BY 2.0, via Flickr. &ldquo;Fontainebleau ambulance soir
            2020-11-22 (2)&rdquo; by Baidax, CC BY-SA 4.0, and &ldquo;Bags of medical supplies and defibrillators&rdquo; by
            Hillelfrei, CC BY-SA 4.0 (cropped), both via Wikimedia Commons.
          </p>
          <p className="shrink-0">© 2026 NarrateEMS</p>
        </div>
      </div>
    </footer>
  )
}
