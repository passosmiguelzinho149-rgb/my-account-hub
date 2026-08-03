import { CircleHelp, Bell, MoreVertical } from "lucide-react";

/** Cabeçalho com gradiente da marca usado nas telas principais. */
export function BrandHeader({ children }: { children?: React.ReactNode }) {
  return (
    <header className="bg-brand-gradient text-primary-foreground">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 pt-3 pb-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-card text-lg font-bold text-brand-red">
            B
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-base font-bold">Bradesco</span>
            <span className="block truncate text-xs opacity-80">empresas e negócios</span>
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <CircleHelp className="size-5" aria-hidden />
          <span className="relative">
            <Bell className="size-5" aria-hidden />
            <span className="absolute -top-1.5 -right-1.5 grid size-4 place-items-center rounded-full bg-brand-red text-[10px] font-bold">
              3
            </span>
          </span>
          <MoreVertical className="size-5" aria-hidden />
        </div>
      </div>
      {children}
    </header>
  );
}