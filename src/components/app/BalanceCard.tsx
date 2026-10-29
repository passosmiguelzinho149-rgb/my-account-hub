import { Eye, EyeOff } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { account, formatBRL } from "@/lib/mock-data";
import { useBalance } from "@/lib/bank";
import { useSession } from "@/lib/session";
import { cn } from "@/lib/utils";

interface BalanceCardProps {
  showAccount?: boolean;
  hideDetailsLink?: boolean;
  className?: string;
}

const PIX_EMITIDO_OUTRA_IF_MESMA_TIT = 132_500;

export function BalanceCard({ showAccount = false, hideDetailsLink = false, className }: BalanceCardProps) {
  const { balanceHidden, toggleBalance } = useSession();
  const balance = useBalance() - PIX_EMITIDO_OUTRA_IF_MESMA_TIT;

  return (
    <div className={cn("w-full rounded-[15px] border border-white/10 bg-primary-foreground/12 px-4 py-3.5 shadow-lg backdrop-blur-sm sm:px-5 sm:py-4", className)}>
      {showAccount && (
        <div className="flex min-w-0 items-center gap-6 text-[14px] font-semibold leading-none sm:gap-8 sm:text-[15px]">
          <span>Agência: <strong>{account.branch}</strong></span>
          <span className="whitespace-nowrap">Conta: <strong>{account.number}</strong></span>
        </div>
      )}

      <p className={cn("text-[13px] font-normal leading-none sm:text-sm", showAccount && "mt-5")}>Saldo disponível</p>

      <div className="mt-2 grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <p className="min-w-0 whitespace-nowrap text-[clamp(1.02rem,4.25vw,1.35rem)] font-semibold leading-none tracking-[-0.025em] tabular-nums">
            {balanceHidden ? "R$ ••••••••" : formatBRL(balance)}
          </p>
          <button
            type="button"
            onClick={toggleBalance}
            aria-label={balanceHidden ? "Mostrar saldo" : "Ocultar saldo"}
            aria-pressed={balanceHidden}
            className="shrink-0 rounded-full p-0.5 transition-colors hover:bg-primary-foreground/20 focus-visible:ring-2 focus-visible:ring-primary-foreground/70 focus-visible:outline-none"
          >
            {balanceHidden ? <EyeOff className="size-[19px]" aria-hidden /> : <Eye className="size-[19px]" aria-hidden />}
          </button>
        </div>

        {!hideDetailsLink && (
          <Link
            to="/app/saldo"
            className="shrink-0 whitespace-nowrap text-[12px] font-semibold underline underline-offset-4 sm:text-[13px]"
          >
            Ver detalhes
          </Link>
        )}
      </div>
    </div>
  );
}
