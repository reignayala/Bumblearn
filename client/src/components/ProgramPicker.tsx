import { Check, ChevronDown, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { COURSE_OPTIONS } from "../data/courses";

type SingleProps = {
  mode?: "single";
  label?: string;
  value: string | null;
  onChange: (next: string | null) => void;
  placeholder?: string;
  allowClear?: boolean;
};

type MultiProps = {
  mode: "multi";
  label?: string;
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
};

type ProgramPickerProps = SingleProps | MultiProps;

export function ProgramPicker(props: ProgramPickerProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const isMulti = props.mode === "multi";
  const selected = isMulti ? props.value : props.value ? [props.value] : [];
  const placeholder = props.placeholder ?? "Choose your program";
  const label = props.label ?? "Program";

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COURSE_OPTIONS;
    return COURSE_OPTIONS.filter((course) => course.toLowerCase().includes(q));
  }, [query]);

  const buttonText = isMulti
    ? selected.length === 0
      ? placeholder
      : selected.length === 1
        ? selected[0]
        : `${selected.length} programs selected`
    : selected[0] ?? placeholder;

  function pick(course: string) {
    if (isMulti) {
      const exists = props.value.includes(course);
      props.onChange(
        exists ? props.value.filter((c) => c !== course) : [...props.value, course],
      );
      return;
    }
    props.onChange(course);
    setOpen(false);
    setQuery("");
  }

  return (
    <div>
      {label && (
        <p className="mb-2 text-sm font-medium text-slate">{label}</p>
      )}

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-between gap-3 rounded-2xl border border-ink/10 bg-white px-4 py-3.5 text-left transition hover:bg-mist/60"
      >
        <span
          className={[
            "min-w-0 flex-1 truncate text-sm font-semibold",
            selected.length ? "text-ink" : "text-muted",
          ].join(" ")}
        >
          {buttonText}
        </span>
        <ChevronDown className="h-4 w-4 shrink-0 text-muted" />
      </button>

      {isMulti && selected.length > 0 && (
        <ul className="mt-2 space-y-1.5">
          {selected.map((course) => (
            <li
              key={course}
              className="flex items-center justify-between gap-2 rounded-2xl bg-mist/80 px-3 py-2 text-sm text-ink"
            >
              <span className="min-w-0 flex-1 leading-snug">{course}</span>
              <button
                type="button"
                aria-label={`Remove ${course}`}
                onClick={() =>
                  props.onChange(props.value.filter((c) => c !== course))
                }
                className="rounded-full p-1 text-muted hover:bg-white hover:text-ink"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {!isMulti &&
        props.allowClear !== false &&
        props.value && (
          <button
            type="button"
            onClick={() => props.onChange(null)}
            className="mt-2 text-xs font-medium text-muted hover:text-ink"
          >
            Clear selection
          </button>
        )}

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-ink/45 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          onClick={() => {
            setOpen(false);
            setQuery("");
          }}
        >
          <div
            role="dialog"
            aria-label={label}
            className="flex max-h-[85vh] w-full max-w-lg flex-col rounded-t-[1.75rem] bg-foam shadow-2xl sm:rounded-[1.75rem]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-ink/8 px-4 py-3">
              <h3 className="font-display text-xl font-bold text-ink">
                {isMulti ? "Choose programs" : "Choose a program"}
              </h3>
              <button
                type="button"
                aria-label="Close"
                onClick={() => {
                  setOpen(false);
                  setQuery("");
                }}
                className="rounded-full p-2 text-muted hover:bg-mist hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="border-b border-ink/8 px-4 py-3">
              <label className="flex items-center gap-2 rounded-2xl border border-ink/10 bg-white px-3 py-2.5">
                <Search className="h-4 w-4 text-muted" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search programs…"
                  className="w-full bg-transparent text-sm outline-none"
                  autoFocus
                />
              </label>
            </div>

            <div className="min-h-0 flex-1 space-y-2 overflow-y-auto px-3 py-3">
              {filtered.map((course) => {
                const active = selected.includes(course);
                return (
                  <button
                    key={course}
                    type="button"
                    onClick={() => pick(course)}
                    className={[
                      "flex w-full items-center justify-between gap-3 rounded-2xl px-4 py-3.5 text-left text-sm font-medium transition",
                      active
                        ? "bg-leaf text-white"
                        : "bg-white text-ink ring-1 ring-ink/8 hover:bg-mist/70",
                    ].join(" ")}
                  >
                    <span className="min-w-0 flex-1 leading-snug">{course}</span>
                    {active && <Check className="h-4 w-4 shrink-0" />}
                  </button>
                );
              })}
              {filtered.length === 0 && (
                <p className="px-2 py-8 text-center text-sm text-muted">
                  No programs match that search.
                </p>
              )}
            </div>

            {isMulti && (
              <div className="border-t border-ink/8 p-3">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    setQuery("");
                  }}
                  className="w-full rounded-2xl bg-ink px-4 py-3.5 text-sm font-semibold text-foam hover:bg-ink-soft"
                >
                  Done{selected.length ? ` · ${selected.length}` : ""}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
