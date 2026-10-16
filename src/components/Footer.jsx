import Logo from "./Logo";

/* ---------- Footer ---------- */
export default function Footer() {
  return (
    <footer className="bg-charcoal text-paper/60">
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <Logo variant="light" />
        <div className="font-mono text-xs leading-relaxed">
          <div>56 Argyle Street, Fawkner VIC 3060</div>
          <div>0470308312 · ranahussnain112a@gmail.com</div>
        </div>
        <div className="font-mono text-xs">&copy; {new Date().getFullYear()} RANA & CO Pty Ltd</div>
      </div>
    </footer>
  );
}
