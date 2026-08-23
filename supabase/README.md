# Supabase

The Edge Functions and database migrations for NarrateEMS live in the
NarrateEMS/NarrateEMS repository, which is the only place they are deployed
from.

Copies used to be vendored here as well. They drifted: this directory still
held the pre-hardening `accept-squad-invite` (which trusted a body-supplied
user_id and never checked an invite's status, expiry or email) and a
`stripe-webhook-prod` from before status normalization. Running
`supabase functions deploy` from this repo silently reverted production to
those versions. Deploy from NarrateEMS/NarrateEMS instead.
