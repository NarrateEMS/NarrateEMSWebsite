export const AGREEMENT_VERSION = '2026-10'

// Agency-signed PDFs, stamped and stored in Google Drive on signing.
export const AGENCY_DOCUMENTS = [
  { file: 'agency-baa.pdf', title: 'Business Associate Agreement' },
  { file: 'agency-authorization.pdf', title: 'Agency Authorization & Security Acknowledgment' },
] as const

// Click-to-accept at signup.
export const LEGAL_DOCUMENTS = [
  { href: '/legal/individual-subscription-agreement.pdf', title: 'Individual Subscription Agreement', individualOnly: true },
  { href: '/legal/terms-of-service.pdf', title: 'Terms of Service', individualOnly: false },
  { href: '/legal/privacy-policy.pdf', title: 'Privacy Policy', individualOnly: false },
  { href: '/legal/sla.pdf', title: 'Service Level Agreement', individualOnly: false },
] as const
