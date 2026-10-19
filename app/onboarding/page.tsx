"use client"

export const dynamic = "force-dynamic"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowRight,
  BookOpenText,
  ExternalLink,
  LogOut,
  ShieldCheck,
} from "lucide-react"
import { AppNav, btn, outlineBtn, navLink } from "@/components/app-ui"
import { primaryBtn } from "@/app/home/shared"
import {
  FeaturesVisual,
  NarrationVisual,
  SquadNameVisual,
  TeamVisual,
} from "@/components/onboarding-visuals"
import { supabase } from "@/lib/supabase"
import { clearDictateData } from "@/lib/dictate/store"

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
    await clearDictateData()
    await supabase.auth.signOut()
    router.push("/")
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper">
        <div className="flex items-center gap-3 text-[17px] text-ink-muted">
          <BookOpenText className="h-4 w-4 animate-pulse text-ink" />
          Loading guide
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-paper text-ink antialiased">
      <AppNav>
        <Link href="/account" className={navLink}>
          Account
        </Link>
        <button onClick={handleLogout} className={navLink}>
          <LogOut className="h-4 w-4" />
          Log out
        </button>
      </AppNav>

      <header className="border-b border-rule">
        <div className="mx-auto grid max-w-[1200px] gap-10 px-5 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1fr_0.65fr] lg:px-10 lg:py-24">
          <div>
            <div className="mb-5 flex items-center gap-2 text-[17px] font-medium text-ink-muted">
              <BookOpenText className="h-4 w-4" />
              NarrateEMS field guide
            </div>
            <h1 className="max-w-3xl text-[44px] font-semibold leading-[1.02] tracking-tight text-balance sm:text-[56px] lg:text-[64px]">
              From first narration to a fully onboarded squad.
            </h1>
            <p className="mt-7 max-w-2xl text-[17px] leading-relaxed text-ink-muted sm:text-[19px]">
              Follow the annotated walkthroughs below while you keep your ZOLL
              chart open in Chrome. The visuals use sample information only.
            </p>
          </div>

          <div className="self-end rounded-card border border-rule bg-surface p-6">
            <div className="flex items-center gap-2 text-[17px] font-semibold">
              <ShieldCheck className="h-4 w-4" />
              Before your first narration
            </div>
            <ol className="mt-5 space-y-4">
              {[
                "Install the NarrateEMS Chrome extension.",
                "Sign into the extension with this account.",
                "Open the correct patient chart in ZOLL.",
              ].map((item, index) => (
                <li key={item} className="flex gap-3 text-[17px] text-ink-muted">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink text-[15px] font-semibold text-paper">
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
              className={`${btn} mt-6 w-full`}
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
            <p className="text-[15px] font-semibold text-ink">
              In this guide
            </p>
            <nav className="mt-5 border-l border-rule-strong">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="group flex min-h-11 items-center gap-3 border-l-2 border-transparent py-2 pl-4 text-[15px] text-ink-muted transition-colors hover:border-ink hover:text-ink focus-hi-vis"
                >
                  <span className="text-ink-soft tabular-nums">
                    {section.number}
                  </span>
                  <span>{section.label}</span>
                </a>
              ))}
            </nav>
            <p className="mt-8 text-[14px] leading-relaxed text-ink-muted">
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
                  className="rounded-card border border-rule bg-surface p-5"
                >
                  <h3 className="text-[17px] font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">
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
            <div className="mt-7 flex flex-col gap-4 rounded-card border border-rule bg-paper-tint p-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[17px] font-semibold">
                  Ready to invite your crew?
                </p>
                <p className="mt-1 text-[15px] text-ink-muted">
                  Open Squad administration from your account.
                </p>
              </div>
              <Link
                href="/account"
                className={`${outlineBtn} shrink-0`}
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

          <section className="rounded-card bg-ink px-6 py-10 text-paper sm:px-10 sm:py-12">
            <p className="text-[17px] font-medium text-paper/80">
              You&apos;re ready
            </p>
            <div className="mt-4 flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="max-w-xl text-[34px] font-semibold tracking-tight leading-tight text-balance sm:text-[44px]">
                  Open a ZOLL chart and start your first narration.
                </h2>
              </div>
              <a
                href={CHROME_EXTENSION_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={`${primaryBtn} shrink-0`}
              >
                Open extension listing
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </section>
        </main>
      </div>

      <footer className="border-t border-rule">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-2 px-5 py-8 text-[15px] text-ink-muted sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-10">
          <span>
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
      <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-ink text-[17px] font-semibold text-paper tabular-nums">
        {number}
      </div>
      <div>
        <p className="text-[17px] font-medium text-ink-muted">
          {eyebrow}
        </p>
        <h2 className="mt-2 text-[34px] font-semibold leading-[1.05] tracking-tight sm:text-[44px]">
          {title}
        </h2>
        <p className="mt-5 max-w-3xl text-[17px] leading-relaxed text-ink-muted">
          {description}
        </p>
      </div>
    </div>
  )
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-7 flex gap-3 rounded-card border border-rule bg-paper-tint p-5 text-[15px] leading-relaxed text-ink">
      <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-ink" />
      <p>{children}</p>
    </div>
  )
}
