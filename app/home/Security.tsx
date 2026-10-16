import { ArrowUpRight } from "lucide-react"
import { h2, body } from "./shared"

export function Security() {
  return (
    <>
      {/* SECURITY */}
      <section id="security" className="mx-auto max-w-[1400px] px-6 py-20 lg:px-10 lg:py-28">
        <div className="max-w-2xl">
          <h2 className={h2}>Patient data is sacred.</h2>
          <p className={`mt-6 ${body}`}>
            We built this for the same patients we used to treat. The security posture matches the trust the badge
            carries.
          </p>
          <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-2 text-[17px] font-semibold text-ink">
            <li>HIPAA compliant</li>
            <li>End-to-end encrypted</li>
            <li>Direct Zoll ePCR</li>
            <li>Mobile compatible</li>
          </ul>
        </div>
        <div className="mt-14 grid gap-4 lg:grid-cols-3 lg:grid-rows-2">
          <img
            src="/photos/light-trail-detail.jpg"
            alt="Close-up of a blue emergency light streak on a dark road"
            className="h-full min-h-[280px] w-full object-cover lg:row-span-2"
            loading="lazy"
          />
          {[
            ["HIPAA compliant", "Built to HIPAA standards from day one. We sign BAAs with squads and services."],
            ["Encrypted end to end", "Recordings, transcripts, and chart data are encrypted in transit and at rest."],
            ["Your data, your account", "Only you and your authorized squad members can see your charts. Period."],
            ["Never sold. Never trained on.", "Patient data is not sold and is not used to train third-party models."],
          ].map(([title, text], i) => (
            <div key={title} className={`p-8 ${i === 0 || i === 3 ? "bg-ink text-paper" : "bg-paper-tint"}`}>
              <h3 className="text-[22px] font-semibold leading-tight">{title}</h3>
              <p className={`mt-2 text-[17px] leading-[1.6] ${i === 0 || i === 3 ? "text-paper" : "text-ink"}`}>{text}</p>
            </div>
          ))}
        </div>
        <a
          href="mailto:narrateems@gmail.com?subject=Security%20questions"
          className="mt-12 inline-flex items-center gap-1.5 text-[17px] font-semibold underline underline-offset-4"
        >
          Security questions? Email a medic
          <ArrowUpRight className="h-4 w-4" />
        </a>
      </section>

    </>
  )
}
