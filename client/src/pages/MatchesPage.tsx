import { GraduationCap, MessageCircle, WifiOff } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchMatches, type ApiMatch } from "../lib/api";
import { isDemoMode } from "../lib/demo";
import { getSocket, onMatchUpdated } from "../lib/socket";

function relativeTime(iso: string) {
  const delta = Date.now() - new Date(iso).getTime();
  const mins = Math.round(delta / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

export function MatchesPage() {
  const [matches, setMatches] = useState<ApiMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchMatches()
      .then((data) => {
        if (cancelled) return;
        setMatches(data.matches);
        setError(null);
      })
      .catch((err: Error) => {
        if (cancelled) return;
        setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    if (isDemoMode) {
      return () => {
        cancelled = true;
      };
    }

    getSocket();
    const unsubscribe = onMatchUpdated((event) => {
      setMatches((prev) => {
        const next = prev.map((match) =>
          match.id === event.matchId
            ? { ...match, lastMessage: event.lastMessage }
            : match,
        );
        return [...next].sort((a, b) => {
          const aTime = a.lastMessage?.sentAt ?? a.createdAt;
          const bTime = b.lastMessage?.sentAt ?? b.createdAt;
          return bTime.localeCompare(aTime);
        });
      });
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  return (
    <section className="min-h-0 flex-1 overflow-y-auto pb-2">
      <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
        Matches
      </h1>
      <p className="mt-0.5 text-sm text-slate">
        Mutual interest unlocks chat and session scheduling.
      </p>

      {loading && (
        <p className="mt-8 text-center text-sm text-muted">Loading matches…</p>
      )}

      {!loading && error && (
        <div className="mt-8 flex flex-col items-center rounded-[1.75rem] border border-dashed border-coral/40 bg-white/60 px-6 py-10 text-center">
          <WifiOff className="mb-3 h-6 w-6 text-coral" />
          <h2 className="font-display text-xl font-bold text-ink">Can&apos;t reach chat API</h2>
          <p className="mt-1 max-w-xs text-sm text-slate">
            Start the server with <code className="text-ink">npm run dev:server</code>, then
            refresh.
          </p>
          <p className="mt-2 text-xs text-coral">{error}</p>
        </div>
      )}

      {!loading && !error && matches.length === 0 && <EmptyMatches />}

      {!loading && !error && matches.length > 0 && (
        <ul className="mt-5 space-y-2">
          {matches.map((match) => {
            const preview = match.lastMessage?.content ?? "Say hello and plan a session.";
            const time = match.lastMessage?.sentAt ?? match.createdAt;
            return (
              <li key={match.id}>
                <Link
                  to={`/matches/${match.id}`}
                  className="flex items-center gap-3 rounded-3xl bg-white/70 p-3 ring-1 ring-ink/8 transition hover:bg-white"
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-ink font-display text-xl font-bold text-spark">
                    {match.photoInitial}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h2 className="truncate font-semibold text-ink">{match.peerName}</h2>
                      <span className="shrink-0 text-[11px] text-muted">
                        {relativeTime(time)}
                      </span>
                    </div>
                    <p className="truncate text-sm text-ink-soft">{preview}</p>
                    <p className="mt-0.5 text-[11px] text-leaf">
                      {match.subjects.join(" · ") || "Matched"}
                    </p>
                  </div>
                  <MessageCircle className="h-4 w-4 shrink-0 text-muted" />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
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
