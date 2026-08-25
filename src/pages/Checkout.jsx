import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import Eyebrow from "../components/Eyebrow";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { createCheckoutSession } from "../lib/stripe";

const inputCls = "w-full bg-paper border border-charcoal/15 rounded-sm px-4 py-3 text-charcoal placeholder:text-slab/50 focus:border-amber transition-colors";
const labelCls = "block font-mono text-xs uppercase tracking-wide text-slab/70 mb-1.5";

const AU_STATES = ["VIC", "NSW", "QLD", "WA", "SA", "TAS", "ACT", "NT"];

export default function Checkout() {
  const { items, cartTotal } = useCart();
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: profile?.full_name || "",
    email: user?.email || "",
    phone: profile?.phone || "",
    address: "",
    city: "",
    state: "VIC",
    postcode: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  if (items.length === 0) {
    return (
      <section className="bg-paper min-h-[60vh]">
        <div className="max-w-3xl mx-auto px-5 py-24 text-center">
          <Eyebrow>Checkout</Eyebrow>
          <h1 className="font-condensed font-extrabold uppercase text-4xl mb-4">Nothing to check out</h1>
          <p className="text-slab mb-8">Your cart is empty — add a service first.</p>
          <Link to="/#services" className="inline-block bg-amber text-charcoal font-condensed font-bold uppercase tracking-wide px-8 py-3.5 rounded-sm hover:bg-charcoal hover:text-paper transition-colors">
            View Services
          </Link>
        </div>
      </section>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const payloadItems = items.map((i) => ({
        slug: i.slug,
        title: i.title,
        sqm: i.packageSelected ? i.packageSqm : i.sqm,
        quantity: i.quantity,
        packageSelected: i.packageSelected,
        unitPrice: i.packageSelected ? i.packagePrice : i.pricePerSqm,
        lineTotal: i.lineTotal,
      }));
      const { url } = await createCheckoutSession({ items: payloadItems, customer: form });
      window.location.href = url;
    } catch (err) {
      setError(err.message || "Could not start checkout. Please try again.");
      toast.error(err.message || "Checkout failed");
      setSubmitting(false);
    }
  };

  return (
    <section className="bg-paper min-h-[60vh]">
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-16">
        <Eyebrow>Checkout</Eyebrow>
        <h1 className="font-condensed font-extrabold uppercase text-4xl mb-10">Checkout</h1>

        <div className="grid md:grid-cols-12 gap-10">
          <form onSubmit={handleSubmit} className="md:col-span-7 bg-white/40 border border-charcoal/10 rounded-sm p-6 md:p-8 space-y-5">
            <h2 className="font-condensed font-bold uppercase text-xl mb-2">Your details</h2>

            {error && (
              <div className="bg-rebar/10 border border-rebar/30 text-rebar px-4 py-3 rounded-sm font-mono text-sm">
                {error}
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <label className={labelCls} htmlFor="fullName">Full name</label>
                <input required id="fullName" name="fullName" value={form.fullName} onChange={handleChange} className={inputCls} placeholder="Full name" />
              </div>
              <div>
                <label className={labelCls} htmlFor="email">Email</label>
                <input required id="email" name="email" type="email" value={form.email} onChange={handleChange} className={inputCls} placeholder="you@example.com" />
              </div>
              <div>
                <label className={labelCls} htmlFor="phone">Phone number</label>
                <input required id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} className={inputCls} placeholder="04xx xxx xxx" />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls} htmlFor="address">Address</label>
                <input required id="address" name="address" value={form.address} onChange={handleChange} className={inputCls} placeholder="Street address" />
              </div>
              <div>
                <label className={labelCls} htmlFor="city">City</label>
                <input required id="city" name="city" value={form.city} onChange={handleChange} className={inputCls} placeholder="City / suburb" />
              </div>
              <div>
                <label className={labelCls} htmlFor="state">State</label>
                <select id="state" name="state" value={form.state} onChange={handleChange} className={inputCls}>
                  {AU_STATES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls} htmlFor="postcode">Postcode</label>
                <input required id="postcode" name="postcode" value={form.postcode} onChange={handleChange} className={inputCls} placeholder="3000" />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls} htmlFor="notes">Notes (optional)</label>
                <textarea id="notes" name="notes" rows="4" value={form.notes} onChange={handleChange} className={inputCls} placeholder="Site access, timing, anything else we should know..."></textarea>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-4 bg-amber text-charcoal font-condensed font-bold uppercase tracking-wide px-8 py-3.5 rounded-sm hover:bg-charcoal hover:text-paper transition-colors disabled:opacity-60"
            >
              {submitting ? "Redirecting to payment..." : "Continue to Payment"}
            </button>
            <p className="text-xs text-slab/60 font-mono text-center">You'll be redirected to Stripe to complete payment securely.</p>
          </form>

          <div className="md:col-span-5">
            <div className="bg-charcoal text-paper rounded-sm p-6 md:p-7 sticky top-24">
              <h2 className="font-condensed font-bold uppercase text-xl mb-5">Order summary</h2>
              <div className="space-y-4 divide-y divide-paper/10">
                {items.map((item) => (
                  <div key={item.cartKey} className="pt-4 first:pt-0 flex justify-between gap-3">
                    <div>
                      <div className="font-condensed font-bold uppercase">{item.title}</div>
                      <div className="font-mono text-xs text-paper/60">
                        {item.packageSelected
                          ? `Package · ${item.packageSqm}m² × ${item.quantity}`
                          : `${item.sqm}m² × ${item.quantity}`}
                      </div>
                    </div>
                    <div className="font-mono text-sm whitespace-nowrap">${item.lineTotal.toLocaleString()}</div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-5 border-t border-paper/20 flex justify-between items-center">
                <span className="font-mono text-xs uppercase tracking-wide text-paper/60">Total (AUD)</span>
                <span className="font-condensed font-extrabold text-3xl">${cartTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
