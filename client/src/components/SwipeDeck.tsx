import { AnimatePresence, motion } from "framer-motion";
import { GraduationCap, RotateCcw, Sparkles, ThumbsDown, ThumbsUp } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { MOCK_DECK } from "../data/mockProfiles";
import { DEFAULT_FILTERS, type DeckFilters, type DeckProfile, type SwipeDirection } from "../types";
import { FilterBar } from "./FilterBar";
import { MatchCelebration } from "./MatchCelebration";
import { ProfileDetail } from "./ProfileDetail";
import { SwipeCard } from "./SwipeCard";

function applyFilters(profiles: DeckProfile[], filters: DeckFilters): DeckProfile[] {
  return profiles.filter((p) => {
    if (filters.subject !== "all" && !p.subjects.includes(filters.subject)) {
      return false;
    }
    if (p.hourlyRate != null) {
      if (p.hourlyRate < filters.priceMin || p.hourlyRate > filters.priceMax) {
        return false;
      }
    }
    if (
      filters.format !== "any" &&
      p.preferredFormat &&
      p.preferredFormat !== "either" &&
      filters.format !== "either" &&
      p.preferredFormat !== filters.format
    ) {
      return false;
    }
    return true;
  });
}

/** Mock mutual-match chance so the celebration UI is easy to demo. */
function mockIsMutualMatch(profile: DeckProfile): boolean {
  const hash = profile.id.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return hash % 2 === 0;
}

export function SwipeDeck() {
  const [filters, setFilters] = useState<DeckFilters>(DEFAULT_FILTERS);
  const [deckIds, setDeckIds] = useState(() => MOCK_DECK.map((p) => p.id));
  const [history, setHistory] = useState<
    { id: string; direction: SwipeDirection; matched: boolean }[]
  >([]);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [matchProfile, setMatchProfile] = useState<DeckProfile | null>(null);
  const [exitHint, setExitHint] = useState<"like" | "pass" | null>(null);

  const filtered = useMemo(() => applyFilters(MOCK_DECK, filters), [filters]);
  const deck = useMemo(
    () => filtered.filter((p) => deckIds.includes(p.id)),
    [filtered, deckIds],
  );
  const visible = deck.slice(0, 3);
  const detailProfile = detailId ? (MOCK_DECK.find((p) => p.id === detailId) ?? null) : null;

  const commitSwipe = (profile: DeckProfile, direction: SwipeDirection) => {
    const matched = direction === "like" && mockIsMutualMatch(profile);
    setDeckIds((ids) => ids.filter((id) => id !== profile.id));
    setHistory((h) => [...h, { id: profile.id, direction, matched }]);
    setDetailId(null);
    setExitHint(null);
    if (matched) {
      setTimeout(() => setMatchProfile(profile), 280);
    }
  };

  const handleButtonSwipe = (direction: SwipeDirection) => {
    const top = deck[0];
    if (!top) return;
    setExitHint(direction);
    // brief flash then remove — card exit animation handled by AnimatePresence
    requestAnimationFrame(() => commitSwipe(top, direction));
  };

  const undo = () => {
    const last = history[history.length - 1];
    if (!last) return;
    setHistory((h) => h.slice(0, -1));
    setDeckIds((ids) => [last.id, ...ids]);
    setMatchProfile(null);
  };

  const resetDeck = () => {
    setDeckIds(MOCK_DECK.map((p) => p.id));
    setHistory([]);
    setMatchProfile(null);
    setDetailId(null);
  };

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <div className="shrink-0">
        <FilterBar filters={filters} onChange={setFilters} />
      </div>

      <div className="relative min-h-[22rem] flex-1">
        <div className="absolute inset-0 mx-auto max-w-md">
          <AnimatePresence mode="popLayout">
            {visible.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex h-full flex-col items-center justify-center rounded-[1.75rem] border border-dashed border-ink/15 bg-white/50 px-6 text-center"
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-mist text-leaf">
                  <GraduationCap className="h-7 w-7" />
                </div>
                <h2 className="font-display text-2xl font-bold text-ink">Deck complete</h2>
                <p className="mt-2 max-w-xs text-sm text-slate">
                  {filtered.length === 0
                    ? "No educators match these filters. Loosen the filters to see more."
                    : "You've reviewed everyone for now. Reset the mock deck or tweak filters."}
                </p>
                <button
                  type="button"
                  onClick={resetDeck}
                  className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-ink px-4 py-3 text-sm font-semibold text-foam hover:bg-ink-soft"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset mock deck
                </button>
              </motion.div>
            ) : (
              visible
                .map((profile, index) => (
                  <SwipeCard
                    key={profile.id}
                    profile={profile}
                    isTop={index === 0}
                    stackIndex={index}
                    onSwipe={(dir) => commitSwipe(profile, dir)}
                    onOpen={() => setDetailId(profile.id)}
                  />
                ))
                .reverse()
            )}
          </AnimatePresence>

          {/* Button-swipe flyaway hint layer */}
          <AnimatePresence>
            {exitHint && deck[0] && (
              <motion.div
                key={`hint-${exitHint}`}
                className="pointer-events-none absolute inset-0 z-30 rounded-[1.75rem]"
                initial={{ opacity: 0.35 }}
                animate={{
                  opacity: 0,
                  x: exitHint === "like" ? 80 : -80,
                  rotate: exitHint === "like" ? 8 : -8,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                style={{
                  background:
                    exitHint === "like"
                      ? "rgba(47,158,140,0.2)"
                      : "rgba(224,122,95,0.2)",
                }}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-md shrink-0 items-center justify-center gap-4 pb-1">
        <ActionButton
          label="Undo"
          disabled={history.length === 0}
          onClick={undo}
          className="h-12 w-12 bg-white text-muted ring-1 ring-ink/10 hover:text-ink disabled:opacity-40"
        >
          <RotateCcw className="h-5 w-5" />
        </ActionButton>
        <ActionButton
          label="Pass"
          disabled={deck.length === 0}
          onClick={() => handleButtonSwipe("pass")}
          className="h-16 w-16 bg-white text-coral shadow-md ring-1 ring-coral/30 hover:bg-coral/10 disabled:opacity-40"
        >
          <ThumbsDown className="h-7 w-7" />
        </ActionButton>
        <ActionButton
          label="Interested"
          disabled={deck.length === 0}
          onClick={() => handleButtonSwipe("like")}
          className="h-16 w-16 bg-leaf text-white shadow-md hover:bg-ink-soft disabled:opacity-40"
        >
          <ThumbsUp className="h-7 w-7" />
        </ActionButton>
        <ActionButton
          label="Tip"
          onClick={() => deck[0] && setDetailId(deck[0].id)}
          disabled={deck.length === 0}
          className="h-12 w-12 bg-spark/90 text-ink hover:bg-spark disabled:opacity-40"
        >
          <Sparkles className="h-5 w-5" />
        </ActionButton>
      </div>

      <p className="shrink-0 text-center text-[11px] text-muted">
        Drag cards or use buttons · tap card for full profile · mock data
      </p>

      <ProfileDetail
        profile={detailProfile}
        onClose={() => setDetailId(null)}
        onLike={() => detailProfile && commitSwipe(detailProfile, "like")}
        onPass={() => detailProfile && commitSwipe(detailProfile, "pass")}
      />

      <MatchCelebration
        profile={matchProfile}
        onClose={() => setMatchProfile(null)}
        onChat={() => setMatchProfile(null)}
      />
    </div>
  );
}

function ActionButton({
  children,
  label,
  onClick,
  disabled,
  className,
}: {
  children: ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  className: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={[
        "inline-flex items-center justify-center rounded-full transition active:scale-95",
        className,
      ].join(" ")}
    >
      {children}
    </button>
  );
}
