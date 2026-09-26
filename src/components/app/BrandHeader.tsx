import { Bell, HelpCircle } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";

export function BrandHeader({ children }: { children?: ReactNode }) {
  return (
    <header className="bg-brand-gradient text-primary-foreground">
      <div className="flex items-center justify-between gap-3 px-4 pb-4 pt-4">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white text-lg font-black text-[#2638a8] shadow-sm">B</span>
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-[18px] font-bold tracking-tight">bradesco</span>
            <span className="block truncate text-xs font-medium text-white/85">empresas e negócios</span>
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button type="button" aria-label="Ajuda" className="grid size-10 place-items-center rounded-full transition-colors hover:bg-white/10">
            <HelpCircle className="size-7" strokeWidth={1.8} />
          </button>
          <Link to="/app/notificacoes" aria-label="Notificações" className="relative grid size-10 place-items-center rounded-full transition-colors hover:bg-white/10">
            <Bell className="size-7" strokeWidth={1.8} />
            <span className="absolute right-1.5 top-1.5 grid size-4 place-items-center rounded-full bg-[#df202f] text-[9px] font-bold text-white ring-2 ring-[#4a2aa0]">0</span>
          </Link>
        </div>
      </div>
      {children}
      <div className="relative h-8 overflow-hidden bg-[#f7f7f8]">
        <div aria-hidden className="absolute -top-7 left-[-12%] h-14 w-[124%] rounded-[50%] bg-[#df202f]/30" />
        <div aria-hidden className="absolute -top-5 left-[18%] h-11 w-[92%] rounded-[50%] bg-[#2638a8]/35" />
        <div aria-hidden className="absolute -top-1 left-[-10%] h-11 w-[120%] rounded-[50%] bg-[#f7f7f8]" />
      </div>
    </header>
  );
}
