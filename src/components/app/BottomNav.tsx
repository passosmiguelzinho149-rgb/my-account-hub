import { Link } from "@tanstack/react-router";
import { Barcode, House, Settings2, WalletCards } from "lucide-react";

const items = [
  { to: "/app", label: "Início", Icon: House, exact: true },
  { to: "/app/extrato", label: "Contas", Icon: WalletCards, exact: false },
  { to: "/app/pagamentos", label: "Pagamentos", Icon: Barcode, exact: false },
  { to: "/app/servicos", label: "Serviços", Icon: Settings2, exact: false },
] as const;

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-[#e6e6ea] bg-white/95 shadow-[0_-4px_16px_rgba(20,30,60,.06)] backdrop-blur">
      <ul className="mx-auto grid max-w-lg grid-cols-4">
        {items.map(({ to, label, Icon, exact }) => (
          <li key={label}>
            <Link
              to={to}
              activeOptions={{ exact }}
              className="flex h-[68px] flex-col items-center justify-center gap-1 text-[#596070] transition-colors data-[status=active]:text-[#2638a8]"
            >
              <Icon className="size-6" strokeWidth={1.7} aria-hidden />
              <span className="text-[11px] font-semibold">{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
