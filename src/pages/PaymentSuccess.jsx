import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Eyebrow from "../components/Eyebrow";
import LoadingSpinner from "../components/LoadingSpinner";
import { useCart } from "../context/CartContext";
import { supabase } from "../lib/supabase";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { clearCart } = useCart();

  const [status, setStatus] = useState("checking"); // checking | paid | pending | error
  const [order, setOrder] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function verify() {
      if (!sessionId) {
        setStatus("error");
        return;
      }
      try {
        // The Stripe webhook is the source of truth for order status — it
        // updates the orders row when payment_intent.succeeded arrives.
        // Poll briefly here in case the webhook hasn't landed yet.
        for (let attempt = 0; attempt < 6; attempt++) {
          const { data, error } = await supabase
            .from("orders")
            .select("*, order_items(*)")
            .eq("stripe_session_id", sessionId)
            .maybeSingle();

          if (cancelled) return;

          if (!error && data) {
            setOrder(data);
            if (data.payment_status === "paid") {
              setStatus("paid");
              clearCart();
              return;
            }
          }
          await new Promise((r) => setTimeout(r, 1500));
        }
        if (!cancelled) setStatus("pending");
      } catch {
        if (!cancelled) setStatus("error");
      }
    }

    verify();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  if (status === "checking") {
    return <LoadingSpinner label="Confirming your payment..." />;
  }

  if (status === "error") {
    return (
      <section className="bg-paper min-h-[60vh]">
        <div className="max-w-2xl mx-auto px-5 py-24 text-center">
          <Eyebrow>Payment</Eyebrow>
          <h1 className="font-condensed font-extrabold uppercase text-4xl mb-4">Couldn't confirm payment</h1>
          <p className="text-slab mb-8">
            We couldn't verify this payment session. If you were charged, check your dashboard or contact us —
            we'll sort it out.
          </p>
          <Link to="/dashboard" className="inline-block bg-amber text-charcoal font-condensed font-bold uppercase tracking-wide px-8 py-3.5 rounded-sm hover:bg-charcoal hover:text-paper transition-colors">
            Go to Dashboard
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-paper min-h-[60vh]">
      <div className="max-w-2xl mx-auto px-5 py-24 text-center">
        <div className="w-16 h-16 rounded-full bg-amber/20 border-2 border-amber flex items-center justify-center mx-auto mb-6">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#E8A233" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <Eyebrow>Payment {status === "paid" ? "confirmed" : "processing"}</Eyebrow>
        <h1 className="font-condensed font-extrabold uppercase text-4xl mb-4">
          {status === "paid" ? "Thanks — your order is confirmed" : "Payment received, confirming order"}
        </h1>
        <p className="text-slab mb-8">
          {status === "paid"
            ? "We've emailed a confirmation and will be in touch to schedule the job."
            : "Your payment went through — we're just finishing up the order record. This can take a minute; refresh your dashboard shortly."}
        </p>
        {order && (
          <div className="text-left bg-white/40 border border-charcoal/10 rounded-sm p-6 mb-8 font-mono text-sm">
            <div className="flex justify-between mb-2"><span className="text-slab/70">Order</span><span>#{order.id.slice(0, 8)}</span></div>
            <div className="flex justify-between"><span className="text-slab/70">Total</span><span>${Number(order.total_amount).toLocaleString()} AUD</span></div>
          </div>
        )}
        <Link to="/dashboard" className="inline-block bg-amber text-charcoal font-condensed font-bold uppercase tracking-wide px-8 py-3.5 rounded-sm hover:bg-charcoal hover:text-paper transition-colors">
          View My Orders
        </Link>
      </div>
    </section>
  );
}
