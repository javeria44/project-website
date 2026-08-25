import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Eyebrow from "../components/Eyebrow";
import { useAuth } from "../context/AuthContext";

const inputCls = "w-full bg-paper border border-charcoal/15 rounded-sm px-4 py-3 text-charcoal placeholder:text-slab/50 focus:border-amber transition-colors";
const labelCls = "block font-mono text-xs uppercase tracking-wide text-slab/70 mb-1.5";

// Supabase redirects here (?type=recovery) after the user clicks the emailed
// reset link. Supabase's client automatically exchanges the URL token for a
// session, so by the time this page mounts the user is already signed in
// and updatePassword() can be called directly.
export default function ResetPassword() {
  const { updatePassword } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setSubmitting(true);
    try {
      await updatePassword(password);
      toast.success("Password updated — you're all set");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Could not update password. Request a new reset link and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="bg-paper min-h-[70vh]">
      <div className="max-w-md mx-auto px-5 py-20">
        <Eyebrow>Account</Eyebrow>
        <h1 className="font-condensed font-extrabold uppercase text-4xl mb-8">Set a new password</h1>

        {error && (
          <div className="mb-6 bg-rebar/10 border border-rebar/30 text-rebar px-4 py-3 rounded-sm font-mono text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white/40 border border-charcoal/10 rounded-sm p-6 md:p-8 space-y-5">
          <div>
            <label className={labelCls} htmlFor="password">New password</label>
            <input required id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputCls} placeholder="At least 6 characters" />
          </div>
          <div>
            <label className={labelCls} htmlFor="confirmPassword">Confirm new password</label>
            <input required id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={inputCls} placeholder="••••••••" />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-amber text-charcoal font-condensed font-bold uppercase tracking-wide px-8 py-3.5 rounded-sm hover:bg-charcoal hover:text-paper transition-colors disabled:opacity-60"
          >
            {submitting ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </section>
  );
}
