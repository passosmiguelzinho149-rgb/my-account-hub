import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { SubHeader } from "@/components/app/SubHeader";
import { BalanceCard } from "@/components/app/BalanceCard";
import { formatBRL } from "@/lib/mock-data";
import { formatDay, useBank, useBalance } from "@/lib/bank";
import { useSession } from "@/lib/session";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/extrato")({
  head: () => ({
    meta: [
      { title: "Extrato — Conta Empresas (demo)" },
      {
        name: "description",
        content: "Lançamentos, entradas e saídas da conta empresarial nesta demonstração.",
      },
      { property: "og:title", content: "Extrato — Conta Empresas (demo)" },
      { property: "og:description", content: "Lançamentos, entradas e saídas da conta empresarial." },
    ],
  }),
  component: ExtratoScreen,
});

const periods = ["7 dias", "15 dias", "30 dias", "90 dias"] as const;
const tabs = ["Todos", "Entradas", "Saídas", "Futuros"] as const;

function ExtratoScreen() {
  const { balanceHidden } = useSession();
  const [period, setPeriod] = useState<string>("7 dias");
  const [tab, setTab] = useState<string>("Todos");
  const [query, setQuery] = useState("");
  const { transactions } = useBank();
  const balance = useBalance();
  const days = Number.parseInt(period, 10);
  const since = Date.now() - days * 86_400_000;

  const filtered = transactions.filter((t) => {
    if (tab === "Entradas" && t.kind !== "in") return false;
    if (tab === "Saídas" && t.kind !== "out") return false;
    if (tab === "Futuros") return t.status === "Agendado";
    if (t.status === "Agendado") return false;
    if (new Date(t.createdAt).getTime() < since) return false;
    if (!query.trim()) return true;
    const q = query.trim().toLowerCase();
    return t.title.toLowerCase().includes(q) || t.counterpart.toLowerCase().includes(q);
  });

  return (
    <>
      <SubHeader title="Extrato" variant="deep" compactActions>
        <div className="px-4 pb-6">
          <BalanceCard hideDetailsLink />
        </div>
      </SubHeader>

      <main className="-mt-4 rounded-t-2xl bg-card px-4 pt-4 pb-4">
        <div className="mx-auto h-1.5 w-12 rounded-full bg-border" />

        <label className="mt-4 flex items-center gap-2 rounded-lg border border-border px-3 py-2.5">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar lançamentos"
            className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
            aria-label="Buscar lançamentos"
          />
          <Search className="size-5 shrink-0 text-foreground" aria-hidden />
        </label>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            className="flex shrink-0 items-center gap-1.5 rounded-full bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground"
          >
            Filtrar
            <SlidersHorizontal className="size-4" aria-hidden />
          </button>
          {periods.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPeriod(p)}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                period === p
                  ? "bg-primary-deep text-primary-foreground"
                  : "bg-secondary text-secondary-foreground",
              )}
            >
              {p}
            </button>
          ))}
        </div>

        <div className="mt-4 flex gap-5 border-b border-border">
          {tabs.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={cn(
                "-mb-px border-b-2 pb-2 text-base transition-colors",
                tab === t
                  ? "border-primary font-semibold text-foreground"
                  : "border-transparent text-muted-foreground",
              )}
            >
              {t}
            </button>
          ))}
        </div>

        <ul className="divide-y divide-border">
          {filtered.map((t) => (
            <li key={t.id}>
              <Link to="/app/comprovante/$id" params={{ id: t.id }} className="grid grid-cols-[3rem_minmax(0,1fr)_auto] gap-3 py-4">
              <div className="text-center">
                <p className="text-2xl leading-none font-bold">{formatDay(t.createdAt).slice(0, 2)}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(t.createdAt).toLocaleDateString("pt-BR", { month: "short" }).replace(".", "")}
                </p>
              </div>
              <div className="min-w-0">
                <p className="flex items-center gap-2 font-bold">
                  <span
                    className={cn(
                      "size-2 shrink-0 rounded-full",
                      t.kind === "in" ? "bg-income" : "bg-brand-red",
                    )}
                    aria-hidden
                  />
                  <span className="min-w-0 break-words">{t.title}</span>
                </p>
                <p className="mt-1 text-sm break-words text-muted-foreground">{t.counterpart}</p>
                <p className="text-sm text-muted-foreground">{formatDay(t.createdAt)} · {t.status}</p>
              </div>
              <p
                className={cn(
                  "shrink-0 self-center text-right font-semibold tabular-nums",
                  t.kind === "in" ? "text-income" : "text-brand-red",
                )}
              >
                {balanceHidden ? "R$ ••••" : formatBRL(t.amount)}
              </p>
              </Link>
            </li>
          ))}
          {filtered.length === 0 && (
            <li className="py-8 text-center text-sm text-muted-foreground">
              Nenhum lançamento para este filtro.
            </li>
          )}
        </ul>

        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-t border-border pt-4">
          <p className="truncate font-semibold">Saldo do dia</p>
          <p className="shrink-0 font-semibold tabular-nums">
            {balanceHidden ? "R$ ••••••••" : formatBRL(balance)}
          </p>
        </div>
      </main>
    </>
  );
}