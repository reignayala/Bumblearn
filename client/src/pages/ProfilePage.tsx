import { BookOpen, GraduationCap, LogOut } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";
import type { RoleChoice } from "../lib/api";

export function ProfilePage() {
  const { user, logout, switchRoles } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user) return null;

  const roleLabel = user.roles.includes("educator") && user.roles.includes("learner")
    ? "Learner & educator"
    : user.roles.includes("educator")
      ? "Educator"
      : "Learner";

  async function changeRole(roleChoice: RoleChoice) {
    setBusy(true);
    setError(null);
    try {
      await switchRoles(roleChoice);
      navigate("/onboarding", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update role");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="min-h-0 flex-1 overflow-y-auto pb-2">
      <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
        Your profile
      </h1>
      <p className="mt-0.5 text-sm text-slate">{user.email}</p>

      <div className="mt-6 overflow-hidden rounded-[1.75rem] bg-ink p-5 text-foam">
        <p className="font-display text-2xl font-bold">{user.name}</p>
        <p className="mt-1 text-sm text-foam/80">{roleLabel}</p>
        {user.bio && <p className="mt-3 text-sm leading-relaxed text-foam/85">{user.bio}</p>}
      </div>

      {user.educator && (
        <div className="mt-4 rounded-3xl bg-white/70 p-4 ring-1 ring-ink/8">
          <div className="mb-2 flex items-center gap-2 text-leaf">
            <GraduationCap className="h-4 w-4" />
            <h2 className="font-semibold text-ink">Educator</h2>
          </div>
          <p className="text-sm text-slate">
            {user.educator.subjects.join(" · ")} · ${user.educator.hourlyRate}/hr
          </p>
          {user.educator.pitch && (
            <p className="mt-1 text-sm text-muted">{user.educator.pitch}</p>
          )}
        </div>
      )}

      {user.learner && (
        <div className="mt-4 rounded-3xl bg-white/70 p-4 ring-1 ring-ink/8">
          <div className="mb-2 flex items-center gap-2 text-leaf">
            <BookOpen className="h-4 w-4" />
            <h2 className="font-semibold text-ink">Learner</h2>
          </div>
          <p className="text-sm text-slate">
            {user.learner.subjectsWanted.join(" · ")} · {user.learner.skillLevel}
          </p>
          {user.learner.learningGoals && (
            <p className="mt-1 text-sm text-muted">{user.learner.learningGoals}</p>
          )}
        </div>
      )}

      <div className="mt-6">
        <h2 className="mb-2 text-sm font-semibold text-ink">Switch role</h2>
        <div className="grid gap-2">
          {(
            [
              ["learner", "Learn only"],
              ["educator", "Educate only"],
              ["both", "Both"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              disabled={busy}
              onClick={() => void changeRole(id)}
              className="rounded-2xl bg-white/80 px-4 py-3 text-left text-sm font-medium text-ink ring-1 ring-ink/10 hover:bg-white disabled:opacity-50"
            >
              {label}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-muted">
          Switching roles asks you to rebuild the matching profile steps.
        </p>
      </div>

      {error && <p className="mt-3 text-sm text-coral">{error}</p>}

      <button
        type="button"
        onClick={() => {
          void logout().then(() => navigate("/welcome", { replace: true }));
        }}
        className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3.5 text-sm font-semibold text-coral ring-1 ring-coral/30 hover:bg-coral/10"
      >
        <LogOut className="h-4 w-4" />
        Log out
      </button>
    </section>
  );
}
