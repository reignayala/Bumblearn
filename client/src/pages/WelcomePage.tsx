import { BookOpen, GraduationCap, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { BrandMark } from "../components/BrandMark";

export function WelcomePage() {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col px-5 pb-10 pt-8">
      <BrandMark size="md" />

      <div className="mt-10 flex flex-1 flex-col justify-center">
        <p className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-lime/50 px-3 py-1 text-xs font-semibold text-ink">
          <Sparkles className="h-3.5 w-3.5" />
          Learn by matching
        </p>
        <h1 className="font-display text-4xl font-bold leading-tight tracking-tight text-ink text-balance">
          Find your next tutor — or your next student.
        </h1>
        <p className="mt-3 max-w-md text-base leading-relaxed text-slate">
          Bumblearn pairs educators and learners with a swipe. Choose how you
          want to show up, build your profile, and start matching.
        </p>

        <div className="mt-8 grid gap-3">
          <div className="flex items-start gap-3 rounded-3xl bg-white/70 p-4 ring-1 ring-ink/8">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-mist text-leaf">
              <BookOpen className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-semibold text-ink">Learn</h2>
              <p className="text-sm text-muted">
                Swipe educators by subject, price, and teaching style.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-3xl bg-white/70 p-4 ring-1 ring-ink/8">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-mist text-leaf">
              <GraduationCap className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-semibold text-ink">Educate</h2>
              <p className="text-sm text-muted">
                Share your subjects, rate, and availability with learners.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-3">
        <Link
          to="/signup"
          className="rounded-2xl bg-ink px-4 py-3.5 text-center text-sm font-semibold text-foam transition hover:bg-ink-soft"
        >
          Create account
        </Link>
        <Link
          to="/login"
          className="rounded-2xl bg-white/80 px-4 py-3.5 text-center text-sm font-semibold text-ink ring-1 ring-ink/10 transition hover:bg-white"
        >
          Log in
        </Link>
      </div>
    </div>
  );
}
