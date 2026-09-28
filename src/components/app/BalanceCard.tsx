import { Eye, EyeOff } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { account, formatBRL } from "@/lib/mock-data";
import { useBalance } from "@/lib/bank";
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
 * O saldo vem do banco de dados da demonstração, então muda conforme
 * as operações simuladas (Pix, pagamentos, transferências...).
 */
export function BalanceCard({
  showAccount = false,
  hideDetailsLink = false,
  className,
}: BalanceCardProps) {
  const { balanceHidden, toggleBalance } = useSession();
  const balance = useBalance();

  return (
    <div className={cn("rounded-2xl border border-white/10 bg-primary-foreground/12 px-5 py-4 shadow-lg backdrop-blur-sm", className)}>
      {showAccount && (
        <div className="flex items-center gap-8 text-base font-semibold">
          <span>
            Agência: <strong>{account.branch}</strong>
          </span>
          <span>
            Conta: <strong>{account.number}</strong>
          </span>
        </div>
      )}
      <p className={cn("text-base", showAccount && "mt-5")}>Saldo disponível</p>
      <div className="mt-1 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <p className="truncate text-3xl font-bold tabular-nums">
            {balanceHidden ? "R$ ••••••••" : formatBRL(balance)}
          </p>
          <button
            type="button"
            onClick={toggleBalance}
            aria-label={balanceHidden ? "Mostrar saldo" : "Ocultar saldo"}
            aria-pressed={balanceHidden}
            className="shrink-0 rounded-full p-1 transition-colors hover:bg-primary-foreground/20 focus-visible:ring-2 focus-visible:ring-primary-foreground/70 focus-visible:outline-none"
          >
            {balanceHidden ? (
              <EyeOff className="size-6" aria-hidden />
            ) : (
              <Eye className="size-6" aria-hidden />
            )}
          </button>
        </div>
        {!hideDetailsLink && (
          <Link to="/app/extrato" className="shrink-0 self-end pb-1 text-base font-semibold underline underline-offset-4">
            Ver detalhes
          </Link>
        )}
      </div>
    </div>
  );
}
