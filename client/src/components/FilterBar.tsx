import { Filter, X } from "lucide-react";
import { useState } from "react";
import type { DeckFilters } from "../types";

const SUBJECTS = [
  "all",
  "Calculus",
  "Python",
  "Spanish",
  "Chemistry",
  "UX Design",
  "Guitar",
  "Algebra",
  "Web Dev",
];

interface FilterBarProps {
  filters: DeckFilters;
  onChange: (next: DeckFilters) => void;
}

export function FilterBar({ filters, onChange }: FilterBarProps) {
  const [open, setOpen] = useState(false);

  const activeCount = [
    filters.subject !== "all",
    filters.format !== "any",
    filters.skillLevel !== "any",
    filters.priceMin > 0 || filters.priceMax < 200,
  ].filter(Boolean).length;

  return (
    <div className="relative z-20">
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-ink px-3.5 py-2 text-sm font-medium text-foam shadow-sm transition hover:bg-ink-soft"
        >
          <Filter className="h-3.5 w-3.5" />
          Filters
          {activeCount > 0 && (
            <span className="ml-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-spark px-1.5 text-[11px] font-semibold text-ink">
              {activeCount}
            </span>
          )}
        </button>

        {SUBJECTS.filter((s) => s !== "all").map((subject) => {
          const active = filters.subject === subject;
          return (
            <button
              key={subject}
              type="button"
              onClick={() =>
                onChange({
                  ...filters,
                  subject: active ? "all" : subject,
                })
              }
              className={[
                "shrink-0 rounded-full px-3.5 py-2 text-sm font-medium transition",
                active
                  ? "bg-leaf text-white"
                  : "bg-white/70 text-slate ring-1 ring-ink/10 hover:bg-white",
              ].join(" ")}
            >
              {subject}
            </button>
          );
        })}
      </div>

      {open && (
        <div className="absolute left-0 right-0 top-full mt-2 rounded-3xl border border-ink/10 bg-foam/95 p-4 shadow-xl backdrop-blur-md">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold text-ink">Refine deck</h3>
            <button
              type="button"
              aria-label="Close filters"
              onClick={() => setOpen(false)}
              className="rounded-full p-1.5 text-muted hover:bg-mist hover:text-ink"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <label className="mb-3 block text-sm">
            <span className="mb-1 block font-medium text-slate">Subject</span>
            <select
              value={filters.subject}
              onChange={(e) => onChange({ ...filters, subject: e.target.value })}
              className="w-full rounded-2xl border border-ink/10 bg-white px-3 py-2.5 outline-none focus:ring-2 focus:ring-leaf/40"
            >
              {SUBJECTS.map((s) => (
                <option key={s} value={s}>
                  {s === "all" ? "All subjects" : s}
                </option>
              ))}
            </select>
          </label>

          <div className="mb-3 grid grid-cols-2 gap-3">
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-slate">Min $/hr</span>
              <input
                type="number"
                min={0}
                max={filters.priceMax}
                value={filters.priceMin}
                onChange={(e) =>
                  onChange({ ...filters, priceMin: Number(e.target.value) || 0 })
                }
                className="w-full rounded-2xl border border-ink/10 bg-white px-3 py-2.5 outline-none focus:ring-2 focus:ring-leaf/40"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-slate">Max $/hr</span>
              <input
                type="number"
                min={filters.priceMin}
                max={300}
                value={filters.priceMax}
                onChange={(e) =>
                  onChange({ ...filters, priceMax: Number(e.target.value) || 200 })
                }
                className="w-full rounded-2xl border border-ink/10 bg-white px-3 py-2.5 outline-none focus:ring-2 focus:ring-leaf/40"
              />
            </label>
          </div>

          <label className="mb-3 block text-sm">
            <span className="mb-1 block font-medium text-slate">Format</span>
            <select
              value={filters.format}
              onChange={(e) =>
                onChange({
                  ...filters,
                  format: e.target.value as DeckFilters["format"],
                })
              }
              className="w-full rounded-2xl border border-ink/10 bg-white px-3 py-2.5 outline-none focus:ring-2 focus:ring-leaf/40"
            >
              <option value="any">Any format</option>
              <option value="online">Online</option>
              <option value="in-person">In person</option>
              <option value="either">Flexible</option>
            </select>
          </label>

          <label className="block text-sm">
            <span className="mb-1 block font-medium text-slate">Skill level</span>
            <select
              value={filters.skillLevel}
              onChange={(e) =>
                onChange({
                  ...filters,
                  skillLevel: e.target.value as DeckFilters["skillLevel"],
                })
              }
              className="w-full rounded-2xl border border-ink/10 bg-white px-3 py-2.5 outline-none focus:ring-2 focus:ring-leaf/40"
            >
              <option value="any">Any level</option>
              <option value="beginner">Beginner-friendly</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </label>
        </div>
      )}
    </div>
  );
}
