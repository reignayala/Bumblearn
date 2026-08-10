import { SwipeDeck } from "../components/SwipeDeck";

export function DiscoverPage() {
  return (
    <section className="flex min-h-0 flex-1 flex-col">
      <div className="mb-2">
        <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          Discover educators
        </h1>
        <p className="mt-0.5 text-sm text-slate">
          Swipe right if you&apos;d learn with them. Mutual interest unlocks chat.
        </p>
      </div>
      <div className="min-h-[28rem] flex-1 sm:min-h-[32rem]">
        <SwipeDeck />
      </div>
    </section>
  );
}
