import { ArrowUpRight } from "lucide-react"
import { CALENDLY_URL, h2, body, inkBtn } from "./shared"

function SquadStage() {
  const members = [
    ["Medic A", "Admin"],
    ["Medic B", "Member"],
    ["Medic C", "Member"],
  ]
  return (
    <div data-ui className="mx-auto w-full max-w-[360px] bg-paper text-ink border border-ink text-[12px]">
      <div className="flex items-center justify-between bg-ink px-3 py-2 text-paper">
        <span className="text-[15px] font-semibold">Manage squad</span>
        <span aria-hidden>×</span>
      </div>
      <div className="space-y-1.5 p-3">
        <div className="flex justify-between"><span className="font-semibold">Squad name</span><span>Sample squad</span></div>
        <div className="flex justify-between"><span className="font-semibold">Squad code</span><span>SAMPLE</span></div>
      </div>
      <div className="px-3 font-semibold">Invite a team member</div>
      <div className="mx-3 mt-1 flex">
        <span className="flex-1 border border-[#D6D2C7] bg-white px-2 py-1.5 text-[#4A5568]">name@squad.org</span>
        <span className="bg-ink px-3 py-1.5 font-semibold text-paper">Invite</span>
      </div>
      <div className="px-3 pt-3 font-semibold">Members {members.length}</div>
      <ul className="m-3 mt-1 border border-[#D6D2C7] bg-white">
        {members.map(([name, role]) => (
          <li key={name} className="flex justify-between px-2 py-1.5 even:bg-[#F5F4F0]">
            <span>{name}</span>
            <span className="text-[#4A5568]">{role}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Squads({ scrollToSection }: { scrollToSection: (id: string) => void }) {
  return (
    <>
      {/* FOR SQUADS */}
      <section id="squads" className="mx-auto max-w-[1400px] px-6 py-20 lg:px-10 lg:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className={h2}>Run a department? We&apos;ve got you.</h2>
          <p className={`mt-6 ${body}`}>
            One squad code. One bill. Every medic charting faster from day one. No per-seat math, no provisioning
            meetings.
          </p>
        </div>
        <div className="mt-16 grid gap-10 lg:grid-cols-[1fr_400px_1fr] lg:items-center">
          {[0, 1].map((col) => (
            <dl key={col} className={`space-y-10 ${col === 1 ? "lg:order-3" : ""}`}>
              {[
                ["Squad codes", "Hand out one code at orientation. New medics join your plan in a click, no email back-and-forth."],
                ["Chart bundles", "Plans start at 500 charts and scale to 10,000+. Pay for what your squad actually runs, with simple overage pricing."],
                ["Real-time usage", "See how many charts your squad has filed this period. No surprises at renewal."],
                ["HIPAA from day one", "End-to-end encryption on every recording and chart. Patient data never leaves the secure pipeline."],
                ["Works on what you've got", "Chrome on the rig laptop, phone on the bench, tablet at the station. Same login, same workflow."],
                ["Squad admin controls", "Promote leads, revoke former members, transfer billing. Run it like you run shifts."],
              ]
                .slice(col * 3, col * 3 + 3)
                .map(([title, text]) => (
                  <div key={title}>
                    <dt className="text-[22px] font-semibold leading-tight">{title}</dt>
                    <dd className={`mt-2 ${body}`}>{text}</dd>
                  </div>
                ))}
            </dl>
          ))}
          <div className="bg-ink px-6 py-10 lg:order-2">
            <SquadStage />
          </div>
        </div>
        <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-5">
          <button onClick={() => scrollToSection("pricing")} className={inkBtn}>
            See squad pricing
            <ArrowUpRight className="h-4 w-4" />
          </button>
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[17px] font-semibold text-ink underline underline-offset-4"
          >
            Book a squad walkthrough
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </section>

    </>
  )
}
