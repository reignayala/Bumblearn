import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";

interface ScheduleSessionModalProps {
  open: boolean;
  peerName: string;
  onClose: () => void;
  onSchedule: (details: { when: string; link: string; notes: string }) => void;
}

export function ScheduleSessionModal({
  open,
  peerName,
  onClose,
  onSchedule,
}: ScheduleSessionModalProps) {
  const [when, setWhen] = useState("");
  const [link, setLink] = useState("https://meet.jit.si/bumblearn-session");
  const [notes, setNotes] = useState("");

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-ink/50 p-4 backdrop-blur-sm sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-labelledby="schedule-title"
            className="w-full max-w-md rounded-[1.75rem] bg-foam p-5 shadow-2xl"
            initial={{ y: 28, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 16, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <h2
                  id="schedule-title"
                  className="font-display text-2xl font-bold text-ink"
                >
                  Schedule a session
                </h2>
                <p className="text-sm text-slate">Propose a time with {peerName}.</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-2 text-muted hover:bg-mist hover:text-ink"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <label className="mb-3 block text-sm">
              <span className="mb-1 block font-medium text-slate">When</span>
              <input
                type="datetime-local"
                value={when}
                onChange={(e) => setWhen(e.target.value)}
                className="w-full rounded-2xl border border-ink/10 bg-white px-3 py-2.5 outline-none focus:ring-2 focus:ring-leaf/40"
              />
            </label>

            <label className="mb-3 block text-sm">
              <span className="mb-1 block font-medium text-slate">Meeting link</span>
              <input
                type="url"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="w-full rounded-2xl border border-ink/10 bg-white px-3 py-2.5 outline-none focus:ring-2 focus:ring-leaf/40"
              />
            </label>

            <label className="mb-4 block text-sm">
              <span className="mb-1 block font-medium text-slate">Notes (optional)</span>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Topics to cover…"
                className="w-full resize-none rounded-2xl border border-ink/10 bg-white px-3 py-2.5 outline-none focus:ring-2 focus:ring-leaf/40"
              />
            </label>

            <button
              type="button"
              disabled={!when.trim()}
              onClick={() => {
                onSchedule({ when, link, notes });
                onClose();
              }}
              className="w-full rounded-2xl bg-ink px-4 py-3.5 text-sm font-semibold text-foam transition hover:bg-ink-soft disabled:opacity-40"
            >
              Send proposal in chat
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
