import { SwipeDeck } from "../components/SwipeDeck";
import { useAuth } from "../lib/auth";
import { MOCK_EDUCATORS, MOCK_LEARNERS } from "../data/mockProfiles";

export function DiscoverPage() {
  const { user } = useAuth();
  const educateOnly =
    Boolean(user?.roles.includes("educator")) &&
    !Boolean(user?.roles.includes("learner"));

  const title = educateOnly ? "Discover learners" : "Discover educators";
  const subtitle = educateOnly
    ? "Swipe right if you'd teach them. Mutual interest unlocks chat."
    : "Swipe right if you'd learn with them. Mutual interest unlocks chat.";

  return (
    <section className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="mb-2 shrink-0">
        <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          {title}
        </h1>
        <p className="mt-0.5 text-sm text-slate">{subtitle}</p>
      </div>
      <div className="min-h-0 flex-1">
        <SwipeDeck deck={educateOnly ? MOCK_LEARNERS : MOCK_EDUCATORS} />
      </div>
    </section>
  );
}
