"use client"

import { LegalLayout } from "@/components/legal-layout"

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout
      title="Privacy Policy."
      meta="Effective March 1, 2025 · Version 3.0 — revised March 2026"
    >
      <p>
        NarrateEMS Inc. is committed to protecting your privacy. This Privacy Policy explains what
        information we collect, how we use it, and how we protect it when you use our Service.
      </p>

      <p>
        Our Service is architected to minimize server-side data exposure. We do not store patient
        care records or narrative content on our servers.
      </p>

      <hr />

      <h2>1. What we collect — and what we don't</h2>

      <h3>What we do collect (stored server-side)</h3>
      <ul>
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

      <h3>What we do NOT store server-side</h3>
      <ul>
        <li>
          <strong>Raw audio recordings:</strong> Voice input is transcribed locally within your browser.
          Raw audio is never captured or transmitted by NarrateEMS.
        </li>
        <li>
          <strong>Text transcripts and session data:</strong> Narrative transcripts and extracted
          clinical data (including chief complaints, diagnoses, vital signs, and patient care
          narratives) are stored temporarily in the browser's local extension storage
          (chrome.storage.local) on the user's device during session processing. This data is
          stored locally on the device only — it is never transmitted to or written to NarrateEMS
          servers or databases. It persists on the device until the user manually resets their
          session using the Reset function in the extension. NarrateEMS cannot access, retrieve, or
          delete this locally stored data remotely.
        </li>
        <li>
          <strong>Patient records:</strong> No patient identifiers, clinical information, or ePCR
          content is stored in NarrateEMS databases.
        </li>
      </ul>

      <blockquote>
        <strong>In plain terms:</strong> patient information processed through NarrateEMS lives
        temporarily on the provider's device only. NarrateEMS does not build or maintain a database
        of patient records.
      </blockquote>

      <hr />

      <h2>2. How we use the information we collect</h2>
      <ul>
        <li>Provision and manage your access to the Service.</li>
        <li>Process payments and manage subscriptions via Stripe.</li>
        <li>Communicate with you about your account, updates, and support.</li>
        <li>Comply with legal obligations.</li>
      </ul>

      <p>
        <strong>
          We do NOT use patient data or transcript content for AI model training. We do NOT sell
          any data to third parties.
        </strong>
      </p>

      <hr />

      <h2>3. How transcript content is processed</h2>
      <ul>
        <li>Your browser's Speech API converts audio to text locally on the device.</li>
        <li>
          The text transcript is stored in the browser's local extension storage on your device and
          transmitted through our backend infrastructure (Supabase Edge Functions), which forwards
          it to our AI providers for documentation generation.
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

      <hr />

      <h2>4. Data storage and security</h2>
      <ul>
        <li>
          <strong>Storage infrastructure:</strong> Supabase (PostgreSQL).
        </li>
        <li>
          <strong>Encryption at rest:</strong> AES-256 encryption at the infrastructure level via
          Supabase platform defaults.
        </li>
        <li>
          <strong>Encryption in transit:</strong> All data is encrypted using TLS/SSL.
        </li>
        <li>
          <strong>Access controls:</strong> Database access is restricted to authorized NarrateEMS
          personnel. Data is isolated by agency.
        </li>
        <li>
          <strong>Logging:</strong> NarrateEMS does not currently log patient data or transcript
          content. Any future logging of such data will be conducted exclusively through
          HIPAA-compliant services with appropriate safeguards.
        </li>
      </ul>

      <hr />

      <h2>5. Third-party subprocessors</h2>
      <div className="my-6 overflow-x-auto rounded-md border border-rule-strong">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-paper-tint text-ink">
            <tr>
              <th className="text-left px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] border-b border-rule">
                Provider
              </th>
              <th className="text-left px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] border-b border-rule">
                Purpose
              </th>
              <th className="text-left px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] border-b border-rule">
                Data received
              </th>
              <th className="text-left px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] border-b border-rule">
                PHI exposure
              </th>
            </tr>
          </thead>
          <tbody className="text-ink-muted">
            <tr className="border-b border-rule">
              <td className="px-4 py-3 align-top">Microsoft Azure OpenAI</td>
              <td className="px-4 py-3 align-top">Field extraction and documentation generation</td>
              <td className="px-4 py-3 align-top">Text transcript + system prompt</td>
              <td className="px-4 py-3 align-top">Yes — HIPAA DPA executed.</td>
            </tr>
            <tr className="border-b border-rule bg-paper-tint/40">
              <td className="px-4 py-3 align-top">Groq</td>
              <td className="px-4 py-3 align-top">Page relevance classification</td>
              <td className="px-4 py-3 align-top">Text transcript + system prompt</td>
              <td className="px-4 py-3 align-top">Yes — BAA in Groq ToS (eff. Oct 15, 2025).</td>
            </tr>
            <tr className="border-b border-rule">
              <td className="px-4 py-3 align-top">Supabase</td>
              <td className="px-4 py-3 align-top">Database, auth, API proxy</td>
              <td className="px-4 py-3 align-top">
                Account/subscription data; transcript in-memory transit only
              </td>
              <td className="px-4 py-3 align-top">Transit only — not persisted.</td>
            </tr>
            <tr className="bg-paper-tint/40">
              <td className="px-4 py-3 align-top">Stripe</td>
              <td className="px-4 py-3 align-top">Billing and payment processing</td>
              <td className="px-4 py-3 align-top">
                User ID, email, subscription metadata only
              </td>
              <td className="px-4 py-3 align-top">No — no clinical data.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>
        NarrateEMS does not permit subprocessors to use your data for their own purposes or for AI
        model training.
      </p>

      <hr />

      <h2>6. Data retention</h2>
      <p>
        Account and subscription records are retained for the duration of your active account and
        for a reasonable period thereafter. Transcript content and extracted clinical session data
        are stored locally on the user's device only and are not held on NarrateEMS servers.
        Deletion of your NarrateEMS account affects only account and subscription records.
      </p>
      <p>
        To request deletion of your account and associated records, contact{" "}
        <a href="mailto:narrateems@gmail.com">narrateems@gmail.com</a>. Requests are processed
        within thirty (30) days.
      </p>

      <hr />

      <h2>7. HIPAA</h2>
      <ul>
        <li>We implement safeguards to protect PHI during transit, including TLS encryption.</li>
        <li>We do not persist PHI in our databases.</li>
        <li>
          Covered Entities must execute a Business Associate Agreement (BAA) with NarrateEMS
          before using the Service with any PHI.
        </li>
        <li>
          We will notify you of any confirmed breach of unsecured PHI in accordance with the HIPAA
          Breach Notification Rule.
        </li>
      </ul>

      <hr />

      <h2>8. Your rights</h2>
      <p>
        You may request access to, correction of, or deletion of personal information we hold
        (account and subscription data). Contact{" "}
        <a href="mailto:narrateems@gmail.com">narrateems@gmail.com</a>. We respond within thirty
        (30) days.
      </p>

      <hr />

      <h2>9. Changes to this policy</h2>
      <p>
        Material changes will be communicated by email or a Service notice at least 14 days before
        taking effect.
      </p>

      <hr />

      <h2>10. Contact</h2>
      <p>
        <strong>NarrateEMS</strong>
        <br />
        Email: <a href="mailto:narrateems@gmail.com">narrateems@gmail.com</a>
        <br />
        Website: <a href="https://www.narrateems.com">www.narrateems.com</a>
      </p>

      <p className="!mt-12 text-center !mb-0 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-soft">
        © 2026 NarrateEMS Inc. All rights reserved.
      </p>
    </LegalLayout>
  )
}
