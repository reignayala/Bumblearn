import { GraduationCap, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

const PLACEHOLDER_MATCHES = [
  {
    id: "m1",
    name: "Maya Chen",
    preview: "Happy to start with derivatives this week!",
    subjects: ["Calculus"],
    time: "2h ago",
    unread: true,
  },
  {
    id: "m2",
    name: "Sofia Alvarez",
    preview: "¿Quieres practicar mañana por la mañana?",
    subjects: ["Spanish"],
    time: "Yesterday",
    unread: false,
  },
];

export function MatchesPage() {
  return (
    <section className="min-h-0 flex-1 overflow-y-auto pb-2">
      <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
        Matches
      </h1>
      <p className="mt-0.5 text-sm text-slate">
        Mutual interest unlocks chat and session scheduling.
      </p>

      {PLACEHOLDER_MATCHES.length === 0 ? (
        <EmptyMatches />
      ) : (
        <ul className="mt-5 space-y-2">
          {PLACEHOLDER_MATCHES.map((match) => (
            <li key={match.id}>
              <Link
                to={`/matches/${match.id}`}
                className="flex items-center gap-3 rounded-3xl bg-white/70 p-3 ring-1 ring-ink/8 transition hover:bg-white"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-ink font-display text-xl font-bold text-spark">
                  {match.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="truncate font-semibold text-ink">{match.name}</h2>
                    <span className="shrink-0 text-[11px] text-muted">{match.time}</span>
                  </div>
                  <p
                    className={[
                      "truncate text-sm",
                      match.unread ? "font-medium text-ink-soft" : "text-muted",
                    ].join(" ")}
                  >
                    {match.preview}
                  </p>
                  <p className="mt-0.5 text-[11px] text-leaf">{match.subjects.join(" · ")}</p>
                </div>
                {match.unread && (
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-leaf" aria-label="Unread" />
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-6 inline-flex items-center gap-1.5 text-xs text-muted">
        <MessageCircle className="h-3.5 w-3.5" />
        Real-time chat wires up after auth + matching.
      </p>
    </section>
  );
}

function EmptyMatches() {
  return (
    <div className="mt-10 flex flex-col items-center rounded-[1.75rem] border border-dashed border-ink/15 bg-white/50 px-6 py-12 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-mist text-leaf">
        <GraduationCap className="h-6 w-6" />
      </div>
      <h2 className="font-display text-xl font-bold text-ink">No matches yet</h2>
      <p className="mt-1 max-w-xs text-sm text-slate">
        Keep discovering — when both sides are interested, they&apos;ll show up here.
      </p>
      <Link
        to="/"
        className="mt-5 rounded-2xl bg-ink px-4 py-3 text-sm font-semibold text-foam hover:bg-ink-soft"
      >
        Back to discover
      </Link>
    </div>
  );
}
