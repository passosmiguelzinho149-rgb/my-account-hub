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

const PIX_EMITIDO_OUTRA_IF_MESMA_TIT = 132_500;

/** Card de saldo com o "olho" de ocultar/mostrar. */
export function BalanceCard({
  showAccount = false,
  hideDetailsLink = false,
  className,
}: BalanceCardProps) {
  const { balanceHidden, toggleBalance } = useSession();
  const balance = useBalance() - PIX_EMITIDO_OUTRA_IF_MESMA_TIT;

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
      <div className="mt-1 grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
        <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-1">
          <p className="min-w-0 whitespace-nowrap text-[clamp(.95rem,4.3vw,1.65rem)] font-bold leading-tight tracking-[-0.03em] tabular-nums">
            {balanceHidden ? "R$ ••••••••" : formatBRL(balance)}
          </p>
          <button
            type="button"
            onClick={toggleBalance}
            aria-label={balanceHidden ? "Mostrar saldo" : "Ocultar saldo"}
            aria-pressed={balanceHidden}
            className="shrink-0 rounded-full p-0.5 transition-colors hover:bg-primary-foreground/20 focus-visible:ring-2 focus-visible:ring-primary-foreground/70 focus-visible:outline-none"
          >
            {balanceHidden ? (
              <EyeOff className="size-5 sm:size-6" aria-hidden />
            ) : (
              <Eye className="size-5 sm:size-6" aria-hidden />
            )}
          </button>
        </div>
        {!hideDetailsLink && (
          <Link to="/app/extrato" className="ml-1 shrink-0 self-end whitespace-nowrap pb-0.5 text-[11px] font-semibold underline underline-offset-4 sm:text-sm">
            Ver detalhes
          </Link>
        )}
      </div>
    </div>
  );
}
