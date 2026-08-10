import { useMemo, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { BrandMark } from "../components/BrandMark";
import { COURSE_OPTIONS } from "../data/courses";
import { useAuth } from "../lib/auth";
import type { AuthUser } from "../lib/api";

const STYLE_OPTIONS = [
  "hands-on",
  "exam-prep",
  "conversational",
  "visual",
  "patient",
  "project-based",
];

export function OnboardingPage() {
  const { user, finishOnboarding } = useAuth();
  const navigate = useNavigate();
  const needsEducator = Boolean(user?.roles.includes("educator"));
  const needsLearner = Boolean(user?.roles.includes("learner"));

  const steps = useMemo(() => {
    const list = ["basics"] as Array<"basics" | "educator" | "learner">;
    if (needsEducator) list.push("educator");
    if (needsLearner) list.push("learner");
    return list;
  }, [needsEducator, needsLearner]);

  const [stepIndex, setStepIndex] = useState(0);
  const step = steps[stepIndex] ?? "basics";
  const [bio, setBio] = useState(user?.bio ?? "");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [eduSubjects, setEduSubjects] = useState<string[]>([]);
  const [eduRate, setEduRate] = useState("45");
  const [eduYears, setEduYears] = useState("2");
  const [eduStyles, setEduStyles] = useState<string[]>([]);
  const [eduAvailability, setEduAvailability] = useState("Weeknights & weekends");
  const [eduPitch, setEduPitch] = useState("");

  const [lrnSubjects, setLrnSubjects] = useState<string[]>([]);
  const [lrnLevel, setLrnLevel] =
    useState<"beginner" | "intermediate" | "advanced">("beginner");
  const [lrnGoals, setLrnGoals] = useState("");
  const [lrnBudgetMin, setLrnBudgetMin] = useState("20");
  const [lrnBudgetMax, setLrnBudgetMax] = useState("60");
  const [lrnFormat, setLrnFormat] =
    useState<"online" | "in-person" | "either">("either");
  const [lrnAvailability, setLrnAvailability] = useState("Flexible evenings");
  const [lrnPitch, setLrnPitch] = useState("");

  if (!user) return null;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const isLast = stepIndex >= steps.length - 1;
    if (!isLast) {
      setError(null);
      setStepIndex((i) => i + 1);
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const educator: AuthUser["educator"] = needsEducator
        ? {
            subjects: eduSubjects,
            hourlyRate: Number(eduRate) || 40,
            yearsExperience: Number(eduYears) || 0,
            teachingStyle: eduStyles,
            languages: ["English"],
            availabilitySummary: eduAvailability,
            pitch: eduPitch,
          }
        : null;
      const learner: AuthUser["learner"] = needsLearner
        ? {
            subjectsWanted: lrnSubjects,
            skillLevel: lrnLevel,
            learningGoals: lrnGoals,
            budgetMin: Number(lrnBudgetMin) || 0,
            budgetMax: Number(lrnBudgetMax) || 100,
            preferredFormat: lrnFormat,
            availabilitySummary: lrnAvailability,
            pitch: lrnPitch,
          }
        : null;

      await finishOnboarding({ bio, educator, learner });
      navigate("/", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save profile");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col px-5 pb-10 pt-8">
      <BrandMark size="sm" />
      <div className="mt-6 mb-2 flex gap-1.5">
        {steps.map((s, i) => (
          <span
            key={s}
            className={[
              "h-1.5 flex-1 rounded-full",
              i <= stepIndex ? "bg-leaf" : "bg-ink/10",
            ].join(" ")}
          />
        ))}
      </div>

      <h1 className="font-display text-3xl font-bold tracking-tight text-ink">
        {step === "basics" && "Tell us about you"}
        {step === "educator" && "Educator profile"}
        {step === "learner" && "Learner profile"}
      </h1>
      <p className="mt-1 text-sm text-slate">
        {step === "basics" && `Hi ${user.name} — a short bio helps matches trust you.`}
        {step === "educator" && "What programs do you teach, and how do you like to teach?"}
        {step === "learner" && "Which courses are you hoping to get help with?"}
      </p>

      <form className="mt-6 flex flex-1 flex-col" onSubmit={onSubmit}>
        {step === "basics" && (
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-slate">Bio</span>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              placeholder="A sentence or two about your background…"
              className="w-full resize-none rounded-2xl border border-ink/10 bg-white px-3.5 py-3 outline-none focus:ring-2 focus:ring-leaf/40"
            />
          </label>
        )}

        {step === "educator" && (
          <div className="space-y-4">
            <ChipPicker
              label="Courses you teach"
              options={COURSE_OPTIONS}
              value={eduSubjects}
              onChange={setEduSubjects}
              searchable
            />
            <div className="grid grid-cols-2 gap-3">
              <NumberField label="$ / hour" value={eduRate} onChange={setEduRate} />
              <NumberField label="Years experience" value={eduYears} onChange={setEduYears} />
            </div>
            <ChipPicker
              label="Teaching style"
              options={STYLE_OPTIONS}
              value={eduStyles}
              onChange={setEduStyles}
            />
            <TextField
              label="Availability"
              value={eduAvailability}
              onChange={setEduAvailability}
              placeholder="Weeknights after 6pm"
            />
            <TextField
              label="One-line pitch"
              value={eduPitch}
              onChange={setEduPitch}
              placeholder="Accountancy board review that finally clicks"
            />
          </div>
        )}

        {step === "learner" && (
          <div className="space-y-4">
            <ChipPicker
              label="Courses you want help with"
              options={COURSE_OPTIONS}
              value={lrnSubjects}
              onChange={setLrnSubjects}
              searchable
            />
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-slate">Skill level</span>
              <select
                value={lrnLevel}
                onChange={(e) =>
                  setLrnLevel(e.target.value as typeof lrnLevel)
                }
                className="w-full rounded-2xl border border-ink/10 bg-white px-3.5 py-3 outline-none focus:ring-2 focus:ring-leaf/40"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-slate">Learning goals</span>
              <textarea
                value={lrnGoals}
                onChange={(e) => setLrnGoals(e.target.value)}
                rows={3}
                className="w-full resize-none rounded-2xl border border-ink/10 bg-white px-3.5 py-3 outline-none focus:ring-2 focus:ring-leaf/40"
                placeholder="Raise my Calc II grade before finals…"
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <NumberField label="Budget min $" value={lrnBudgetMin} onChange={setLrnBudgetMin} />
              <NumberField label="Budget max $" value={lrnBudgetMax} onChange={setLrnBudgetMax} />
            </div>
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-slate">Preferred format</span>
              <select
                value={lrnFormat}
                onChange={(e) =>
                  setLrnFormat(e.target.value as typeof lrnFormat)
                }
                className="w-full rounded-2xl border border-ink/10 bg-white px-3.5 py-3 outline-none focus:ring-2 focus:ring-leaf/40"
              >
                <option value="either">Online or in person</option>
                <option value="online">Online</option>
                <option value="in-person">In person</option>
              </select>
            </label>
            <TextField
              label="Availability"
              value={lrnAvailability}
              onChange={setLrnAvailability}
            />
            <TextField
              label="One-line pitch"
              value={lrnPitch}
              onChange={setLrnPitch}
              placeholder="CE major needing strength of materials help"
            />
          </div>
        )}

        {error && <p className="mt-4 text-sm text-coral">{error}</p>}

        <div className="mt-auto grid gap-3 pt-8">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-2xl bg-ink px-4 py-3.5 text-sm font-semibold text-foam hover:bg-ink-soft disabled:opacity-50"
          >
            {submitting
              ? "Saving…"
              : stepIndex >= steps.length - 1
                ? "Finish & start matching"
                : "Continue"}
          </button>
          {stepIndex > 0 && (
            <button
              type="button"
              onClick={() => setStepIndex((i) => i - 1)}
              className="rounded-2xl px-4 py-3 text-sm font-medium text-slate hover:bg-white/60"
            >
              Back
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

function ChipPicker({
  label,
  options,
  value,
  onChange,
  searchable = false,
}: {
  label: string;
  options: string[];
  value: string[];
  onChange: (next: string[]) => void;
  searchable?: boolean;
}) {
  const [query, setQuery] = useState("");
  const visible = searchable
    ? options.filter((option) =>
        option.toLowerCase().includes(query.trim().toLowerCase()),
      )
    : options;

  return (
    <div>
      <p className="mb-2 text-sm font-medium text-slate">{label}</p>
      {searchable && (
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search courses…"
          className="mb-2 w-full rounded-2xl border border-ink/10 bg-white px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-leaf/40"
        />
      )}
      {value.length > 0 && (
        <p className="mb-2 text-xs text-muted">{value.length} selected</p>
      )}
      <div className="flex max-h-48 flex-wrap gap-2 overflow-y-auto rounded-2xl bg-white/50 p-2 ring-1 ring-ink/8">
        {visible.map((option) => {
          const active = value.includes(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() =>
                onChange(
                  active ? value.filter((v) => v !== option) : [...value, option],
                )
              }
              className={[
                "rounded-full px-3 py-1.5 text-left text-xs font-medium transition sm:text-sm",
                active
                  ? "bg-leaf text-white"
                  : "bg-white text-slate ring-1 ring-ink/10 hover:bg-mist",
              ].join(" ")}
            >
              {option}
            </button>
          );
        })}
        {visible.length === 0 && (
          <p className="px-2 py-3 text-sm text-muted">No courses match that search.</p>
        )}
      </div>
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-slate">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-ink/10 bg-white px-3.5 py-3 outline-none focus:ring-2 focus:ring-leaf/40"
      />
    </label>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-slate">{label}</span>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-ink/10 bg-white px-3.5 py-3 outline-none focus:ring-2 focus:ring-leaf/40"
      />
    </label>
  );
}
