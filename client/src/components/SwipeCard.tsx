import { motion, useMotionValue, useTransform, type PanInfo } from "framer-motion";
import { MapPin, Star } from "lucide-react";
import type { DeckProfile } from "../types";

interface SwipeCardProps {
  profile: DeckProfile;
  isTop: boolean;
  stackIndex: number;
  onSwipe: (direction: "like" | "pass") => void;
  onOpen: () => void;
}

const SWIPE_THRESHOLD = 120;

export function SwipeCard({
  profile,
  isTop,
  stackIndex,
  onSwipe,
  onOpen,
}: SwipeCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-220, 0, 220], [-14, 0, 14]);
  const likeOpacity = useTransform(x, [40, 140], [0, 1]);
  const passOpacity = useTransform(x, [-140, -40], [1, 0]);
  const overlayTint = useTransform(
    x,
    [-180, 0, 180],
    ["rgba(224,122,95,0.25)", "rgba(0,0,0,0)", "rgba(47,158,140,0.28)"],
  );

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;
    if (offset > SWIPE_THRESHOLD || velocity > 800) {
      onSwipe("like");
      return;
    }
    if (offset < -SWIPE_THRESHOLD || velocity < -800) {
      onSwipe("pass");
    }
  };

  const scale = 1 - stackIndex * 0.04;
  const yOffset = stackIndex * 10;

  return (
    <motion.article
      className="absolute inset-0 touch-none select-none"
      style={{
        x: isTop ? x : 0,
        rotate: isTop ? rotate : 0,
        zIndex: 20 - stackIndex,
        scale,
        y: yOffset,
      }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={isTop ? handleDragEnd : undefined}
      initial={{ scale: 0.94, opacity: 0, y: 24 }}
      animate={{ scale, opacity: 1, y: yOffset }}
      exit={{
        x: isTop ? (x.get() > 0 ? 420 : -420) : 0,
        opacity: 0,
        transition: { duration: 0.28 },
      }}
      transition={{ type: "spring", stiffness: 320, damping: 28 }}
    >
      <button
        type="button"
        onClick={() => {
          if (Math.abs(x.get()) < 8) onOpen();
        }}
        className="relative h-full w-full overflow-hidden rounded-[1.75rem] text-left shadow-[0_20px_50px_-24px_rgba(11,61,58,0.55)] ring-1 ring-ink/10"
        aria-label={`View ${profile.name}'s profile`}
      >
        <img
          src={profile.photoUrl}
          alt=""
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-transparent" />
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{ backgroundColor: isTop ? overlayTint : "transparent" }}
        />

        {isTop && (
          <>
            <motion.div
              style={{ opacity: likeOpacity }}
              className="absolute left-5 top-6 rounded-xl border-[3px] border-leaf bg-leaf/15 px-3 py-1.5 font-display text-xl font-bold uppercase tracking-wide text-leaf backdrop-blur-sm"
            >
              Interested
            </motion.div>
            <motion.div
              style={{ opacity: passOpacity }}
              className="absolute right-5 top-6 rounded-xl border-[3px] border-coral bg-coral/15 px-3 py-1.5 font-display text-xl font-bold uppercase tracking-wide text-coral backdrop-blur-sm"
            >
              Pass
            </motion.div>
          </>
        )}

        <div className="absolute inset-x-0 bottom-0 space-y-3 p-5 pb-6 text-white">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 className="font-display text-3xl font-bold leading-tight tracking-tight">
                {profile.name}
              </h2>
              {profile.hourlyRate != null && (
                <p className="mt-0.5 text-sm font-medium text-lime">
                  ${profile.hourlyRate}/hr
                  {profile.yearsExperience != null && (
                    <span className="text-white/70">
                      {" "}
                      · {profile.yearsExperience} yrs experience
                    </span>
                  )}
                </p>
              )}
            </div>
            {profile.ratingCount > 0 && (
              <div className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-sm font-semibold backdrop-blur-sm">
                <Star className="h-3.5 w-3.5 fill-spark text-spark" />
                {profile.ratingAvg.toFixed(1)}
                <span className="font-normal text-white/70">({profile.ratingCount})</span>
              </div>
            )}
          </div>

          <p className="text-sm leading-snug text-white/90 line-clamp-2">{profile.pitch}</p>

          <div className="flex flex-wrap gap-1.5">
            {profile.subjects.slice(0, 4).map((subject) => (
              <span
                key={subject}
                className="rounded-full bg-white/15 px-2.5 py-1 text-xs font-medium backdrop-blur-sm"
              >
                {subject}
              </span>
            ))}
          </div>

          <p className="flex items-center gap-1.5 text-xs text-white/75">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            {profile.availabilitySummary}
            {profile.preferredFormat && (
              <span className="before:mx-1.5 before:content-['·']">
                {profile.preferredFormat === "in-person"
                  ? "In person"
                  : profile.preferredFormat === "online"
                    ? "Online"
                    : "Online or in person"}
              </span>
            )}
          </p>
        </div>
      </button>
    </motion.article>
  );
}
