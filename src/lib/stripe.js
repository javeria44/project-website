import { loadStripe } from "@stripe/stripe-js";
import { supabase } from "./supabase";

let stripePromise;
export function getStripe() {
  if (!stripePromise) {
    const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
    if (!key) {
      console.warn(
        "[stripe] Missing VITE_STRIPE_PUBLISHABLE_KEY — set it in your .env file."
      );
    }
    stripePromise = loadStripe(key || "");
  }
  return stripePromise;
}

/**
 * Calls the `create-checkout-session` Supabase Edge Function, which builds a
 * Stripe Checkout Session server-side (secret key never touches the browser)
 * and writes a pending order + order_items row before returning the session.
 *
 * @param {object} params
 * @param {Array}  params.items - cart items [{ slug, title, sqm, quantity, packageSelected, unitPrice, lineTotal }]
 * @param {object} params.customer - checkout form fields
 * @returns {Promise<{ url: string, orderId: string }>}
 */
export async function createCheckoutSession({ items, customer }) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("You must be logged in to check out.");
  }

  const { data, error } = await supabase.functions.invoke("create-checkout-session", {
    body: { items, customer },
  });

  if (error) {
    throw new Error(error.message || "Could not start checkout. Please try again.");
  }
  if (!data?.url) {
    throw new Error("Checkout session was not created. Please try again.");
  }
  return data;
}
