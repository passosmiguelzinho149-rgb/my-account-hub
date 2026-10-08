import { Bell, FileQuestion } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { useUnreadCount } from "@/lib/bank";

export function BrandHeader({ children }: { children?: ReactNode }) {
  const unreadCount = useUnreadCount();
  return (
    <header className="bg-brand-gradient text-primary-foreground">
      <div className="mobile-safe-top flex items-center justify-between gap-3 px-5 pb-5 pt-4">
        <div className="flex min-w-0 items-center gap-3">
          <img src="/bradesco-symbol.svg?v=white-1" alt="" aria-hidden className="h-14 w-14 shrink-0 object-contain" />
          <span className="min-w-0 leading-none">
            <span className="block truncate text-[28px] font-bold tracking-[-0.04em] text-white">bradesco</span>
            <span className="mt-1 block truncate text-[14px] font-normal leading-tight text-white/95">empresas e negócios</span>
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button type="button" aria-label="Ajuda" className="grid size-10 place-items-center rounded-full transition-colors hover:bg-white/10">
            <FileQuestion className="size-7" strokeWidth={1.8} />
          </button>
          <Link to="/app/notificacoes" aria-label="Notificações" className="relative grid size-10 place-items-center rounded-full transition-colors hover:bg-white/10">
            <Bell className="size-7" strokeWidth={1.8} />
            {unreadCount > 0 && <span className="absolute right-1 top-1 grid min-h-4 min-w-4 place-items-center rounded-full bg-[#df202f] px-1 text-[9px] font-bold text-white ring-2 ring-[#4a2aa0]">{unreadCount > 99 ? "99+" : unreadCount}</span>}
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
