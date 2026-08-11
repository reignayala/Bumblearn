import { Outlet } from "react-router-dom";
import { BottomNav } from "../components/BottomNav";
import { BrandMark } from "../components/BrandMark";
import { useAuth } from "../lib/auth";

export function AppShell() {
  const { user } = useAuth();
  const roleLabel =
    user?.roles.includes("educator") && user.roles.includes("learner")
      ? "Both roles"
      : user?.roles.includes("educator")
        ? "Educating"
        : "Learning";

  return (
    <div className="mx-auto flex h-dvh w-full max-w-lg flex-col overflow-hidden px-4 pb-[5.5rem] pt-4 sm:px-5">
      <header className="mb-3 flex shrink-0 items-center justify-between">
        <BrandMark size="sm" />
        <span className="rounded-full bg-white/70 px-3 py-1 text-[11px] font-medium text-muted ring-1 ring-ink/8">
          {roleLabel}
        </span>
      </header>
      <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
