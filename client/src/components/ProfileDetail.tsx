import { AnimatePresence, motion } from "framer-motion";
import { Clock, Star, X } from "lucide-react";
import type { ReactNode } from "react";
import type { DeckProfile } from "../types";

interface ProfileDetailProps {
  profile: DeckProfile | null;
  onClose: () => void;
  onLike: () => void;
  onPass: () => void;
}

export function ProfileDetail({ profile, onClose, onLike, onPass }: ProfileDetailProps) {
  return (
    <AnimatePresence>
      {profile && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-ink/50 sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-labelledby="profile-detail-title"
            className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-[2rem] bg-foam shadow-2xl sm:rounded-[2rem]"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-56 shrink-0 sm:h-64">
              <img
                src={profile.photoUrl}
                alt=""
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foam via-transparent to-ink/20" />
              <button
                type="button"
                onClick={onClose}
                className="absolute right-4 top-4 rounded-full bg-foam/90 p-2 text-ink shadow"
                aria-label="Close profile"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="overflow-y-auto px-5 pb-6 pt-1">
              <div className="mb-1 flex items-start justify-between gap-3">
                <h2
                  id="profile-detail-title"
                  className="font-display text-3xl font-bold tracking-tight text-ink"
                >
                  {profile.name}
                </h2>
                {profile.ratingCount > 0 && (
                  <div className="inline-flex items-center gap-1 rounded-full bg-mist px-2.5 py-1 text-sm font-semibold text-ink">
                    <Star className="h-3.5 w-3.5 fill-spark text-spark" />
                    {profile.ratingAvg.toFixed(1)}
                  </div>
                )}
              </div>

              {profile.hourlyRate != null && (
                <p className="mb-3 text-sm font-medium text-leaf">
                  ${profile.hourlyRate}/hr
                  {profile.yearsExperience != null && (
                    <span className="text-muted"> · {profile.yearsExperience} years teaching</span>
                  )}
                </p>
              )}

              <p className="mb-4 text-sm leading-relaxed text-slate">{profile.bio}</p>

              <Section title="Subjects">
                <div className="flex flex-wrap gap-1.5">
                  {profile.subjects.map((s) => (
                    <Tag key={s}>{s}</Tag>
                  ))}
                </div>
              </Section>

              {profile.teachingStyle && profile.teachingStyle.length > 0 && (
                <Section title="Teaching style">
                  <div className="flex flex-wrap gap-1.5">
                    {profile.teachingStyle.map((s) => (
                      <Tag key={s}>{s}</Tag>
                    ))}
                  </div>
                </Section>
              )}

              {profile.languages && profile.languages.length > 0 && (
                <Section title="Languages">
                  <p className="text-sm text-slate">{profile.languages.join(", ")}</p>
                </Section>
              )}

              {profile.learningGoals && (
                <Section title="Learning goals">
                  <p className="text-sm text-slate">{profile.learningGoals}</p>
                </Section>
              )}

              <Section title="Availability">
                <p className="inline-flex items-center gap-1.5 text-sm text-slate">
                  <Clock className="h-3.5 w-3.5 text-muted" />
                  {profile.availabilitySummary}
                </p>
              </Section>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={onPass}
                  className="rounded-2xl border border-ink/10 bg-white px-4 py-3.5 text-sm font-semibold text-coral transition hover:bg-coral/10"
                >
                  Pass
                </button>
                <button
                  type="button"
                  onClick={onLike}
                  className="rounded-2xl bg-leaf px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-ink-soft"
                >
                  Interested
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-4">
      <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted">
        {title}
      </h3>
      {children}
    </section>
  );
}

function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full bg-mist px-2.5 py-1 text-xs font-medium text-ink-soft">
      {children}
    </span>
  );
}
