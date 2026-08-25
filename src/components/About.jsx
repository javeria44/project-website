import Eyebrow from "./Eyebrow";

/* ---------- About ---------- */
export default function About() {
  return (
    <section id="about" className="bg-paper">
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-20 grid md:grid-cols-12 gap-10 items-start">
        <div className="md:col-span-4">
          <Eyebrow>About the crew</Eyebrow>
          <h2 className="font-condensed font-extrabold uppercase text-4xl leading-[0.95]">
            Concrete work, done properly.
          </h2>
        </div>
        <div className="md:col-span-8">
          <p className="text-lg text-slab leading-relaxed">
            Shaharyar Concrete Pty Ltd is a Melbourne-based concreting business specialising in
            <strong className="text-charcoal"> house slabs and commercial driveways</strong>. From
            excavation and formwork through to the final finish, we handle every stage of the pour
            ourselves — so there's one crew accountable for the whole job, not three subcontractors
            passing the blame around.
          </p>
          <p className="mt-4 text-lg text-slab leading-relaxed">
            Whether it's a new slab for a house build or a commercial driveway that needs to handle
            daily traffic, we set it out square, pour it level, and finish it to last.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-6 border-t border-charcoal/10 pt-6">
            {[["100%","owner-operated"],["Melb-wide","service area"],["Fawkner","home base, VIC"]].map(([n,l]) => (
              <div key={l}>
                <div className="font-condensed font-extrabold text-2xl text-charcoal">{n}</div>
                <div className="font-mono text-xs uppercase tracking-wide text-slab/70 mt-1">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
