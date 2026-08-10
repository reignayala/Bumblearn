import { Outlet } from "react-router-dom";
import { BottomNav } from "../components/BottomNav";
import { BrandMark } from "../components/BrandMark";

export function AppShell() {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col px-4 pb-[5.5rem] pt-4 sm:px-5">
      <header className="mb-3 flex items-center justify-between">
        <BrandMark size="sm" />
        <span className="rounded-full bg-white/70 px-3 py-1 text-[11px] font-medium text-muted ring-1 ring-ink/8">
          Preview · mock deck
        </span>
      </header>
      <main className="flex min-h-0 flex-1 flex-col">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
