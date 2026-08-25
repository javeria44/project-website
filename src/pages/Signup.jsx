import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Eyebrow from "../components/Eyebrow";
import { useAuth } from "../context/AuthContext";

const inputCls = "w-full bg-paper border border-charcoal/15 rounded-sm px-4 py-3 text-charcoal placeholder:text-slab/50 focus:border-amber transition-colors";
const labelCls = "block font-mono text-xs uppercase tracking-wide text-slab/70 mb-1.5";

export default function Signup() {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ fullName: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [confirmSent, setConfirmSent] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setSubmitting(true);
    try {
      const data = await signUp(form);
      if (data?.session) {
        toast.success("Account created");
        navigate("/dashboard", { replace: true });
      } else {
        // Email confirmation is required
        setConfirmSent(true);
      }
    } catch (err) {
      setError(err.message || "Could not create account. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (confirmSent) {
    return (
      <section className="bg-paper min-h-[70vh]">
        <div className="max-w-md mx-auto px-5 py-24 text-center">
          <Eyebrow>Almost there</Eyebrow>
          <h1 className="font-condensed font-extrabold uppercase text-3xl mb-4">Check your email</h1>
          <p className="text-slab">
            We've sent a confirmation link to <strong className="text-charcoal">{form.email}</strong>.
            Click it to activate your account, then log in.
          </p>
          <Link to="/login" className="inline-block mt-8 bg-amber text-charcoal font-condensed font-bold uppercase tracking-wide px-8 py-3.5 rounded-sm hover:bg-charcoal hover:text-paper transition-colors">
            Go to login
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-paper min-h-[70vh]">
      <div className="max-w-md mx-auto px-5 py-20">
        <Eyebrow>Account</Eyebrow>
        <h1 className="font-condensed font-extrabold uppercase text-4xl mb-8">Create an account</h1>

        {error && (
          <div className="mb-6 bg-rebar/10 border border-rebar/30 text-rebar px-4 py-3 rounded-sm font-mono text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white/40 border border-charcoal/10 rounded-sm p-6 md:p-8 space-y-5">
          <div>
            <label className={labelCls} htmlFor="fullName">Full name</label>
            <input required id="fullName" name="fullName" value={form.fullName} onChange={handleChange} className={inputCls} placeholder="Full name" />
          </div>
          <div>
            <label className={labelCls} htmlFor="email">Email</label>
            <input required id="email" name="email" type="email" value={form.email} onChange={handleChange} className={inputCls} placeholder="you@example.com" />
          </div>
          <div>
            <label className={labelCls} htmlFor="phone">Phone (optional)</label>
            <input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} className={inputCls} placeholder="04xx xxx xxx" />
          </div>
          <div>
            <label className={labelCls} htmlFor="password">Password</label>
            <input required id="password" name="password" type="password" value={form.password} onChange={handleChange} className={inputCls} placeholder="At least 6 characters" />
          </div>
          <div>
            <label className={labelCls} htmlFor="confirmPassword">Confirm password</label>
            <input required id="confirmPassword" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} className={inputCls} placeholder="••••••••" />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-amber text-charcoal font-condensed font-bold uppercase tracking-wide px-8 py-3.5 rounded-sm hover:bg-charcoal hover:text-paper transition-colors disabled:opacity-60"
          >
            {submitting ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-6 text-center text-slab font-body">
          Already have an account?{" "}
          <Link to="/login" className="text-charcoal font-semibold underline decoration-amber decoration-2 underline-offset-2">
            Log in
          </Link>
        </p>
      </div>
    </section>
  );
}
