import { h2, body } from "./shared"

export function Why() {
  return (
    <>
      {/* BUILT BY MEDICS */}
      <section id="why" className="bg-paper-tint">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center lg:py-28">
          <h2 className={h2}>We built it for ourselves first.</h2>
          <p className={`mx-auto mt-6 max-w-xl ${body}`}>
            Six-plus years working calls. We know what charting feels like at the end of a sixteen-hour shift, because
            we lived it. NarrateEMS is the tool we wished we had when we were the ones typing.
          </p>
          <dl className="mt-12 grid grid-cols-3 gap-6">
            {[
              ["6+ yrs", "Field experience on the team"],
              ["1hr", "Old way: typing per call"],
              ["<3min", "New way: narrate, sign, done"],
            ].map(([figure, label]) => (
              <div key={label}>
                <dt className="text-[34px] lg:text-[44px] font-semibold leading-none tracking-tight tabular-nums">{figure}</dt>
                <dd className="mt-2 text-[13px] text-ink">{label}</dd>
              </div>
            ))}
          </dl>
          <p className={`mt-12 ${body}`}>The NarrateEMS team. Made in New Jersey.</p>
        </div>
        <img
          src="/photos/ambulance-night-blur.jpg"
          alt="An ambulance passing at night, motion-blurred"
          className="w-full h-[52svh] object-cover"
          loading="lazy"
        />
      </section>

    </>
  )
}
