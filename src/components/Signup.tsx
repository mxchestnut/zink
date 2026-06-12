import { useState } from "react";
import { useAuth } from "../lib/auth";
import { LuArrowRight, LuLoader } from "react-icons/lu";

export function Signup({ onSwitchToLogin }: { onSwitchToLogin: () => void }) {
  const { signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    const { error: authError } = await signUp(email, password);

    if (authError) {
      setError(authError.message || "Signup failed");
    } else {
      setSuccess(true);
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        setSuccess(false);
        onSwitchToLogin();
      }, 2000);
    }
    setLoading(false);
  };

  return (
    <div className="mx-auto max-w-md space-y-6 rounded-3xl border border-zinc-800 bg-zinc-950/60 p-8 text-zinc-300 shadow-xl shadow-black/20">
      <div className="space-y-2">
        <h1 className="text-2xl font-display font-semibold tracking-tight text-zinc-100">
          Create your account
        </h1>
        <p className="text-sm text-zinc-400">
          Sign up to save and manage your PathCompanion characters
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="w-full rounded-xl border border-zinc-700/80 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition focus:border-amber-300/70 focus:ring-2 focus:ring-amber-300/10"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-zinc-300 mb-2">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="w-full rounded-xl border border-zinc-700/80 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition focus:border-amber-300/70 focus:ring-2 focus:ring-amber-300/10"
          />
        </div>

        <div>
          <label htmlFor="confirm" className="block text-sm font-medium text-zinc-300 mb-2">
            Confirm Password
          </label>
          <input
            id="confirm"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="w-full rounded-xl border border-zinc-700/80 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition focus:border-amber-300/70 focus:ring-2 focus:ring-amber-300/10"
          />
        </div>

        {error && (
          <div className="rounded-xl bg-red-950/40 border border-red-900/40 p-3 text-sm text-red-200">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-xl bg-green-950/40 border border-green-900/40 p-3 text-sm text-green-200">
            Account created! Redirecting to sign in...
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl border border-amber-300/30 bg-amber-300/10 px-3 py-2.5 text-sm font-semibold text-amber-200 transition hover:border-amber-300 hover:bg-amber-300/15 disabled:cursor-not-allowed disabled:opacity-40 flex items-center justify-center gap-2"
        >
          {loading ? <LuLoader className="animate-spin size-4" /> : <LuArrowRight className="size-4" />}
          Create account
        </button>
      </form>

      <div className="text-center">
        <p className="text-sm text-zinc-400">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-amber-300 hover:text-amber-200 font-semibold"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}
