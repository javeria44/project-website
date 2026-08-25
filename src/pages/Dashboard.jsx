import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Eyebrow from "../components/Eyebrow";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

const STATUS_STYLES = {
  paid: "bg-amber/20 text-amber border-amber/40",
  pending: "bg-slab/10 text-slab border-slab/30",
  failed: "bg-rebar/10 text-rebar border-rebar/40",
  refunded: "bg-slab/10 text-slab border-slab/30",
};

export default function Dashboard() {
  const { user, profile } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function loadOrders() {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .order("created_at", { ascending: false });
      if (!cancelled) {
        if (!error) setOrders(data || []);
        setLoading(false);
      }
    }
    loadOrders();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="bg-paper min-h-[70vh]">
      <div className="max-w-5xl mx-auto px-5 md:px-8 py-16">
        <Eyebrow>My account</Eyebrow>
        <h1 className="font-condensed font-extrabold uppercase text-4xl mb-10">Dashboard</h1>

        <div className="grid md:grid-cols-12 gap-10">
          <div className="md:col-span-4">
            <div className="bg-white/40 border border-charcoal/10 rounded-sm p-6">
              <h2 className="font-condensed font-bold uppercase text-lg mb-4">Profile</h2>
              <div className="space-y-3 font-mono text-sm">
                <div>
                  <div className="text-slab/60 text-xs uppercase tracking-wide">Name</div>
                  <div className="text-charcoal">{profile?.full_name || "—"}</div>
                </div>
                <div>
                  <div className="text-slab/60 text-xs uppercase tracking-wide">Email</div>
                  <div className="text-charcoal break-all">{user?.email}</div>
                </div>
                <div>
                  <div className="text-slab/60 text-xs uppercase tracking-wide">Phone</div>
                  <div className="text-charcoal">{profile?.phone || "—"}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-8">
            <h2 className="font-condensed font-bold uppercase text-lg mb-4">Order history</h2>
            {loading ? (
              <LoadingSpinner label="Loading orders..." />
            ) : orders.length === 0 ? (
              <div className="bg-white/40 border border-charcoal/10 rounded-sm p-8 text-center">
                <p className="text-slab mb-5">You haven't placed any orders yet.</p>
                <Link to="/#services" className="inline-block bg-amber text-charcoal font-condensed font-bold uppercase tracking-wide px-6 py-3 rounded-sm hover:bg-charcoal hover:text-paper transition-colors">
                  View Services
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <Link
                    key={order.id}
                    to={`/orders/${order.id}`}
                    className="block bg-white/40 border border-charcoal/10 rounded-sm p-5 hover:border-amber/50 transition-colors"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                      <div className="font-mono text-sm text-slab/70">
                        Order #{order.id.slice(0, 8)} · {new Date(order.created_at).toLocaleDateString("en-AU")}
                      </div>
                      <span className={"font-mono text-xs uppercase tracking-wide px-2.5 py-1 rounded-sm border " + (STATUS_STYLES[order.payment_status] || STATUS_STYLES.pending)}>
                        {order.payment_status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="font-mono text-xs text-slab/60">
                        {order.order_items?.length || 0} item{order.order_items?.length === 1 ? "" : "s"} · Status: {order.status}
                      </div>
                      <div className="font-condensed font-extrabold text-xl text-charcoal">
                        ${Number(order.total_amount).toLocaleString()} AUD
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
