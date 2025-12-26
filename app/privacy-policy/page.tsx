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
            <strong>Effective Date: December 25, 2024</strong>
          </p>

          <div className="prose prose-slate max-w-none">
            <p className="text-slate-700 leading-relaxed mb-6">
              NarrateEMS ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains
              how we collect, use, disclose, and safeguard your information when you use our Chrome extension.
            </p>

            <p className="text-slate-700 leading-relaxed mb-8">
              By installing and using NarrateEMS, you agree to the collection and use of information in accordance with
              this policy.
            </p>

            <hr className="my-8 border-slate-200" />

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">1. Information We Collect</h2>

            <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">1.1 Personally Identifiable Information</h3>
            <p className="text-slate-700 leading-relaxed mb-4">
              When you create an account or subscribe to NarrateEMS, we may collect:
            </p>
            <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-2">
              <li>Name</li>
              <li>Email address</li>
              <li>Billing address</li>
              <li>Age or date of birth (if required for account verification)</li>
              <li>
                Payment information (processed securely through Stripe; we do not store full payment card details)
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">1.2 Authentication Information</h3>
            <p className="text-slate-700 leading-relaxed mb-4">To secure your account, we collect:</p>
            <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-2">
              <li>Password (encrypted and hashed; never stored in plain text)</li>
              <li>Account credentials for authentication purposes</li>
              <li>Security questions or PINs (if applicable)</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">1.3 Audio and Transcription Data</h3>
            <p className="text-slate-700 leading-relaxed mb-4">When you use the voice recording feature:</p>
            <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-2">
              <li>Audio recordings are captured temporarily for the sole purpose of transcription</li>
              <li>Audio is transmitted securely to our transcription service providers</li>
              <li>Audio recordings are not permanently stored after transcription is complete</li>
              <li>Transcribed text is used only to populate form fields during your active session</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">1.4 Usage Data</h3>
            <p className="text-slate-700 leading-relaxed mb-4">
              We may collect non-personally identifiable information such as:
            </p>
            <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-2">
              <li>Features used within the Extension</li>
              <li>Error logs for troubleshooting</li>
              <li>Session duration and frequency of use</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">1.5 Information We Do NOT Collect</h3>
            <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-2">
              <li>Patient health information or medical records (this data remains within Zoll EMS Charts)</li>
              <li>Your Zoll EMS Charts login credentials</li>
              <li>Contents of completed patient care reports</li>
            </ul>

            <hr className="my-8 border-slate-200" />

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">2. How We Use Your Information</h2>
            <p className="text-slate-700 leading-relaxed mb-4">We use the information we collect to:</p>
            <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-2">
              <li>Provide, operate, and maintain NarrateEMS</li>
              <li>Create and manage your account</li>
              <li>Process subscriptions and payments</li>
              <li>Authenticate your access to the Extension</li>
              <li>Convert voice narrations into text for form population</li>
              <li>Communicate with you about your account, updates, or support requests</li>
              <li>Improve and optimize the Extension</li>
              <li>Detect and prevent fraud or abuse</li>
              <li>Comply with legal obligations</li>
            </ul>

            <hr className="my-8 border-slate-200" />

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">3. Data Sharing and Disclosure</h2>
            <p className="text-slate-700 leading-relaxed mb-6">
              We do not sell, trade, or rent your personal information to third parties.
            </p>

            <p className="text-slate-700 leading-relaxed mb-4">We may share information with:</p>

            <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Service Providers</h3>
            <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-2">
              <li>
                <strong>Transcription Services (Groq):</strong> Processes audio to convert narrations into text
              </li>
              <li>
                <strong>AI Processing (OpenAI):</strong> Extracts medical information from transcriptions for form
                population
              </li>
              <li>
                <strong>Payment Processing (Stripe):</strong> Handles subscription payments securely
              </li>
              <li>
                <strong>Authentication (Supabase):</strong> Provides secure user authentication and account management
              </li>
            </ul>

            <p className="text-slate-700 leading-relaxed mb-6">
              These providers are contractually obligated to protect your information and use it only for the services
              they provide to us.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Legal Requirements</h3>
            <p className="text-slate-700 leading-relaxed mb-6">
              We may disclose your information if required by law, court order, or government request, or to protect
              our rights, your safety, or the safety of others.
            </p>

            <hr className="my-8 border-slate-200" />

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">4. Data Security</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              We implement appropriate security measures to protect your information:
            </p>
            <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-2">
              <li>All data in transit is encrypted using TLS/SSL</li>
              <li>Passwords are hashed using industry-standard algorithms</li>
              <li>Audio recordings are processed in real-time and discarded after transcription</li>
              <li>Access to user data is restricted to authorized personnel only</li>
              <li>We conduct regular security reviews</li>
            </ul>

            <p className="text-slate-700 leading-relaxed mb-6">
              While we strive to protect your information, no method of transmission over the Internet is 100% secure.
              We cannot guarantee absolute security.
            </p>

            <hr className="my-8 border-slate-200" />

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">5. HIPAA Considerations</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              NarrateEMS is designed to assist EMS providers with documentation:
            </p>
            <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-2">
              <li>We process voice narrations to extract information for form population</li>
              <li>Patient information populated into Zoll EMS Charts remains within the Zoll system</li>
              <li>We do not store or retain patient health information</li>
              <li>
                We utilize HIPAA-eligible service providers and maintain appropriate agreements where applicable
              </li>
              <li>
                Users are responsible for ensuring their use of NarrateEMS complies with their organization's policies
                and applicable healthcare regulations
              </li>
            </ul>

            <hr className="my-8 border-slate-200" />

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">6. Data Retention</h2>
            <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-2">
              <li>
                <strong>Account Information:</strong> Retained while your account is active and for a reasonable period
                thereafter for legal and business purposes
              </li>
              <li>
                <strong>Authentication Data:</strong> Retained while your account is active; deleted upon account
                deletion
              </li>
              <li>
                <strong>Audio Recordings:</strong> Not retained; discarded immediately after transcription
              </li>
              <li>
                <strong>Transcriptions:</strong> Temporarily stored during your active session only; not retained after
                session ends
              </li>
              <li>
                <strong>Payment Records:</strong> Retained as required for financial, tax, and legal compliance
              </li>
            </ul>

            <hr className="my-8 border-slate-200" />

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">7. Your Rights</h2>
            <p className="text-slate-700 leading-relaxed mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-2">
              <li>
                <strong>Access:</strong> Request a copy of the personal information we hold about you
              </li>
              <li>
                <strong>Correction:</strong> Request correction of inaccurate or incomplete information
              </li>
              <li>
                <strong>Deletion:</strong> Request deletion of your account and associated personal data
              </li>
              <li>
                <strong>Portability:</strong> Request your data in a portable format
              </li>
              <li>
                <strong>Opt-Out:</strong> Unsubscribe from marketing communications at any time
              </li>
            </ul>

            <p className="text-slate-700 leading-relaxed mb-6">
              To exercise these rights, contact us at{" "}
              <a href="mailto:narrateems@gmail.com" className="text-teal-600 hover:text-teal-700 underline">
                narrateems@gmail.com
              </a>
              .
            </p>

            <hr className="my-8 border-slate-200" />

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">8. Cookies and Tracking</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              NarrateEMS uses local browser storage (Chrome Storage API) to:
            </p>
            <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-2">
              <li>Maintain your session state</li>
              <li>Store temporary form-filling data during active use</li>
              <li>Remember your preferences</li>
            </ul>

            <p className="text-slate-700 leading-relaxed mb-6">
              We do not use third-party tracking cookies or analytics within the Extension.
            </p>

            <hr className="my-8 border-slate-200" />

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">9. Children's Privacy</h2>
            <p className="text-slate-700 leading-relaxed mb-6">
              NarrateEMS is not intended for individuals under the age of 18. We do not knowingly collect personal
              information from children. If we learn we have collected information from a child under 18, we will
              delete it promptly.
            </p>

            <hr className="my-8 border-slate-200" />

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">10. California Privacy Rights</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              If you are a California resident, you have additional rights under the California Consumer Privacy Act
              (CCPA):
            </p>
            <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-2">
              <li>Right to know what personal information we collect and how it is used</li>
              <li>Right to request deletion of your personal information</li>
              <li>Right to opt-out of the sale of personal information (we do not sell your data)</li>
              <li>Right to non-discrimination for exercising your privacy rights</li>
            </ul>

            <hr className="my-8 border-slate-200" />

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">11. International Users</h2>
            <p className="text-slate-700 leading-relaxed mb-6">
              NarrateEMS is operated from the United States. If you are accessing the Extension from outside the United
              States, your information may be transferred to and processed in the United States, where data protection
              laws may differ from those in your jurisdiction.
            </p>

            <hr className="my-8 border-slate-200" />

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">12. Changes to This Privacy Policy</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              We may update this Privacy Policy from time to time. We will notify you of material changes by:
            </p>
            <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-2">
              <li>Posting the updated policy on this page</li>
              <li>Updating the "Effective Date" at the top</li>
              <li>Sending an email notification for significant changes</li>
            </ul>

            <p className="text-slate-700 leading-relaxed mb-6">
              Your continued use of NarrateEMS after changes are posted constitutes acceptance of the revised policy.
            </p>

            <hr className="my-8 border-slate-200" />

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">13. Contact Us</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              If you have questions about this Privacy Policy or wish to exercise your privacy rights, contact us at:
            </p>

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

            <p className="text-center text-slate-600 text-sm mt-8">© 2024 NarrateEMS. All rights reserved.</p>
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
              <span>© 2025 NarrateEMS. All rights reserved.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

