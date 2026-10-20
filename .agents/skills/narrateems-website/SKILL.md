---
name: narrateems-website
description: How narrateems.com (Next.js App Router on Vercel) implements signup, Stripe checkout, /account and squad-invite acceptance against the production Supabase project - plus the local build/test recipe, the push/PR workaround, and the traps that have caused real customer-visible bugs.
---

# narrateems.com (NarrateEMSWebsite)

Platform-wide context (Supabase tables, edge functions, Stripe webhooks, squad matching, invite
lifecycle, secret names, live-data hazards) lives in the **`narrateems-platform`** skill in the
`NarrateEMS/NarrateEMS` repo. Read that first; this file only covers the website.

**This site is the only supported way to create an account or pay.** The Chrome extension no longer
signs anyone up - it links to `narrateems.com/#pricing`.

## Layout

`app/page.tsx` (marketing + pricing modal), `app/login`, `app/reset-password`, `app/account`,
`app/onboarding` (signed-in feature guide linked from `/account`), `app/dictate` (phone dictation), `app/invite/accept`,
`app/checkout/success`, `app/agreement/sign` (agency rep signing page). API routes:
`app/api/create-checkout-session`, `app/api/finish-payment`, `app/api/agency-access`,
`app/api/agency-agreement`. Server libs: `lib/checkout.ts` (`PRICE_CONFIG`, `startCheckout`),
`lib/agency.ts` (agency onboarding), `lib/agreement.ts` (`AGREEMENT_VERSION`, document lists),
`lib/email.ts` (Resend), `lib/sign-pdf.ts` (PDF stamping), `lib/auth.ts` (`userFromRequest`, bearer
JWT). `components/agency-panel.tsx` is the `/account` agencies panel. Legal docs are PDFs in
`public/legal/`; `next.config.mjs` redirects (non-permanent) `/terms-of-service` ->
`/legal/terms-of-service.pdf`, `/privacy-policy` -> `/legal/privacy-policy.pdf`, `/sla` ->
`/legal/sla.pdf`.
Supabase browser client in `lib/supabase.ts`; shadcn/ui in `components/ui`.

## Design (A3)

- Homepage is one full-width scroll story: `app/page.tsx` composes the sections in `app/home/`.
  The 3D story runs on one requestAnimationFrame loop that writes CSS variables (no React state per
  frame) and only runs while the story is on screen.
- Font is Work Sans only (no serif, italics or mono labels). Colours are the tokens in `app/globals.css`:
  ink/navy, paper, hi-vis yellow, red, green.
- Corners by type: buttons, tags and statuses are pills (`rounded-full`); cards and panels
  `rounded-card` (16px); app windows and modals `rounded-ui` (10px); fields and list rows `rounded-field` (6px).
  Full-width sections, photos and the nav stay square. `--radius` is 0, so `rounded-sm/md/lg` are square.
- Hero and the auth pages use `.story-stage` + `.story-blobs` (3 drifting blobs); other navy
  sections use the static `.navy-tex` glow. Anything that moves must stop under
  `prefers-reduced-motion`.
- Signed-in pages reuse `components/app-ui.tsx` (`AppNav`, `AuthShell`, `AppFooter`, `btn`,
  `outlineBtn`, `dangerBtn`, `field`, `label`). Use these instead of new one-off button/input classes.
- Photos are generic only: no real squads, faces, agency patches or readable branding.

## `/dictate` (phone dictation)

Phone page for medics without a laptop. Signed-in users with an active/trialing plan record here, see
live Azure Speech words, edit, and Save. The extension's "From phone" list then pulls the text.
- `lib/dictate/live.ts` (lazy chunk, preloaded after sign-in): an AudioWorklet buffers the mic from the
  tap into a Speech push stream, so the opening words survive the connect delay. If capture started late,
  `stop()` returns null and the full recording goes to `/transcribe`.
- `lib/dictate/store.ts`: IndexedDB drafts plus audio chunks (ArrayBuffers, not Blobs, for Safari private
  tabs), deleted on save, after 24h, or on any sign-out (`clearDictateData`). Offline recordings
  are transcribed when the signal returns.
- `lib/dictate/api.ts`: the Azure inbox (`NEXT_PUBLIC_NARRATION_API_URL`, contract in the NarrateEMS repo's
  `azure/narration-inbox/README.md`) and `get-speech-token`. Saved text lives in Azure for 24h, never Supabase.
- `public/dictate.webmanifest` (linked in `app/dictate/layout.tsx`) + `public/dictate-sw.js`: Add to Home Screen opens `/dictate`.
- A new origin (e.g. a Vercel preview) must be in the inbox's exact CORS list before it can call it.

`supabase/` holds only a README: functions and migrations live in the `NarrateEMS` repo. Never
deploy functions from here.

## `POST /api/create-checkout-session`

Order matters: the Supabase user is created **before** Stripe, so the checkout can carry the
identity.

1. Requires `email`, `password`, `planType` and `legalAccepted: true` (every plan, squads too: the
   modal's single "I agree" checkbox over `LEGAL_DOCUMENTS`: individuals
   `public/legal/individual-subscription-agreement.pdf` + `terms-of-service.pdf`,
   `privacy-policy.pdf`, `sla.pdf`; squads only the last three).
   Stores `user_metadata.legal_accepted {version: AGREEMENT_VERSION, at}`. `planType` must be a key
   of `PRICE_CONFIG` (`individual_monthly`, `pilot_annual`, `small_squad_annual`,
   `large_squad_annual`, `high_volume_annual`) whose price ids come from `NEXT_PUBLIC_STRIPE_PRICE_*`.
   Individuals also send `agencyName`, `serviceCode`, optional `repEmail` (`validateAgencyInput`):
   revoked agency -> 400; not approved and no rep email -> `{status:'needs_rep'}` before any account
   is created. `individual_monthly`: 7-day trial, then $29.99/month (UI copy; the real price is
   `NEXT_PUBLIC_STRIPE_PRICE_INDIVIDUAL_MONTHLY`).
2. If no account exists: `admin.createUser` with `email_confirm: true` and
   `user_metadata.plan_type`.
3. If an account exists but is **unconfirmed and never signed in** (a shell), it is *adopted*: the
   submitted password is set and the account confirmed. A **confirmed** account must prove ownership
   with `signInWithPassword` via the **anon** client (never the admin client - service role would
   authenticate without checking the password); failure returns 401 `account_exists`.
4. Existing users get their `user_metadata.plan_type` re-stamped before checkout, because `/account`
   uses it to know a squad purchase is in flight.
5. Checkout session: `client_reference_id: userId`, subscription metadata
   `{supabase_user_id, plan_type, included_charts}`, `trial_period_days: 7`; squad plans add a
   metered overage line item alongside the flat annual price.
6. Individuals go through `requestAgencyAccess` first: only an already-approved agency reaches
   Checkout. Otherwise the route returns `{status:'pending'}`, the rep is emailed a signing link,
   and **no Checkout** is created until the agency signs; then the user pays via `/account` ->
   `POST /api/finish-payment`. Squad signup is otherwise unchanged.

`client_reference_id` is what stops the "paid but no account" failure mode - never add a purchase
path without it.

## `/account`

Reads `user_subscriptions` for the signed-in user and, when `squad_id` is set, reads the linked
`squads` row with the user's own JWT (RLS allows both admin and member reads). Squad panel states:

| DB state | Panel |
| --- | --- |
| `squad_id` NULL **and** `plan_type` is a squad plan | "Setting up your squad." - polls every 3s, 20 attempts |
| `squad_id` set, `squads.squad_code` NULL | "One step left." + link-your-EMS-Charts copy (admin) / waiting-on-admin (member) |
| `squad_id` set, `squad_code` set | "You ride with `<name>`" + admin or member copy |
| `squad_id` NULL, individual plan | "Solo medic." + agencies panel |

Agencies panel (`components/agency-panel.tsx`): "Your agencies" lists each authorization as
"Approved", "Waiting for agency to sign" or "Revoked"; "Finish payment and activate →" shows when
there is no live plan and an approval exists; "Work for another agency? Add it here." posts to
`/api/agency-access` (asks for a rep email when the agency isn't approved).

Two bugs have shipped here; both are regression tests worth keeping:

- Keying off `squad_names[0]`: the webhook sets `squad_id` but leaves `squad_names`/`allowed_squads`
  NULL for the **purchasing admin**, so the person who just bought a squad was told "Solo medic."
  while their invited members looked fine. Always verify **as the admin**, not just a member.
- The provisioning race: the squad row is written ~30s after the subscription row, so a buyer who
  lands on `/account` immediately sees `squad_id` NULL. Hence the `plan_type` metadata stamp, the
  fresh `supabase.auth.getUser()` read (the cached session metadata is stale), the admin-owned
  `squads` fallback query, and the poll.

If you ever see the `"Your squad"` fallback name, the `squads` read returned null - suspect RLS, and
check the console (the failure is logged, not swallowed).

Admin usage line ("Charts used X of Y this year (Z overage) · resets <date>") comes from
`get-squad-admin-data`'s `usage` field (server-computed; null for non-counted plans). Don't
recompute it from `squads.charts_used`: the year rolls lazily, so that column can be stale.

## `/invite/accept`

Branch selection is `?setup=1` on the URL **OR** `user_metadata.needs_password === true`:

- flag present -> `set-password` state (password + confirm, then
  `updateUser({ password, data: { needs_password: false } })`), success copy "log in with your new
  password";
- no flag -> `confirm-join` for an existing confirmed account, with an
  "I don't have a password yet -- set one" escape hatch.

It must **never** infer this from `identities[].identity_data.email_verified`: GoTrue flips that to
`true` the instant an invite link is opened, so every brand-new invitee was read as
"already has a password", skipped the form, and ended up in the squad with a credential nobody knew.
Website buyers, who *do* have a password, arrive with `false` - the check was exactly inverted.

Acceptance POSTs **`{ invite_id }`** only; the edge function derives the user from the JWT and the
squad from the invite row. Do not reintroduce body-supplied `user_id`/`squad_id`. The success card
auto-redirects to `/account` after ~2s.

## Agency signing and PDF stamping

`/agreement/sign?token=...` collects agency legal name, mailing address, rep name and title plus two
required checkboxes (authority + agree), then `POST /api/agency-agreement`. `lib/sign-pdf.ts`
stamps them onto `public/legal/agency-baa.pdf` and `agency-authorization.pdf` with the fixed
NarrateEMS countersignature, domain-based enrollment ticked and the rep's email domain. Text
shrinks, then wraps to 2 lines; still too long -> `FieldTooLongError` -> 400 "Please shorten it".
Coordinates are hand-measured: re-measure if the PDFs change, and bump `AGREEMENT_VERSION`
(stored in `user_metadata.legal_accepted.version` and `agency_agreements.agreement_version`;
agencies that already signed are not asked to re-sign). `outputFileTracingIncludes` in
`next.config.mjs` must keep `public/legal/agency-*.pdf` in the function bundle. Signed PDFs go to
the private bucket `agency-agreements` at `<service_code>/<signed individual_authorizations.id>/<file>` and are emailed (Resend) to the rep and
narrateems@gmail.com. Emails must stay PHI-free (Resend has no BAA).

Expired, used or superseded links get "This link is invalid, expired, or already used." (404). To
re-send, the medic re-adds the agency with a rep email on `/account` (new token, old link dies);
admin re-send and un-revoking an agency are not supported (manual DB; see `narrateems-platform`).

## Local dev, build and lint

- `npx -y pnpm@9 install --frozen-lockfile` (pnpm-lock.yaml is the only lockfile; `npm install`/`npm ci` fail on peer deps).
- Env needed: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_NARRATION_API_URL`,
  `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`, all `NEXT_PUBLIC_STRIPE_PRICE_*`,
  `RESEND_API_KEY` (optional `EMAIL_FROM`, default `no-reply@narrateems.com`). Modules
  construct Supabase/Stripe clients at import time, so `npm run build` fails outright without them -
  placeholders are fine for a type/build check.
- `NEXT_PUBLIC_*` is inlined at **build** time: export env before `npm run build`, not just before
  `npm run start`. Guard against testing a stale bundle by grepping the built chunk for a new
  string, e.g. `grep -rl "Setting up your squad" .next/static/chunks/app/account/`.
- `npx tsc --noEmit` is clean: the checkout route pins `apiVersion: '2025-12-15.clover'` with `subscription_data.billing_mode: { type: 'flexible' }`.
- There is no lint script; the checks are `npx tsc --noEmit -p .` and `npx next build`. `npx next lint`
  drops into an interactive setup prompt - do not let it scaffold a config mid-task.
- A dev server launched from a one-shot shell must use `setsid npm run dev`; plain `nohup ... &`
  is terminated when the shell call returns.
- Use the **sandbox** Stripe key for any checkout test and inline-assign it on the command that
  starts the server (`STRIPE_SECRET_KEY="$SBX" npm run dev`), because the login shell may export a
  live key that wins otherwise. Verify `cs_test_` / `livemode: false` before trusting a result.
  Probing the route with curl requires an `Origin: http://localhost:3000` header, or it 500s.
- `ACCEPT_URL` in the edge function is hardcoded to the production site and Supabase's
  `uri_allow_list` has no localhost entry, so an emailed invite link cannot be followed into a local
  build. Exchange the token yourself (`GET /auth/v1/verify?token=<hashed>&type=invite`), take the
  `#access_token=...` fragment from the `Location` header, and open
  `http://localhost:3000/invite/accept?invite=<id>#<fragment>`.

## Deploy, push, PRs

Vercel deploys `main` automatically; verify by grepping the live bundle for a string the change
introduced rather than trusting the dashboard.

Devin's GitHub integration and git proxy cannot reach this repo (proxy push returns **403**). Push
with the PAT and open PRs through the REST API:

```
git push https://$NARRATEEMS_GITHUB_PAT@github.com/NarrateEMS/NarrateEMSWebsite.git HEAD:<branch>
curl -X POST -H "Authorization: token $NARRATEEMS_GITHUB_PAT" \
  https://api.github.com/repos/NarrateEMS/NarrateEMSWebsite/pulls -d @body.json
```

## Testing against production data

There is only one Supabase project and it is production. Pin the live squads/admins with a `select`
before writing anything, never run a checkout as a live squad's admin, and re-read those rows
afterwards to prove they are unchanged. Delete throwaway users **after** their `squad_invites` and
`user_subscriptions` rows, otherwise the admin delete returns an opaque 500. Agency fixtures: delete
Storage objects in `agency-agreements`, then `agency_agreements`/`individual_authorizations`, then
`agencies`, then auth users. Delete test agencies directly; setting `revoked` fires the revoke hook,
which cancels Stripe subs.

`squads.squad_code` is UNIQUE and a live squad already owns the empty string. Use `NULL` for
synthetic unlinked-squad fixtures; both values follow the same falsey account-page branch, and the
live empty-string row must not be modified just to capture a screenshot.
