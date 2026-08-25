import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Eyebrow from "../components/Eyebrow";
import LoadingSpinner from "../components/LoadingSpinner";
import { supabase } from "../lib/supabase";

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .eq("id", id)
        .maybeSingle();
      if (!cancelled) {
        if (error || !data) setNotFound(true);
        else setOrder(data);
        setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) return <LoadingSpinner label="Loading order..." />;

  if (notFound) {
    return (
      <section className="bg-paper min-h-[60vh]">
        <div className="max-w-2xl mx-auto px-5 py-24 text-center">
          <h1 className="font-condensed font-extrabold uppercase text-3xl mb-4">Order not found</h1>
          <Link to="/dashboard" className="text-charcoal font-semibold underline decoration-amber decoration-2 underline-offset-2">
            Back to dashboard
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-paper min-h-[70vh]">
      <div className="max-w-3xl mx-auto px-5 md:px-8 py-16">
        <Eyebrow>Order details</Eyebrow>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <h1 className="font-condensed font-extrabold uppercase text-4xl">Order #{order.id.slice(0, 8)}</h1>
          <Link to="/dashboard" className="font-mono text-xs uppercase tracking-wide text-slab hover:text-amber transition-colors">
            ← Back to dashboard
          </Link>
        </div>

        <div className="grid sm:grid-cols-3 gap-5 mb-8 font-mono text-sm">
          <div className="bg-white/40 border border-charcoal/10 rounded-sm p-4">
            <div className="text-slab/60 text-xs uppercase tracking-wide mb-1">Placed</div>
            <div className="text-charcoal">{new Date(order.created_at).toLocaleString("en-AU")}</div>
          </div>
          <div className="bg-white/40 border border-charcoal/10 rounded-sm p-4">
            <div className="text-slab/60 text-xs uppercase tracking-wide mb-1">Payment status</div>
            <div className="text-charcoal capitalize">{order.payment_status}</div>
          </div>
          <div className="bg-white/40 border border-charcoal/10 rounded-sm p-4">
            <div className="text-slab/60 text-xs uppercase tracking-wide mb-1">Order status</div>
            <div className="text-charcoal capitalize">{order.status}</div>
          </div>
        </div>

        <div className="bg-white/40 border border-charcoal/10 rounded-sm p-6 mb-8">
          <h2 className="font-condensed font-bold uppercase text-lg mb-4">Service details</h2>
          <div className="space-y-4 divide-y divide-charcoal/10">
            {order.order_items?.map((item) => (
              <div key={item.id} className="pt-4 first:pt-0 flex justify-between gap-4">
                <div>
                  <div className="font-condensed font-bold uppercase">{item.service_title}</div>
                  <div className="font-mono text-xs text-slab/60">
                    {item.package_selected ? "Package" : "Per m²"} · {item.sqm}m² × {item.quantity}
                  </div>
                </div>
                <div className="font-mono text-sm whitespace-nowrap">${Number(item.line_total).toLocaleString()}</div>
              </div>
            ))}
          </div>
          <div className="mt-5 pt-5 border-t border-charcoal/10 flex justify-between items-center">
            <span className="font-mono text-xs uppercase tracking-wide text-slab/70">Total</span>
            <span className="font-condensed font-extrabold text-2xl text-charcoal">${Number(order.total_amount).toLocaleString()} AUD</span>
          </div>
        </div>

        <div className="bg-white/40 border border-charcoal/10 rounded-sm p-6">
          <h2 className="font-condensed font-bold uppercase text-lg mb-4">Delivery details</h2>
          <div className="font-mono text-sm space-y-1 text-charcoal">
            <div>{order.customer_name}</div>
            <div>{order.customer_email} · {order.customer_phone}</div>
            <div>{order.address}, {order.city} {order.state} {order.postcode}</div>
            {order.notes && <div className="mt-2 text-slab/70">Notes: {order.notes}</div>}
          </div>
        </div>
      </div>
    </section>
  );
}
