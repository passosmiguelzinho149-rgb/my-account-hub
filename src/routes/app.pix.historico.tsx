import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { SubHeader } from "@/components/app/SubHeader";
import { formatBRL } from "@/lib/mock-data";
import { formatDateTime, useBank } from "@/lib/bank";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/pix/historico")({
  head: () => ({
    meta: [
      { title: "Histórico de Pix — Conta Empresas (demo)" },
      {
        name: "description",
        content: "Todos os Pix enviados, recebidos e agendados, com acesso ao comprovante detalhado.",
      },
      { property: "og:title", content: "Histórico de Pix — Conta Empresas (demo)" },
      { property: "og:description", content: "Pix enviados, recebidos e agendados com comprovante." },
    ],
  }),
  component: HistoricoPix,
});

const tabs = ["Todos", "Enviados", "Recebidos", "Agendados"] as const;

function HistoricoPix() {
  const { transactions } = useBank();
  const [tab, setTab] = useState<string>("Todos");
  const [query, setQuery] = useState("");

  const list = transactions.filter((t) => {
    if (t.category !== "pix") return false;
    if (tab === "Enviados" && !(t.kind === "out" && t.status === "Concluído")) return false;
    if (tab === "Recebidos" && t.kind !== "in") return false;
    if (tab === "Agendados" && t.status !== "Agendado") return false;
    if (!query.trim()) return true;
    const q = query.trim().toLowerCase();
    return t.counterpart.toLowerCase().includes(q) || t.title.toLowerCase().includes(q);
  });

  return (
    <>
      <SubHeader title="Histórico de Pix" fallbackTo="/app/pix" compactActions />
      <main className="px-4 py-5">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nome"
          aria-label="Buscar por nome"
          className="w-full rounded-lg border border-border px-3 py-2.5 text-base outline-none focus-visible:ring-2 focus-visible:ring-primary"
        />

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {tabs.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                tab === t
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground",
              )}
            >
              {t}
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
                  <span className="block truncate font-semibold">{t.counterpart}</span>
                  <span className="block text-sm text-muted-foreground">
                    {formatDateTime(t.createdAt)}
                  </span>
                  <span className="block text-sm text-muted-foreground">{t.status}</span>
                </span>
                <span
                  className={cn(
                    "shrink-0 font-semibold tabular-nums",
                    t.kind === "in" ? "text-income" : "text-brand-red",
                  )}
                >
                  {t.kind === "in" ? "+" : "−"} {formatBRL(t.amount)}
                </span>
                <ChevronRight className="size-5 shrink-0 text-brand-red" aria-hidden />
              </Link>
            </li>
          ))}
          {list.length === 0 && (
            <li className="p-6 text-center text-sm text-muted-foreground">
              Nenhum Pix para este filtro.
            </li>
          )}
        </ul>
      </main>
    </>
  );
}
