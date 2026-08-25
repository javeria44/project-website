/* ---------- Logo ---------- */
export default function Logo({ variant = "light", className = "" }) {
  const ink = variant === "light" ? "#EAE7DF" : "#201F1C";
  const amber = "#E8A233";
  return (
    <div className={"flex items-center gap-3 " + className}>
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect x="1" y="1" width="42" height="42" rx="4" stroke={ink} strokeWidth="1.5" opacity="0.5"/>
        {/* poured slab shape */}
        <path d="M6 30 L14 12 H30 L38 30 Z" fill={ink} opacity="0.12"/>
        <path d="M6 30 L14 12 H30 L38 30" stroke={ink} strokeWidth="2" strokeLinejoin="round"/>
        {/* trowel line across the slab */}
        <path d="M9 27 H35" stroke={amber} strokeWidth="2.5" strokeLinecap="round"/>
        {/* S / C monogram mark, subtle */}
        <path d="M18 21c0-1.7 1.6-2.5 3.4-2.5 1.5 0 2.6.6 3.1 1.4M18 21c0 1.7 1.6 2.3 3.4 2.3 1.9 0 3.4-.8 3.4-2.4" stroke={ink} strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
      <div className="leading-none">
        <div className="font-condensed font-extrabold tracking-wide text-[1.05rem]" style={{color: ink}}>SHAHARYAR</div>
        <div className="font-mono text-[0.62rem] tracking-[0.25em]" style={{color: amber}}>CONCRETE&nbsp;PTY&nbsp;LTD</div>
      </div>
    </div>
  );
}
