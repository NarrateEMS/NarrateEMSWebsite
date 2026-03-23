"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function SLAPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-slate-200 z-50">
        <div className="max-w-none mx-auto px-8 sm:px-12 lg:px-16 xl:px-20">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/NarrateEMS_Logo_Transparent_Blue-gNghgG69Eid0XYluSONpUoMlNuweF6.png"
                alt="NarrateEMS Logo"
                className="h-8 sm:h-10 md:h-12 w-auto"
              />
            </div>
            <Button
              variant="ghost"
              onClick={() => router.push("/")}
              className="flex items-center gap-2 text-slate-600 hover:text-blue-600"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-8 sm:px-12 lg:px-16">
          <p className="text-sm font-semibold text-teal-600 mb-2">NarrateEMS Inc.</p>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Service Level Agreement</h1>
          <p className="text-lg text-slate-600 mb-4">
            <strong>Version 1.0</strong> — Effective March 2026
          </p>

          <div className="prose prose-slate max-w-none">
            <p className="text-slate-700 leading-relaxed mb-6">
              This Service Level Agreement (&ldquo;SLA&rdquo;) describes what subscribers can expect from NarrateEMS
              with respect to service availability, support, and incident communication. It applies to all active
              subscriptions and is incorporated by reference into the applicable service agreement.
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 mb-8">
              <p className="text-slate-700 leading-relaxed">
                We&apos;ve written this to be honest about where we are as an early-stage product. We&apos;ll update it as
                we grow.
              </p>
            </div>

            <hr className="my-8 border-slate-200" />

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">1. Service Availability</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              NarrateEMS is a Chrome extension that relies on the following underlying infrastructure:
            </p>
            <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-2">
              <li>Supabase (PostgreSQL + Edge Functions)</li>
              <li>Microsoft Azure OpenAI</li>
              <li>Groq API</li>
            </ul>

            <p className="text-slate-700 leading-relaxed mb-4">
              NarrateEMS does not independently guarantee a specific uptime percentage. Service
              availability is dependent on the uptime of these underlying providers, each of which publishes
              their own SLAs:
            </p>

            <div className="overflow-x-auto mb-6">
              <table className="w-full border-collapse border border-slate-300 text-sm text-slate-700">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="border border-slate-300 px-4 py-3 text-left font-semibold text-slate-900">Provider</th>
                    <th className="border border-slate-300 px-4 py-3 text-left font-semibold text-slate-900">Published Uptime SLA</th>
                    <th className="border border-slate-300 px-4 py-3 text-left font-semibold text-slate-900">Status Page</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-slate-300 px-4 py-3">Supabase</td>
                    <td className="border border-slate-300 px-4 py-3">99.9% for Pro plan and above</td>
                    <td className="border border-slate-300 px-4 py-3">
                      <a href="https://status.supabase.com" className="text-teal-600 hover:text-teal-700 underline">status.supabase.com</a>
                    </td>
                  </tr>
                  <tr className="bg-slate-50">
                    <td className="border border-slate-300 px-4 py-3">Microsoft Azure OpenAI</td>
                    <td className="border border-slate-300 px-4 py-3">99.9% per Azure SLA</td>
                    <td className="border border-slate-300 px-4 py-3">
                      <a href="https://status.azure.com" className="text-teal-600 hover:text-teal-700 underline">status.azure.com</a>
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 px-4 py-3">Groq</td>
                    <td className="border border-slate-300 px-4 py-3">See Groq status page</td>
                    <td className="border border-slate-300 px-4 py-3">
                      <a href="https://status.groq.com" className="text-teal-600 hover:text-teal-700 underline">status.groq.com</a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-slate-700 leading-relaxed mb-4">
              NarrateEMS will make commercially reasonable efforts to ensure the extension and backend
              infrastructure remain operational. In practice, the vast majority of outages will originate from one
              of the above providers, not from NarrateEMS-specific code or infrastructure.
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 mb-6">
              <p className="text-slate-700 leading-relaxed">
                <strong>What this means in plain terms:</strong> if Supabase or Azure goes down, NarrateEMS goes down
                with it. We don&apos;t have a redundant fallback infrastructure at this stage. We&apos;ll be transparent
                about incidents as they happen.
              </p>
            </div>

            <hr className="my-8 border-slate-200" />

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">2. Planned Maintenance</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              NarrateEMS may perform planned maintenance on backend infrastructure from time to time. We
              will provide at least 48 hours advance notice by email to the subscriber point of contact before any maintenance that is expected to cause a service interruption.
            </p>
            <p className="text-slate-700 leading-relaxed mb-6">
              Where possible, maintenance will be scheduled during overnight hours (11pm–5am ET) to
              minimize impact on active shifts.
            </p>

            <hr className="my-8 border-slate-200" />

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">3. Incident Communication</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              In the event of an unplanned service outage or degradation that affects the ability to generate
              documentation:
            </p>
            <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-2">
              <li>
                NarrateEMS will post a status update to listed contacts within 2
                hours of confirming the incident.
              </li>
              <li>We will provide updates at regular intervals until the issue is resolved.</li>
              <li>
                A brief post-incident summary will be sent within 3 business days of resolution,
                describing the cause and steps taken to prevent recurrence.
              </li>
            </ul>
            <p className="text-slate-700 leading-relaxed mb-6">
              For real-time status, subscribers can check the status pages of our infrastructure providers
              listed in Section 1.
            </p>

            <hr className="my-8 border-slate-200" />

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">4. Support</h2>

            <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">How to reach us</h3>
            <p className="text-slate-700 leading-relaxed mb-4">
              Email:{" "}
              <a href="mailto:narrateems@gmail.com" className="text-teal-600 hover:text-teal-700 underline">
                narrateems@gmail.com
              </a>
            </p>
            <p className="text-slate-700 leading-relaxed mb-6">
              All support requests should include: your account email, a description of the
              issue, and the device and browser version you&apos;re using.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Response times</h3>
            <p className="text-slate-700 leading-relaxed mb-4">
              NarrateEMS is an early-stage company operated by a small founding team. We commit to the
              following on a best-effort basis:
            </p>

            <div className="overflow-x-auto mb-6">
              <table className="w-full border-collapse border border-slate-300 text-sm text-slate-700">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="border border-slate-300 px-4 py-3 text-left font-semibold text-slate-900">Issue Type</th>
                    <th className="border border-slate-300 px-4 py-3 text-left font-semibold text-slate-900">Target First Response</th>
                    <th className="border border-slate-300 px-4 py-3 text-left font-semibold text-slate-900">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-slate-300 px-4 py-3">Complete service outage — unable to generate any documentation</td>
                    <td className="border border-slate-300 px-4 py-3">Same business day</td>
                    <td className="border border-slate-300 px-4 py-3">Priority issue. We&apos;ll acknowledge and begin investigating immediately.</td>
                  </tr>
                  <tr className="bg-slate-50">
                    <td className="border border-slate-300 px-4 py-3">Partial degradation — some features not working</td>
                    <td className="border border-slate-300 px-4 py-3">Within 2 business days</td>
                    <td className="border border-slate-300 px-4 py-3">We&apos;ll acknowledge and provide an estimated resolution timeline.</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 px-4 py-3">General questions, billing, account changes</td>
                    <td className="border border-slate-300 px-4 py-3">Within 3 business days</td>
                    <td className="border border-slate-300 px-4 py-3">Standard support queue.</td>
                  </tr>
                  <tr className="bg-slate-50">
                    <td className="border border-slate-300 px-4 py-3">Feature requests or feedback</td>
                    <td className="border border-slate-300 px-4 py-3">We read everything</td>
                    <td className="border border-slate-300 px-4 py-3">No guaranteed response time, but we genuinely use this input.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 mb-6">
              <p className="text-slate-700 leading-relaxed">
                <strong>&ldquo;Best effort&rdquo;</strong> means we have no contractual penalty for missing these targets at this stage. We
                include them because we want to be transparent about our intentions, not because we&apos;re
                making a legally enforceable promise. As we grow, this SLA will be updated with binding
                commitments.
              </p>
            </div>

            <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Support hours</h3>
            <p className="text-slate-700 leading-relaxed mb-6">
              We don&apos;t currently offer 24/7 support. Support is monitored during standard business hours,
              Monday through Friday, 9am–6pm ET. We&apos;ll do our best to respond to urgent outage reports
              outside those hours when we see them, but cannot guarantee it.
            </p>

            <hr className="my-8 border-slate-200" />

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">5. Remedies</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              NarrateEMS does not currently offer service credits or refunds for downtime. If you experience a
              significant and prolonged outage that materially impacts your operations, contact us at{" "}
              <a href="mailto:narrateems@gmail.com" className="text-teal-600 hover:text-teal-700 underline">
                narrateems@gmail.com
              </a>{" "}
              and we&apos;ll work something out on a case-by-case basis. We&apos;d rather
              make it right than lose a customer over something outside our control.
            </p>
            <p className="text-slate-700 leading-relaxed mb-6">
              This will be replaced with a formal credit schedule in a future version of this SLA.
            </p>

            <hr className="my-8 border-slate-200" />

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">6. Session Failure and Connectivity — Expected Behavior</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              The following behaviors are by design and do not constitute service failures under this SLA:
            </p>
            <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-2">
              <li>
                <strong>Connectivity loss mid-session:</strong> If a device loses internet connectivity after a narrative has
                been transcribed but before the documentation generation request completes, the
                transcript is held in memory and retried up to 3 times with a 2-second delay. If all retries
                fail, the session fails and the transcript is not recoverable. The user must re-dictate.
                There is no persistent retry queue that survives a browser restart or extension close.
              </li>
              <li>
                <strong>Groq unavailability:</strong> If the Groq page relevance service is unreachable, the extension
                degrades gracefully and processes the current EMS Charts page only. Documentation
                generation via Azure OpenAI continues.
              </li>
              <li>
                <strong>Azure OpenAI unavailability:</strong> If the field extraction service is unreachable, the extension
                retries 3 times. If all retries fail, the session fails. No cross-provider fallback exists.
              </li>
              <li>
                <strong>Shared device session state:</strong> Session data in chrome.storage.local is cleared only on
                manual reset. On shared devices, users should reset their session after each use.
                Residual session state from a prior user is not a service failure.
              </li>
            </ul>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 mb-6">
              <p className="text-slate-700 leading-relaxed">
                In all session failure scenarios, the user&apos;s underlying EMS Charts data is unaffected —
                NarrateEMS only writes to form fields that the user explicitly approves. A failed NarrateEMS
                session never corrupts or alters existing patient records.
              </p>
            </div>

            <hr className="my-8 border-slate-200" />

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">7. Exclusions</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              This SLA does not apply to service unavailability caused by:
            </p>
            <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-2">
              <li>
                Factors outside NarrateEMS&apos;s reasonable control, including upstream provider outages
                (Supabase, Azure OpenAI, Groq), internet service disruptions, or acts of nature.
              </li>
              <li>
                Actions taken by the subscriber, including misconfiguration of devices, unauthorized use,
                or use in violation of the Terms of Service.
              </li>
              <li>Scheduled maintenance communicated in advance per Section 2.</li>
              <li>Session failures caused by device connectivity loss as described in Section 6.</li>
              <li>The free trial period.</li>
            </ul>

            <hr className="my-8 border-slate-200" />

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">8. Updates to This SLA</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              NarrateEMS will update this SLA as the product matures, infrastructure improves, and the team
              grows. Material changes will be communicated by email at least 14 days before taking effect.
            </p>
            <p className="text-slate-700 leading-relaxed mb-6">
              The most current version will always be available at{" "}
              <a href="/sla" className="text-teal-600 hover:text-teal-700 underline">
                narrateems.com/sla
              </a>
              .
            </p>

            <hr className="my-8 border-slate-200" />

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 mb-8">
              <p className="text-slate-900 font-semibold mb-2">NarrateEMS</p>
              <p className="text-slate-700">
                Email:{" "}
                <a href="mailto:narrateems@gmail.com" className="text-teal-600 hover:text-teal-700 underline">
                  narrateems@gmail.com
                </a>
              </p>
              <p className="text-slate-700">
                Website:{" "}
                <a href="https://www.narrateems.com" className="text-teal-600 hover:text-teal-700 underline">
                  www.narrateems.com
                </a>
              </p>
            </div>

            <p className="text-center text-slate-600 text-sm mt-8">&copy; 2025 NarrateEMS Inc. All rights reserved.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8 sm:py-12">
        <div className="max-w-none mx-auto px-8 sm:px-12 lg:px-16 xl:px-20">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/NarrateEMS_Logo_Transparent_White-edQRVIFGqJxTAPGBJm2kUfBX3Lctuf.png"
                alt="NarrateEMS Logo"
                className="h-10 sm:h-12 md:h-14 w-auto hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="flex flex-col md:flex-row items-center gap-4 text-slate-400 text-sm">
              <a href="/" className="hover:text-white transition-colors">
                Home
              </a>
              <a href="/privacy-policy" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="/terms-of-service" className="hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="/sla" className="hover:text-white transition-colors">
                SLA
              </a>
              <span>&copy; 2025 NarrateEMS. All rights reserved.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
