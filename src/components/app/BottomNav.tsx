import { Link } from "@tanstack/react-router";
import { House, MessageCircle, ShoppingBag, User, Grid2X2 } from "lucide-react";

const items = [
  { to: "/app", label: "Início", Icon: House, exact: true },
  { to: "/app/chat", label: "Chat", Icon: MessageCircle, exact: false },
  { to: "/app/servicos", label: "Shop", Icon: ShoppingBag, exact: false },
  { to: "/app/perfil", label: "Perfil", Icon: User, exact: false },
  { to: "/app/servicos", label: "Serviços", Icon: Grid2X2, exact: false },
] as const;

/** Barra de navegação inferior fixa (padrão app mobile). */
export function BottomNav() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 bottom-0 z-40 h-16 overflow-hidden"
      >
        <div className="absolute -bottom-9 left-[-12%] h-16 w-[124%] rounded-[50%] bg-brand-red" />
        <div className="absolute -bottom-7 left-[10%] h-12 w-[105%] rounded-[50%] bg-primary/40" />
        <div className="absolute -bottom-10 left-[38%] h-14 w-[82%] rounded-[50%] bg-primary-deep" />
      </div>

      <nav className="fixed inset-x-0 bottom-16 z-50 border-t border-border/60 bg-card">
        <ul className="mx-auto flex max-w-lg">
          {items.map(({ to, label, Icon, exact }) => (
            <li key={label} className="flex-1">
              <Link
                to={to}
                activeOptions={{ exact }}
                className="flex h-16 flex-col items-center justify-center gap-1 text-muted-foreground transition-colors data-[status=active]:text-primary"
              >
                <Icon className="size-7" aria-hidden />
                <span className="text-xs font-medium">{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
