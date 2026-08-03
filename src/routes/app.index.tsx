import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDown, ArrowUp, ChevronRight, HandCoins, CreditCard, PieChart, MessageCircle } from "lucide-react";
import { BrandHeader } from "@/components/app/BrandHeader";
import { BalanceCard } from "@/components/app/BalanceCard";
import { account, formatBRL } from "@/lib/mock-data";

export const Route = createFileRoute("/app/")({
  head: () => ({
    meta: [
      { title: "Início — Conta Empresas (demo)" },
      {
        name: "description",
        content: "Resumo diário, saldo disponível e acesso rápido aos serviços da conta empresarial.",
      },
      { property: "og:title", content: "Início — Conta Empresas (demo)" },
      {
        property: "og:description",
        content: "Resumo diário, saldo disponível e acesso rápido da conta empresarial.",
      },
    ],
  }),
  component: HomeScreen,
});

const quickAccess = [
  { to: "/app/credito", label: "Linhas de Crédito", Icon: HandCoins },
  { to: "/app/cartoes", label: "Cartões", Icon: CreditCard },
  { to: "/app/servico/open-finance", label: "Open Finance", Icon: PieChart },
  { to: "/app/servico/whatsapp", label: "WhatsApp", Icon: MessageCircle },
] as const;

function HomeScreen() {
  return (
    <>
      <BrandHeader>
        <div className="px-4 pb-6">
          <h1 className="text-lg font-bold break-words">Olá, {account.holder}</h1>
          <p className="mt-1 text-sm opacity-90">{account.company}</p>
          <p className="text-sm opacity-90">CNPJ: {account.cnpj}</p>
          <BalanceCard showAccount className="mt-4" />
        </div>
      </BrandHeader>

      <main className="px-4 py-5">
        <section className="rounded-xl border border-border bg-card p-4 shadow-card">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
            <h2 className="truncate text-lg font-semibold">Resumo diário</h2>
            <span className="shrink-0 text-sm text-muted-foreground">{account.summaryDate}</span>
          </div>
          <dl className="mt-4 grid grid-cols-2 gap-4">
            <div className="min-w-0">
              <dt className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <ArrowUp className="size-4 text-income" aria-hidden />
                Entradas
              </dt>
              <dd className="mt-1 truncate font-semibold tabular-nums">
                {formatBRL(account.inflow)}
              </dd>
            </div>
            <div className="min-w-0">
              <dt className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <ArrowDown className="size-4 text-brand-red" aria-hidden />
                Saídas
              </dt>
              <dd className="mt-1 truncate font-semibold tabular-nums">
                {formatBRL(account.outflow)}
              </dd>
            </div>
          </dl>
        </section>

        <Link
          to="/app/extrato"
          className="mt-4 inline-flex items-center gap-1 font-medium text-primary underline underline-offset-4"
        >
          Consultar extrato
          <ChevronRight className="size-4" aria-hidden />
        </Link>

        <h2 className="mt-6 text-lg font-semibold">Soluções para sua empresa</h2>
        <Link
          to="/app/servico/$slug"
          params={{ slug: "pix" }}
          className="mt-3 flex items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-card"
        >
          <span className="grid size-12 shrink-0 place-items-center rounded-full bg-secondary text-secondary-foreground">
            Pix
          </span>
          <span className="min-w-0">
            <span className="block font-semibold">Pix</span>
            <span className="block text-sm text-muted-foreground">
              Pague, receba e transfira a qualquer hora do dia.
            </span>
          </span>
        </Link>

        <h2 className="mt-6 text-lg font-semibold">Acesso rápido</h2>
        <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {quickAccess.map(({ to, label, Icon }) => (
            <li key={to}>
              <Link
                to={to}
                className="flex h-full flex-col items-center justify-center gap-2 rounded-xl border border-border bg-card px-2 py-4 text-center shadow-card"
              >
                <Icon className="size-6 text-primary" aria-hidden />
                <span className="text-xs font-medium">{label}</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="bg-brand-gradient mt-6 rounded-xl p-4 text-primary-foreground">
          <p className="font-bold">Vai pagar boleto? Atenção!</p>
          <p className="mt-1 text-sm opacity-95">
            Confira os dados e valide a origem antes de confirmar qualquer transação.
          </p>
        </div>
      </main>
    </>
  );
}