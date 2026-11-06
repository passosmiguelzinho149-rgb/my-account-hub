import { Eye, EyeOff } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { account, formatBRL } from "@/lib/mock-data";
import { useBalance } from "@/lib/bank";
import { useSession } from "@/lib/session";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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
        <div className="flex min-w-0 flex-wrap items-center gap-x-6 gap-y-2 text-bank-label font-normal sm:gap-x-8">
          <span>Agência: <strong>{account.branch}</strong></span>
          <span className="whitespace-nowrap">Conta: <strong>{account.number}</strong></span>
        </div>
      )}

      <p className={cn("text-bank-label font-normal", showAccount && "mt-4")}>Saldo disponível</p>

      <div className="mt-2 flex min-w-0 flex-wrap items-center justify-between gap-x-3 gap-y-2">
        <div className="flex min-w-0 items-center gap-2">
          <p className="min-w-0 break-words text-bank-amount font-semibold tabular-nums">
            {balanceHidden ? "R$ ••••••••" : formatBRL(balance)}
          </p>
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={toggleBalance}
            aria-label={balanceHidden ? "Mostrar saldo" : "Ocultar saldo"}
            aria-pressed={balanceHidden}
            className="size-8 shrink-0 rounded-full text-inherit hover:bg-primary-foreground/20 hover:text-inherit"
          >
            {balanceHidden ? <EyeOff className="size-[19px]" aria-hidden /> : <Eye className="size-[19px]" aria-hidden />}
          </Button>
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
