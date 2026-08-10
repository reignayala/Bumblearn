import { AnimatePresence, motion } from "framer-motion";
import { Lightbulb, MessageCircle, X } from "lucide-react";
import type { DeckProfile } from "../types";

interface MatchCelebrationProps {
  profile: DeckProfile | null;
  onClose: () => void;
  onChat: () => void;
}

export function MatchCelebration({ profile, onClose, onChat }: MatchCelebrationProps) {
  return (
    <AnimatePresence>
      {profile && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-ink/55 p-4 backdrop-blur-sm sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-labelledby="match-title"
            className="relative w-full max-w-md overflow-hidden rounded-[2rem] bg-foam p-6 shadow-2xl"
            initial={{ y: 40, scale: 0.94, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 24, scale: 0.96, opacity: 0 }}
            transition={{ type: "spring", stiffness: 340, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full p-2 text-muted hover:bg-mist hover:text-ink"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>

            <motion.div
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-spark/80 text-ink"
              initial={{ rotate: -20, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 400, damping: 14 }}
            >
              <Lightbulb className="h-8 w-8" strokeWidth={2.2} />
            </motion.div>

            <h2
              id="match-title"
              className="text-center font-display text-3xl font-bold tracking-tight text-ink"
            >
              You&apos;re matched!
            </h2>
            <p className="mt-2 text-center text-sm leading-relaxed text-slate">
              You and <span className="font-semibold text-ink">{profile.name}</span> both want
              to learn together. Say hello and schedule a session when you&apos;re ready.
            </p>

            <div className="mt-5 flex items-center justify-center gap-3">
              <img
                src={profile.photoUrl}
                alt=""
                className="h-16 w-16 rounded-2xl object-cover ring-2 ring-lime"
              />
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-mist font-display text-lg font-bold text-leaf">
                ↔
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-ink font-display text-2xl font-bold text-spark ring-2 ring-spark">
                You
              </div>
            </div>

            <div className="mt-6 grid gap-2">
              <button
                type="button"
                onClick={onChat}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-ink px-4 py-3.5 text-sm font-semibold text-foam transition hover:bg-ink-soft"
              >
                <MessageCircle className="h-4 w-4" />
                Open chat
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-2xl px-4 py-3 text-sm font-medium text-slate hover:bg-mist"
              >
                Keep discovering
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
