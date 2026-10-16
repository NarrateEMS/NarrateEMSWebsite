import { body } from "./shared"

export function Testimonial() {
  return (
    <>
      {/* TESTIMONIAL */}
      <section id="field" className="mx-auto max-w-[1400px] px-6 py-20 lg:px-10 lg:py-28 lg:grid lg:grid-cols-2 lg:items-center lg:gap-16">
        <img
          src="/photos/night-light-trail.jpg"
          alt="Blue emergency light trail along a highway at night"
          className="w-full aspect-[4/3] object-cover"
          loading="lazy"
        />
        <div className="mt-10 lg:mt-0">
          <blockquote className="text-[34px] lg:text-[44px] font-semibold leading-[1.1] tracking-tight text-balance">
            &ldquo;Saved me hours of documentation.&rdquo;
          </blockquote>
          <p className={`mt-5 ${body}`}>Kendall Park First Aid Squad, New Jersey EMS provider</p>
        </div>
      </section>

    </>
  )
}
