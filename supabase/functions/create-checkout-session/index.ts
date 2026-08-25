// Supabase Edge Function: create-checkout-session
//
// Called from the browser via supabase.functions.invoke("create-checkout-session").
// - Verifies the caller's JWT (must be logged in).
// - Re-derives every price server-side from the `services` table — the
//   client's cart numbers are never trusted for the amount actually charged.
// - Creates a Stripe Checkout Session in AUD.
// - Writes a `pending` order + order_items rows, storing the Stripe session id
//   so the webhook can find and update the same row later.
//
// Deploy with:
//   supabase functions deploy create-checkout-session
// Required secrets (see SETUP.md):
//   supabase secrets set STRIPE_SECRET_KEY=sk_test_...
//   supabase secrets set SITE_URL=https://your-site.com

import { createClient } from "npm:@supabase/supabase-js@2";
import Stripe from "npm:stripe@16";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return json({ error: "Missing Authorization header" }, 401);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY")!;
    const siteUrl = Deno.env.get("SITE_URL") || "http://localhost:5173";

    // Client scoped to the caller's JWT — used only to identify the user.
    const supabaseUser = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const {
      data: { user },
      error: userError,
    } = await supabaseUser.auth.getUser();

    if (userError || !user) {
      return json({ error: "Not authenticated" }, 401);
    }

    // Service-role client for writes that bypass RLS (orders/order_items have
    // no insert policy for regular users by design — see migration 0001).
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    const { items, customer } = await req.json();

    if (!Array.isArray(items) || items.length === 0) {
      return json({ error: "Cart is empty" }, 400);
    }
    const required = ["fullName", "email", "phone", "address", "city", "state", "postcode"];
    for (const field of required) {
      if (!customer?.[field]) {
        return json({ error: `Missing required field: ${field}` }, 400);
      }
    }

    // --- Re-price every line item server-side against the services table ---
    const { data: catalogue, error: catalogueError } = await supabaseAdmin
      .from("services")
      .select("*");
    if (catalogueError || !catalogue) {
      return json({ error: "Could not load service catalogue" }, 500);
    }
    const catalogueBySlug = Object.fromEntries(catalogue.map((s) => [s.slug, s]));

    const lineItems = [];
    const orderItemsPayload = [];
    let totalAmount = 0;

    for (const item of items) {
      const svc = catalogueBySlug[item.slug];
      if (!svc) return json({ error: `Unknown service: ${item.slug}` }, 400);

      const quantity = Math.max(1, Number(item.quantity) || 1);
      const packageSelected = !!item.packageSelected;
      const sqm = packageSelected ? svc.package_sqm : Math.max(1, Number(item.sqm) || 1);
      const unitPrice = packageSelected ? Number(svc.package_price) : Number(svc.price_per_sqm) * sqm;
      const lineTotal = Math.round(unitPrice * quantity * 100) / 100;

      totalAmount += lineTotal;

      lineItems.push({
        price_data: {
          currency: "aud",
          product_data: {
            name: `${svc.title}${packageSelected ? ` — ${svc.package_sqm}m² package` : ` — ${sqm}m²`}`,
          },
          unit_amount: Math.round((packageSelected ? Number(svc.package_price) : unitPrice) * 100),
        },
        quantity,
      });

      orderItemsPayload.push({
        service_slug: svc.slug,
        service_title: svc.title,
        sqm,
        quantity,
        package_selected: packageSelected,
        unit_price: packageSelected ? Number(svc.package_price) : Number(svc.price_per_sqm),
        line_total: lineTotal,
      });
    }

    totalAmount = Math.round(totalAmount * 100) / 100;

    // --- Create the pending order first so we have an id for metadata ---
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        user_id: user.id,
        customer_name: customer.fullName,
        customer_email: customer.email,
        customer_phone: customer.phone,
        address: customer.address,
        city: customer.city,
        state: customer.state,
        postcode: customer.postcode,
        notes: customer.notes || null,
        total_amount: totalAmount,
        payment_status: "pending",
        status: "received",
      })
      .select()
      .single();

    if (orderError || !order) {
      return json({ error: "Could not create order" }, 500);
    }

    const { error: itemsError } = await supabaseAdmin
      .from("order_items")
      .insert(orderItemsPayload.map((i) => ({ ...i, order_id: order.id })));

    if (itemsError) {
      return json({ error: "Could not save order items" }, 500);
    }

    // --- Create the Stripe Checkout Session ---
    const stripe = new Stripe(stripeSecretKey, { apiVersion: "2024-06-20" });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: customer.email,
      line_items: lineItems,
      success_url: `${siteUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/payment-cancel`,
      metadata: { order_id: order.id, user_id: user.id },
    });

    await supabaseAdmin
      .from("orders")
      .update({ stripe_session_id: session.id })
      .eq("id", order.id);

    return json({ url: session.url, orderId: order.id });
  } catch (err) {
    console.error(err);
    return json({ error: err instanceof Error ? err.message : "Unexpected error" }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
