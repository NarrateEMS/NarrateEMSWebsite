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
`app/invite/accept`, `app/checkout/success`, `app/api/create-checkout-session`, plus legal pages.
Supabase browser client in `lib/supabase.ts`; shadcn/ui in `components/ui`.

`supabase/functions/` in this repo holds **stale copies** of `accept-squad-invite` and
`stripe-webhook-prod`. Never deploy from here - the real ones live in the `NarrateEMS` repo, and a
deploy from this directory silently reverts the hardened versions.

## `POST /api/create-checkout-session`

Order matters: the Supabase user is created **before** Stripe, so the checkout can carry the
identity.

1. Requires `email`, `password`, `planType`; `planType` must be a key of `PRICE_CONFIG`
   (`individual_monthly`, `pilot_annual`, `small_squad_annual`, `large_squad_annual`,
   `high_volume_annual`) whose price ids come from `NEXT_PUBLIC_STRIPE_PRICE_*`.
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
| `squad_id` NULL, individual plan | "Solo medic." |

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

## Local dev, build and lint

- `npm install --legacy-peer-deps` (plain `npm install` fails; pnpm is not installed here).
- Env needed: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
  `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`, all `NEXT_PUBLIC_STRIPE_PRICE_*`. Modules
  construct Supabase/Stripe clients at import time, so `npm run build` fails outright without them -
  placeholders are fine for a type/build check.
- `NEXT_PUBLIC_*` is inlined at **build** time: export env before `npm run build`, not just before
  `npm run start`. Guard against testing a stale bundle by grepping the built chunk for a new
  string, e.g. `grep -rl "Setting up your squad" .next/static/chunks/app/account/`.
- `npx tsc --noEmit` reports one **pre-existing** error: the `apiVersion: '2025-01-27.acacia'`
  literal in the checkout route does not match the installed Stripe types. Do not "fix" it by
  changing the pinned API version as a side effect of unrelated work; the production build succeeds.
- `npm run lint` (`eslint .`) has no config committed and `npx next lint` drops into an interactive
  setup prompt - do not let it scaffold a config mid-task.
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
`user_subscriptions` rows, otherwise the admin delete returns an opaque 500.

`squads.squad_code` is UNIQUE and a live squad already owns the empty string. Use `NULL` for
synthetic unlinked-squad fixtures; both values follow the same falsey account-page branch, and the
live empty-string row must not be modified just to capture a screenshot.
