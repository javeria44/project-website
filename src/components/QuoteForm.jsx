import { useState } from "react";
import Eyebrow from "./Eyebrow";

/* ---------- Quote form ---------- */
export default function QuoteForm() {
  const [form, setForm] = useState({
    name: "", phone: "", email: "", address: "", service: "House Slabs", details: "",
  });
  const [sent, setSent] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Quote request — ${form.service} — ${form.name}`);
    const body = encodeURIComponent(
`New quote request from the website:

Name: ${form.name}
Phone: ${form.phone}
Email: ${form.email}
Project / site address: ${form.address}
Service required: ${form.service}

Project details:
${form.details}`
    );
    window.location.href = `mailto:ranahussnain112a@gmail.com?subject=${subject}&body=${body}`;
    setSent(true);
  };

  const inputCls = "w-full bg-paper border border-charcoal/15 rounded-sm px-4 py-3 text-charcoal placeholder:text-slab/50 focus:border-amber transition-colors";
  const labelCls = "block font-mono text-xs uppercase tracking-wide text-slab/70 mb-1.5";

  return (
    <section id="quote" className="bg-paper">
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-20">
        <div className="grid md:grid-cols-12 gap-10">
          <div className="md:col-span-4">
            <Eyebrow>Free, no-obligation</Eyebrow>
            <h2 className="font-condensed font-extrabold uppercase text-4xl leading-[0.95] mb-4">Request a quote</h2>
            <p className="text-slab mb-6">
              Tell us about the job and we'll get back to you with pricing and a timeframe.
              Prefer to talk it through? Call <a href="tel:0470308312" className="text-charcoal font-semibold underline decoration-amber decoration-2 underline-offset-2">0470308312</a>.
            </p>
            <div className="hidden md:block h-40 rounded-sm formwork-grid border border-charcoal/10"></div>
          </div>

          <form onSubmit={handleSubmit} className="md:col-span-8 bg-white/40 border border-charcoal/10 rounded-sm p-6 md:p-8">
            {sent && (
              <div className="mb-6 bg-charcoal text-paper px-4 py-3 rounded-sm font-mono text-sm">
                Your email app should have opened with the details filled in — hit send and we'll be in touch.
              </div>
            )}
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className={labelCls} htmlFor="name">Name</label>
                <input required id="name" name="name" value={form.name} onChange={handleChange} className={inputCls} placeholder="Full name" />
              </div>
              <div>
                <label className={labelCls} htmlFor="phone">Phone</label>
                <input required id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} className={inputCls} placeholder="04xx xxx xxx" />
              </div>
              <div>
                <label className={labelCls} htmlFor="email">Email</label>
                <input required id="email" name="email" type="email" value={form.email} onChange={handleChange} className={inputCls} placeholder="you@example.com" />
              </div>
              <div>
                <label className={labelCls} htmlFor="service">Service required</label>
                <select id="service" name="service" value={form.service} onChange={handleChange} className={inputCls}>
                  <option>House Slabs</option>
                  <option>Driveways</option>
                  <option>Formwork</option>
                  <option>Other / Not sure</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls} htmlFor="address">Project / site address</label>
                <input required id="address" name="address" value={form.address} onChange={handleChange} className={inputCls} placeholder="Where's the job located?" />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls} htmlFor="details">Project details</label>
                <textarea id="details" name="details" rows="5" value={form.details} onChange={handleChange} className={inputCls} placeholder="Size of the area, timing, access, anything else we should know..."></textarea>
              </div>
            </div>
            <button type="submit" className="mt-6 bg-amber text-charcoal font-condensed font-bold uppercase tracking-wide px-8 py-3.5 rounded-sm hover:bg-charcoal hover:text-paper transition-colors">
              Send Quote Request
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
