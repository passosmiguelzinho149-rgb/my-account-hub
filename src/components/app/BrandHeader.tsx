import { Bell } from "lucide-react";
import { Link } from "@tanstack/react-router";

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
        <Link
          to="/app/notificacoes"
          aria-label="Notificações"
          className="rounded-full p-1.5 transition-colors hover:bg-primary-foreground/15"
        >
          <Bell className="size-6" aria-hidden />
        </Link>
      </div>
      {children}
      <div className="relative h-7 overflow-hidden bg-background">
        <div
          aria-hidden
          className="absolute -top-5 left-[-8%] h-12 w-[116%] rounded-[50%] bg-background"
        />
        <div
          aria-hidden
          className="absolute -top-2 left-[34%] h-8 w-[45%] rounded-[50%] bg-background/80"
        />
      </div>
    </header>
  );
}