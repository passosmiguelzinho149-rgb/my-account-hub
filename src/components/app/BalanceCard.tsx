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
    <div className={cn("w-full rounded-2xl border border-white/10 bg-primary-foreground/12 px-4 py-4 shadow-lg backdrop-blur-sm sm:px-5", className)}>
      {showAccount && (
        <div className="flex min-w-0 items-center gap-5 text-[15px] font-semibold sm:gap-8 sm:text-base">
          <span>
            Agência: <strong>{account.branch}</strong>
          </span>
          <span className="whitespace-nowrap">
            Conta: <strong>{account.number}</strong>
          </span>
        </div>
      )}
      <p className={cn("text-base", showAccount && "mt-5")}>Saldo disponível</p>
      <div className="mt-1 flex min-w-0 items-end justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <p className="min-w-0 whitespace-nowrap text-[clamp(1.05rem,5vw,1.75rem)] font-bold leading-tight tracking-tight tabular-nums">
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
              <EyeOff className="size-5 sm:size-6" aria-hidden />
            ) : (
              <Eye className="size-5 sm:size-6" aria-hidden />
            )}
          </button>
        </div>
        {!hideDetailsLink && (
          <Link to="/app/extrato" className="shrink-0 self-end pb-0.5 text-xs font-semibold underline underline-offset-4 sm:text-sm">
            Ver detalhes
          </Link>
        )}
      </div>
    </div>
  );
}
