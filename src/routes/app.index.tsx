import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ChevronRight,
  CreditCard,
  HandCoins,
  MessageCircle,
  PieChart,
  ShoppingBag,
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
      { name: "description", content: "Tela inicial da conta empresarial de demonstração." },
    ],
  }),
  component: HomeScreen,
});

function HomeScreen() {
  const { transactions } = useBank();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const today = now.toDateString();
  const dayTx = transactions.filter(
    (t) => t.status === "Concluído" && new Date(t.createdAt).toDateString() === today,
  );
  const inflow = dayTx.filter((t) => t.kind === "in").reduce((s, t) => s + t.amount, 0);
  const outflow = dayTx.filter((t) => t.kind === "out").reduce((s, t) => s + t.amount, 0);

  return (
    <>
      <BrandHeader>
        <div className="px-4 pb-7">
          <div className="min-w-0">
            <h1 className="text-[22px] font-bold leading-tight">Agendamento de transferência</h1>
            <p className="mt-1 text-sm font-medium opacity-90">Dezembro</p>
            <p className="mt-1 text-sm font-semibold opacity-95">R$ 3.000.000,00</p>
          </div>
          <BalanceCard
            showAccount
            className="mt-5 rounded-2xl border border-primary-foreground/10 bg-primary-deep/45 p-5 shadow-lg"
          />
        </div>
      </BrandHeader>

      <main className="bg-background px-5 pb-8 pt-5">
        <section>
          <div className="rounded-2xl bg-card p-5 shadow-[0_8px_25px_rgba(30,50,70,0.06)]">
            <div className="flex items-center justify-between">
              <h2 className="text-[20px] font-bold">Resumo diário</h2>
              <span className="text-sm text-muted-foreground">{now.toLocaleDateString("pt-BR")}</span>
            </div>
            <dl className="mt-5 grid grid-cols-2 divide-x divide-border">
              <div className="pr-4">
                <dt className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ArrowUp className="size-4 text-income" /> Entradas
                </dt>
                <dd className="mt-2 text-lg font-semibold tabular-nums">{formatBRL(inflow)}</dd>
              </div>
              <div className="pl-4">
                <dt className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ArrowDown className="size-4 text-brand-red" /> Saídas
                </dt>
                <dd className="mt-2 text-lg font-semibold tabular-nums">{formatBRL(outflow)}</dd>
              </div>
            </dl>
            <Link
              to="/app/extrato"
              className="mt-5 inline-flex items-center gap-1 font-semibold text-primary underline underline-offset-2"
            >
              Consultar extrato <ChevronRight className="size-4" />
            </Link>
          </div>
        </section>

        <section className="mt-7">
          <h2 className="text-[22px] font-bold">Soluções para sua empresa</h2>
          <div className="mt-3 overflow-hidden rounded-3xl bg-card shadow-[0_8px_25px_rgba(30,50,70,0.08)]">
            <Link to="/app/credito" className="flex min-h-[154px] items-stretch">
              <div className="w-[30%] shrink-0 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1753161022783-160d6579f86d?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=700"
                  alt="Pessoa usando celular"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex flex-1 items-center justify-between gap-3 p-5">
                <div>
                  <h3 className="text-lg font-bold">Linhas de crédito</h3>
                  <p className="mt-2 text-[15px] leading-snug text-muted-foreground">
                    Exclusivas para você que é MEI!<br />Clique aqui.
                  </p>
                </div>
                <ChevronRight className="size-7 shrink-0 text-primary" />
              </div>
            </Link>
          </div>
          <div className="mt-3 flex justify-center gap-2">
            <span className="size-2.5 rounded-full bg-muted" />
            <span className="h-2.5 w-12 rounded-full bg-primary" />
            <span className="size-2.5 rounded-full bg-muted" />
          </div>
        </section>

        <section className="mt-7">
          <h2 className="text-[22px] font-bold">Acesso rápido</h2>
          <div className="mt-3 grid grid-cols-5 gap-2">
            <Link to="/app/pix" className="flex min-w-0 min-h-[104px] flex-col items-center justify-center rounded-2xl bg-card px-1.5 py-3 text-center shadow-[0_8px_25px_rgba(30,50,70,0.08)]">
              <Zap className="size-8 text-primary" strokeWidth={1.6} />
              <span className="mt-2 text-[11px] font-semibold leading-tight">Pix</span>
            </Link>
            <Link to="/app/credito" className="flex min-w-0 min-h-[104px] flex-col items-center justify-center rounded-2xl bg-card px-1 py-3 text-center shadow-[0_8px_25px_rgba(30,50,70,0.08)]">
              <HandCoins className="size-8 text-primary" strokeWidth={1.6} />
              <span className="mt-2 text-[10px] font-semibold leading-tight">Linhas de<br />crédito</span>
            </Link>
            <Link to="/app/cartoes" className="flex min-w-0 min-h-[104px] flex-col items-center justify-center rounded-2xl bg-card px-1.5 py-3 text-center shadow-[0_8px_25px_rgba(30,50,70,0.08)]">
              <CreditCard className="size-8 text-primary" strokeWidth={1.6} />
              <span className="mt-2 text-[11px] font-semibold leading-tight">Cartões</span>
            </Link>
            <Link to="/app/servico/$slug" params={{ slug: "open-finance" }} className="flex min-w-0 min-h-[104px] flex-col items-center justify-center rounded-2xl bg-card px-1 py-3 text-center shadow-[0_8px_25px_rgba(30,50,70,0.08)]">
              <PieChart className="size-8 text-primary" strokeWidth={1.6} />
              <span className="mt-2 text-[10px] font-semibold leading-tight">Open<br />Finance</span>
            </Link>
            <Link to="/app/chat" className="flex min-w-0 min-h-[104px] flex-col items-center justify-center rounded-2xl bg-card px-1 py-3 text-center shadow-[0_8px_25px_rgba(30,50,70,0.08)]">
              <MessageCircle className="size-8 text-primary" strokeWidth={1.6} />
              <span className="mt-2 text-[10px] font-semibold leading-tight">WhatsApp</span>
            </Link>
          </div>
        </section>

        <section className="mt-7">
          <h2 className="text-[22px] font-bold">Ofertas</h2>
          <div className="mt-3 overflow-hidden rounded-3xl bg-card shadow-[0_8px_25px_rgba(30,50,70,0.08)]">
            <Link to="/app/credito" className="flex min-h-[150px] items-stretch">
              <div className="w-[30%] bg-gradient-to-br from-red-100 via-red-50 to-white">
                <img
                  src="https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=700"
                  alt="Pessoa usando celular"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex flex-1 items-center justify-between p-5">
                <div>
                  <h3 className="text-lg font-bold">A melhor oferta do consignado</h3>
                  <p className="mt-2 text-sm text-muted-foreground">Simule e autorize a consulta dos seus dados.</p>
                </div>
                <ChevronRight className="size-7 shrink-0 text-primary" />
              </div>
            </Link>
          </div>
        </section>

        <section className="mt-7">
          <h2 className="text-[22px] font-bold">Benefícios e parcerias</h2>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <Link to="/app/servicos" className="flex min-h-[100px] items-center gap-3 rounded-2xl bg-gradient-to-br from-[#2638a8] to-[#5b2aa0] px-5 text-white shadow-lg">
              <ShoppingBag className="size-10 shrink-0" strokeWidth={1.6} />
              <span className="font-bold">Oferta com cashback</span>
            </Link>
            <Link to="/app/servicos" className="flex min-h-[100px] items-center gap-3 rounded-2xl bg-brand-red px-5 text-primary-foreground shadow-lg">
              <ShoppingBag className="size-10 shrink-0" strokeWidth={1.6} />
              <span className="font-bold">Superoferta no shop</span>
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
