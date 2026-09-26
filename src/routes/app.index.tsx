import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ChevronRight,
  CreditCard,
  PieChart,
  ReceiptText,
  Settings2,
  ShoppingBag,
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
      { name: "description", content: "Tela inicial da conta empresarial de demonstração." },
    ],
  }),
  component: HomeScreen,
});

const quickAccess = [
  { label: "Pix", Icon: Zap, to: "/app/pix" },
  { label: "Pagamentos", Icon: ReceiptText, to: "/app/pagamentos" },
  { label: "Cartões", Icon: CreditCard, to: "/app/cartoes" },
  { label: "Extrato", Icon: PieChart, to: "/app/extrato" },
  { label: "Transferências", Icon: TrendingUp, to: "/app/transferencias" },
  { label: "Serviços", Icon: Settings2, to: "/app/servicos" },
] as const;

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
        <div className="px-4 pb-5">
          <h1 className="max-w-[360px] text-[23px] font-bold leading-tight">Olá, {account.holder}</h1>
          <p className="mt-2 text-[14px] font-medium text-white/90">{account.company}</p>
          <p className="mt-1 text-[14px] text-white/90">CNPJ: {account.cnpj}</p>
          <BalanceCard
            showAccount
            className="mt-5 rounded-[22px] border border-white/10 bg-white/20 p-5 shadow-xl backdrop-blur-sm"
          />
        </div>
      </BrandHeader>

      <main className="bg-[#f7f7f8] px-4 pb-28 pt-2 text-[#202124]">
        <section className="pt-3">
          <div className="flex items-center justify-between">
            <h2 className="text-[20px] font-bold">Resumo diário</h2>
            <span className="text-sm text-gray-500">{now.toLocaleDateString("pt-BR")}</span>
          </div>
          <div className="mt-3 rounded-[20px] bg-white p-5 shadow-[0_5px_18px_rgba(20,30,60,.08)]">
            <dl className="grid grid-cols-2 gap-5">
              <div>
                <dt className="flex items-center gap-2 text-sm text-gray-500">
                  <ArrowUp className="size-5 text-[#159d78]" /> Entradas
                </dt>
                <dd className="mt-1 text-lg font-bold tabular-nums">{formatBRL(inflow)}</dd>
              </div>
              <div>
                <dt className="flex items-center gap-2 text-sm text-gray-500">
                  <ArrowDown className="size-5 text-[#df202f]" /> Saídas
                </dt>
                <dd className="mt-1 text-lg font-bold tabular-nums">{formatBRL(outflow)}</dd>
              </div>
            </dl>
            <Link to="/app/extrato" className="mt-4 inline-flex items-center gap-1 text-base font-bold text-[#2638a8]">
              Consultar extrato <ChevronRight className="size-5" />
            </Link>
          </div>
        </section>

        <section className="mt-6">
          <h2 className="text-[20px] font-bold">Soluções para sua empresa</h2>
          <Link
            to="/app/pix"
            className="mt-3 flex min-h-[138px] overflow-hidden rounded-[22px] bg-white shadow-[0_5px_18px_rgba(20,30,60,.08)] transition-transform active:scale-[.99]"
          >
            <div className="flex w-[34%] shrink-0 items-center justify-center overflow-hidden bg-gradient-to-br from-[#e4ebf4] via-[#dfe9e4] to-[#f2ded9]">
              <div className="relative flex size-24 items-center justify-center rounded-2xl bg-white/45">
                <Zap className="size-12 text-[#159d78]" strokeWidth={1.7} />
                <span className="absolute -right-1 -top-1 grid size-8 place-items-center rounded-lg bg-[#159d78] text-white">
                  <span className="text-sm font-black">P</span>
                </span>
              </div>
            </div>
            <div className="flex min-w-0 flex-1 flex-col justify-center p-4">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-[20px] font-bold">Pix</h3>
                <ChevronRight className="size-5 text-[#2638a8]" />
              </div>
              <p className="mt-2 text-sm leading-snug text-gray-600">
                Pague, receba e transfira a qualquer hora do dia.
              </p>
            </div>
          </Link>
        </section>

        <section className="mt-6">
          <h2 className="text-[20px] font-bold">Acesso rápido</h2>
          <div className="mt-3 flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {quickAccess.map(({ label, Icon, to }) => (
              <Link
                key={label}
                to={to}
                className="flex min-w-[88px] flex-col items-center rounded-2xl bg-white px-3 py-4 shadow-[0_5px_18px_rgba(20,30,60,.08)] transition-transform active:scale-95"
              >
                <span className="grid size-11 place-items-center rounded-xl bg-[#eef0ff]">
                  <Icon className="size-6 text-[#2638a8]" strokeWidth={1.8} />
                </span>
                <span className="mt-2 text-center text-xs font-semibold leading-tight">{label}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-6 pb-4">
          <Link to="/app/servicos" className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-[0_5px_18px_rgba(20,30,60,.08)]">
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-xl bg-[#eef0ff]">
                <ShoppingBag className="size-6 text-[#2638a8]" />
              </span>
              <div>
                <p className="font-bold">Mais soluções</p>
                <p className="text-sm text-gray-500">Veja todos os serviços disponíveis</p>
              </div>
            </div>
            <ChevronRight className="size-5 text-[#2638a8]" />
          </Link>
        </section>
      </main>
    </>
  );
}
