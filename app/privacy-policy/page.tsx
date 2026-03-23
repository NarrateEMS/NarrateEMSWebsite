"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function PrivacyPolicyPage() {
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
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Privacy Policy</h1>
          <p className="text-lg text-slate-600 mb-8">
            <strong>Effective Date: March 1, 2025</strong> | Version 3.0 — Revised March 2026
          </p>

          <div className="prose prose-slate max-w-none">
            <p className="text-slate-700 leading-relaxed mb-6">
              NarrateEMS Inc. is committed to protecting your privacy. This Privacy Policy explains what
              information we collect, how we use it, and how we protect it when you use our Service.
            </p>

            <p className="text-slate-700 leading-relaxed mb-8">
              Our Service is architected to minimize server-side data exposure. We do not store patient care
              records or narrative content on our servers.
            </p>

            <hr className="my-8 border-slate-200" />

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">1. What We Collect — and What We Don&apos;t</h2>

            <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">What We DO Collect (Stored Server-Side)</h3>
            <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-2">
              <li>Account information: name, email address, professional credentials.</li>
              <li>Agency information: agency name, agency code, admin user ID.</li>
              <li>
                Subscription and billing metadata: subscription status, Stripe customer ID. Stripe
                processes payment card details directly — we do not store card numbers.
              </li>
              <li>
                Basic technical logs for service stability. In production, no patient data or transcript
                content is included in logs.
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">What We Do NOT Store Server-Side</h3>
            <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-2">
              <li>
                <strong>Raw audio recordings:</strong> Voice input is transcribed locally within your browser. Raw audio
                is never captured or transmitted by NarrateEMS.
              </li>
              <li>
                <strong>Text transcripts and session data:</strong> Narrative transcripts and extracted clinical data
                (including chief complaints, diagnoses, vital signs, and patient care narratives) are stored
                temporarily in the browser&apos;s local extension storage (chrome.storage.local) on the user&apos;s
                device during session processing. This data is stored locally on the device only — it is
                never transmitted to or written to NarrateEMS servers or databases. It persists on the
                device until the user manually resets their session using the Reset function in the
                extension. NarrateEMS cannot access, retrieve, or delete this locally stored data
                remotely.
              </li>
              <li>
                <strong>Patient records:</strong> No patient identifiers, clinical information, or ePCR content is stored in
                NarrateEMS databases.
              </li>
            </ul>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 mb-6">
              <p className="text-slate-700 leading-relaxed">
                <strong>In plain terms:</strong> patient information processed through NarrateEMS lives temporarily on the
                provider&apos;s device only. NarrateEMS does not build or maintain a database of patient
                records.
              </p>
            </div>

            <hr className="my-8 border-slate-200" />

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">2. How We Use the Information We Collect</h2>
            <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-2">
              <li>Provision and manage your access to the Service.</li>
              <li>Process payments and manage subscriptions via Stripe.</li>
              <li>Communicate with you about your account, updates, and support.</li>
              <li>Comply with legal obligations.</li>
            </ul>

            <p className="text-slate-700 leading-relaxed mb-6 font-semibold">
              We do NOT use patient data or transcript content for AI model training. We do NOT sell any
              data to third parties.
            </p>

            <hr className="my-8 border-slate-200" />

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">3. How Transcript Content Is Processed</h2>
            <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-2">
              <li>
                Your browser&apos;s Speech API converts audio to text locally on the device.
              </li>
              <li>
                The text transcript is stored in the browser&apos;s local extension storage on your device and
                transmitted through our backend infrastructure (Supabase Edge Functions), which
                forwards it to our AI providers for documentation generation.
              </li>
              <li>
                The AI providers return structured documentation fields — including chief complaints,
                clinical assessments, vital signs, and narrative content — which are stored in
                chrome.storage.local on your device and used to populate the ePCR form.
              </li>
              <li>
                None of this data is written to NarrateEMS servers or databases at any point. It resides
                on the local device only and persists until the user manually resets their session.
              </li>
            </ul>

            <hr className="my-8 border-slate-200" />

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">4. Data Storage and Security</h2>
            <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-2">
              <li><strong>Storage infrastructure:</strong> Supabase (PostgreSQL).</li>
              <li><strong>Encryption at rest:</strong> AES-256 encryption at the infrastructure level via Supabase platform defaults.</li>
              <li><strong>Encryption in transit:</strong> All data is encrypted using TLS/SSL.</li>
              <li><strong>Access controls:</strong> Database access is restricted to authorized NarrateEMS personnel. Data is isolated by agency.</li>
              <li><strong>Logging:</strong> NarrateEMS does not currently log patient data or transcript content. Any future logging of such data will be conducted exclusively through HIPAA-compliant services with appropriate safeguards.</li>
            </ul>

            <hr className="my-8 border-slate-200" />

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">5. Third-Party Subprocessors</h2>
            <div className="overflow-x-auto mb-6">
              <table className="w-full border-collapse border border-slate-300 text-sm text-slate-700">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="border border-slate-300 px-4 py-3 text-left font-semibold text-slate-900">Provider</th>
                    <th className="border border-slate-300 px-4 py-3 text-left font-semibold text-slate-900">Purpose</th>
                    <th className="border border-slate-300 px-4 py-3 text-left font-semibold text-slate-900">Data Received</th>
                    <th className="border border-slate-300 px-4 py-3 text-left font-semibold text-slate-900">PHI Exposure</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-slate-300 px-4 py-3">Microsoft Azure OpenAI</td>
                    <td className="border border-slate-300 px-4 py-3">Field extraction and documentation generation</td>
                    <td className="border border-slate-300 px-4 py-3">Text transcript + system prompt</td>
                    <td className="border border-slate-300 px-4 py-3">Yes — HIPAA DPA executed.</td>
                  </tr>
                  <tr className="bg-slate-50">
                    <td className="border border-slate-300 px-4 py-3">Groq</td>
                    <td className="border border-slate-300 px-4 py-3">Page relevance classification</td>
                    <td className="border border-slate-300 px-4 py-3">Text transcript + system prompt</td>
                    <td className="border border-slate-300 px-4 py-3">Yes — BAA in Groq ToS (eff. Oct 15, 2025).</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 px-4 py-3">Supabase</td>
                    <td className="border border-slate-300 px-4 py-3">Database, auth, API proxy</td>
                    <td className="border border-slate-300 px-4 py-3">Account/subscription data; transcript in-memory transit only</td>
                    <td className="border border-slate-300 px-4 py-3">Transit only — not persisted.</td>
                  </tr>
                  <tr className="bg-slate-50">
                    <td className="border border-slate-300 px-4 py-3">Stripe</td>
                    <td className="border border-slate-300 px-4 py-3">Billing and payment processing</td>
                    <td className="border border-slate-300 px-4 py-3">User ID, email, subscription metadata only</td>
                    <td className="border border-slate-300 px-4 py-3">No — no clinical data.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-slate-700 leading-relaxed mb-6">
              NarrateEMS does not permit subprocessors to use your data for their own purposes or for AI
              model training.
            </p>

            <hr className="my-8 border-slate-200" />

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">6. Data Retention</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Account and subscription records are retained for the duration of your active account and for a
              reasonable period thereafter. Transcript content and extracted clinical session data are stored
              locally on the user&apos;s device only and are not held on NarrateEMS servers. Deletion of your
              NarrateEMS account affects only account and subscription records.
            </p>
            <p className="text-slate-700 leading-relaxed mb-6">
              To request deletion of your account and associated records, contact{" "}
              <a href="mailto:narrateems@gmail.com" className="text-teal-600 hover:text-teal-700 underline">
                narrateems@gmail.com
              </a>
              . Requests are processed within thirty (30) days.
            </p>

            <hr className="my-8 border-slate-200" />

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">7. HIPAA</h2>
            <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-2">
              <li>We implement safeguards to protect PHI during transit, including TLS encryption.</li>
              <li>We do not persist PHI in our databases.</li>
              <li>
                Covered Entities must execute a Business Associate Agreement (BAA) with NarrateEMS
                before using the Service with any PHI.
              </li>
              <li>
                We will notify you of any confirmed breach of unsecured PHI in accordance with the
                HIPAA Breach Notification Rule.
              </li>
            </ul>

            <hr className="my-8 border-slate-200" />

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">8. Your Rights</h2>
            <p className="text-slate-700 leading-relaxed mb-6">
              You may request access to, correction of, or deletion of personal information we hold (account
              and subscription data). Contact{" "}
              <a href="mailto:narrateems@gmail.com" className="text-teal-600 hover:text-teal-700 underline">
                narrateems@gmail.com
              </a>
              . We respond within thirty (30) days.
            </p>

            <hr className="my-8 border-slate-200" />

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">9. Changes to This Policy</h2>
            <p className="text-slate-700 leading-relaxed mb-6">
              Material changes will be communicated by email or a Service notice at least 14 days before
              taking effect.
            </p>

            <hr className="my-8 border-slate-200" />

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">10. Contact</h2>
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

            <hr className="my-8 border-slate-200" />

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
