import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BrandMark } from "../components/BrandMark";
import { useAuth } from "../lib/auth";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const user = await login({ email, password });
      navigate(user.onboardingComplete ? "/" : "/onboarding", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col px-5 pb-10 pt-8">
      <BrandMark size="sm" />
      <h1 className="mt-8 font-display text-3xl font-bold tracking-tight text-ink">
        Welcome back
      </h1>
      <p className="mt-1 text-sm text-slate">Log in to keep matching and chatting.</p>

      <form className="mt-6 flex flex-1 flex-col" onSubmit={onSubmit}>
        <label className="mb-3 block text-sm">
          <span className="mb-1 block font-medium text-slate">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            className="w-full rounded-2xl border border-ink/10 bg-white px-3.5 py-3 outline-none focus:ring-2 focus:ring-leaf/40"
            required
          />
        </label>
        <label className="mb-3 block text-sm">
          <span className="mb-1 block font-medium text-slate">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className="w-full rounded-2xl border border-ink/10 bg-white px-3.5 py-3 outline-none focus:ring-2 focus:ring-leaf/40"
            required
          />
        </label>

        {error && <p className="text-sm text-coral">{error}</p>}

        <div className="mt-auto grid gap-3 pt-8">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-2xl bg-ink px-4 py-3.5 text-sm font-semibold text-foam hover:bg-ink-soft disabled:opacity-50"
          >
            {submitting ? "Signing in…" : "Log in"}
          </button>
          <p className="text-center text-sm text-muted">
            New here?{" "}
            <Link to="/signup" className="font-semibold text-ink hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
