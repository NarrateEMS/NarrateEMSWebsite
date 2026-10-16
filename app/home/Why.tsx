import { useRef } from "react"
import { h2, body } from "./shared"
import { reveal, useReveal } from "./Testimonial"

const bar =
  "h-10 origin-left transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none data-[in=0]:scale-x-0 lg:h-12"

export function Why() {
  const ref = useRef<HTMLElement>(null)
  useReveal(ref)
  return (
    <section ref={ref} id="why" className="bg-paper-tint">
      <div className="mx-auto max-w-[1400px] px-6 py-24 lg:px-10 lg:py-40">
        <div className="lg:grid lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="lg:col-span-6">
            <h2 data-reveal className={`${h2} ${reveal}`}>We built it for ourselves first.</h2>
            <p data-reveal style={{ transitionDelay: "80ms" }} className={`mt-5 ${body} ${reveal}`}>
              Made in New Jersey by a team that lived the sixteen-hour shift.
            </p>
          </div>
          <p data-reveal style={{ transitionDelay: "160ms" }} className={`mt-14 lg:col-span-6 lg:mt-0 lg:text-right ${reveal}`}>
            <span className="block text-[120px] font-semibold leading-[0.8] tracking-[-0.05em] tabular-nums lg:text-[220px]">6+</span>
            <span className="mt-4 block text-[17px] lg:text-[20px]">Years of field experience on the team</span>
          </p>
        </div>

        <div className="mt-20 lg:mt-28 lg:grid lg:grid-cols-12 lg:items-center lg:gap-10">
          <div data-reveal className={`overflow-hidden lg:col-span-5 ${reveal}`}>
            <img
              src="/photos/ambulance-night-blur.jpg"
              alt="An ambulance passing at night, motion-blurred"
              className="block aspect-[4/3] w-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="mt-14 space-y-10 lg:col-span-7 lg:mt-0" role="img" aria-label="Old way: typing per call, 1 hour. New way: narrate, sign, done, under 3 minutes.">
            {[
              ["Old way: typing per call", "1 hr", "flex-1 bg-ink"],
              ["New way: narrate, sign, done", "<3 min", "w-[5%] min-w-6 bg-hi-vis"],
            ].map(([label, figure, fill], i) => (
              <div key={label} aria-hidden>
                <div className="flex items-center gap-4">
                  <div data-reveal style={{ transitionDelay: `${200 + i * 160}ms` }} className={`${bar} ${fill}`} />
                  <span className="shrink-0 text-[34px] font-semibold leading-none tracking-tight tabular-nums lg:text-[44px]">{figure}</span>
                </div>
                <div className="mt-3 text-[17px]">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
