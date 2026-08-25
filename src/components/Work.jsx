import Eyebrow from "./Eyebrow";

/* ---------- Work / gallery (placeholder tiles — swap in real project photos) ---------- */
function WorkTile({ label, sub, pattern }) {
  const patterns = {
    slab: "repeating-linear-gradient(0deg, rgba(32,31,28,0.08) 0 2px, transparent 2px 34px), repeating-linear-gradient(90deg, rgba(32,31,28,0.08) 0 2px, transparent 2px 34px)",
    broom: "repeating-linear-gradient(100deg, rgba(32,31,28,0.10) 0 1.5px, transparent 1.5px 6px)",
    exposed: "radial-gradient(circle at 15% 30%, rgba(32,31,28,0.14) 0 3px, transparent 4px), radial-gradient(circle at 55% 70%, rgba(32,31,28,0.12) 0 4px, transparent 5px), radial-gradient(circle at 80% 25%, rgba(32,31,28,0.14) 0 3px, transparent 4px), radial-gradient(circle at 35% 85%, rgba(32,31,28,0.1) 0 3px, transparent 4px)",
  };
  return (
    <div className="relative rounded-sm overflow-hidden aspect-[4/3] bg-concrete flex items-end" style={{ backgroundImage: patterns[pattern] }}>
      {/* NOTE FOR SHAHARYAR: replace this block's backgroundImage with a real project photo,
          e.g. style={{ backgroundImage: 'url(/images/driveway-01.jpg)', backgroundSize: 'cover' }} */}
      <div className="w-full bg-gradient-to-t from-charcoal/85 to-transparent p-4">
        <div className="font-condensed font-bold uppercase text-paper text-lg leading-tight">{label}</div>
        <div className="font-mono text-[0.65rem] text-paper/70">{sub}</div>
      </div>
    </div>
  );
}

export default function Work() {
  return (
    <section id="work" className="bg-charcoal text-paper">
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-20">
        <Eyebrow dark>Recent pours</Eyebrow>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 gap-4">
          <h2 className="font-condensed font-extrabold uppercase text-4xl">Our Work</h2>
          <p className="max-w-sm text-paper/60 font-mono text-xs leading-relaxed">
            Photo tiles below are placeholders — drop your own job-site photos into the public/images/ folder
            and swap the backgroundImage in WorkTile to show real projects.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <WorkTile label="House Slab" sub="Fawkner, VIC" pattern="slab" />
          <WorkTile label="Commercial Driveway" sub="Broom finish" pattern="broom" />
          <WorkTile label="Exposed Aggregate" sub="Residential driveway" pattern="exposed" />
          <WorkTile label="Formwork Set-Out" sub="New house build" pattern="slab" />
          <WorkTile label="Garage Slab" sub="Level pour" pattern="broom" />
          <WorkTile label="Driveway Extension" sub="Exposed finish" pattern="exposed" />
        </div>
      </div>
      <div className="h-2 hazard-stripe"></div>
    </section>
  );
}

export { WorkTile };
