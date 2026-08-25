import { Link, useNavigate } from "react-router-dom";
import Eyebrow from "../components/Eyebrow";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Cart() {
  const { items, removeFromCart, updateQuantity, updateSqm, togglePackage, cartTotal } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (isAuthenticated) {
      navigate("/checkout");
    } else {
      navigate("/login", { state: { from: "/checkout" } });
    }
  };

  if (items.length === 0) {
    return (
      <section className="bg-paper min-h-[60vh]">
        <div className="max-w-3xl mx-auto px-5 py-24 text-center">
          <Eyebrow>Your cart</Eyebrow>
          <h1 className="font-condensed font-extrabold uppercase text-4xl mb-4">Your cart is empty</h1>
          <p className="text-slab mb-8">Browse our services and add a job to get an instant estimate.</p>
          <Link to="/#services" className="inline-block bg-amber text-charcoal font-condensed font-bold uppercase tracking-wide px-8 py-3.5 rounded-sm hover:bg-charcoal hover:text-paper transition-colors">
            View Services
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-paper min-h-[60vh]">
      <div className="max-w-5xl mx-auto px-5 md:px-8 py-16">
        <Eyebrow>Your cart</Eyebrow>
        <h1 className="font-condensed font-extrabold uppercase text-4xl mb-10">Cart</h1>

        <div className="space-y-5">
          {items.map((item) => (
            <div key={item.cartKey} className="bg-white/40 border border-charcoal/10 rounded-sm p-5 md:p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="font-condensed font-extrabold uppercase text-xl">{item.title}</h3>
                  <div className="font-mono text-xs text-slab/70 mt-1">
                    {item.packageSelected
                      ? `Package — ${item.packageSqm}m² @ $${item.packagePrice.toLocaleString()} AUD`
                      : `$${item.pricePerSqm}/m² × ${item.sqm}m²`}
                  </div>
                </div>
                <div className="font-condensed font-extrabold text-2xl text-charcoal">
                  ${item.lineTotal.toLocaleString()} AUD
                </div>
              </div>

              <div className="mt-5 grid sm:grid-cols-3 gap-4 items-end">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => togglePackage(item.cartKey, false)}
                    className={"flex-1 font-mono text-xs uppercase px-3 py-2 rounded-sm border transition-colors " +
                      (!item.packageSelected ? "bg-charcoal text-paper border-charcoal" : "bg-transparent text-charcoal border-charcoal/20")}
                  >
                    Per m²
                  </button>
                  <button
                    type="button"
                    onClick={() => togglePackage(item.cartKey, true)}
                    className={"flex-1 font-mono text-xs uppercase px-3 py-2 rounded-sm border transition-colors " +
                      (item.packageSelected ? "bg-charcoal text-paper border-charcoal" : "bg-transparent text-charcoal border-charcoal/20")}
                  >
                    Package
                  </button>
                </div>

                <div>
                  <label className="block font-mono text-[0.65rem] uppercase tracking-wide text-slab/60 mb-1">Area (m²)</label>
                  <input
                    type="number"
                    min={1}
                    disabled={item.packageSelected}
                    value={item.packageSelected ? item.packageSqm : item.sqm}
                    onChange={(e) => updateSqm(item.cartKey, Math.max(1, Number(e.target.value)))}
                    className={"w-full bg-paper border border-charcoal/15 rounded-sm px-3 py-2 text-charcoal text-sm focus:border-amber transition-colors" + (item.packageSelected ? " opacity-50 cursor-not-allowed" : "")}
                  />
                </div>

                <div>
                  <label className="block font-mono text-[0.65rem] uppercase tracking-wide text-slab/60 mb-1">Quantity</label>
                  <div className="flex items-center border border-charcoal/15 rounded-sm bg-paper overflow-hidden">
                    <button type="button" aria-label="Decrease quantity" onClick={() => updateQuantity(item.cartKey, Math.max(1, item.quantity - 1))} className="px-3 py-2 text-charcoal hover:bg-charcoal/5 font-bold">−</button>
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.cartKey, Math.max(1, Number(e.target.value)))}
                      className="w-full text-center bg-transparent px-1 py-2 text-sm text-charcoal focus:outline-none"
                    />
                    <button type="button" aria-label="Increase quantity" onClick={() => updateQuantity(item.cartKey, item.quantity + 1)} className="px-3 py-2 text-charcoal hover:bg-charcoal/5 font-bold">+</button>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => removeFromCart(item.cartKey)}
                className="mt-4 font-mono text-xs uppercase tracking-wide text-rebar hover:underline"
              >
                Remove item
              </button>
            </div>
          ))}
        </div>

        <div className="mt-10 bg-charcoal text-paper rounded-sm p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="font-mono text-xs uppercase tracking-wide text-paper/60">Cart total</div>
            <div className="font-condensed font-extrabold text-4xl">${cartTotal.toLocaleString()} AUD</div>
          </div>
          <div className="flex gap-4">
            <Link to="/#services" className="border border-paper/30 px-6 py-3.5 rounded-sm font-condensed font-bold uppercase tracking-wide hover:border-amber hover:text-amber transition-colors">
              Add More
            </Link>
            <button
              type="button"
              onClick={handleCheckout}
              className="bg-amber text-charcoal font-condensed font-bold uppercase tracking-wide px-7 py-3.5 rounded-sm hover:bg-paper transition-colors"
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
