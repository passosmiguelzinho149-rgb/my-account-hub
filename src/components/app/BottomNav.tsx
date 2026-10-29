import { Link } from "@tanstack/react-router";
import { House, MessageCircle, Settings2, UserRound } from "lucide-react";

const items = [
  { to: "/app", label: "Início", Icon: House, exact: true },
  { to: "/app/chat", label: "Chat", Icon: MessageCircle, exact: false },
  { to: "/app/servicos", label: "Serviços", Icon: Settings2, exact: false },
  { to: "/app/perfil", label: "Perfil", Icon: UserRound, exact: false },
] as const;

export function BottomNav() {
  return (
    <nav aria-label="Navegação principal" className="fixed inset-x-0 bottom-0 z-50 border-t border-[#e6e6ea] bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_16px_rgba(20,30,60,.06)] backdrop-blur-xl">
      <ul className="mx-auto grid h-[56px] w-full max-w-[430px] grid-cols-4 px-5">
        {items.map(({ to, label, Icon, exact }) => (
          <li key={label} className="flex justify-center">
            <Link
              to={to}
              activeOptions={{ exact }}
              className="group relative flex h-[56px] w-[64px] min-w-0 flex-col items-center justify-center gap-0.5 text-[#596070] transition-all duration-150 active:scale-[.96] data-[status=active]:font-semibold data-[status=active]:text-[#2638a8]"
            >
              <span className="absolute top-0 h-[2px] w-6 scale-x-0 rounded-full bg-[#2638a8] transition-transform group-data-[status=active]:scale-x-100" aria-hidden />
              <Icon className="size-5 transition-transform duration-150 group-data-[status=active]:scale-105" strokeWidth={1.8} aria-hidden />
              <span className="text-[10px] leading-tight">{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
