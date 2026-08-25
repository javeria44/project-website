import { Link } from "react-router-dom";
import Eyebrow from "../components/Eyebrow";

export default function PaymentCancel() {
  return (
    <section className="bg-paper min-h-[60vh]">
      <div className="max-w-2xl mx-auto px-5 py-24 text-center">
        <div className="w-16 h-16 rounded-full bg-rebar/10 border-2 border-rebar/40 flex items-center justify-center mx-auto mb-6">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="#C4472A" strokeWidth="3" strokeLinecap="round"/></svg>
        </div>
        <Eyebrow>Payment cancelled</Eyebrow>
        <h1 className="font-condensed font-extrabold uppercase text-4xl mb-4">No payment was taken</h1>
        <p className="text-slab mb-8">
          You cancelled checkout before payment completed. Your cart is still saved, so you can pick up right
          where you left off.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link to="/cart" className="bg-amber text-charcoal font-condensed font-bold uppercase tracking-wide px-8 py-3.5 rounded-sm hover:bg-charcoal hover:text-paper transition-colors">
            Return to Cart
          </Link>
          <Link to="/" className="border border-charcoal/20 px-8 py-3.5 rounded-sm font-condensed font-bold uppercase tracking-wide hover:border-amber hover:text-amber transition-colors">
            Back to Home
          </Link>
        </div>
      </div>
    </section>
  );
}
