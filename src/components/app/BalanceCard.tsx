import { Eye, EyeOff } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { account, formatBRL } from "@/lib/mock-data";
import { useSession } from "@/lib/session";
import { cn } from "@/lib/utils";

interface BalanceCardProps {
  /** Mostra agência/conta (usado na Home). */
  showAccount?: boolean;
  /** Esconde o link "Ver detalhes" (na própria tela de Extrato). */
  hideDetailsLink?: boolean;
  className?: string;
}

/**
 * Card de saldo com o "olho" de ocultar/mostrar.
 * O estado vive no contexto de sessão, então alternar aqui reflete
 * imediatamente em todas as telas que exibem o saldo.
 */
export function BalanceCard({
  showAccount = false,
  hideDetailsLink = false,
  className,
}: BalanceCardProps) {
  const { balanceHidden, toggleBalance } = useSession();

  return (
    <div className={cn("rounded-xl bg-primary-foreground/12 p-4", className)}>
      {showAccount && (
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
          <span>
            Agência: <strong>{account.branch}</strong>
          </span>
          <span>
            Conta: <strong>{account.number}</strong>
          </span>
        </div>
      )}
      <p className={cn("text-sm", showAccount && "mt-3")}>Saldo disponível</p>
      <div className="mt-1 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <p className="truncate text-2xl font-bold tabular-nums">
            {balanceHidden ? "R$ ••••••••" : formatBRL(account.balance)}
          </p>
          <button
            type="button"
            onClick={toggleBalance}
            aria-label={balanceHidden ? "Mostrar saldo" : "Ocultar saldo"}
            aria-pressed={balanceHidden}
            className="shrink-0 rounded-full p-1 transition-colors hover:bg-primary-foreground/20 focus-visible:ring-2 focus-visible:ring-primary-foreground/70 focus-visible:outline-none"
          >
            {balanceHidden ? (
              <EyeOff className="size-5" aria-hidden />
            ) : (
              <Eye className="size-5" aria-hidden />
            )}
          </button>
        </div>
        {!hideDetailsLink && (
          <Link to="/app/extrato" className="shrink-0 text-sm underline underline-offset-4">
            Ver detalhes
          </Link>
        )}
      </div>
    </div>
  );
}