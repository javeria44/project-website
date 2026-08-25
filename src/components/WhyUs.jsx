import Eyebrow from "./Eyebrow";

/* ---------- Why us ---------- */
export default function WhyUs() {
  const items = [
    ["Set out square","Every job starts with an accurate set-out, so the finished slab or driveway sits exactly to plan."],
    ["Level, every time","Screeded and floated to a true, even finish — no birdbaths, no low spots."],
    ["Own crew, own gear","No subcontracting the pour out — the same crew handles formwork through to finish."],
    ["Straight communication","Clear quotes, realistic timeframes, and someone who answers the phone."],
  ];
  return (
    <section className="bg-paper">
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-20">
        <Eyebrow>Why work with us</Eyebrow>
        <h2 className="font-condensed font-extrabold uppercase text-4xl mb-10 max-w-lg">Built for people who need it done right, once.</h2>
        <div className="grid sm:grid-cols-2 gap-x-10 gap-y-8">
          {items.map(([t, d], i) => (
            <div key={t} className="flex gap-4">
              <div className="font-mono text-amber text-sm pt-1">{String(i+1).padStart(2,'0')}</div>
              <div>
                <div className="font-condensed font-bold uppercase text-lg mb-1">{t}</div>
                <div className="text-slab">{d}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
