import { Link } from "@tanstack/react-router";
import { House, MessageCircle, DollarSign, User } from "lucide-react";

const items = [
  { to: "/app", label: "Início", Icon: House, exact: true },
  { to: "/app/chat", label: "Chat", Icon: MessageCircle, exact: false },
  { to: "/app/servicos", label: "Serviços", Icon: DollarSign, exact: false },
  { to: "/app/perfil", label: "Perfil", Icon: User, exact: false },
] as const;

/** Barra de navegação inferior fixa (padrão app mobile). */
export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card">
      <ul className="mx-auto flex max-w-lg">
        {items.map(({ to, label, Icon, exact }) => (
          <li key={to} className="flex-1">
            <Link
              to={to}
              activeOptions={{ exact }}
              className="flex flex-col items-center gap-1 py-2.5 text-muted-foreground transition-colors data-[status=active]:text-primary"
            >
              <Icon className="size-6" aria-hidden />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}