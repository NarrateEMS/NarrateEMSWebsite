/**
 * Server-side logging to Azure Monitor.
 *
 * Vercel's own function logs are the only record of a failed signup today, and
 * they cannot be alerted on or correlated with the extension's events. This
 * posts to the same authenticated ingress the extension uses
 * (`azure/log-ingest` in the NarrateEMS repo), so a purchase can be followed
 * from the pricing modal through the Stripe webhook into the medic's first
 * chart with one KQL query over the `narrateems-logs` workspace.
 *
 * Website events land in `NarrateOps_CL` with `Source = "website"`. Never send
 * patient data or a password from here; emails are PII and are deliberately not
 * logged - a user id is enough to reconcile an account by hand.
 */

const INGEST_URL = process.env.AZURE_LOG_INGEST_URL
const SERVICE_KEY = process.env.AZURE_LOG_SERVICE_KEY

export interface WebEvent {
  /** Snake-case event name, e.g. "checkout_session_created". */
  event: string
  level?: 'debug' | 'info' | 'warn' | 'error'
  message?: string
  userId?: string | null
  statusCode?: number
  properties?: Record<string, unknown>
}

/**
 * Fire-and-forget. A logging outage must never fail a checkout, so this never
 * throws and is never awaited on the request path; with no URL or key
 * configured it is a no-op, which keeps local builds and previews quiet.
 */
export function logEvent(entry: WebEvent): void {
  if (!INGEST_URL || !SERVICE_KEY) return

  void fetch(INGEST_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-narrate-service-key': SERVICE_KEY,
    },
    body: JSON.stringify({
      logs: [
        {
          timestamp: new Date().toISOString(),
          level: entry.level ?? 'info',
          message: entry.message ?? entry.event,
          event: entry.event,
          source: 'website',
          component: 'next-api',
          userId: entry.userId ?? undefined,
          statusCode: entry.statusCode,
          properties: entry.properties,
        },
      ],
    }),
    // Vercel keeps the invocation alive for a pending fetch, but a hung ingress
    // must not hold the response open.
    signal: AbortSignal.timeout(3_000),
  }).catch(() => undefined)
}

/** Error shapes vary by SDK; keep the message, drop anything unrecognised. */
export function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  if (typeof error === 'string') return error
  return 'unknown_error'
}
