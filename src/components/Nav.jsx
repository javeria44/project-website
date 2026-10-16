import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

function CartIcon({ className = "" }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M3 4h2l2.4 12.4a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 2-1.6L21 8H6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="10" cy="21" r="1.4" fill="currentColor"/>
      <circle cx="17" cy="21" r="1.4" fill="currentColor"/>
    </svg>
  );
}

export default function Nav() {
  const [open, setOpen] = useState(false);
  const { cartCount } = useCart();
  const { isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();

  const links = [
    ["About", "/#about"],
    ["Services", "/#services"],
    ["Work", "/#work"],
    ["Hours", "/#hours"],
    ["Get a Quote", "/#quote"],
  ];

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Logged out");
      setOpen(false);
      navigate("/");
    } catch (err) {
      toast.error(err.message || "Could not log out");
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-charcoal/95 backdrop-blur border-b border-paper/10">
      <div className="max-w-6xl mx-auto px-5 md:px-8 h-20 flex items-center justify-between">
        <Link to="/#top" aria-label="Shaharyar Concrete home"><Logo variant="light" /></Link>
        <nav className="hidden md:flex items-center gap-8 font-condensed text-[0.95rem] tracking-wide uppercase text-paper/80">
          {links.map(([label, href]) => (
            <a key={href} href={href} className="hover:text-amber transition-colors">{label}</a>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-5">
          <a href="tel:0470308312" className="font-mono text-sm text-paper/90 hover:text-amber transition-colors">047&nbsp;030&nbsp;8312</a>

          <Link to="/cart" aria-label="View cart" className="relative text-paper/90 hover:text-amber transition-colors">
            <CartIcon />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-amber text-charcoal text-[0.65rem] font-mono font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <>
              <NavLink to="/dashboard" className="font-condensed text-[0.95rem] tracking-wide uppercase text-paper/80 hover:text-amber transition-colors">
                Account
              </NavLink>
              <button onClick={handleLogout} className="font-condensed text-[0.95rem] tracking-wide uppercase text-paper/80 hover:text-amber transition-colors">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="font-condensed text-[0.95rem] tracking-wide uppercase text-paper/80 hover:text-amber transition-colors">
              Login
            </Link>
          )}

          <a href="/#quote" className="bg-amber text-charcoal font-condensed font-bold uppercase tracking-wide px-5 py-2.5 rounded-sm hover:bg-paper transition-colors">Get a Quote</a>
        </div>
        <div className="flex items-center gap-4 md:hidden">
          <Link to="/cart" aria-label="View cart" className="relative text-paper">
            <CartIcon />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-amber text-charcoal text-[0.65rem] font-mono font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
          <button className="text-paper" onClick={() => setOpen(!open)} aria-label="Toggle menu" aria-expanded={open}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden bg-charcoal border-t border-paper/10 px-5 py-5 flex flex-col gap-4 font-condensed text-lg uppercase tracking-wide text-paper/90">
          {links.map(([label, href]) => (
            <a key={href} href={href} onClick={() => setOpen(false)} className="hover:text-amber transition-colors">{label}</a>
          ))}
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" onClick={() => setOpen(false)} className="hover:text-amber transition-colors">Account</Link>
              <button onClick={handleLogout} className="text-left hover:text-amber transition-colors">Logout</button>
            </>
          ) : (
            <Link to="/login" onClick={() => setOpen(false)} className="hover:text-amber transition-colors">Login</Link>
          )}
          <a href="tel:0470308312" className="font-mono text-sm text-amber">Call 0470308312</a>
        </div>
      )}
    </header>
  );
}
