import { Link } from "@tanstack/react-router";
import { CalendarClock } from "lucide-react";
import { formatBRL } from "@/lib/mock-data";
import { useBank, type TxCategory } from "@/lib/bank";

/**
 * Lista as operações agendadas (ainda não executadas) de uma categoria.
 * Usada em Transferências, Pagamentos e outras telas de operação.
 */
export function ScheduledList({ category }: { category: TxCategory }) {
  const { transactions } = useBank();
  const scheduled = transactions.filter(
    (tx) => tx.status === "Agendado" && tx.category === category,
  );
  if (scheduled.length === 0) return null;

  return (
    <section aria-label="Operações agendadas" className="mt-6">
      <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        <CalendarClock className="size-4" aria-hidden />
        Agendadas
      </h2>
      <ul className="divide-y divide-border rounded-xl bg-card shadow-card">
        {scheduled.map((tx) => (
          <li key={tx.id}>
            <Link
              to="/app/comprovante/$id"
              params={{ id: tx.id }}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-4"
            >
              <span className="min-w-0">
                <span className="block truncate font-medium">{tx.title}</span>
                <span className="block truncate text-sm text-muted-foreground">
                  {tx.counterpart}
                  {tx.scheduledFor
                    ? ` · ${new Date(tx.scheduledFor).toLocaleDateString("pt-BR")}`
                    : ""}
                </span>
              </span>
              <span className="shrink-0 font-semibold tabular-nums">{formatBRL(tx.amount)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
