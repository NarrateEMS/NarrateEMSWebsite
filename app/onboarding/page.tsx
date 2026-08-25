"use client"

export const dynamic = "force-dynamic"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowRight,
  BookOpenText,
  Download,
  ExternalLink,
  LogOut,
  ShieldCheck,
} from "lucide-react"
import { Wordmark } from "@/components/wordmark"
import {
  FeaturesVisual,
  NarrationVisual,
  SquadNameVisual,
  TeamVisual,
} from "@/components/onboarding-visuals"
import { supabase } from "@/lib/supabase"

const CHROME_EXTENSION_URL =
  "https://chromewebstore.google.com/detail/narrateems/nokdpnigpfafepjbdinggckgcdekdjkm"

const sections = [
  { id: "start", label: "Start a narration", number: "01" },
  { id: "features", label: "Know the features", number: "02" },
  { id: "team", label: "Onboard your team", number: "03" },
  { id: "squad-name", label: "Change squad name", number: "04" },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState("")

  useEffect(() => {
    let active = true

    const verifySession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!active) return

      if (!session) {
        router.replace("/")
        return
      }

      setEmail(session.user.email ?? "")
      setLoading(false)
    }

    void verifySession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.replace("/")
      }
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper">
        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft">
          <BookOpenText className="h-4 w-4 animate-pulse text-ink" />
          Loading guide
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-paper text-ink antialiased">
      <nav className="sticky top-0 z-40 border-b border-rule bg-paper/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-5 sm:px-6 lg:px-10">
          <Wordmark href="/" size="md" />
          <div className="flex items-center gap-1 sm:gap-2">
            <Link
              href="/account"
              className="inline-flex items-center gap-1.5 px-2 py-2 text-sm text-ink-muted transition-colors hover:text-ink sm:px-3"
            >
              <ArrowRight className="h-3.5 w-3.5 rotate-180" />
              Account
            </Link>
            <a
              href={CHROME_EXTENSION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-1.5 px-3 py-2 text-sm text-ink-muted transition-colors hover:text-ink md:inline-flex"
            >
              <Download className="h-3.5 w-3.5" />
              Install
            </a>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-2 py-2 text-sm text-ink-muted transition-colors hover:text-ink sm:px-3"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </nav>

      <header className="border-b border-rule bg-grain">
        <div className="mx-auto grid max-w-[1200px] gap-10 px-5 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1fr_0.65fr] lg:px-10 lg:py-24">
          <div>
            <div className="mb-5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft">
              <BookOpenText className="h-3.5 w-3.5" />
              NarrateEMS field guide
            </div>
            <h1 className="max-w-3xl font-serif text-5xl leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl">
              From first narration to a{" "}
              <span className="italic">fully onboarded squad.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-relaxed text-ink-muted sm:text-lg">
              Follow the annotated walkthroughs below while you keep your ZOLL
              chart open in Chrome. The visuals use sample information only.
            </p>
          </div>

          <div className="self-end rounded-2xl border border-rule-strong bg-surface p-5 shadow-[0_18px_50px_rgba(10,22,40,0.06)] sm:p-6">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <ShieldCheck className="h-4 w-4" />
              Before your first narration
            </div>
            <ol className="mt-5 space-y-4">
              {[
                "Install the NarrateEMS Chrome extension.",
                "Sign into the extension with this account.",
                "Open the correct patient chart in ZOLL.",
              ].map((item, index) => (
                <li key={item} className="flex gap-3 text-sm text-ink-muted">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-hi-vis font-mono text-[9px] font-semibold text-ink">
                    {index + 1}
                  </span>
                  <span className="pt-0.5 leading-relaxed">{item}</span>
                </li>
              ))}
            </ol>
            <a
              href={CHROME_EXTENSION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-ink px-4 py-3 text-sm font-semibold text-paper transition-colors hover:bg-ink-2"
            >
              Open Chrome Web Store
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1200px] gap-12 px-5 py-12 sm:px-6 lg:grid-cols-[210px_minmax(0,1fr)] lg:px-10 lg:py-16">
        <aside className="hidden lg:block">
          <div className="sticky top-28">
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-ink-soft">
              In this guide
            </p>
            <nav className="mt-5 border-l border-rule-strong">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="group flex gap-3 border-l-2 border-transparent py-3 pl-4 text-sm text-ink-muted transition-colors hover:border-ink hover:text-ink"
                >
                  <span className="font-mono text-[9px] text-ink-soft">
                    {section.number}
                  </span>
                  <span>{section.label}</span>
                </a>
              ))}
            </nav>
            <p className="mt-8 text-xs leading-relaxed text-ink-soft">
              Signed in as
              <br />
              <span className="break-all text-ink-muted">{email}</span>
            </p>
          </div>
        </aside>

        <main className="min-w-0 space-y-24 sm:space-y-32">
          <section id="start" className="scroll-mt-28">
            <SectionHeader
              number="01"
              eyebrow="The core workflow"
              title="Start a narration"
              description="Keep the ZOLL patient chart in the active Chrome tab, then record or type the way you would brief your partner. Review the transcript before asking NarrateEMS to fill the chart."
            />
            <div className="mt-9">
              <NarrationVisual />
            </div>
            <Note>
              NarrateEMS can make mistakes. Review the completed chart in ZOLL
              before you save or sign it.
            </Note>
          </section>

          <section id="features" className="scroll-mt-28">
            <SectionHeader
              number="02"
              eyebrow="Work with confidence"
              title="Know the features"
              description="The extension keeps recording, reference material, page progress, and the final receipt in one place. You can switch to the checklist or samples without ending an active recording."
            />
            <div className="mt-9">
              <FeaturesVisual />
            </div>
            <div className="mt-7 grid gap-4 sm:grid-cols-3">
              {[
                {
                  title: "Checklist",
                  text: "A prompt for arrival, assessment, transport, transfer of care, and other details worth narrating.",
                },
                {
                  title: "Samples",
                  text: "Create and reuse templates for the calls your crew runs most often.",
                },
                {
                  title: "Page receipt",
                  text: "See what filled successfully and which section still needs review.",
                },
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="border-t border-ink pt-4"
                >
                  <h3 className="text-sm font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                    {feature.text}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section id="team" className="scroll-mt-28">
            <SectionHeader
              number="03"
              eyebrow="For squad administrators"
              title="Onboard your team"
              description="Link the squad once through the extension, then manage invitations from the website account portal. Pending invitations can be resent, and active members can be removed from the roster."
            />
            <div className="mt-9">
              <TeamVisual />
            </div>
            <div className="mt-7 flex flex-col gap-4 rounded-xl border border-rule-strong bg-paper-tint p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold">
                  Ready to invite your crew?
                </p>
                <p className="mt-1 text-sm text-ink-muted">
                  Open Squad administration from your account.
                </p>
              </div>
              <Link
                href="/account"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-ink px-4 py-3 text-sm font-semibold text-paper transition-colors hover:bg-ink-2"
              >
                Manage squad
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </section>

          <section id="squad-name" className="scroll-mt-28">
            <SectionHeader
              number="04"
              eyebrow="For squad administrators"
              title="Change the squad name"
              description="Squad administrators can update the display name from the extension. Open the profile menu, choose Manage squad, select the pencil beside the current name, and save."
            />
            <div className="mt-9">
              <SquadNameVisual />
            </div>
            <Note>
              Renaming the squad does not change the ZOLL service code or break
              the existing link.
            </Note>
          </section>

          <section className="rounded-2xl bg-ink px-6 py-10 text-paper sm:px-10 sm:py-12">
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-paper/55">
              You&apos;re ready
            </p>
            <div className="mt-4 flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="max-w-xl font-serif text-4xl leading-tight sm:text-5xl">
                  Open a ZOLL chart and start your{" "}
                  <span className="italic">first narration.</span>
                </h2>
              </div>
              <a
                href={CHROME_EXTENSION_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-hi-vis px-5 py-3 text-sm font-semibold text-ink transition-colors hover:bg-[#e7bc10]"
              >
                Open extension listing
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </section>
        </main>
      </div>

      <footer className="border-t border-rule">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-2 px-5 py-8 text-xs text-ink-soft sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-10">
          <span className="font-mono uppercase tracking-[0.16em]">
            NarrateEMS field guide
          </span>
          <span>Always review the chart before signing.</span>
        </div>
      </footer>
    </div>
  )
}

function SectionHeader({
  number,
  eyebrow,
  title,
  description,
}: {
  number: string
  eyebrow: string
  title: string
  description: string
}) {
  return (
    <div className="grid gap-5 sm:grid-cols-[64px_minmax(0,1fr)]">
      <div className="font-mono text-xs tracking-[0.18em] text-ink-soft">
        {number}
      </div>
      <div>
        <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-ink-soft">
          {eyebrow}
        </p>
        <h2 className="mt-3 font-serif text-4xl leading-none sm:text-5xl">
          {title}
        </h2>
        <p className="mt-5 max-w-3xl text-base leading-relaxed text-ink-muted">
          {description}
        </p>
      </div>
    </div>
  )
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-7 flex gap-3 border-l-2 border-hi-vis-deep bg-paper-tint px-4 py-3 text-sm leading-relaxed text-ink-muted">
      <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-ink" />
      <p>{children}</p>
    </div>
  )
}
