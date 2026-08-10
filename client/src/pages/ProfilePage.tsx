import { BookOpen, GraduationCap } from "lucide-react";
import type { ReactNode } from "react";

export function ProfilePage() {
  return (
    <section>
      <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
        Your profile
      </h1>
      <p className="mt-0.5 text-sm text-slate">
        Onboarding and settings will live here after auth is wired up.
      </p>

      <div className="mt-6 overflow-hidden rounded-[1.75rem] bg-ink p-5 text-foam">
        <p className="font-display text-2xl font-bold">Learner · preview</p>
        <p className="mt-1 text-sm text-foam/75">
          You&apos;re browsing as a learner discovering educators. Role switching and profile
          editing arrive with the auth milestone.
        </p>
      </div>

      <div className="mt-4 grid gap-3">
        <PlaceholderRow
          icon={<GraduationCap className="h-5 w-5" />}
          title="Educator profile"
          body="Subjects, rate, teaching style, availability"
        />
        <PlaceholderRow
          icon={<BookOpen className="h-5 w-5" />}
          title="Learner profile"
          body="Goals, budget, preferred format, skill level"
        />
      </div>
    </section>
  );
}

function PlaceholderRow({
  icon,
  title,
  body,
}: {
  icon: ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-3xl bg-white/70 p-4 ring-1 ring-ink/8">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-mist text-leaf">
        {icon}
      </div>
      <div>
        <h2 className="font-semibold text-ink">{title}</h2>
        <p className="text-sm text-muted">{body}</p>
      </div>
    </div>
  );
}
