import { Link } from "react-router-dom";
import Eyebrow from "./Eyebrow";
import { SERVICES } from "../data/services";

function ServiceCard({ index, title, blurb, points, slug, pricePerSqm }) {
  return (
    <Link to={`/services/${slug}`} className="relative bg-charcoal text-paper rounded-sm p-7 trowel-tex overflow-hidden group block">
      <div className="absolute top-0 right-0 h-1 w-0 group-hover:w-full bg-amber transition-all duration-500"></div>
      <div className="flex items-start justify-between mb-6">
        <div className="font-mono text-amber text-sm">{index}</div>
        <div className="font-mono text-xs text-paper/50">${pricePerSqm}/m²</div>
      </div>
      <h3 className="font-condensed font-extrabold uppercase text-2xl mb-3">{title}</h3>
      <p className="text-paper/65 mb-5">{blurb}</p>
      <ul className="space-y-2 font-mono text-xs text-paper/70 mb-6">
        {points.map(p => (
          <li key={p} className="flex items-start gap-2">
            <span className="text-amber mt-0.5">▸</span>{p}
          </li>
        ))}
      </ul>
      <span className="inline-flex items-center gap-2 font-condensed font-bold uppercase text-sm tracking-wide text-amber group-hover:gap-3 transition-all">
        View pricing &amp; order <span aria-hidden="true">→</span>
      </span>
    </Link>
  );
}

export default function Services() {
  return (
    <section id="services" className="bg-paper">
      <div className="h-2 hazard-stripe"></div>
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-20">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4">
          <div>
            <Eyebrow>What we pour</Eyebrow>
            <h2 className="font-condensed font-extrabold uppercase text-4xl">Services</h2>
          </div>
          <p className="max-w-sm text-slab">Three services, one crew, no handballing between subbies. Tap a card for pricing and to order online.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {SERVICES.map((s) => (
            <ServiceCard
              key={s.slug}
              slug={s.slug}
              index={s.index}
              title={s.title}
              blurb={s.blurb}
              points={s.points}
              pricePerSqm={s.pricePerSqm}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
