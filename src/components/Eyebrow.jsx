/* ---------- Section label ---------- */
export default function Eyebrow({ children, dark }) {
  return (
    <div className={"flex items-center gap-3 mb-4 font-mono text-xs tracking-[0.3em] uppercase " + (dark ? "text-paper/60" : "text-slab/70")}>
      <span className="w-8 h-[2px] bg-amber inline-block"></span>
      {children}
    </div>
  );
}
