import { useEffect, useRef, type RefObject } from "react"

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

export function Testimonial() {
  const ref = useRef<HTMLElement>(null)
  useReveal(ref)
  return (
    <section ref={ref} id="field" className="navy-tex bg-ink text-paper">
      <figure className="mx-auto max-w-[1400px] px-6 pt-16 pb-14 lg:px-10 lg:pt-24 lg:pb-24">
        <blockquote
          data-reveal
          className={`text-[32px] sm:text-[64px] lg:text-[124px] font-semibold leading-[0.98] tracking-[-0.035em] text-balance ${reveal}`}
        >
          &ldquo;Saved me hours of documentation.&rdquo;
        </blockquote>
        <figcaption data-reveal style={{ transitionDelay: "90ms" }} className={`mt-8 text-[17px] lg:mt-12 lg:text-[20px] ${reveal}`}>
          <span className="font-semibold">Kendall Park First Aid Squad</span>
          <span className="block text-paper/70">New Jersey EMS provider</span>
        </figcaption>
      </figure>
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
