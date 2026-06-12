import { useState } from "react";
import { useAuth } from "../lib/auth";
import { LuArrowRight, LuLoader } from "react-icons/lu";

export function Login({ onSwitchToSignup }: { onSwitchToSignup: () => void }) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: authError } = await signIn(email, password);

    if (authError) {
      setError(authError.message || "Login failed");
    }
    setLoading(false);
  };

  return (
    <div className="mx-auto max-w-md space-y-6 rounded-3xl border border-zinc-800 bg-zinc-950/60 p-8 text-zinc-300 shadow-xl shadow-black/20">
      <div className="space-y-2">
        <h1 className="text-2xl font-display font-semibold tracking-tight text-zinc-100">
          Sign in to onee.cloud
        </h1>
        <p className="text-sm text-zinc-400">
          Sign in with your email to manage your PathCompanion characters
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

        {error && (
          <div className="rounded-xl bg-red-950/40 border border-red-900/40 p-3 text-sm text-red-200">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl border border-amber-300/30 bg-amber-300/10 px-3 py-2.5 text-sm font-semibold text-amber-200 transition hover:border-amber-300 hover:bg-amber-300/15 disabled:cursor-not-allowed disabled:opacity-40 flex items-center justify-center gap-2"
        >
          {loading ? <LuLoader className="animate-spin size-4" /> : <LuArrowRight className="size-4" />}
          Sign in
        </button>
      </form>

      <div className="text-center">
        <p className="text-sm text-zinc-400">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToSignup}
            className="text-amber-300 hover:text-amber-200 font-semibold"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}
