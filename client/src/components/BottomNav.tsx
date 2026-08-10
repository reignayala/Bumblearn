import { GraduationCap, MessageCircle, UserRound } from "lucide-react";
import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Discover", icon: GraduationCap, end: true },
  { to: "/matches", label: "Matches", icon: MessageCircle, end: false },
  { to: "/profile", label: "Profile", icon: UserRound, end: false },
];

export function BottomNav() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-foam/90 backdrop-blur-md"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-around px-2 pt-1">
        {links.map(({ to, label, icon: Icon, end }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                [
                  "flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium transition-colors",
                  isActive ? "text-ink" : "text-muted hover:text-ink-soft",
                ].join(" ")
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={[
                      "flex h-9 w-9 items-center justify-center rounded-2xl transition-all",
                      isActive ? "bg-lime/70 text-ink" : "bg-transparent",
                    ].join(" ")}
                  >
                    <Icon className="h-5 w-5" strokeWidth={isActive ? 2.4 : 2} />
                  </span>
                  {label}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
