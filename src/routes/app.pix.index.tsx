import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  ChevronRight,
  History,
  KeyRound,
  QrCode,
  SlidersHorizontal,
} from "lucide-react";
import { SubHeader } from "@/components/app/SubHeader";
import { BalanceCard } from "@/components/app/BalanceCard";
import { formatBRL } from "@/lib/mock-data";
import { formatDay, useBank } from "@/lib/bank";

export const Route = createFileRoute("/app/pix/")({
  head: () => ({
    meta: [
      { title: "Pix — Conta Empresas (demo)" },
      {
        name: "description",
        content:
          "Envie e receba Pix por chave, QR Code ou copia e cola, gerencie chaves, limites e histórico.",
      },
      { property: "og:title", content: "Pix — Conta Empresas (demo)" },
      {
        property: "og:description",
        content: "Enviar, receber, chaves, limites e histórico de Pix na conta empresarial.",
      },
    ],
  }),
  component: PixHub,
});

const shortcuts = [
  { label: "Pagar ou enviar", to: "/app/pix/enviar", Icon: ArrowUpRight },
  { label: "Receber ou cobrar", to: "/app/pix/receber", Icon: QrCode },
  { label: "Minhas chaves", to: "/app/pix/chaves", Icon: KeyRound },
  { label: "Limites", to: "/app/pix/limites", Icon: SlidersHorizontal },
] as const;

function PixHub() {
  const { transactions } = useBank();
  const recent = transactions.filter((t) => t.category === "pix").slice(0, 4);

  return (
    <>
      <SubHeader title="Pix" variant="deep" compactActions>
        <div className="px-4 pb-6">
          <BalanceCard hideDetailsLink />
        </div>
      </SubHeader>

      <main className="px-4 py-5">
        <ul className="grid grid-cols-2 gap-3">
          {shortcuts.map(({ label, to, Icon }) => (
            <li key={label}>
              <Link
                to={to}
                className="flex h-full flex-col items-start gap-2 rounded-xl border border-border bg-card p-4 shadow-card transition-transform active:scale-95"
              >
                <Icon className="size-6 text-primary" aria-hidden />
                <span className="text-sm font-semibold">{label}</span>
              </Link>
            </li>
          ))}
        </ul>

        <Link
          to="/app/pix/historico"
          className="mt-4 flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-card"
        >
          <History className="size-5 shrink-0 text-primary" aria-hidden />
          <span className="min-w-0">
            <span className="block font-semibold">Histórico e comprovantes</span>
            <span className="block text-sm text-muted-foreground">
              Consulte todos os Pix desta demonstração.
            </span>
          </span>
          <ChevronRight className="ml-auto size-5 shrink-0 text-brand-red" aria-hidden />
        </Link>

        <h2 className="mt-6 text-lg font-semibold">Últimos Pix</h2>
        {recent.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">
            Nenhum Pix por aqui ainda. Faça o primeiro em “Pagar ou enviar”.
          </p>
        ) : (
          <ul className="mt-3 divide-y divide-border rounded-xl border border-border bg-card shadow-card">
            {recent.map((t) => (
              <li key={t.id}>
                <Link
                  to="/app/comprovante/$id"
                  params={{ id: t.id }}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 p-4"
                >
                  <span className="min-w-0">
                    <span className="block truncate font-semibold">{t.counterpart}</span>
                    <span className="block text-sm text-muted-foreground">
                      {formatDay(t.createdAt)} · {t.status}
                    </span>
                  </span>
                  <span
                    className={
                      t.kind === "in"
                        ? "shrink-0 font-semibold tabular-nums text-income"
                        : "shrink-0 font-semibold tabular-nums text-brand-red"
                    }
                  >
                    {t.kind === "in" ? "+" : "−"} {formatBRL(t.amount)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}

        <p className="mt-6 text-xs text-muted-foreground">
          Ambiente de demonstração: nenhum Pix movimenta dinheiro real.
        </p>
      </main>
    </>
  );
}
