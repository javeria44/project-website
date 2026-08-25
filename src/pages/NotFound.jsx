import { Link } from "react-router-dom";
import Eyebrow from "../components/Eyebrow";

export default function NotFound() {
  return (
    <section className="bg-paper min-h-[70vh]">
      <div className="max-w-2xl mx-auto px-5 py-24 text-center">
        <Eyebrow>404</Eyebrow>
        <h1 className="font-condensed font-extrabold uppercase text-5xl mb-4">Page not found</h1>
        <p className="text-slab mb-8">That page doesn't exist — it might have been moved or the link's off.</p>
        <Link to="/" className="inline-block bg-amber text-charcoal font-condensed font-bold uppercase tracking-wide px-8 py-3.5 rounded-sm hover:bg-charcoal hover:text-paper transition-colors">
          Back to Home
        </Link>
      </div>
    </section>
  );
}
