// Stripe Webhook Handler for NarrateEMS - PRODUCTION
// Handles Stripe events to update user subscription status
// Uses LIVE Stripe keys

import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0"

// Squad flat price IDs - PRODUCTION (new tiered chart-based pricing)
// These are the flat annual prices, not the overage prices
const SQUAD_FLAT_PRICE_IDS = [
  'price_1SsbjtDGtsD3DA0qlyXqkNZa', // Pilot - $1,000/year, 500 charts
  'price_1SsborDGtsD3DA0qHJ026v2h', // Small Squad - $3,000/year, 2,000 charts
  'price_1SsbpWDGtsD3DA0qp0J1QvEx', // Large Squad - $6,000/year, 5,000 charts
  'price_1SsbpuDGtsD3DA0qDRTvC80j', // High Volume - $10,000/year, 10,000 charts
]

// Map flat price IDs to plan types and included charts
const SQUAD_PLAN_CONFIG: Record<string, { planType: string; includedCharts: number }> = {
  'price_1SsbjtDGtsD3DA0qlyXqkNZa': { planType: 'pilot_annual', includedCharts: 500 },
  'price_1SsborDGtsD3DA0qHJ026v2h': { planType: 'small_squad_annual', includedCharts: 2000 },
  'price_1SsbpWDGtsD3DA0qp0J1QvEx': { planType: 'large_squad_annual', includedCharts: 5000 },
  'price_1SsbpuDGtsD3DA0qDRTvC80j': { planType: 'high_volume_annual', includedCharts: 10000 },
}

// Helper to determine plan type from price ID
function getPlanType(priceId: string): string {
  if (SQUAD_PLAN_CONFIG[priceId]) {
    return SQUAD_PLAN_CONFIG[priceId].planType
  }
  return 'individual_monthly'
}

// Helper to get included charts from price ID
function getIncludedCharts(priceId: string): number {
  if (SQUAD_PLAN_CONFIG[priceId]) {
    return SQUAD_PLAN_CONFIG[priceId].includedCharts
  }
  return 0
}

// Helper to generate random squad code
function generateSquadCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = 'SQ-'
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

// Stripe configuration - PRODUCTION (Live keys from Supabase secrets)
const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY_PROD")!
if (!STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY_PROD is not set. Run: supabase secrets set STRIPE_SECRET_KEY_PROD=sk_live_...")
}
const STRIPE_WEBHOOK_SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET_PROD") || ""

// Supabase configuration - use built-in env vars provided by Supabase Edge Functions
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
})

console.log("Stripe webhook PRODUCTION function loaded")

Deno.serve(async (req) => {
  // Only accept POST requests
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 })
  }

  try {
    const body = await req.text()
    const signature = req.headers.get("stripe-signature")

    let event: Stripe.Event

    // Verify webhook signature if secret is configured
    if (STRIPE_WEBHOOK_SECRET && signature) {
      try {
        event = await stripe.webhooks.constructEventAsync(body, signature, STRIPE_WEBHOOK_SECRET)
      } catch (err) {
        console.error("Webhook signature verification failed:", err.message)
        return new Response(`Webhook signature verification failed: ${err.message}`, { status: 400 })
      }
    } else {
      console.log("WARNING: No webhook secret configured, skipping signature verification")
      event = JSON.parse(body)
    }

    console.log("Received Stripe event:", event.type)

    // Handle checkout.session.completed event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session

      // Get the user_id from client_reference_id
      const userId = session.client_reference_id
      const customerEmail = session.customer_email || session.customer_details?.email

      console.log("Checkout completed - user_id:", userId, "email:", customerEmail)

      if (!userId) {
        console.error("No client_reference_id (user_id) found in session")
        return new Response("Missing client_reference_id", { status: 400 })
      }

      // Initialize Supabase client with service role key (bypasses RLS)
      const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      })

      // Retrieve subscription details from Stripe to get period dates and line items
      let currentPeriodStart: string | null = null
      let currentPeriodEnd: string | null = null
      let flatPriceId: string | null = null
      let meteredSubscriptionItemId: string | null = null

      if (session.subscription) {
        try {
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string, {
            expand: ['items.data.price']
          })
          console.log("Retrieved subscription:", subscription.id)

          // Convert Unix timestamps to ISO strings
          currentPeriodStart = new Date(subscription.current_period_start * 1000).toISOString()
          currentPeriodEnd = new Date(subscription.current_period_end * 1000).toISOString()

          // Find the flat price (first item) and metered overage price item (second item)
          // Squad subscriptions have 2 items: flat annual fee + metered overage
          for (const item of subscription.items.data) {
            const price = item.price as Stripe.Price
            if (SQUAD_FLAT_PRICE_IDS.includes(price.id)) {
              flatPriceId = price.id
              console.log("Found flat price ID:", flatPriceId)
            } else if (price.recurring?.usage_type === 'metered') {
              meteredSubscriptionItemId = item.id
              console.log("Found metered subscription item ID:", meteredSubscriptionItemId)
            } else if (!flatPriceId) {
              // Individual subscription (single item)
              flatPriceId = price.id
              console.log("Found individual price ID:", flatPriceId)
            }
          }

          console.log("Period start:", currentPeriodStart, "Period end:", currentPeriodEnd)
        } catch (subError) {
          console.error("Error retrieving subscription:", subError)
          // Fall back to current time for start, no end date
          currentPeriodStart = new Date().toISOString()
        }
      } else {
        // One-time payment, no subscription period
        currentPeriodStart = new Date().toISOString()
      }

      // Check if this is a squad subscription (using the flat price IDs)
      const isSquadSubscription = flatPriceId && SQUAD_FLAT_PRICE_IDS.includes(flatPriceId)
      console.log("Is squad subscription:", isSquadSubscription)

      if (isSquadSubscription) {
        // === SQUAD SUBSCRIPTION FLOW (Chart-based tiered pricing) ===
        const planType = getPlanType(flatPriceId!)
        const includedCharts = getIncludedCharts(flatPriceId!)
        const squadCode = generateSquadCode()
        const squadName = "My Squad" // Placeholder name, admin can change later

        console.log("Creating squad - code:", squadCode, "plan:", planType, "includedCharts:", includedCharts)

        // 1. Create the squad with usage tracking fields
        const { data: squad, error: squadError } = await supabase
          .from("squads")
          .insert({
            squad_code: squadCode,
            name: squadName,
            admin_user_id: userId,
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: session.subscription as string,
            stripe_customer_email: customerEmail,
            subscription_status: "active",
            plan_type: planType,
            current_period_start: currentPeriodStart,
            current_period_end: currentPeriodEnd,
            included_charts: includedCharts,
            charts_used: 0,
            stripe_metered_subscription_item_id: meteredSubscriptionItemId,
          })
          .select()
          .single()

        if (squadError) {
          console.error("Error creating squad:", squadError)
          return new Response(`Database error creating squad: ${squadError.message}`, { status: 500 })
        }

        console.log("Created squad:", squad.id, "code:", squadCode, "plan:", planType, "charts:", includedCharts)

        // 2. Update admin's user_subscriptions with squad_id and active status
        const { error: userError } = await supabase
          .from("user_subscriptions")
          .update({
            subscription_status: "active",
            squad_id: squad.id,
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: session.subscription as string,
            stripe_customer_email: customerEmail,
            current_period_start: currentPeriodStart,
            current_period_end: currentPeriodEnd,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", userId)

        if (userError) {
          console.error("Error updating admin user_subscriptions:", userError)
          return new Response(`Database error updating admin: ${userError.message}`, { status: 500 })
        }

        console.log("Successfully created squad and linked admin:", userId)
      } else {
        // === INDIVIDUAL SUBSCRIPTION FLOW ===
        // Set allowed_squads to ['ALL'] for unlimited squad access
        const { error } = await supabase
          .from("user_subscriptions")
          .update({
            subscription_status: "active",
            stripe_customer_email: customerEmail,
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: session.subscription as string,
            current_period_start: currentPeriodStart,
            current_period_end: currentPeriodEnd,
            allowed_squads: ["ALL"],
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", userId)

        if (error) {
          console.error("Error updating user_subscriptions:", error)
          return new Response(`Database error: ${error.message}`, { status: 500 })
        }

        console.log("Successfully updated individual subscription for user:", userId, "with allowed_squads=['ALL']")
      }
    }

    // Handle subscription updated (user initiates cancellation or status changes)
    if (event.type === "customer.subscription.updated") {
      const subscription = event.data.object as Stripe.Subscription
      // Access cancel_at which may not be in type definition
      const cancelAt = (subscription as any).cancel_at as number | null

      console.log("Subscription updated:", subscription.id)
      console.log("  status:", subscription.status)
      console.log("  cancel_at_period_end:", subscription.cancel_at_period_end)
      console.log("  cancel_at:", cancelAt)
      console.log("  canceled_at:", subscription.canceled_at)

      // Initialize Supabase client
      const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      })

      // Check if this is a squad subscription
      const { data: squad } = await supabase
        .from("squads")
        .select("id")
        .eq("stripe_subscription_id", subscription.id)
        .single()

      const isSquadSubscription = !!squad
      console.log("Is squad subscription:", isSquadSubscription)

      // Check if subscription is canceled (either immediately or at period end)
      if (subscription.status === "canceled") {
        // Subscription was canceled immediately
        const canceledAt = subscription.canceled_at
          ? new Date(subscription.canceled_at * 1000).toISOString()
          : new Date().toISOString()

        console.log("Subscription immediately canceled at:", canceledAt)

        if (isSquadSubscription) {
          // Update squad status
          const { error: squadError } = await supabase
            .from("squads")
            .update({
              subscription_status: "canceled",
              canceled_at: canceledAt,
              updated_at: new Date().toISOString(),
            })
            .eq("stripe_subscription_id", subscription.id)

          if (squadError) {
            console.error("Error updating squad to canceled:", squadError)
            return new Response(`Database error: ${squadError.message}`, { status: 500 })
          }

          // Cancel all squad members
          const { error: membersError } = await supabase
            .from("user_subscriptions")
            .update({
              subscription_status: "canceled",
              updated_at: new Date().toISOString(),
            })
            .eq("squad_id", squad.id)

          if (membersError) {
            console.error("Error canceling squad members:", membersError)
          }

          console.log("Marked squad and all members as canceled:", subscription.id)
        } else {
          // Individual subscription
          const { error } = await supabase
            .from("user_subscriptions")
            .update({
              subscription_status: "canceled",
              canceled_at: canceledAt,
              updated_at: new Date().toISOString(),
            })
            .eq("stripe_subscription_id", subscription.id)

          if (error) {
            console.error("Error updating subscription to canceled:", error)
            return new Response(`Database error: ${error.message}`, { status: 500 })
          }

          console.log("Marked individual subscription as canceled:", subscription.id)
        }
      } else if (subscription.cancel_at_period_end || cancelAt) {
        // User initiated cancellation (either cancel_at_period_end or scheduled cancel_at)
        const canceledAt = subscription.canceled_at
          ? new Date(subscription.canceled_at * 1000).toISOString()
          : new Date().toISOString()

        const periodEnd = cancelAt
          ? new Date(cancelAt * 1000).toISOString()
          : null

        console.log("User initiated cancellation, will end at:", periodEnd || "period end")

        if (isSquadSubscription) {
          const updateData: any = {
            canceled_at: canceledAt,
            updated_at: new Date().toISOString(),
          }
          if (periodEnd) {
            updateData.current_period_end = periodEnd
          }

          const { error } = await supabase
            .from("squads")
            .update(updateData)
            .eq("stripe_subscription_id", subscription.id)

          if (error) {
            console.error("Error updating squad canceled_at:", error)
            return new Response(`Database error: ${error.message}`, { status: 500 })
          }

          console.log("Recorded pending cancellation for squad:", subscription.id)
        } else {
          const updateData: any = {
            canceled_at: canceledAt,
            updated_at: new Date().toISOString(),
          }
          if (periodEnd) {
            updateData.current_period_end = periodEnd
          }

          const { error } = await supabase
            .from("user_subscriptions")
            .update(updateData)
            .eq("stripe_subscription_id", subscription.id)

          if (error) {
            console.error("Error updating canceled_at:", error)
            return new Response(`Database error: ${error.message}`, { status: 500 })
          }

          console.log("Recorded pending cancellation for subscription:", subscription.id)
        }
      } else if (!subscription.cancel_at_period_end && !cancelAt && subscription.status === "active") {
        // User may have reactivated their subscription (uncanceled)
        console.log("Subscription is active and not pending cancellation - clearing canceled_at")

        if (isSquadSubscription) {
          // Reactivate squad
          const { error: squadError } = await supabase
            .from("squads")
            .update({
              subscription_status: "active",
              canceled_at: null,
              updated_at: new Date().toISOString(),
            })
            .eq("stripe_subscription_id", subscription.id)

          if (squadError) {
            console.error("Error reactivating squad:", squadError)
          }

          // Reactivate all squad members
          const { error: membersError } = await supabase
            .from("user_subscriptions")
            .update({
              subscription_status: "active",
              updated_at: new Date().toISOString(),
            })
            .eq("squad_id", squad.id)

          if (membersError) {
            console.error("Error reactivating squad members:", membersError)
          }

          console.log("Reactivated squad and all members:", subscription.id)
        } else {
          const { error } = await supabase
            .from("user_subscriptions")
            .update({
              canceled_at: null,
              updated_at: new Date().toISOString(),
            })
            .eq("stripe_subscription_id", subscription.id)

          if (error) {
            console.error("Error clearing canceled_at:", error)
          }
        }
      }
    }

    // Handle subscription created (resubscription from Customer Portal)
    if (event.type === "customer.subscription.created") {
      const subscription = event.data.object as Stripe.Subscription

      console.log("New subscription created:", subscription.id)
      console.log("  customer:", subscription.customer)
      console.log("  status:", subscription.status)

      // Initialize Supabase client
      const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      })

      // Get period dates - handle different API versions
      // In newer Stripe API versions, period dates may be in items.data[0] instead of root
      let periodStart: number | undefined = (subscription as any).current_period_start
      let periodEnd: number | undefined = (subscription as any).current_period_end

      // Fallback: check subscription items for period dates
      if (!periodStart || !periodEnd) {
        const items = (subscription as any).items?.data
        if (items && items.length > 0) {
          periodStart = periodStart || items[0].current_period_start
          periodEnd = periodEnd || items[0].current_period_end
        }
      }

      // Final fallback: use start_date and calculate end (shouldn't happen but be safe)
      if (!periodStart) {
        periodStart = (subscription as any).start_date || Math.floor(Date.now() / 1000)
      }

      console.log("Period start (unix):", periodStart, "Period end (unix):", periodEnd)

      const currentPeriodStart = periodStart ? new Date(periodStart * 1000).toISOString() : new Date().toISOString()
      const currentPeriodEnd = periodEnd ? new Date(periodEnd * 1000).toISOString() : null

      console.log("Period start:", currentPeriodStart, "Period end:", currentPeriodEnd)

      // Find the user by stripe_customer_id and update their subscription
      const updateData: any = {
        subscription_status: subscription.status === "active" ? "active" : subscription.status,
        stripe_subscription_id: subscription.id,
        current_period_start: currentPeriodStart,
        canceled_at: null, // Clear any previous cancellation
        updated_at: new Date().toISOString(),
      }

      // Only set period end if we have it
      if (currentPeriodEnd) {
        updateData.current_period_end = currentPeriodEnd
      }

      const { error } = await supabase
        .from("user_subscriptions")
        .update(updateData)
        .eq("stripe_customer_id", subscription.customer as string)

      if (error) {
        console.error("Error updating subscription for customer:", error)
        return new Response(`Database error: ${error.message}`, { status: 500 })
      }

      console.log("Successfully activated new subscription for customer:", subscription.customer)
    }

    // Handle subscription deleted (subscription actually ends)
    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as Stripe.Subscription

      console.log("Subscription deleted:", subscription.id)

      // Initialize Supabase client
      const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      })

      // Check if this is a squad subscription
      const { data: squad } = await supabase
        .from("squads")
        .select("id")
        .eq("stripe_subscription_id", subscription.id)
        .single()

      const isSquadSubscription = !!squad
      console.log("Is squad subscription:", isSquadSubscription)

      if (isSquadSubscription) {
        // Update squad status
        const { error: squadError } = await supabase
          .from("squads")
          .update({
            subscription_status: "canceled",
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_subscription_id", subscription.id)

        if (squadError) {
          console.error("Error updating squad status to canceled:", squadError)
          return new Response(`Database error: ${squadError.message}`, { status: 500 })
        }

        // Cancel all squad members
        const { error: membersError } = await supabase
          .from("user_subscriptions")
          .update({
            subscription_status: "canceled",
            updated_at: new Date().toISOString(),
          })
          .eq("squad_id", squad.id)

        if (membersError) {
          console.error("Error canceling squad members:", membersError)
        }

        console.log("Squad and all members marked as canceled:", subscription.id)
      } else {
        // Individual subscription
        const { error } = await supabase
          .from("user_subscriptions")
          .update({
            subscription_status: "canceled",
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_subscription_id", subscription.id)

        if (error) {
          console.error("Error updating subscription status to canceled:", error)
          return new Response(`Database error: ${error.message}`, { status: 500 })
        }

        console.log("Individual subscription marked as canceled:", subscription.id)
      }
    }

    // Handle invoice paid (successful payment, renewal, or retry after past_due)
    if (event.type === "invoice.paid") {
      const invoice = event.data.object as Stripe.Invoice

      console.log("Invoice paid:", invoice.id)
      console.log("  subscription:", invoice.subscription)
      console.log("  customer:", invoice.customer)
      console.log("  billing_reason:", invoice.billing_reason)

      // Only process subscription-related invoices
      if (invoice.subscription) {
        // Initialize Supabase client
        const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
          auth: {
            autoRefreshToken: false,
            persistSession: false,
          },
        })

        // Check if this is a squad subscription
        const { data: squad } = await supabase
          .from("squads")
          .select("id")
          .eq("stripe_subscription_id", invoice.subscription as string)
          .single()

        const isSquadSubscription = !!squad
        console.log("Is squad subscription:", isSquadSubscription)

        // Retrieve the subscription to get updated period dates
        try {
          const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string)

          const currentPeriodStart = new Date(subscription.current_period_start * 1000).toISOString()
          const currentPeriodEnd = new Date(subscription.current_period_end * 1000).toISOString()

          console.log("Subscription renewed - period start:", currentPeriodStart, "end:", currentPeriodEnd)

          if (isSquadSubscription) {
            // Update squad status and period dates
            const { error: squadError } = await supabase
              .from("squads")
              .update({
                subscription_status: "active",
                current_period_start: currentPeriodStart,
                current_period_end: currentPeriodEnd,
                canceled_at: null,
                updated_at: new Date().toISOString(),
              })
              .eq("stripe_subscription_id", invoice.subscription as string)

            if (squadError) {
              console.error("Error updating squad after invoice paid:", squadError)
              return new Response(`Database error: ${squadError.message}`, { status: 500 })
            }

            // Reactivate all squad members
            const { error: membersError } = await supabase
              .from("user_subscriptions")
              .update({
                subscription_status: "active",
                updated_at: new Date().toISOString(),
              })
              .eq("squad_id", squad.id)

            if (membersError) {
              console.error("Error reactivating squad members after invoice paid:", membersError)
            }

            console.log("Successfully renewed squad subscription:", invoice.subscription)
          } else {
            // Update individual subscription status and period dates
            const { error } = await supabase
              .from("user_subscriptions")
              .update({
                subscription_status: "active",
                current_period_start: currentPeriodStart,
                current_period_end: currentPeriodEnd,
                canceled_at: null, // Clear any cancellation if payment succeeded
                updated_at: new Date().toISOString(),
              })
              .eq("stripe_subscription_id", invoice.subscription as string)

            if (error) {
              console.error("Error updating subscription after invoice paid:", error)
              return new Response(`Database error: ${error.message}`, { status: 500 })
            }

            console.log("Successfully updated individual subscription after payment:", invoice.subscription)
          }
        } catch (subError) {
          console.error("Error retrieving subscription after invoice paid:", subError)
        }
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    })
  } catch (err) {
    console.error("Webhook error:", err)
    return new Response(`Webhook error: ${err.message}`, { status: 500 })
  }
})

