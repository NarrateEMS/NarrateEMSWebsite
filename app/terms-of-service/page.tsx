"use client"

import { LegalLayout } from "@/components/legal-layout"

export default function TermsOfServicePage() {
  return (
    <LegalLayout
      title="Terms of Service."
      meta="Effective March 1, 2025 · Version 3.0 — revised March 2026"
    >
      <p>
        Welcome to NarrateEMS. These Terms of Service ("Terms") govern your access to and use of
        the NarrateEMS Chrome extension and associated services (collectively, the "Service")
        provided by NarrateEMS Inc. By installing or using the Service, you agree to be bound by
        these Terms.
      </p>
      <p>
        NarrateEMS Inc. is incorporated in the State of Delaware and headquartered in New Jersey.
      </p>

      <hr />

      <h2>1. What NarrateEMS is — and is not</h2>
      <p>
        NarrateEMS is a Google Chrome extension that uses AI to help EMS providers convert spoken
        or typed patient care narratives into structured ePCR documentation fields. The Service is
        a productivity and documentation tool only.
      </p>
      <p>
        NarrateEMS is NOT a medical device, clinical decision support tool, or source of medical
        advice. It does not diagnose, treat, or recommend any course of care for any patient. All
        AI-generated outputs must be reviewed and verified by the EMS provider before being entered
        into any official patient care record.
      </p>

      <hr />

      <h2>2. How the Service works — technical summary</h2>
      <ul>
        <li>
          Voice input is transcribed locally in your browser using the browser's built-in Web
          Speech API. Raw audio is never captured, stored, or transmitted by NarrateEMS.
        </li>
        <li>
          The resulting text transcript is stored temporarily in the browser's local extension
          storage (chrome.storage.local) on the user's device during session processing, and is
          transmitted through our infrastructure to generate structured documentation. Transcript
          content is never transmitted to or stored in NarrateEMS servers or databases, and is not
          recoverable by NarrateEMS.
        </li>
        <li>
          Patient data entered through the Service is not persisted in NarrateEMS databases. Only
          account, subscription, and squad membership data is stored server-side.
        </li>
      </ul>
      <p>
        You remain fully responsible for reviewing, verifying, and approving all generated content
        before it is used in any official record.
      </p>

      <hr />

      <h2>3. Eligibility and account registration</h2>
      <ul>
        <li>
          You have the authority to accept these Terms on behalf of your agency or organization, if
          applicable.
        </li>
        <li>The information you provide during registration is accurate and current.</li>
        <li>
          You will keep your credentials secure and notify us at{" "}
          <a href="mailto:narrateems@gmail.com">narrateems@gmail.com</a> if you suspect
          unauthorized access.
        </li>
      </ul>

      <hr />

      <h2>4. Acceptable use</h2>
      <p>You agree to use the Service only for lawful EMS documentation purposes. You agree not to:</p>
      <ul>
        <li>Use the Service to create fraudulent, falsified, or misleading medical records.</li>
        <li>Submit content that violates applicable law or third-party rights.</li>
        <li>Attempt to reverse-engineer, decompile, or extract source code from the Service.</li>
        <li>Share account credentials with individuals outside your authorized agency or squad.</li>
        <li>
          Use the Service in any manner that could damage, overload, or impair our infrastructure.
        </li>
      </ul>

      <hr />

      <h2>5. AI-generated content — no accuracy guarantee</h2>
      <ul>
        <li>AI outputs may be incomplete, incorrect, or contextually inappropriate.</li>
        <li>
          NarrateEMS makes no warranty — express or implied — regarding the accuracy or
          completeness of any AI-generated content.
        </li>
        <li>
          It is your professional and legal responsibility to review all outputs before submission
          or use in any official patient care record.
        </li>
        <li>
          NarrateEMS is not liable for any harm resulting from reliance on unreviewed AI-generated
          content.
        </li>
      </ul>

      <hr />

      <h2>6. Privacy and Protected Health Information</h2>
      <p>
        The Service is designed to handle PHI with minimal server-side exposure. Raw audio is never
        transmitted. Text transcripts and extracted clinical data are stored temporarily in the
        browser's local extension storage on the user's device during session processing, and are
        never transmitted to or stored in NarrateEMS servers or databases. Patient record data is
        not retained by NarrateEMS.
      </p>
      <p>
        Covered Entities must execute a Business Associate Agreement (BAA) before processing any
        patient information through the Service.
      </p>

      <hr />

      <h2>7. Subscriptions, billing, and failed payments</h2>
      <ul>
        <li>Subscriptions are billed per the terms of the applicable service agreement.</li>
        <li>
          If a payment fails, we will notify you by email and allow a 7-day grace period to update
          your payment method. If payment is not received within 7 days, access will be suspended
          until resolved. Data is retained during suspension and for 30 days thereafter.
        </li>
      </ul>

      <hr />

      <h2>8. Account deletion and data requests</h2>
      <p>
        To request deletion of your account or associated data, contact us at{" "}
        <a href="mailto:narrateems@gmail.com">narrateems@gmail.com</a>. Requests are processed
        within thirty (30) days. Because patient data is not stored server-side, deletion affects
        only account and subscription records.
      </p>

      <hr />

      <h2>9. Intellectual property</h2>
      <p>
        The Service is the property of NarrateEMS Inc. We grant you a limited, non-exclusive,
        non-transferable license to use the Service for internal documentation purposes during your
        subscription term.
      </p>
      <p>
        You retain ownership of data you submit; you grant NarrateEMS a limited license to process
        that data solely to provide the Service.
      </p>

      <hr />

      <h2>10. Limitation of liability</h2>
      <p>
        To the fullest extent permitted by applicable law, NarrateEMS Inc. shall not be liable for
        any indirect, incidental, special, consequential, or punitive damages arising from your use
        of the Service, including clinical outcomes, documentation errors not caught during
        provider review, or data loss.
      </p>
      <p>
        NarrateEMS's total cumulative liability shall not exceed the total amount you paid in the
        twelve (12) months preceding the claim, or $250 if no payment has been made.
      </p>

      <hr />

      <h2>11. Disclaimer of warranties</h2>
      <p>
        The Service is provided "AS IS" and "AS AVAILABLE" without any warranty of any kind,
        including warranties of merchantability, fitness for a particular purpose, or
        non-infringement.
      </p>

      <hr />

      <h2>12. Indemnification</h2>
      <p>
        You agree to indemnify and hold harmless NarrateEMS Inc. and its officers, directors, and
        employees from and against any claims, liabilities, or expenses arising from: (a) your use
        or misuse of the Service; (b) your violation of these Terms; (c) your violation of
        applicable law; or (d) your submission of any content through the Service.
      </p>

      <hr />

      <h2>13. Termination</h2>
      <p>
        Either party may terminate these Terms at any time. NarrateEMS may suspend or terminate
        your access if you violate these Terms or applicable law.
      </p>
      <p>Sections 5, 9, 10, 11, 12, and 15 survive termination.</p>

      <hr />

      <h2>14. Changes to the Terms</h2>
      <p>
        Material changes will be communicated by email or a notice in the Service at least 14 days
        before taking effect. Continued use after notice constitutes acceptance.
      </p>

      <hr />

      <h2>15. Governing law</h2>
      <p>
        These Terms are governed by the laws of the State of New Jersey. Disputes shall be resolved
        in state or federal courts located in New Jersey.
      </p>

      <hr />

      <h2>16. General</h2>
      <ul>
        <li>
          These Terms constitute the entire agreement between you and NarrateEMS regarding the
          Service.
        </li>
        <li>If any provision is unenforceable, remaining provisions remain in effect.</li>
        <li>You may not assign your rights under these Terms without our prior written consent.</li>
      </ul>

      <hr />

      <h2>Questions</h2>
      <p>
        <strong>NarrateEMS</strong>
        <br />
        Email: <a href="mailto:narrateems@gmail.com">narrateems@gmail.com</a>
      </p>

      <p className="!mt-12 text-center !mb-0 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-soft">
        © 2026 NarrateEMS Inc. All rights reserved.
      </p>
    </LegalLayout>
  )
}
