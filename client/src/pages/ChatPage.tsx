import { ArrowLeft, CalendarPlus, Send } from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { Link, useParams } from "react-router-dom";
import { ScheduleSessionModal } from "../components/chat/ScheduleSessionModal";
import {
  fetchMatchThread,
  type ApiMatch,
  type ApiMessage,
  type DemoIdentity,
} from "../lib/api";
import { isDemoMode } from "../lib/demo";
import { getSocket, onChatMessage, sendChatMessage } from "../lib/socket";

function formatTime(iso: string) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return "";
  }
}

function buildScheduleMessage(details: {
  when: string;
  link: string;
  notes: string;
}) {
  const whenLabel = details.when
    ? new Date(details.when).toLocaleString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : "TBD";
  const notes = details.notes.trim() ? `\nNotes: ${details.notes.trim()}` : "";
  return `Session proposal\nWhen: ${whenLabel}\nLink: ${details.link.trim() || "TBD"}${notes}`;
}

export function ChatPage() {
  const { matchId = "" } = useParams();
  const [match, setMatch] = useState<ApiMatch | null>(null);
  const [me, setMe] = useState<DemoIdentity | null>(null);
  const [messages, setMessages] = useState<ApiMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [sending, setSending] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const seenIds = useRef(new Set<string>());

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    setError(null);
    seenIds.current = new Set();

    fetchMatchThread(matchId)
      .then((data) => {
        if (cancelled) return;
        setMatch(data.match);
        setMe(data.me);
        setMessages(data.messages);
        data.messages.forEach((m) => seenIds.current.add(m.id));
        setStatus("ready");
      })
      .catch((err: Error) => {
        if (cancelled) return;
        setError(err.message);
        setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [matchId]);

  useEffect(() => {
    if (status !== "ready" || !matchId || isDemoMode) return;
    const socket = getSocket();
    if (!socket) return;
    socket.emit("join_match", matchId);

    const unsubscribe = onChatMessage((message) => {
      if (message.matchId !== matchId) return;
      if (seenIds.current.has(message.id)) return;
      seenIds.current.add(message.id);
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.emit("leave_match", matchId);
      unsubscribe();
    };
  }, [matchId, status]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const canSend = useMemo(
    () => draft.trim().length > 0 && !sending && status === "ready",
    [draft, sending, status],
  );

  async function handleSend(content: string) {
    const text = content.trim();
    if (!text || !matchId) return;
    setSending(true);
    setError(null);
    try {
      const message = await sendChatMessage(matchId, text);
      if (!seenIds.current.has(message.id)) {
        seenIds.current.add(message.id);
        setMessages((prev) => [...prev, message]);
      }
      setDraft("");
      if (isDemoMode && match) {
        window.setTimeout(async () => {
          const thread = await fetchMatchThread(matchId);
          setMessages(thread.messages);
          thread.messages.forEach((m) => seenIds.current.add(m.id));
        }, 1000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send message");
    } finally {
      setSending(false);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void handleSend(draft);
  }

  if (status === "loading") {
    return (
      <section className="flex min-h-0 flex-1 items-center justify-center text-sm text-muted">
        Opening chat…
      </section>
    );
  }

  if (status === "error" || !match || !me) {
    return (
      <section className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 px-4 text-center">
        <p className="text-sm text-coral">{error ?? "Chat unavailable"}</p>
        <p className="max-w-xs text-xs text-muted">
          Make sure the API is running (`npm run dev:server`), then try again.
        </p>
        <Link to="/matches" className="rounded-2xl bg-ink px-4 py-2.5 text-sm font-semibold text-foam">
          Back to matches
        </Link>
      </section>
    );
  }

  return (
    <section className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="mb-3 flex shrink-0 items-center gap-3">
        <Link
          to="/matches"
          className="rounded-full bg-white/80 p-2 text-ink ring-1 ring-ink/10"
          aria-label="Back to matches"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="truncate font-display text-xl font-bold text-ink">
            {match.peerName}
          </h1>
          <p className="truncate text-xs text-muted">
            {match.subjects.join(" · ") || "Matched educator"}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setScheduleOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-2xl bg-spark/90 px-3 py-2 text-xs font-semibold text-ink hover:bg-spark"
        >
          <CalendarPlus className="h-3.5 w-3.5" />
          Schedule
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col rounded-[1.75rem] bg-white/60 ring-1 ring-ink/8">
        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4">
          {messages.length === 0 ? (
            <p className="rounded-2xl bg-mist/80 px-3 py-3 text-center text-sm text-slate">
              You&apos;re matched with {match.peerName}. Say hello to start the conversation.
            </p>
          ) : (
            messages.map((message) => (
              <Bubble
                key={message.id}
                mine={message.senderId === me.userId}
                time={formatTime(message.sentAt)}
              >
                {message.content}
              </Bubble>
            ))
          )}
          <div ref={bottomRef} />
        </div>

        <form
          className="shrink-0 border-t border-ink/8 px-3 py-3"
          onSubmit={onSubmit}
        >
          <div className="flex items-end gap-2">
            <input
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={`Message ${match.peerName}…`}
              className="flex-1 rounded-2xl border border-ink/10 bg-foam px-3.5 py-3 text-sm outline-none focus:ring-2 focus:ring-leaf/40"
              autoComplete="off"
            />
            <button
              type="submit"
              disabled={!canSend}
              className="rounded-2xl bg-ink p-3 text-foam transition hover:bg-ink-soft disabled:opacity-40"
              aria-label="Send"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
          {error && <p className="mt-2 text-center text-[11px] text-coral">{error}</p>}
          {!error && (
            <p className="mt-2 text-center text-[11px] text-muted">
              Live over Socket.io · demo replies from {match.peerName}
            </p>
          )}
        </form>
      </div>

      <ScheduleSessionModal
        open={scheduleOpen}
        peerName={match.peerName}
        onClose={() => setScheduleOpen(false)}
        onSchedule={(details) => {
          void handleSend(buildScheduleMessage(details));
        }}
      />
    </section>
  );
}

function Bubble({
  children,
  mine,
  time,
}: {
  children: ReactNode;
  mine?: boolean;
  time: string;
}) {
  return (
    <div
      className={[
        "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap",
        mine
          ? "ml-auto bg-ink text-foam rounded-br-md"
          : "mr-auto bg-mist text-ink rounded-bl-md",
      ].join(" ")}
    >
      {children}
      <div
        className={[
          "mt-1 text-[10px]",
          mine ? "text-foam/60" : "text-muted",
        ].join(" ")}
      >
        {time}
      </div>
    </div>
  );
}
