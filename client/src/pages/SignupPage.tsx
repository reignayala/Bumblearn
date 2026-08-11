import { useState, type FormEvent, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BrandMark } from "../components/BrandMark";
import { useAuth } from "../lib/auth";
import type { RoleChoice } from "../lib/api";
import { BookOpen, Check, GraduationCap, Users } from "lucide-react";

const ROLE_OPTIONS: {
  id: RoleChoice;
  title: string;
  body: string;
  icon: typeof BookOpen;
}[] = [
  {
    id: "learner",
    title: "I want to learn",
    body: "Find tutors, teachers, and mentors for the subjects you need.",
    icon: BookOpen,
  },
  {
    id: "educator",
    title: "I want to educate",
    body: "Share what you teach and match with motivated learners.",
    icon: GraduationCap,
  },
  {
    id: "both",
    title: "Both",
    body: "Learn in some subjects and teach in others — switch anytime.",
    icon: Users,
  },
];

export function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleChoice, setRoleChoice] = useState<RoleChoice | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (step === 1) {
      if (!name.trim() || !email.trim() || password.length < 6) {
        setError("Enter your name, email, and a password with 6+ characters.");
        return;
      }
      setError(null);
      setStep(2);
      return;
    }
    if (!roleChoice) {
      setError("Choose whether you want to learn, educate, or both.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await signup({ name, email, password, roleChoice });
      navigate("/onboarding", { replace: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Signup failed";
      if (message.includes("405")) {
        setError(
          "The live API is not connected yet. Deploy the Render backend and set BUMBLEARN_API_URL in repo settings.",
        );
      } else {
        setError(message);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col px-5 pb-10 pt-8">
      <BrandMark size="sm" />
      <h1 className="mt-8 font-display text-3xl font-bold tracking-tight text-ink">
        {step === 1 ? "Create your account" : "How will you use Bumblearn?"}
      </h1>
      <p className="mt-1 text-sm text-slate">
        {step === 1
          ? "Sign up with email — Google OAuth comes next."
          : "You can change this later in Profile."}
      </p>

      <form className="mt-6 flex flex-1 flex-col" onSubmit={onSubmit}>
        {step === 1 ? (
          <div className="space-y-3">
            <Field label="Name">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                className="field"
                placeholder="Alex Rivera"
              />
            </Field>
            <Field label="Email">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="field"
                placeholder="you@school.edu"
              />
            </Field>
            <Field label="Password">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                className="field"
                placeholder="At least 6 characters"
              />
            </Field>
          </div>
        ) : (
          <div className="space-y-3">
            {ROLE_OPTIONS.map(({ id, title, body, icon: Icon }) => {
              const active = roleChoice === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setRoleChoice(id)}
                  className={[
                    "flex w-full items-start gap-3 rounded-3xl p-4 text-left transition ring-1",
                    active
                      ? "bg-mist ring-leaf shadow-sm"
                      : "bg-white/70 ring-ink/8 hover:bg-white",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl",
                      active ? "bg-leaf text-white" : "bg-mist text-leaf",
                    ].join(" ")}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-ink">{title}</span>
                      {active && <Check className="h-4 w-4 text-leaf" />}
                    </span>
                    <span className="mt-0.5 block text-sm text-muted">{body}</span>
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {error && <p className="mt-4 text-sm text-coral">{error}</p>}

        <div className="mt-auto grid gap-3 pt-8">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-2xl bg-ink px-4 py-3.5 text-sm font-semibold text-foam transition hover:bg-ink-soft disabled:opacity-50"
          >
            {submitting
              ? "Creating account…"
              : step === 1
                ? "Continue"
                : "Continue to profile"}
          </button>
          {step === 2 && (
            <button
              type="button"
              onClick={() => setStep(1)}
              className="rounded-2xl px-4 py-3 text-sm font-medium text-slate hover:bg-white/60"
            >
              Back
            </button>
          )}
          {step === 1 && (
            <p className="text-center text-sm text-muted">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-ink underline-offset-2 hover:underline">
                Log in
              </Link>
            </p>
          )}
        </div>
      </form>

      <style>{`
        .field {
          width: 100%;
          border-radius: 1rem;
          border: 1px solid color-mix(in oklab, var(--color-ink) 12%, transparent);
          background: white;
          padding: 0.75rem 0.9rem;
          outline: none;
        }
        .field:focus {
          box-shadow: 0 0 0 3px color-mix(in oklab, var(--color-leaf) 35%, transparent);
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-slate">{label}</span>
      {children}
    </label>
  );
}
