import Eyebrow from "./Eyebrow";

/* ---------- Hero ---------- */
export default function Hero() {
  return (
    <section id="top" className="relative bg-charcoal text-paper overflow-hidden">
      <div className="absolute inset-0 formwork-grid-dark"></div>
      <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-amber/10 blur-3xl"></div>
      <div className="relative max-w-6xl mx-auto px-5 md:px-8 pt-16 pb-20 md:pt-24 md:pt-24 md:pb-28">
        <Eyebrow dark>Fawkner, VIC — Melbourne-wide</Eyebrow>
        <h1 className="font-condensed font-extrabold uppercase leading-[0.92] text-[13vw] md:text-[5.2rem] tracking-tight">
          We pour it.<br/>
          <span className="text-amber">You build on it.</span>
        </h1>
        <p className="mt-6 max-w-xl text-paper/75 text-lg font-body">
          Shaharyar Concrete lays the ground floor for Melbourne homes and businesses —
          house slabs, commercial driveways and formwork, finished level, on time, every pour.
        </p>
        <div className="mt-9 flex flex-wrap items-center gap-4">
          <a href="#quote" className="bg-amber text-charcoal font-condensed font-bold uppercase tracking-wide px-7 py-3.5 rounded-sm hover:bg-paper transition-colors">
            Request a Free Quote
          </a>
          <a href="tel:0406926792" className="border border-paper/30 px-7 py-3.5 rounded-sm font-condensed font-bold uppercase tracking-wide hover:border-amber hover:text-amber transition-colors">
            Call 0470308312
          </a>
        </div>

        {/* pour progress strip — signature element */}
        <div className="mt-14 md:mt-20 grid grid-cols-3 max-w-lg gap-6 font-mono text-xs text-paper/60">
          {[["SLABS","level ±2mm"],["DRIVEWAYS","exposed & broom"],["FORMWORK","engineer-ready"]].map(([t,s]) => (
            <div key={t}>
              <div className="h-[3px] bg-paper/15 mb-2 overflow-hidden">
                <div className="h-full bg-amber pour-bar"></div>
              </div>
              <div className="uppercase tracking-widest text-paper/80">{t}</div>
              <div className="text-paper/45">{s}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="h-2 hazard-stripe"></div>
    </section>
  );
}
