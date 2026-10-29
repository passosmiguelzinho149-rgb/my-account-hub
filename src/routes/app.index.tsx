// ============= Tela inicial (Início) =============

import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, ChevronRight, ShoppingBag } from "lucide-react";
import creditoMulher from "@/assets/credito-mulher.jpg";
import { BalanceCard } from "@/components/app/BalanceCard";
import { BrandHeader } from "@/components/app/BrandHeader";
import { QuickAccessRail } from "@/components/app/QuickAccessRail";
import { ServiceGlyph } from "@/components/app/ServiceGlyph";
import { account, formatBRL } from "@/lib/mock-data";
import { useBank } from "@/lib/bank";
import { useSession } from "@/lib/session";

export const Route = createFileRoute("/app/")({ component: HomeScreen });

function HomeScreen() {
  const { transactions } = useBank();
  const { balanceHidden } = useSession();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60000);
    return () => window.clearInterval(timer);
  }, []);

  const today = now.toDateString();
  const dayTx = transactions.filter(
    (t) => t.status === "Concluído" && new Date(t.createdAt).toDateString() === today,
  );
  const inflow = dayTx.filter((t) => t.kind === "in").reduce((s, t) => s + t.amount, 0);
  const outflow = dayTx.filter((t) => t.kind === "out").reduce((s, t) => s + t.amount, 0);
  const hiddenValue = "R$ ••••••••";

  const quick = [
    { to: "/app/pix", slug: "pix", label: "Pix" },
    { to: "/app/transferencias", slug: "transferencias", label: "Transferências" },
    { to: "/app/cartoes", slug: "cartoes", label: "Cartões" },
    { to: "/app/credito", slug: "linhas-de-credito", label: "Linhas de Crédito" },
    { to: "/app/open-finance", slug: "open-finance", label: "Open Finance" },
    { to: "/app/chat", slug: "whatsapp", label: "WhatsApp" },
    { to: "/app/investimentos", slug: "investimentos", label: "Investimentos" },
    { to: "/app/recargas", slug: "recargas", label: "Recargas" },
  ] as const;

  return (
    <>
      <BrandHeader>
        <div className="px-5 pb-6 pt-0">
          <h1 className="text-[16px] font-extrabold uppercase leading-tight tracking-[-0.02em]">
            Olá, {account.holder}
          </h1>
          <p className="mt-1 text-[11px] font-semibold leading-tight opacity-95">{account.company}</p>
          <p className="mt-1 text-[11px] font-semibold leading-tight opacity-95">CNPJ: {account.cnpj}</p>
          <BalanceCard
            showAccount
            className="mt-4 rounded-[16px] border border-white/10 bg-white/[.17] px-4 py-3.5 shadow-[0_10px_24px_rgba(25,18,90,.2)] [&_p]:text-[13px] [&_strong]:text-[13px]"
          />
        </div>
      </BrandHeader>

      <main className="mx-auto w-full max-w-[430px] bg-background px-4 pb-8 pt-0">
        <section className="relative -mt-4 z-10">
          <div className="rounded-[20px] border border-black/[.04] bg-card px-4 py-4 shadow-[0_10px_24px_rgba(25,25,45,.1)]">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-[17px] font-medium tracking-[-0.02em]">Resumo diário</h2>
              <span className="text-[11px] text-muted-foreground">{now.toLocaleDateString("pt-BR")}</span>
            </div>
            <dl className="mt-4 grid grid-cols-2">
              <div className="pr-3">
                <dt className="flex items-center gap-2 text-[14px] text-muted-foreground">
                  <ArrowUp className="size-5 text-income" strokeWidth={1.7} />
                  Entradas
                </dt>
                <dd className="ml-7 mt-1 text-[15px] font-medium tabular-nums">
                  {balanceHidden ? hiddenValue : formatBRL(inflow)}
                </dd>
              </div>
              <div className="pl-3">
                <dt className="flex items-center gap-2 text-[14px] text-muted-foreground">
                  <ArrowDown className="size-5 text-brand-red" strokeWidth={1.7} />
                  Saídas
                </dt>
                <dd className="ml-7 mt-1 text-[15px] font-medium tabular-nums">
                  {balanceHidden ? hiddenValue : formatBRL(outflow)}
                </dd>
              </div>
            </dl>
            <Link
              to="/app/extrato"
              className="mt-5 inline-flex items-center text-[15px] font-medium text-[#3565d5] underline underline-offset-4"
            >
              Consultar extrato
              <ChevronRight className="ml-1 size-5" />
            </Link>
          </div>
        </section>

        <section className="mt-6">
          <h2 className="text-[19px] font-bold">Soluções para sua empresa</h2>
          <Link
            to="/app/credito"
            className="mt-3 flex min-h-[132px] overflow-hidden rounded-[24px] bg-card shadow-card"
          >
            <div className="h-[132px] w-[38%] shrink-0 overflow-hidden bg-[#eef1f4]">
              <img
                src={creditoMulher}
                alt="Mulher ao telefone"
                width="512"
                height="768"
                className="h-full w-full object-cover object-[50%_30%]"
                loading="eager"
                decoding="sync"
              />
            </div>
            <div className="flex min-w-0 flex-1 items-center justify-between gap-2 px-4 py-4">
              <div className="min-w-0">
                <h3 className="text-[17px] font-bold leading-tight">Linhas de crédito</h3>
                <p className="mt-2 text-[14px] leading-[1.35] text-muted-foreground">
                  Exclusivas para você que é MEI!
                  <br />
                  Clique aqui.
                </p>
              </div>
              <ChevronRight className="size-7 shrink-0 text-[#173a9a]" strokeWidth={2.5} />
            </div>
          </Link>
          <div className="mt-3 flex justify-center">
            <span className="h-1.5 w-[48px] rounded-full bg-[#2745bd]" />
          </div>
        </section>

        <QuickAccessRail title="Acesso rápido" className="-mx-4 px-4">
          {quick.map((item) => (
            <Link
              key={item.slug}
              to={item.to}
              className="flex min-h-[112px] w-[112px] shrink-0 snap-start flex-col items-start justify-center rounded-[18px] bg-card px-4 shadow-card"
            >
              <ServiceGlyph slug={item.slug} className="size-8" />
              <span className="mt-3 text-[15px] leading-tight">{item.label}</span>
            </Link>
          ))}
        </QuickAccessRail>

        <section className="mt-6">
          <h2 className="text-[19px] font-bold">Benefícios e parcerias</h2>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <Link
              to="/app/shop"
              className="flex min-h-[90px] items-center gap-3 rounded-2xl bg-gradient-to-br from-[#2638a8] to-[#5b2aa0] px-4 text-white shadow-lg"
            >
              <ShoppingBag className="size-8" />
              <span className="text-sm font-bold">Oferta com cashback</span>
            </Link>
            <Link
              to="/app/shop"
              className="flex min-h-[90px] items-center gap-3 rounded-2xl bg-brand-red px-4 text-white shadow-lg"
            >
              <ShoppingBag className="size-8" />
              <span className="text-sm font-bold">Superoferta no shop</span>
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
