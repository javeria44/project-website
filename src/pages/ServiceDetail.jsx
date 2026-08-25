import { useMemo, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import Eyebrow from "../components/Eyebrow";
import { getServiceBySlug, SERVICES } from "../data/services";
import { useCart } from "../context/CartContext";

const PATTERNS = {
  slab: "repeating-linear-gradient(0deg, rgba(32,31,28,0.08) 0 2px, transparent 2px 34px), repeating-linear-gradient(90deg, rgba(32,31,28,0.08) 0 2px, transparent 2px 34px)",
  broom: "repeating-linear-gradient(100deg, rgba(32,31,28,0.10) 0 1.5px, transparent 1.5px 6px)",
  exposed: "radial-gradient(circle at 15% 30%, rgba(32,31,28,0.14) 0 3px, transparent 4px), radial-gradient(circle at 55% 70%, rgba(32,31,28,0.12) 0 4px, transparent 5px), radial-gradient(circle at 80% 25%, rgba(32,31,28,0.14) 0 3px, transparent 4px), radial-gradient(circle at 35% 85%, rgba(32,31,28,0.1) 0 3px, transparent 4px)",
};

export default function ServiceDetail() {
  const { slug } = useParams();
  const service = getServiceBySlug(slug);
  const { addToCart } = useCart();

  const [packageSelected, setPackageSelected] = useState(false);
  const [sqm, setSqm] = useState(service?.package.sqm || 50);
  const [quantity, setQuantity] = useState(1);

  const total = useMemo(() => {
    if (!service) return 0;
    const base = packageSelected ? service.package.price : service.pricePerSqm * sqm;
    return Math.round(base * quantity * 100) / 100;
  }, [service, packageSelected, sqm, quantity]);

  if (!service) return <Navigate to="/" replace />;

  const inputCls = "w-full bg-paper border border-charcoal/15 rounded-sm px-4 py-3 text-charcoal placeholder:text-slab/50 focus:border-amber transition-colors";
  const labelCls = "block font-mono text-xs uppercase tracking-wide text-slab/70 mb-1.5";

  const handleAddToCart = () => {
    addToCart({
      slug: service.slug,
      title: service.title,
      pricePerSqm: service.pricePerSqm,
      packagePrice: service.package.price,
      packageSqm: service.package.sqm,
      packageSelected,
      sqm: packageSelected ? service.package.sqm : sqm,
      quantity,
    });
  };

  return (
    <div className="bg-paper">
      {/* breadcrumb strip */}
      <div className="bg-charcoal text-paper/70">
        <div className="max-w-6xl mx-auto px-5 md:px-8 py-4 font-mono text-xs uppercase tracking-wide flex items-center gap-2">
          <Link to="/" className="hover:text-amber transition-colors">Home</Link>
          <span>/</span>
          <Link to="/#services" className="hover:text-amber transition-colors">Services</Link>
          <span>/</span>
          <span className="text-paper">{service.title}</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 md:px-8 py-16 grid md:grid-cols-12 gap-10">
        {/* image / visual */}
        <div className="md:col-span-5">
          <div
            className="relative rounded-sm overflow-hidden aspect-[4/3] bg-concrete flex items-end"
            style={{ backgroundImage: PATTERNS[service.image] }}
          >
            <div className="w-full bg-gradient-to-t from-charcoal/85 to-transparent p-5">
              <div className="font-mono text-amber text-xs mb-1">{service.index}</div>
              <div className="font-condensed font-bold uppercase text-paper text-2xl leading-tight">{service.title}</div>
            </div>
          </div>
          <ul className="mt-6 space-y-2 font-mono text-xs text-slab">
            {service.points.map((p) => (
              <li key={p} className="flex items-start gap-2">
                <span className="text-amber mt-0.5">▸</span>{p}
              </li>
            ))}
          </ul>
        </div>

        {/* details + order form */}
        <div className="md:col-span-7">
          <Eyebrow>Service details</Eyebrow>
          <h1 className="font-condensed font-extrabold uppercase text-4xl mb-4">{service.title}</h1>
          <p className="text-lg text-slab leading-relaxed mb-6">{service.description}</p>

          <div className="flex flex-wrap gap-6 mb-8 font-mono text-sm border-t border-b border-charcoal/10 py-4">
            <div>
              <div className="text-slab/60 text-xs uppercase tracking-wide">Price per m²</div>
              <div className="text-charcoal font-bold text-lg">${service.pricePerSqm} AUD</div>
            </div>
            <div>
              <div className="text-slab/60 text-xs uppercase tracking-wide">Package price</div>
              <div className="text-charcoal font-bold text-lg">
                ${service.package.price.toLocaleString()} AUD <span className="font-normal text-slab/60">/ {service.package.sqm}m²</span>
              </div>
            </div>
          </div>

          <div className="bg-white/40 border border-charcoal/10 rounded-sm p-6 md:p-7">
            <div className="flex gap-3 mb-6">
              <button
                type="button"
                onClick={() => setPackageSelected(false)}
                className={"flex-1 font-condensed font-bold uppercase text-sm tracking-wide px-4 py-3 rounded-sm border transition-colors " +
                  (!packageSelected ? "bg-charcoal text-paper border-charcoal" : "bg-transparent text-charcoal border-charcoal/20 hover:border-charcoal/40")}
              >
                Pay per m²
              </button>
              <button
                type="button"
                onClick={() => setPackageSelected(true)}
                className={"flex-1 font-condensed font-bold uppercase text-sm tracking-wide px-4 py-3 rounded-sm border transition-colors " +
                  (packageSelected ? "bg-charcoal text-paper border-charcoal" : "bg-transparent text-charcoal border-charcoal/20 hover:border-charcoal/40")}
              >
                {service.package.sqm}m² Package
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-5 mb-6">
              <div>
                <label className={labelCls} htmlFor="sqm">Area (square metres)</label>
                <input
                  id="sqm"
                  type="number"
                  min={1}
                  disabled={packageSelected}
                  value={packageSelected ? service.package.sqm : sqm}
                  onChange={(e) => setSqm(Math.max(1, Number(e.target.value)))}
                  className={inputCls + (packageSelected ? " opacity-50 cursor-not-allowed" : "")}
                />
              </div>
              <div>
                <label className={labelCls} htmlFor="quantity">Quantity</label>
                <div className="flex items-center border border-charcoal/15 rounded-sm bg-paper overflow-hidden">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-4 py-3 text-charcoal hover:bg-charcoal/5 transition-colors font-bold"
                  >
                    −
                  </button>
                  <input
                    id="quantity"
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                    className="w-full text-center bg-transparent px-2 py-3 text-charcoal focus:outline-none"
                  />
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-4 py-3 text-charcoal hover:bg-charcoal/5 transition-colors font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-charcoal/10 pt-5 mb-6">
              <span className="font-mono text-xs uppercase tracking-wide text-slab/70">Total</span>
              <span className="font-condensed font-extrabold text-3xl text-charcoal">${total.toLocaleString()} AUD</span>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              className="w-full bg-amber text-charcoal font-condensed font-bold uppercase tracking-wide px-8 py-3.5 rounded-sm hover:bg-charcoal hover:text-paper transition-colors"
            >
              Add To Cart
            </button>
            <p className="mt-3 text-xs text-slab/60 font-mono">
              Final measurements confirmed on-site. This is an online estimate — we'll follow up to schedule the job.
            </p>
          </div>
        </div>
      </div>

      {/* other services */}
      <div className="border-t border-charcoal/10 bg-paper">
        <div className="max-w-6xl mx-auto px-5 md:px-8 py-16">
          <Eyebrow>Other services</Eyebrow>
          <div className="grid sm:grid-cols-2 gap-5">
            {SERVICES.filter((s) => s.slug !== service.slug).map((s) => (
              <Link
                key={s.slug}
                to={`/services/${s.slug}`}
                className="flex items-center justify-between gap-4 bg-charcoal text-paper rounded-sm p-5 hover:bg-charcoal/90 transition-colors group"
              >
                <div>
                  <div className="font-mono text-amber text-xs mb-1">{s.index}</div>
                  <div className="font-condensed font-bold uppercase text-lg">{s.title}</div>
                </div>
                <span className="font-condensed text-amber group-hover:translate-x-1 transition-transform" aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
