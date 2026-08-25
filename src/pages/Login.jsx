import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Eyebrow from "../components/Eyebrow";
import { useAuth } from "../context/AuthContext";

const inputCls = "w-full bg-paper border border-charcoal/15 rounded-sm px-4 py-3 text-charcoal placeholder:text-slab/50 focus:border-amber transition-colors";
const labelCls = "block font-mono text-xs uppercase tracking-wide text-slab/70 mb-1.5";

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/dashboard";

  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await signIn(form);
      toast.success("Welcome back");
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "Could not log in. Check your details and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="bg-paper min-h-[70vh]">
      <div className="max-w-md mx-auto px-5 py-20">
        <Eyebrow>Account</Eyebrow>
        <h1 className="font-condensed font-extrabold uppercase text-4xl mb-8">Log in</h1>

        {error && (
          <div className="mb-6 bg-rebar/10 border border-rebar/30 text-rebar px-4 py-3 rounded-sm font-mono text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white/40 border border-charcoal/10 rounded-sm p-6 md:p-8 space-y-5">
          <div>
            <label className={labelCls} htmlFor="email">Email</label>
            <input required id="email" name="email" type="email" value={form.email} onChange={handleChange} className={inputCls} placeholder="you@example.com" />
          </div>
          <div>
            <label className={labelCls} htmlFor="password">Password</label>
            <input required id="password" name="password" type="password" value={form.password} onChange={handleChange} className={inputCls} placeholder="••••••••" />
          </div>
          <div className="text-right">
            <Link to="/forgot-password" className="font-mono text-xs text-slab hover:text-amber transition-colors underline decoration-amber/50">
              Forgot password?
            </Link>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-amber text-charcoal font-condensed font-bold uppercase tracking-wide px-8 py-3.5 rounded-sm hover:bg-charcoal hover:text-paper transition-colors disabled:opacity-60"
          >
            {submitting ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="mt-6 text-center text-slab font-body">
          Don't have an account?{" "}
          <Link to="/signup" className="text-charcoal font-semibold underline decoration-amber decoration-2 underline-offset-2">
            Sign up
          </Link>
        </p>
      </div>
    </section>
  );
}
