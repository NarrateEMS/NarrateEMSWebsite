import { useEffect, useRef, type RefObject } from "react"
import { Check } from "lucide-react"
import { h2, body } from "./shared"

export const reveal =
  "transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none data-[in=0]:opacity-0 data-[in=0]:translate-y-6"

// Hides [data-reveal] children below the fold, then shows each as it enters. No JS or reduced motion: always visible.
export function useReveal(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = ref.current
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const items = [...root.querySelectorAll<HTMLElement>("[data-reveal]")].filter(
      (el) => el.getBoundingClientRect().top > window.innerHeight,
    )
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          ;(e.target as HTMLElement).dataset.in = "1"
          io.unobserve(e.target)
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    )
    for (const el of items) {
      el.dataset.in = "0"
      io.observe(el)
    }
    return () => io.disconnect()
  }, [ref])
}

const points = ["Types into your Zoll ePCR", "No integration, no IT ticket", "HIPAA, encrypted, BAA"]

export function Testimonial() {
  const ref = useRef<HTMLElement>(null)
  useReveal(ref)
  return (
    <section ref={ref} id="field" className="navy-tex bg-ink text-paper">
      <div className="mx-auto max-w-[1400px] px-6 pt-24 pb-16 lg:px-10 lg:pt-36 lg:pb-24">
        <div className="lg:grid lg:grid-cols-12 lg:items-center lg:gap-10">
          <div className="lg:col-span-7">
            <h2 data-reveal className={`${h2} ${reveal}`}>
              Talk through the call. <span className="sm:block">Zoll is charted.</span>
            </h2>
            <p data-reveal style={{ transitionDelay: "80ms" }} className={`mt-5 ${body} text-paper ${reveal}`}>
              One narration fills every chart page.
            </p>
          </div>
          <ul className="mt-12 space-y-5 lg:col-span-5 lg:mt-0 lg:space-y-6">
            {points.map((point, i) => (
              <li
                key={point}
                data-reveal
                style={{ transitionDelay: `${160 + i * 80}ms` }}
                className={`flex items-center gap-4 text-[20px] font-semibold leading-[1.15] tracking-tight lg:text-[24px] ${reveal}`}
              >
                <Check className="h-5 w-5 shrink-0 text-hi-vis lg:h-6 lg:w-6" strokeWidth={3} aria-hidden />
                {point}
              </li>
            ))}
          </ul>
        </div>

        <figure
          data-reveal
          className={`mt-16 rounded-card bg-ink-2 p-7 lg:mt-24 lg:flex lg:items-end lg:justify-between lg:gap-10 lg:p-10 ${reveal}`}
        >
          <blockquote className="text-[22px] font-medium leading-[1.25] tracking-tight lg:text-[28px]">
            &ldquo;Saved me hours of documentation.&rdquo;
          </blockquote>
          <figcaption className="mt-5 text-[15px] lg:mt-0 lg:text-right lg:text-[17px]">
            <span className="font-semibold">Kendall Park First Aid Squad</span>
            <span className="block text-paper/70">New Jersey EMS provider</span>
          </figcaption>
        </figure>
      </div>
      <div className="overflow-hidden">
        <img
          data-reveal
          src="/photos/night-light-trail.jpg"
          alt="Blue emergency light trail along a highway at night"
          className="block h-[44svh] w-full object-cover transition-transform duration-[1800ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none data-[in=0]:scale-[1.08] lg:h-[62svh]"
          loading="lazy"
        />
      </div>
    </section>
  )
}
