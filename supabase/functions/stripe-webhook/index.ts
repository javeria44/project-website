// Supabase Edge Function: stripe-webhook
//
// Stripe calls this URL directly (not via supabase-js), so it must be
// deployed with --no-verify-jwt. Configure this URL as an endpoint in the
// Stripe Dashboard -> Developers -> Webhooks:
//   https://YOUR-PROJECT-REF.supabase.co/functions/v1/stripe-webhook
// Listen for: checkout.session.completed, checkout.session.expired,
//             payment_intent.payment_failed
//
// Deploy with:
//   supabase functions deploy stripe-webhook --no-verify-jwt
// Required secrets:
//   supabase secrets set STRIPE_SECRET_KEY=sk_test_...
//   supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...

import { createClient } from "npm:@supabase/supabase-js@2";
import Stripe from "npm:stripe@16";

Deno.serve(async (req) => {
  const signature = req.headers.get("stripe-signature");
  const body = await req.text();

  const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY")!;
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET")!;
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  const stripe = new Stripe(stripeSecretKey, { apiVersion: "2024-06-20" });
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(body, signature!, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return new Response(`Webhook Error: ${err instanceof Error ? err.message : "invalid signature"}`, {
      status: 400,
    });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await supabaseAdmin
          .from("orders")
          .update({
            payment_status: session.payment_status === "paid" ? "paid" : "pending",
            stripe_payment_intent:
              typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id,
          })
          .eq("stripe_session_id", session.id);
        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;
        await supabaseAdmin
          .from("orders")
          .update({ payment_status: "failed" })
          .eq("stripe_session_id", session.id);
        break;
      }

      case "payment_intent.payment_failed": {
        const intent = event.data.object as Stripe.PaymentIntent;
        await supabaseAdmin
          .from("orders")
          .update({ payment_status: "failed" })
          .eq("stripe_payment_intent", intent.id);
        break;
      }

      default:
        // Ignore other event types
        break;
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error handling webhook event:", err);
    return new Response("Webhook handler error", { status: 500 });
  }
});
