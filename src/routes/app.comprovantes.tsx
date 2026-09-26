import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { SubHeader } from "@/components/app/SubHeader";
import { formatBRL } from "@/lib/mock-data";
import { formatDateTime, useBank, type TxCategory } from "@/lib/bank";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/comprovantes")({
  head: () => ({
    meta: [
      { title: "Comprovantes — Conta Empresas (demo)" },
      {
        name: "description",
        content: "Todos os comprovantes de Pix, pagamentos, transferências e compras da demonstração.",
      },
      { property: "og:title", content: "Comprovantes — Conta Empresas (demo)" },
      { property: "og:description", content: "Comprovantes de Pix, pagamentos e transferências." },
    ],
  }),
  component: ComprovantesScreen,
});

const filters: { label: string; category?: TxCategory }[] = [
  { label: "Todos" },
  { label: "Pix", category: "pix" },
  { label: "Pagamentos", category: "pagamento" },
  { label: "Transferências", category: "transferencia" },
  { label: "Compras", category: "compra" },
];

function displayReceiptDate(t: { amount: number; kind: string; createdAt: string }, firstMatch = false): string {
  if (t.kind === "in" && t.amount === 26_750_000) return "11/06/2026 às 10:32:00";
  if (firstMatch && t.kind === "in" && t.amount === 52_625_000) return "18/06/2026 às 10:32:00";
  return formatDateTime(t.createdAt);
}

function ComprovantesScreen() {
  const { transactions } = useBank();
  const [active, setActive] = useState("Todos");

  const selected = filters.find((f) => f.label === active);
  const list = transactions.filter((t) => !selected?.category || t.category === selected.category);

  return (
    <>
      <SubHeader title="Comprovantes" compactActions />
      <main className="px-4 py-5">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {filters.map((f) => (
            <button
              key={f.label}
              type="button"
              onClick={() => setActive(f.label)}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                active === f.label
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        <ul className="mt-4 divide-y divide-border rounded-xl border border-border bg-card shadow-card">
          {list.map((t) => (
            <li key={t.id}>
              <Link
                to="/app/comprovante/$id"
                params={{ id: t.id }}
                className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3 p-4"
              >
                <span className="min-w-0">
                  <span className="block truncate font-semibold">{t.title}</span>
                  <span className="block truncate text-sm text-muted-foreground">
                    {t.counterpart}
                  </span>
                  <span className="block text-sm text-muted-foreground">
                    {displayReceiptDate(t, list.findIndex((item) => item.kind === "in" && item.amount === 52_625_000) === list.indexOf(t))}
                  </span>
                </span>
                <span
                  className={cn(
                    "shrink-0 font-semibold tabular-nums",
                    t.kind === "in" ? "text-income" : "text-brand-red",
                  )}
                >
                  {formatBRL(t.amount)}
                </span>
                <ChevronRight className="size-5 shrink-0 text-brand-red" aria-hidden />
              </Link>
            </li>
          ))}
          {list.length === 0 && (
            <li className="p-6 text-center text-sm text-muted-foreground">
              Nenhum comprovante para este filtro.
            </li>
          )}
        </ul>
      </main>
    </>
  );
}
