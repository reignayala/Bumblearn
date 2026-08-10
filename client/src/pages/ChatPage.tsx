import { ArrowLeft, CalendarPlus, Send } from "lucide-react";
import type { ReactNode } from "react";
import { Link, useParams } from "react-router-dom";

export function ChatPage() {
  const { matchId } = useParams();

  return (
    <section className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="mb-4 flex items-center gap-3">
        <Link
          to="/matches"
          className="rounded-full bg-white/80 p-2 text-ink ring-1 ring-ink/10"
          aria-label="Back to matches"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="truncate font-display text-xl font-bold text-ink">Chat</h1>
          <p className="text-xs text-muted">Match {matchId}</p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-2xl bg-spark/90 px-3 py-2 text-xs font-semibold text-ink hover:bg-spark"
        >
          <CalendarPlus className="h-3.5 w-3.5" />
          Schedule
        </button>
      </div>

      <div className="flex flex-1 flex-col justify-end rounded-[1.75rem] bg-white/60 p-4 ring-1 ring-ink/8">
        <div className="space-y-3">
          <Bubble mine={false}>Hey! Excited to learn with you 👋</Bubble>
          <Bubble mine>Likewise — does Thursday evening work?</Bubble>
          <Bubble mine={false}>Thursday 7pm works great. I&apos;ll send a video link.</Bubble>
        </div>

        <form
          className="mt-4 flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <input
            type="text"
            placeholder="Message… (coming soon)"
            disabled
            className="flex-1 rounded-2xl border border-ink/10 bg-foam px-3.5 py-3 text-sm outline-none disabled:opacity-70"
          />
          <button
            type="submit"
            disabled
            className="rounded-2xl bg-ink p-3 text-foam opacity-50"
            aria-label="Send"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
        <p className="mt-2 text-center text-[11px] text-muted">
          Socket.io chat lands in the next milestone.
        </p>
      </div>
    </section>
  );
}

function Bubble({ children, mine }: { children: ReactNode; mine?: boolean }) {
  return (
    <div
      className={[
        "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
        mine
          ? "ml-auto bg-ink text-foam rounded-br-md"
          : "mr-auto bg-mist text-ink rounded-bl-md",
      ].join(" ")}
    >
      {children}
    </div>
  );
}
