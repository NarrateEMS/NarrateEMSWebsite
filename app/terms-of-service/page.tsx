"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function TermsOfServicePage() {
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
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Terms of Service</h1>
          <p className="text-lg text-slate-600 mb-8">
            <strong>Effective Date: March 1, 2025</strong> | Version 3.0 — Revised March 2026
          </p>

          <div className="prose prose-slate max-w-none">
            <p className="text-slate-700 leading-relaxed mb-6">
              Welcome to NarrateEMS. These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of
              the NarrateEMS Chrome extension and associated services (collectively, the &ldquo;Service&rdquo;)
              provided by NarrateEMS Inc. By installing or using the Service, you agree to be bound by these
              Terms.
            </p>

            <p className="text-slate-700 leading-relaxed mb-8">
              NarrateEMS Inc. is incorporated in the State of Delaware and headquartered in New Jersey.
            </p>

            <hr className="my-8 border-slate-200" />

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">1. What NarrateEMS Is — and Is Not</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              NarrateEMS is a Google Chrome extension that uses AI to help EMS providers convert spoken
              or typed patient care narratives into structured ePCR documentation fields. The Service is a
              productivity and documentation tool only.
            </p>
            <p className="text-slate-700 leading-relaxed mb-6">
              NarrateEMS is NOT a medical device, clinical decision support tool, or source of medical
              advice. It does not diagnose, treat, or recommend any course of care for any patient. All
              AI-generated outputs must be reviewed and verified by the EMS provider before being entered
              into any official patient care record.
            </p>

            <hr className="my-8 border-slate-200" />

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">2. How the Service Works — Technical Summary</h2>
            <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-2">
              <li>
                Voice input is transcribed locally in your browser using the browser&apos;s built-in Web
                Speech API. Raw audio is never captured, stored, or transmitted by NarrateEMS.
              </li>
              <li>
                The resulting text transcript is stored temporarily in the browser&apos;s local extension storage
                (chrome.storage.local) on the user&apos;s device during session processing, and is
                transmitted through our infrastructure to generate structured documentation. Transcript
                content is never transmitted to or stored in NarrateEMS servers or databases, and is not
                recoverable by NarrateEMS.
              </li>
              <li>
                Patient data entered through the Service is not persisted in NarrateEMS databases. Only
                account, subscription, and squad membership data is stored server-side.
              </li>
            </ul>
            <p className="text-slate-700 leading-relaxed mb-6">
              You remain fully responsible for reviewing, verifying, and approving all generated content before
              it is used in any official record.
            </p>

            <hr className="my-8 border-slate-200" />

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">3. Eligibility and Account Registration</h2>
            <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-2">
              <li>
                You have the authority to accept these Terms on behalf of your agency or organization, if
                applicable.
              </li>
              <li>
                The information you provide during registration is accurate and current.
              </li>
              <li>
                You will keep your credentials secure and notify us at{" "}
                <a href="mailto:narrateems@gmail.com" className="text-teal-600 hover:text-teal-700 underline">
                  narrateems@gmail.com
                </a>{" "}
                if you suspect unauthorized access.
              </li>
            </ul>

            <hr className="my-8 border-slate-200" />

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">4. Acceptable Use</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              You agree to use the Service only for lawful EMS documentation purposes. You agree not to:
            </p>
            <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-2">
              <li>Use the Service to create fraudulent, falsified, or misleading medical records.</li>
              <li>Submit content that violates applicable law or third-party rights.</li>
              <li>Attempt to reverse-engineer, decompile, or extract source code from the Service.</li>
              <li>Share account credentials with individuals outside your authorized agency or squad.</li>
              <li>Use the Service in any manner that could damage, overload, or impair our infrastructure.</li>
            </ul>

            <hr className="my-8 border-slate-200" />

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">5. AI-Generated Content — No Accuracy Guarantee</h2>
            <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-2">
              <li>AI outputs may be incomplete, incorrect, or contextually inappropriate.</li>
              <li>
                NarrateEMS makes no warranty — express or implied — regarding the accuracy or
                completeness of any AI-generated content.
              </li>
              <li>
                It is your professional and legal responsibility to review all outputs before submission or
                use in any official patient care record.
              </li>
              <li>
                NarrateEMS is not liable for any harm resulting from reliance on unreviewed
                AI-generated content.
              </li>
            </ul>

            <hr className="my-8 border-slate-200" />

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">6. Privacy and Protected Health Information</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              The Service is designed to handle PHI with minimal server-side exposure. Raw audio is never
              transmitted. Text transcripts and extracted clinical data are stored temporarily in the browser&apos;s
              local extension storage on the user&apos;s device during session processing, and are never
              transmitted to or stored in NarrateEMS servers or databases. Patient record data is not retained
              by NarrateEMS.
            </p>
            <p className="text-slate-700 leading-relaxed mb-6">
              Covered Entities must execute a Business Associate Agreement (BAA) before
              processing any patient information through the Service.
            </p>

            <hr className="my-8 border-slate-200" />

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">7. Subscriptions, Billing, and Failed Payments</h2>
            <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-2">
              <li>Subscriptions are billed per the terms of the applicable service agreement.</li>
              <li>
                If a payment fails, we will notify you by email and allow a 7-day grace period to update
                your payment method. If payment is not received within 7 days, access will be
                suspended until resolved. Data is retained during suspension and for 30 days thereafter.
              </li>
            </ul>

            <hr className="my-8 border-slate-200" />

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">8. Account Deletion and Data Requests</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              To request deletion of your account or associated data, contact us at{" "}
              <a href="mailto:narrateems@gmail.com" className="text-teal-600 hover:text-teal-700 underline">
                narrateems@gmail.com
              </a>
              . Requests are processed within thirty (30) days. Because patient data is not stored server-side,
              deletion affects only account and subscription records.
            </p>

            <hr className="my-8 border-slate-200" />

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">9. Intellectual Property</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              The Service is the property of NarrateEMS Inc. We grant you a limited, non-exclusive,
              non-transferable license to use the Service for internal documentation purposes during your
              subscription term.
            </p>
            <p className="text-slate-700 leading-relaxed mb-6">
              You retain ownership of data you submit; you grant NarrateEMS a limited
              license to process that data solely to provide the Service.
            </p>

            <hr className="my-8 border-slate-200" />

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">10. Limitation of Liability</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              To the fullest extent permitted by applicable law, NarrateEMS Inc. shall not be liable for any
              indirect, incidental, special, consequential, or punitive damages arising from your use of the
              Service, including clinical outcomes, documentation errors not caught during provider review, or
              data loss.
            </p>
            <p className="text-slate-700 leading-relaxed mb-6">
              NarrateEMS&apos;s total cumulative liability shall not exceed the total amount you paid in the twelve
              (12) months preceding the claim, or $250 if no payment has been made.
            </p>

            <hr className="my-8 border-slate-200" />

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">11. Disclaimer of Warranties</h2>
            <p className="text-slate-700 leading-relaxed mb-6">
              The Service is provided &ldquo;AS IS&rdquo; and &ldquo;AS AVAILABLE&rdquo; without any warranty of any kind,
              including warranties of merchantability, fitness for a particular purpose, or non-infringement.
            </p>

            <hr className="my-8 border-slate-200" />

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">12. Indemnification</h2>
            <p className="text-slate-700 leading-relaxed mb-6">
              You agree to indemnify and hold harmless NarrateEMS Inc. and its officers, directors, and
              employees from and against any claims, liabilities, or expenses arising from: (a) your use or
              misuse of the Service; (b) your violation of these Terms; (c) your violation of applicable law; or
              (d) your submission of any content through the Service.
            </p>

            <hr className="my-8 border-slate-200" />

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">13. Termination</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Either party may terminate these Terms at any time. NarrateEMS may suspend or terminate
              your access if you violate these Terms or applicable law.
            </p>
            <p className="text-slate-700 leading-relaxed mb-6">
              Sections 5, 9, 10, 11, 12, and 15 survive termination.
            </p>

            <hr className="my-8 border-slate-200" />

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">14. Changes to the Terms</h2>
            <p className="text-slate-700 leading-relaxed mb-6">
              Material changes will be communicated by email or a notice in the Service at least 14 days
              before taking effect. Continued use after notice constitutes acceptance.
            </p>

            <hr className="my-8 border-slate-200" />

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">15. Governing Law</h2>
            <p className="text-slate-700 leading-relaxed mb-6">
              These Terms are governed by the laws of the State of New Jersey. Disputes shall be resolved in
              state or federal courts located in New Jersey.
            </p>

            <hr className="my-8 border-slate-200" />

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">16. General</h2>
            <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-2">
              <li>
                These Terms constitute the entire agreement between you and NarrateEMS regarding
                the Service.
              </li>
              <li>If any provision is unenforceable, remaining provisions remain in effect.</li>
              <li>You may not assign your rights under these Terms without our prior written consent.</li>
            </ul>

            <hr className="my-8 border-slate-200" />

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Questions</h2>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 mb-8">
              <p className="text-slate-900 font-semibold mb-2">NarrateEMS</p>
              <p className="text-slate-700">
                Email:{" "}
                <a href="mailto:narrateems@gmail.com" className="text-teal-600 hover:text-teal-700 underline">
                  narrateems@gmail.com
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
