// Supabase Edge Function: accept-squad-invite
// Handles the backend work when a user accepts a squad invitation:
// - Updates the squad_invites record to mark as accepted
// - Creates a user_subscriptions record linking user to squad

import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0"

// Supabase configuration
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!

console.log("Accept squad invite function loaded")

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    })
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 })
  }

  try {
    const { user_id, squad_id, invite_id } = await req.json()

    if (!user_id || !squad_id) {
      return new Response(JSON.stringify({ 
        error: "user_id and squad_id are required" 
      }), {
        status: 400,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      })
    }

    console.log("Accepting invite - user:", user_id, "squad:", squad_id, "invite:", invite_id)

    // Initialize Supabase admin client
    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    // 1. Verify the squad exists and is active
    const { data: squad, error: squadError } = await supabase
      .from("squads")
      .select("id, name, subscription_status, current_period_end")
      .eq("id", squad_id)
      .single()

    if (squadError || !squad) {
      console.error("Squad not found:", squadError)
      return new Response(JSON.stringify({ error: "Squad not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      })
    }

    if (squad.subscription_status !== "active") {
      return new Response(JSON.stringify({ 
        error: "Squad subscription is not active" 
      }), {
        status: 403,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      })
    }

    // 2. Check if user already has a subscription record for this squad
    const { data: existingSub } = await supabase
      .from("user_subscriptions")
      .select("user_id")
      .eq("user_id", user_id)
      .eq("squad_id", squad_id)
      .single()

    if (existingSub) {
      console.log("User already has subscription for this squad")
      return new Response(JSON.stringify({
        success: true,
        message: "User is already a member of this squad",
      }), {
        status: 200,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      })
    }

    // 3. Create user_subscriptions record
    const { error: subError } = await supabase
      .from("user_subscriptions")
      .upsert({
        user_id: user_id,
        squad_id: squad_id,
        subscription_status: "active",
        current_period_end: squad.current_period_end,
        squad_names: [squad.name],
        allowed_squads: [squad_id],
      }, {
        onConflict: "user_id",
      })

    if (subError) {
      console.error("Error creating user subscription:", subError)
      return new Response(JSON.stringify({ 
        error: "Failed to create subscription: " + subError.message 
      }), {
        status: 500,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      })
    }

    console.log("User subscription created successfully")

    // 4. Update the invite record if we have an invite_id
    if (invite_id) {
      const { error: inviteError } = await supabase
        .from("squad_invites")
        .update({
          status: "accepted",
          accepted_at: new Date().toISOString(),
          accepted_by_user_id: user_id,
        })
        .eq("id", invite_id)

      if (inviteError) {
        // Log but don't fail - the important part (subscription) is done
        console.error("Error updating invite record:", inviteError)
      } else {
        console.log("Invite record updated to accepted")
      }
    }

    return new Response(JSON.stringify({
      success: true,
      message: "Successfully joined squad",
      squad_name: squad.name,
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    })

  } catch (err) {
    console.error("Error in accept-squad-invite:", err)
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    })
  }
})

