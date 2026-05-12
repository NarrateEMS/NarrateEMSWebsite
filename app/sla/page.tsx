"use client"

import { LegalLayout } from "@/components/legal-layout"

export default function SLAPage() {
  return (
    <LegalLayout
      title="Service Level Agreement."
      meta="Version 1.0 · Effective March 2026"
    >
      <p>
        This Service Level Agreement ("SLA") describes what subscribers can expect from NarrateEMS
        with respect to service availability, support, and incident communication. It applies to
        all active subscriptions and is incorporated by reference into the applicable service
        agreement.
      </p>

      <blockquote>
        We've written this to be honest about where we are as an early-stage product. We'll update
        it as we grow.
      </blockquote>

      <hr />

      <h2>1. Service availability</h2>
      <p>NarrateEMS is a Chrome extension that relies on the following underlying infrastructure:</p>
      <ul>
        <li>Supabase (PostgreSQL + Edge Functions)</li>
        <li>Microsoft Azure OpenAI</li>
        <li>Groq API</li>
      </ul>

      <p>
        NarrateEMS does not independently guarantee a specific uptime percentage. Service
        availability is dependent on the uptime of these underlying providers, each of which
        publishes their own SLAs:
      </p>

      <div className="my-6 overflow-x-auto rounded-md border border-rule-strong">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-paper-tint text-ink">
            <tr>
              <th className="text-left px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] border-b border-rule">
                Provider
              </th>
              <th className="text-left px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] border-b border-rule">
                Published uptime SLA
              </th>
              <th className="text-left px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] border-b border-rule">
                Status page
              </th>
            </tr>
          </thead>
          <tbody className="text-ink-muted">
            <tr className="border-b border-rule">
              <td className="px-4 py-3 align-top">Supabase</td>
              <td className="px-4 py-3 align-top">99.9% for Pro plan and above</td>
              <td className="px-4 py-3 align-top">
                <a href="https://status.supabase.com">status.supabase.com</a>
              </td>
            </tr>
            <tr className="border-b border-rule bg-paper-tint/40">
              <td className="px-4 py-3 align-top">Microsoft Azure OpenAI</td>
              <td className="px-4 py-3 align-top">99.9% per Azure SLA</td>
              <td className="px-4 py-3 align-top">
                <a href="https://status.azure.com">status.azure.com</a>
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 align-top">Groq</td>
              <td className="px-4 py-3 align-top">See Groq status page</td>
              <td className="px-4 py-3 align-top">
                <a href="https://status.groq.com">status.groq.com</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>
        NarrateEMS will make commercially reasonable efforts to ensure the extension and backend
        infrastructure remain operational. In practice, the vast majority of outages will originate
        from one of the above providers, not from NarrateEMS-specific code or infrastructure.
      </p>

      <blockquote>
        <strong>What this means in plain terms:</strong> if Supabase or Azure goes down, NarrateEMS
        goes down with it. We don't have redundant fallback infrastructure at this stage. We'll be
        transparent about incidents as they happen.
      </blockquote>

      <hr />

      <h2>2. Planned maintenance</h2>
      <p>
        NarrateEMS may perform planned maintenance on backend infrastructure from time to time. We
        will provide at least 48 hours advance notice by email to the subscriber point of contact
        before any maintenance that is expected to cause a service interruption.
      </p>
      <p>
        Where possible, maintenance will be scheduled during overnight hours (11pm–5am ET) to
        minimize impact on active shifts.
      </p>

      <hr />

      <h2>3. Incident communication</h2>
      <p>
        In the event of an unplanned service outage or degradation that affects the ability to
        generate documentation:
      </p>
      <ul>
        <li>
          NarrateEMS will post a status update to listed contacts within 2 hours of confirming the
          incident.
        </li>
        <li>We will provide updates at regular intervals until the issue is resolved.</li>
        <li>
          A brief post-incident summary will be sent within 3 business days of resolution,
          describing the cause and steps taken to prevent recurrence.
        </li>
      </ul>
      <p>
        For real-time status, subscribers can check the status pages of our infrastructure
        providers listed in Section 1.
      </p>

      <hr />

      <h2>4. Support</h2>

      <h3>How to reach us</h3>
      <p>
        Email: <a href="mailto:narrateems@gmail.com">narrateems@gmail.com</a>
      </p>
      <p>
        All support requests should include: your account email, a description of the issue, and
        the device and browser version you're using.
      </p>

      <h3>Response times</h3>
      <p>
        NarrateEMS is an early-stage company operated by a small founding team. We commit to the
        following on a best-effort basis:
      </p>

      <div className="my-6 overflow-x-auto rounded-md border border-rule-strong">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-paper-tint text-ink">
            <tr>
              <th className="text-left px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] border-b border-rule">
                Issue type
              </th>
              <th className="text-left px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] border-b border-rule">
                Target first response
              </th>
              <th className="text-left px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] border-b border-rule">
                Notes
              </th>
            </tr>
          </thead>
          <tbody className="text-ink-muted">
            <tr className="border-b border-rule">
              <td className="px-4 py-3 align-top">
                Complete service outage — unable to generate any documentation
              </td>
              <td className="px-4 py-3 align-top">Same business day</td>
              <td className="px-4 py-3 align-top">
                Priority issue. We'll acknowledge and begin investigating immediately.
              </td>
            </tr>
            <tr className="border-b border-rule bg-paper-tint/40">
              <td className="px-4 py-3 align-top">
                Partial degradation — some features not working
              </td>
              <td className="px-4 py-3 align-top">Within 2 business days</td>
              <td className="px-4 py-3 align-top">
                We'll acknowledge and provide an estimated resolution timeline.
              </td>
            </tr>
            <tr className="border-b border-rule">
              <td className="px-4 py-3 align-top">
                General questions, billing, account changes
              </td>
              <td className="px-4 py-3 align-top">Within 3 business days</td>
              <td className="px-4 py-3 align-top">Standard support queue.</td>
            </tr>
            <tr className="bg-paper-tint/40">
              <td className="px-4 py-3 align-top">Feature requests or feedback</td>
              <td className="px-4 py-3 align-top">We read everything</td>
              <td className="px-4 py-3 align-top">
                No guaranteed response time, but we genuinely use this input.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <blockquote>
        <strong>"Best effort"</strong> means we have no contractual penalty for missing these
        targets at this stage. We include them because we want to be transparent about our
        intentions, not because we're making a legally enforceable promise. As we grow, this SLA
        will be updated with binding commitments.
      </blockquote>

      <h3>Support hours</h3>
      <p>
        We don't currently offer 24/7 support. Support is monitored during standard business hours,
        Monday through Friday, 9am–6pm ET. We'll do our best to respond to urgent outage reports
        outside those hours when we see them, but cannot guarantee it.
      </p>

      <hr />

      <h2>5. Remedies</h2>
      <p>
        NarrateEMS does not currently offer service credits or refunds for downtime. If you
        experience a significant and prolonged outage that materially impacts your operations,
        contact us at <a href="mailto:narrateems@gmail.com">narrateems@gmail.com</a> and we'll work
        something out on a case-by-case basis. We'd rather make it right than lose a customer over
        something outside our control.
      </p>
      <p>This will be replaced with a formal credit schedule in a future version of this SLA.</p>

      <hr />

      <h2>6. Session failure and connectivity — expected behavior</h2>
      <p>
        The following behaviors are by design and do not constitute service failures under this
        SLA:
      </p>
      <ul>
        <li>
          <strong>Connectivity loss mid-session:</strong> If a device loses internet connectivity
          after a narrative has been transcribed but before the documentation generation request
          completes, the transcript is held in memory and retried up to 3 times with a 2-second
          delay. If all retries fail, the session fails and the transcript is not recoverable. The
          user must re-dictate. There is no persistent retry queue that survives a browser restart
          or extension close.
        </li>
        <li>
          <strong>Groq unavailability:</strong> If the Groq page relevance service is unreachable,
          the extension degrades gracefully and processes the current EMS Charts page only.
          Documentation generation via Azure OpenAI continues.
        </li>
        <li>
          <strong>Azure OpenAI unavailability:</strong> If the field extraction service is
          unreachable, the extension retries 3 times. If all retries fail, the session fails. No
          cross-provider fallback exists.
        </li>
        <li>
          <strong>Shared device session state:</strong> Session data in chrome.storage.local is
          cleared only on manual reset. On shared devices, users should reset their session after
          each use. Residual session state from a prior user is not a service failure.
        </li>
      </ul>

      <blockquote>
        In all session failure scenarios, the user's underlying EMS Charts data is unaffected —
        NarrateEMS only writes to form fields that the user explicitly approves. A failed
        NarrateEMS session never corrupts or alters existing patient records.
      </blockquote>

      <hr />

      <h2>7. Exclusions</h2>
      <p>This SLA does not apply to service unavailability caused by:</p>
      <ul>
        <li>
          Factors outside NarrateEMS's reasonable control, including upstream provider outages
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

      <hr />

      <h2>8. Updates to this SLA</h2>
      <p>
        NarrateEMS will update this SLA as the product matures, infrastructure improves, and the
        team grows. Material changes will be communicated by email at least 14 days before taking
        effect.
      </p>
      <p>
        The most current version will always be available at <a href="/sla">narrateems.com/sla</a>.
      </p>

      <hr />

      <h2>Contact</h2>
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
