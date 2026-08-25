export default function LoadingSpinner({ label = "Loading...", dark = false }) {
  return (
    <div className={"flex flex-col items-center justify-center gap-3 py-16 " + (dark ? "text-paper" : "text-charcoal")}>
      <div
        className="w-8 h-8 rounded-full border-2 border-amber/30 border-t-amber animate-spin"
        role="status"
        aria-label={label}
      />
      <div className="font-mono text-xs uppercase tracking-wide opacity-70">{label}</div>
    </div>
  );
}
