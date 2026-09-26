import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowDown,
  ArrowUp,
  ArrowLeftRight,
  Barcode,
  ChevronRight,
  CreditCard,
  HandCoins,
  MessageCircle,
  PieChart,
  Settings2,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import { BrandHeader } from "@/components/app/BrandHeader";
import { BalanceCard } from "@/components/app/BalanceCard";
import { account, formatBRL } from "@/lib/mock-data";
import { useBank } from "@/lib/bank";

export const Route = createFileRoute("/app/")({
  head: () => ({
    meta: [
      { title: "Início — Conta Empresas (demo)" },
      {
        name: "description",
        content:
          "Saldo, resumo diário, favoritos, notificações e acesso rápido aos serviços da conta empresarial.",
      },
      { property: "og:title", content: "Início — Conta Empresas (demo)" },
      {
        property: "og:description",
        content: "Saldo, favoritos, notificações e serviços da conta empresarial de demonstração.",
      },
    ],
  }),
  component: HomeScreen,
});

const favorites = [
  { label: "Pix", Icon: Zap, to: "/app/pix" },
  { label: "Transferências", Icon: ArrowLeftRight, to: "/app/transferencias" },
  { label: "Pagamentos", Icon: Barcode, to: "/app/pagamentos" },
  { label: "Cartões", Icon: CreditCard, to: "/app/cartoes" },
  { label: "Empréstimos", Icon: HandCoins, to: "/app/credito" },
  { label: "Investimentos", Icon: TrendingUp, to: "/app/servico/$slug", slug: "investimentos" },
  { label: "Open Finance", Icon: PieChart, to: "/app/servico/$slug", slug: "open-finance" },
  { label: "Personalizar", Icon: Settings2, to: "/app/servicos" },
] as const;

const tips = [
  {
    title: "Pix sem susto",
    body: "Confira sempre o nome e o CPF/CNPJ de quem recebe antes de confirmar.",
  },
  {
    title: "Cartão virtual",
    body: "Use o cartão virtual para compras on-line e troque o número quando quiser.",
  },
];

function HomeScreen() {
  const { transactions } = useBank();
  const today = new Date().toDateString();
  const dayTx = transactions.filter(
    (t) => t.status === "Concluído" && new Date(t.createdAt).toDateString() === today,
  );
  const inflow = dayTx.filter((t) => t.kind === "in").reduce((s, t) => s + t.amount, 0);
  const outflow = dayTx.filter((t) => t.kind === "out").reduce((s, t) => s + t.amount, 0);

  return (
    <>
      <BrandHeader>
        <div className="px-4 pb-6">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
            <div className="min-w-0">
              <h1 className="text-lg font-bold break-words">Olá, {account.holder}</h1>
              <p className="mt-1 text-sm opacity-90">CNPJ: {account.cnpj}</p>
            </div>

          </div>
          <BalanceCard showAccount className="mt-4" />
        </div>
      </BrandHeader>

      <main className="px-4 py-5">
        <h2 className="text-lg font-semibold">Favoritos</h2>
        <ul className="mt-3 grid grid-cols-4 gap-3">
          {favorites.map(({ label, Icon, to, ...rest }) => (
            <li key={label}>
              <Link
                to={to}
                params={"slug" in rest ? { slug: rest.slug } : {}}
                className="group flex h-full flex-col items-center gap-2 rounded-2xl bg-card px-1 py-2.5 text-center transition-transform active:scale-95"
              >
                <span className="grid size-14 place-items-center rounded-2xl border border-border/70 bg-card shadow-card transition-colors group-hover:border-primary/30">
                  <Icon className="size-6 text-primary" aria-hidden />
                </span>
                <span className="text-[11px] leading-tight font-medium">{label}</span>
              </Link>
            </li>
          ))}
        </ul>
        <Link
          to="/app/servicos"
          className="mt-3 inline-flex w-full items-center justify-center gap-1 rounded-full py-2 text-sm font-semibold text-primary"
        >
          Ver mais serviços
          <ChevronRight className="size-4" aria-hidden />
        </Link>

        <section className="mt-4 rounded-2xl border border-border/70 bg-card p-4 shadow-card">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
            <h2 className="truncate text-lg font-semibold">Resumo diário</h2>
            <span className="shrink-0 text-sm text-muted-foreground">
              {new Date().toLocaleDateString("pt-BR")}
            </span>
          </div>
          <dl className="mt-4 grid grid-cols-2 gap-4">
            <div className="min-w-0">
              <dt className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <ArrowUp className="size-4 text-income" aria-hidden />
                Entradas
              </dt>
              <dd className="mt-1 truncate font-semibold tabular-nums">{formatBRL(inflow)}</dd>
            </div>
            <div className="min-w-0">
              <dt className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <ArrowDown className="size-4 text-brand-red" aria-hidden />
                Saídas
              </dt>
              <dd className="mt-1 truncate font-semibold tabular-nums">{formatBRL(outflow)}</dd>
            </div>
          </dl>
          <Link
            to="/app/extrato"
            className="mt-4 inline-flex items-center gap-1 font-medium text-primary underline underline-offset-4"
          >
            Ver extrato
            <ChevronRight className="size-4" aria-hidden />
          </Link>
        </section>

        <Link
          to="/app/chat"
          className="mt-4 flex items-center gap-3 rounded-2xl border border-border/70 bg-card p-4 shadow-card"
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-secondary text-secondary-foreground">
            <MessageCircle className="size-5" aria-hidden />
          </span>
          <span className="min-w-0">
            <span className="block font-semibold">Assistente virtual</span>
            <span className="block text-sm text-muted-foreground">
              Tire dúvidas e abra funções por conversa.
            </span>
          </span>
          <ChevronRight className="ml-auto size-5 shrink-0 text-brand-red" aria-hidden />
        </Link>

        <h2 className="mt-6 text-lg font-semibold">Ofertas e benefícios</h2>
        <Link
          to="/app/credito"
          className="mt-3 flex items-center gap-3 rounded-2xl border border-border/70 bg-card p-4 shadow-card"
        >
          <Sparkles className="size-6 shrink-0 text-brand-red" aria-hidden />
          <span className="min-w-0">
            <span className="block font-semibold">Capital de giro pré-aprovado</span>
            <span className="block text-sm text-muted-foreground">
              Simule prazos e parcelas nesta demonstração.
            </span>
          </span>
        </Link>

        <h2 className="mt-6 text-lg font-semibold">Dicas e novidades</h2>
        <ul className="mt-3 space-y-3">
          {tips.map((tip) => (
            <li key={tip.title} className="rounded-xl border border-border bg-card p-4 shadow-card">
              <p className="font-semibold">{tip.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{tip.body}</p>
            </li>
          ))}
        </ul>

        <p className="mt-6 text-xs text-muted-foreground">
          Ambiente de demonstração: nenhuma operação movimenta dinheiro real.
        </p>
      </main>
    </>
  );
}
