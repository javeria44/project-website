import { useState } from "react";
import { Link } from "react-router-dom";
import Eyebrow from "../components/Eyebrow";
import { useAuth } from "../context/AuthContext";

const inputCls = "w-full bg-paper border border-charcoal/15 rounded-sm px-4 py-3 text-charcoal placeholder:text-slab/50 focus:border-amber transition-colors";
const labelCls = "block font-mono text-xs uppercase tracking-wide text-slab/70 mb-1.5";

export default function ForgotPassword() {
  const { sendPasswordReset } = useAuth();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await sendPasswordReset(email);
      setSent(true);
    } catch (err) {
      setError(err.message || "Could not send reset email. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="bg-paper min-h-[70vh]">
      <div className="max-w-md mx-auto px-5 py-20">
        <Eyebrow>Account</Eyebrow>
        <h1 className="font-condensed font-extrabold uppercase text-4xl mb-4">Reset your password</h1>
        <p className="text-slab mb-8">Enter your email and we'll send you a link to reset your password.</p>

        {error && (
          <div className="mb-6 bg-rebar/10 border border-rebar/30 text-rebar px-4 py-3 rounded-sm font-mono text-sm">
            {error}
          </div>
        )}

        {sent ? (
          <div className="bg-charcoal text-paper px-5 py-6 rounded-sm font-mono text-sm">
            If an account exists for <strong className="text-amber">{email}</strong>, a reset link is on its way.
            Check your inbox (and spam folder).
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white/40 border border-charcoal/10 rounded-sm p-6 md:p-8 space-y-5">
            <div>
              <label className={labelCls} htmlFor="email">Email</label>
              <input required id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} placeholder="you@example.com" />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-amber text-charcoal font-condensed font-bold uppercase tracking-wide px-8 py-3.5 rounded-sm hover:bg-charcoal hover:text-paper transition-colors disabled:opacity-60"
            >
              {submitting ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-slab font-body">
          Remembered it?{" "}
          <Link to="/login" className="text-charcoal font-semibold underline decoration-amber decoration-2 underline-offset-2">
            Log in
          </Link>
        </p>
      </div>
    </section>
  );
}
