import Eyebrow from "./Eyebrow";

/* ---------- Hours + contact strip ---------- */
export default function Hours() {
  const rows = [
    ["Monday – Friday","9:00 AM – 5:00 PM"],
    ["Saturday","By arrangement"],
    ["Sunday","Closed"],
  ];
  return (
    <section id="hours" className="bg-charcoal text-paper">
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-20 grid md:grid-cols-2 gap-12">
        <div>
          <Eyebrow dark>Business hours</Eyebrow>
          <h2 className="font-condensed font-extrabold uppercase text-4xl mb-8">When we're on the tools</h2>
          <div className="font-mono text-sm divide-y divide-paper/10 border-t border-b border-paper/10">
            {rows.map(([d,h]) => (
              <div key={d} className="flex justify-between py-3">
                <span className="text-paper/70">{d}</span>
                <span className="text-paper">{h}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <Eyebrow dark>Get in touch</Eyebrow>
          <h2 className="font-condensed font-extrabold uppercase text-4xl mb-8">Contact details</h2>
          <div className="space-y-5 font-body">
            <a href="tel:0406926792" className="flex items-start gap-3 group">
              <span className="text-amber mt-1">☎</span>
              <span>
                <span className="block text-paper/50 text-xs font-mono uppercase tracking-wide">Phone</span>
                <span className="text-lg group-hover:text-amber transition-colors">0406 926 792</span>
              </span>
            </a>
            <a href="mailto:shaharyar1892@gmail.com" className="flex items-start gap-3 group">
              <span className="text-amber mt-1">✉</span>
              <span>
                <span className="block text-paper/50 text-xs font-mono uppercase tracking-wide">Email</span>
                <span className="text-lg group-hover:text-amber transition-colors break-all">shaharyar1892@gmail.com</span>
              </span>
            </a>
            <div className="flex items-start gap-3">
              <span className="text-amber mt-1">⚑</span>
              <span>
                <span className="block text-paper/50 text-xs font-mono uppercase tracking-wide">Address</span>
                <span className="text-lg">56 Argyle Street, Fawkner VIC 3060</span>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="h-2 hazard-stripe"></div>
    </section>
  );
}
