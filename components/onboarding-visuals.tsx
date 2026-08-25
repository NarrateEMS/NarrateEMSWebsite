import type { ReactNode } from "react"
import {
  ArrowDown,
  ArrowDownRight,
  ArrowRight,
  Check,
  CheckCircle2,
  CircleUserRound,
  ClipboardCheck,
  FileText,
  ListChecks,
  Mail,
  Mic,
  Pencil,
  RotateCcw,
  Save,
  UserPlus,
} from "lucide-react"

const pageChips = ["1", "2", "3", "4", "5", "8", "N"]

function Figure({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <figure
      aria-label={label}
      className="overflow-hidden rounded-2xl border border-rule-strong bg-surface shadow-[0_24px_70px_rgba(10,22,40,0.09)]"
    >
      {children}
    </figure>
  )
}

function FigureBar({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between border-b border-rule bg-paper-tint px-4 py-3">
      <div className="flex gap-1.5" aria-hidden="true">
        <span className="h-2.5 w-2.5 rounded-full bg-rule-strong" />
        <span className="h-2.5 w-2.5 rounded-full bg-rule-strong" />
        <span className="h-2.5 w-2.5 rounded-full bg-rule-strong" />
      </div>
      <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink-soft">
        {title}
      </span>
    </div>
  )
}

function ExtensionHeader({ menuOpen = false }: { menuOpen?: boolean }) {
  return (
    <div className="relative flex items-center justify-between bg-ink px-3 py-2.5 text-paper">
      <div className="flex items-baseline gap-1.5">
        <span className="font-serif text-xl italic leading-none">narrate</span>
        <span className="rounded-sm bg-paper px-1.5 py-0.5 font-mono text-[7px] uppercase tracking-[0.15em] text-ink">
          ems
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="rounded border border-paper/20 px-2 py-1 font-mono text-[7px] uppercase tracking-[0.12em] text-paper/70">
          Reset
        </span>
        <span className="flex h-7 w-7 items-center justify-center rounded-full border border-paper/25">
          <CircleUserRound className="h-4 w-4" />
        </span>
      </div>
      {menuOpen && (
        <div className="absolute right-2 top-10 z-10 w-40 rounded-md border border-rule-strong bg-surface p-1.5 text-ink shadow-xl">
          <div className="rounded bg-hi-vis px-2.5 py-2 text-xs font-medium">
            Manage squad
          </div>
          <div className="px-2.5 py-2 text-xs text-ink-muted">Billing</div>
          <div className="px-2.5 py-2 text-xs text-ink-muted">Log out</div>
        </div>
      )}
    </div>
  )
}

function Marker({ number }: { number: number }) {
  return (
    <span className="absolute -right-2 -top-2 z-20 flex h-6 w-6 items-center justify-center rounded-full bg-hi-vis font-mono text-[10px] font-semibold text-ink shadow-md ring-2 ring-surface">
      {number}
    </span>
  )
}

function Legend({
  items,
}: {
  items: Array<{ number: number; title: string; text: string }>
}) {
  return (
    <figcaption className="grid gap-px border-t border-rule bg-rule sm:grid-cols-3">
      {items.map((item) => (
        <div key={item.number} className="flex gap-3 bg-paper px-4 py-4 sm:px-5">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-hi-vis font-mono text-[10px] font-semibold">
            {item.number}
          </span>
          <div>
            <div className="flex items-center gap-1.5 text-sm font-semibold text-ink">
              {item.title}
              <ArrowDownRight className="h-3.5 w-3.5 text-ink-soft" />
            </div>
            <p className="mt-1 text-xs leading-relaxed text-ink-muted">
              {item.text}
            </p>
          </div>
        </div>
      ))}
    </figcaption>
  )
}

export function NarrationVisual() {
  return (
    <Figure label="Annotated NarrateEMS recording workflow">
      <FigureBar title="ZOLL chart + NarrateEMS extension" />
      <div className="grid gap-4 bg-grain p-4 sm:p-6 md:grid-cols-[1.05fr_0.95fr]">
        <div className="min-h-[360px] rounded-xl border border-rule-strong bg-[#f7f9fb] p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between border-b border-[#d6dde6] pb-3">
            <div>
              <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-ink-soft">
                Active chart
              </p>
              <p className="mt-1 text-sm font-semibold text-ink">Patient care report</p>
            </div>
            <span className="rounded bg-[#dce6f4] px-2 py-1 font-mono text-[8px] uppercase text-[#34506f]">
              Draft
            </span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {["Dispatch", "Chief complaint", "Assessment", "Narrative"].map(
              (label, index) => (
                <div
                  key={label}
                  className={`rounded-md border bg-white p-3 ${
                    index === 1
                      ? "border-hi-vis-deep shadow-[0_0_0_2px_rgba(250,204,21,0.25)]"
                      : "border-[#d6dde6]"
                  }`}
                >
                  <p className="font-mono text-[8px] uppercase tracking-[0.12em] text-ink-soft">
                    {label}
                  </p>
                  <div className="mt-2 space-y-1.5">
                    <div className="h-2 rounded bg-[#e8edf3]" />
                    <div className="h-2 w-3/4 rounded bg-[#e8edf3]" />
                  </div>
                </div>
              ),
            )}
          </div>
          <div className="mt-4 rounded-md border border-[#d6dde6] bg-white p-3">
            <div className="flex items-center gap-2 text-xs font-medium text-[#34506f]">
              <FileText className="h-3.5 w-3.5" />
              Keep this chart open in the active Chrome tab
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-ink/15 bg-paper shadow-lg">
          <ExtensionHeader />
          <div className="grid grid-cols-3 border-b border-rule bg-paper-tint text-center font-mono text-[8px] uppercase tracking-[0.1em] text-ink-soft">
            <span className="border-b-2 border-ink px-2 py-2.5 text-ink">Recording</span>
            <span className="px-2 py-2.5">Checklist</span>
            <span className="px-2 py-2.5">Samples</span>
          </div>
          <div className="p-4">
            <p className="font-mono text-[8px] uppercase tracking-[0.14em] text-ink-soft">
              Chart page
            </p>
            <div className="mt-2 flex gap-1.5">
              {pageChips.map((chip) => (
                <span
                  key={chip}
                  className="flex h-6 w-6 items-center justify-center rounded-full border border-rule-strong bg-surface font-mono text-[8px]"
                >
                  {chip}
                </span>
              ))}
            </div>

            <div className="relative mt-5">
              <Marker number={1} />
              <div className="flex items-center justify-center gap-2 rounded-md bg-ink px-4 py-3 text-sm font-semibold text-paper">
                <Mic className="h-4 w-4" />
                Start narrating
              </div>
            </div>

            <div className="relative mt-5 rounded-md border border-rule-strong bg-surface p-3">
              <Marker number={2} />
              <p className="font-mono text-[8px] uppercase tracking-[0.14em] text-ink-soft">
                Transcript
              </p>
              <p className="mt-2 text-[11px] leading-relaxed text-ink-muted">
                Patient reports chest discomfort beginning approximately thirty
                minutes before arrival…
              </p>
            </div>

            <div className="relative mt-3">
              <Marker number={3} />
              <div className="flex items-center justify-center gap-2 rounded-md bg-hi-vis px-4 py-3 text-sm font-semibold text-ink">
                Fill the chart
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Legend
        items={[
          {
            number: 1,
            title: "Start and stop",
            text: "Speak naturally, as if briefing your partner.",
          },
          {
            number: 2,
            title: "Review the transcript",
            text: "Correct names, doses, times, or other details before sending.",
          },
          {
            number: 3,
            title: "Fill the chart",
            text: "Keep the ZOLL chart active while NarrateEMS writes the fields.",
          },
        ]}
      />
    </Figure>
  )
}

export function FeaturesVisual() {
  return (
    <Figure label="Annotated overview of NarrateEMS extension features">
      <FigureBar title="Extension feature map" />
      <div className="bg-grain p-4 sm:p-6">
        <div className="mx-auto max-w-[720px] overflow-hidden rounded-xl border border-ink/15 bg-paper shadow-lg">
          <ExtensionHeader />
          <div className="relative grid grid-cols-3 border-b border-rule bg-paper-tint text-center text-xs font-medium">
            <Marker number={1} />
            <span className="border-b-2 border-ink px-2 py-3">Recording</span>
            <span className="px-2 py-3">Checklist</span>
            <span className="px-2 py-3">Samples</span>
          </div>

          <div className="grid gap-4 p-4 sm:grid-cols-[0.9fr_1.1fr] sm:p-5">
            <div>
              <div className="relative rounded-lg border border-rule-strong bg-surface p-3">
                <Marker number={2} />
                <p className="font-mono text-[8px] uppercase tracking-[0.14em] text-ink-soft">
                  Chart page
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {pageChips.map((chip, index) => (
                    <span
                      key={chip}
                      className={`flex h-8 w-8 items-center justify-center rounded-full border font-mono text-[10px] ${
                        index < 3
                          ? "border-ink bg-ink text-paper"
                          : index === 3
                            ? "border-hi-vis-deep bg-hi-vis"
                            : "border-rule-strong bg-paper"
                      }`}
                    >
                      {index < 3 ? <Check className="h-3.5 w-3.5" /> : chip}
                    </span>
                  ))}
                </div>
                <div className="mt-3 flex items-center gap-2 text-[10px] leading-relaxed text-ink-muted">
                  <RotateCcw className="h-3.5 w-3.5 shrink-0" />
                  Finished pages become a visual progress trail.
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="rounded-lg border border-rule-strong bg-surface p-3">
                  <ListChecks className="h-4 w-4 text-ink" />
                  <p className="mt-2 text-xs font-semibold">Checklist</p>
                  <p className="mt-1 text-[10px] leading-relaxed text-ink-muted">
                    Prompts for a complete narration.
                  </p>
                </div>
                <div className="rounded-lg border border-rule-strong bg-surface p-3">
                  <ClipboardCheck className="h-4 w-4 text-ink" />
                  <p className="mt-2 text-xs font-semibold">Samples</p>
                  <p className="mt-1 text-[10px] leading-relaxed text-ink-muted">
                    Reusable templates for common calls.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative rounded-lg border border-rule-strong bg-surface p-4">
              <Marker number={3} />
              <div className="flex items-center justify-between">
                <p className="font-mono text-[8px] uppercase tracking-[0.14em] text-ink-soft">
                  Narration complete
                </p>
                <CheckCircle2 className="h-4 w-4 text-[var(--success)]" />
              </div>
              <div className="mt-4 space-y-2">
                {[
                  ["Dispatch", "Filled"],
                  ["CC / HPI", "Filled"],
                  ["Neuro / Airway", "Review"],
                  ["Narrative", "Filled"],
                ].map(([label, status]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between border-b border-rule pb-2 text-xs"
                  >
                    <span>{label}</span>
                    <span
                      className={`font-mono text-[8px] uppercase tracking-[0.1em] ${
                        status === "Review"
                          ? "rounded bg-hi-vis px-1.5 py-1 text-ink"
                          : "text-[var(--success)]"
                      }`}
                    >
                      {status}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-md border border-rule-strong px-3 py-2 text-center text-xs font-semibold">
                New narration
              </div>
            </div>
          </div>
        </div>
      </div>
      <Legend
        items={[
          {
            number: 1,
            title: "Switch views",
            text: "Record, check what to include, or open reusable samples.",
          },
          {
            number: 2,
            title: "Track page progress",
            text: "The numbered chips show which chart sections are complete.",
          },
          {
            number: 3,
            title: "Read the receipt",
            text: "Confirm filled pages and review anything that still needs attention.",
          },
        ]}
      />
    </Figure>
  )
}

function FlowArrow() {
  return (
    <>
      <ArrowRight className="hidden h-5 w-5 shrink-0 text-ink-soft md:block" />
      <ArrowDown className="h-5 w-5 shrink-0 text-ink-soft md:hidden" />
    </>
  )
}

export function TeamVisual() {
  return (
    <Figure label="Annotated squad onboarding workflow">
      <FigureBar title="Admin team onboarding" />
      <div className="bg-grain p-4 sm:p-6">
        <div className="flex flex-col items-stretch gap-3 md:flex-row md:items-center">
          <div className="flex-1 rounded-xl border border-rule-strong bg-surface p-4">
            <div className="flex items-center justify-between">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-hi-vis font-mono text-[10px] font-semibold">
                1
              </span>
              <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-ink-soft">
                One-time link
              </span>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#e5edf7] text-[#34506f]">
                <FileText className="h-5 w-5" />
              </div>
              <ArrowRight className="h-4 w-4 text-ink-soft" />
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-ink text-paper">
                <Mic className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-4 text-sm font-semibold">Link your ZOLL service</p>
            <p className="mt-1 text-xs leading-relaxed text-ink-muted">
              Open your squad&apos;s chart in ZOLL, then open the extension in the
              same browser.
            </p>
          </div>

          <FlowArrow />

          <div className="relative flex-[1.25] rounded-xl border border-ink bg-ink p-4 text-paper shadow-lg">
            <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-hi-vis font-mono text-[10px] font-semibold text-ink ring-2 ring-paper">
              2
            </span>
            <div className="flex items-center gap-2">
              <UserPlus className="h-4 w-4 text-hi-vis" />
              <p className="text-sm font-semibold">Squad administration</p>
            </div>
            <div className="mt-4 rounded-lg bg-paper p-3 text-ink">
              <p className="font-mono text-[8px] uppercase tracking-[0.14em] text-ink-soft">
                Invite a team member
              </p>
              <div className="mt-2 flex gap-2">
                <div className="min-w-0 flex-1 rounded border border-rule-strong px-2 py-2 text-[10px] text-ink-muted">
                  medic@squad.org
                </div>
                <div className="rounded bg-hi-vis px-3 py-2 text-[10px] font-semibold">
                  Send invite
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-rule pt-3 text-[10px]">
                <span>medic@squad.org</span>
                <span className="font-mono uppercase text-ink-soft">Pending</span>
              </div>
            </div>
          </div>

          <FlowArrow />

          <div className="flex-1 rounded-xl border border-rule-strong bg-surface p-4">
            <div className="flex items-center justify-between">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-hi-vis font-mono text-[10px] font-semibold">
                3
              </span>
              <Mail className="h-4 w-4 text-ink-soft" />
            </div>
            <div className="mt-4 flex h-10 w-10 items-center justify-center rounded-lg bg-paper-tint">
              <CheckCircle2 className="h-5 w-5 text-[var(--success)]" />
            </div>
            <p className="mt-4 text-sm font-semibold">Member accepts</p>
            <p className="mt-1 text-xs leading-relaxed text-ink-muted">
              They open the email link, finish account setup, and sign into the
              extension.
            </p>
          </div>
        </div>
      </div>
      <Legend
        items={[
          {
            number: 1,
            title: "Link first",
            text: "The extension automatically connects the squad to its ZOLL service.",
          },
          {
            number: 2,
            title: "Invite on the website",
            text: "Use Account → Squad administration to send or resend invites.",
          },
          {
            number: 3,
            title: "Finish by email",
            text: "The member accepts, creates credentials if needed, and signs in.",
          },
        ]}
      />
    </Figure>
  )
}

export function SquadNameVisual() {
  return (
    <Figure label="Annotated steps for changing a squad name">
      <FigureBar title="Extension squad settings" />
      <div className="grid gap-4 bg-grain p-4 sm:p-6 md:grid-cols-[0.85fr_auto_1.15fr] md:items-center">
        <div className="overflow-hidden rounded-xl border border-ink/15 bg-paper shadow-lg">
          <ExtensionHeader menuOpen />
          <div className="h-36 p-4">
            <div className="rounded-lg border border-rule-strong bg-surface p-3">
              <p className="font-mono text-[8px] uppercase tracking-[0.14em] text-ink-soft">
                Admin only
              </p>
              <div className="mt-3 flex items-center gap-2 text-xs">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-hi-vis font-mono text-[9px] font-semibold">
                  1
                </span>
                Profile
                <ArrowRight className="h-3.5 w-3.5 text-ink-soft" />
                Manage squad
              </div>
            </div>
          </div>
        </div>

        <FlowArrow />

        <div className="overflow-hidden rounded-xl border border-ink/15 bg-surface shadow-lg">
          <div className="flex items-center justify-between border-b border-rule px-4 py-3">
            <p className="font-serif text-xl">Manage squad</p>
            <span className="text-ink-soft">×</span>
          </div>
          <div className="p-4">
            <p className="font-mono text-[8px] uppercase tracking-[0.14em] text-ink-soft">
              Squad name
            </p>
            <div className="mt-2 flex items-center gap-2">
              <div className="relative min-w-0 flex-1 rounded border border-hi-vis-deep bg-paper px-3 py-2 text-sm">
                <Marker number={2} />
                Central Valley EMS
              </div>
              <span className="flex h-9 w-9 items-center justify-center rounded border border-rule-strong bg-paper">
                <Pencil className="h-3.5 w-3.5" />
              </span>
            </div>
            <div className="relative mt-3 flex items-center gap-2">
              <Marker number={3} />
              <div className="flex-1 rounded border border-rule-strong bg-white px-3 py-2 text-sm">
                Central Valley Rescue
              </div>
              <div className="flex items-center gap-1.5 rounded bg-ink px-3 py-2 text-xs font-semibold text-paper">
                <Save className="h-3.5 w-3.5" />
                Save
              </div>
            </div>
            <p className="mt-3 text-[10px] leading-relaxed text-ink-muted">
              The display name changes; the linked ZOLL squad code stays the same.
            </p>
          </div>
        </div>
      </div>
      <Legend
        items={[
          {
            number: 1,
            title: "Open Manage squad",
            text: "Select the profile icon in the extension. Only admins see this option.",
          },
          {
            number: 2,
            title: "Select the pencil",
            text: "Edit the display name shown to squad members.",
          },
          {
            number: 3,
            title: "Save",
            text: "The name updates without changing the ZOLL service connection.",
          },
        ]}
      />
    </Figure>
  )
}
