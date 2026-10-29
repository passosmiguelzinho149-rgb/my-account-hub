// ============= Tela inicial (Início) =============

import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUp, ChevronRight, LoaderCircle, ShoppingBag } from "lucide-react";
import pixMulher from "@/assets/pix-mulher.jpg.jpg";
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
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const touchStartY = useRef<number | null>(null);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60000);
    return () => window.clearInterval(timer);
  }, []);

  const refreshHome = async () => {
    if (refreshing) return;
    setRefreshing(true);
    setPullDistance(54);
    await new Promise((resolve) => window.setTimeout(resolve, 650));
    setNow(new Date());
    setRefreshing(false);
    setPullDistance(0);
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    if (window.scrollY <= 0 && !refreshing) touchStartY.current = event.touches[0]?.clientY ?? null;
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartY.current === null || window.scrollY > 0 || refreshing) return;
    const distance = (event.touches[0]?.clientY ?? touchStartY.current) - touchStartY.current;
    if (distance > 0) setPullDistance(Math.min(82, distance * 0.48));
  };

  const handleTouchEnd = () => {
    const shouldRefresh = pullDistance >= 52;
    touchStartY.current = null;
    if (shouldRefresh) void refreshHome();
    else setPullDistance(0);
  };

  const today = now.toDateString();
  const dayTx = transactions.filter((t) => t.status === "Concluído" && new Date(t.createdAt).toDateString() === today);
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
    <div className="relative min-h-full overscroll-y-contain" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd} onTouchCancel={handleTouchEnd}>
      <div aria-live="polite" className="pointer-events-none absolute inset-x-0 top-0 z-[60] flex justify-center overflow-hidden transition-[height] duration-150" style={{ height: `${pullDistance}px` }}>
        <div className="mt-2 flex h-9 items-center gap-2 rounded-full bg-white px-3 text-[12px] font-semibold text-[#2638a8] shadow-lg">
          <LoaderCircle className={`size-4 ${refreshing ? "animate-spin" : ""}`} />
          <span>{refreshing ? "Atualizando..." : pullDistance >= 52 ? "Solte para atualizar" : "Puxe para atualizar"}</span>
        </div>
      </div>

      <div className="transition-transform duration-150" style={{ transform: `translateY(${refreshing ? 54 : pullDistance}px)` }}>
        <BrandHeader>
          <div className="px-5 pb-6 pt-0">
            <h1 className="text-[16px] font-extrabold uppercase leading-tight tracking-[-0.02em]">Olá, {account.holder}</h1>
            <p className="mt-1 text-[11px] font-semibold leading-tight opacity-95">{account.company}</p>
            <p className="mt-1 text-[11px] font-semibold leading-tight opacity-95">CNPJ: {account.cnpj}</p>
            <BalanceCard showAccount className="mt-4 rounded-[16px] border border-white/10 bg-white/[.17] px-4 py-3.5 shadow-[0_10px_24px_rgba(25,18,90,.2)] [&_p]:text-[13px] [&_strong]:text-[13px]" />
          </div>
        </BrandHeader>

        <main className="mx-auto w-full max-w-[430px] overflow-x-hidden bg-background px-4 pb-8 pt-0">
          <section className="relative z-10 -mt-3 px-1">
            <div className="rounded-[18px] border border-black/[.04] bg-card px-3.5 py-3.5 shadow-[0_8px_20px_rgba(25,25,45,.09)]">
              <div className="flex items-center justify-between gap-3"><h2 className="text-[15px] font-medium tracking-[-0.02em]">Resumo diário</h2><span className="text-[10px] text-muted-foreground">{now.toLocaleDateString("pt-BR")}</span></div>
              <dl className="mt-3 grid grid-cols-2">
                <div className="pr-2.5"><dt className="flex items-center gap-1.5 text-[12px] text-muted-foreground"><ArrowUp className="size-4 text-income" strokeWidth={1.7} />Entradas</dt><dd className="ml-[22px] mt-1 text-[13px] font-medium tabular-nums">{balanceHidden ? hiddenValue : formatBRL(inflow)}</dd></div>
                <div className="pl-2.5"><dt className="flex items-center gap-1.5 text-[12px] text-muted-foreground"><ArrowDown className="size-4 text-brand-red" strokeWidth={1.7} />Saídas</dt><dd className="ml-[22px] mt-1 text-[13px] font-medium tabular-nums">{balanceHidden ? hiddenValue : formatBRL(outflow)}</dd></div>
              </dl>
              <Link to="/app/extrato" className="mt-4 inline-flex items-center text-[13px] font-medium text-[#3565d5] underline underline-offset-4">Consultar extrato<ChevronRight className="ml-1 size-4" /></Link>
            </div>
          </section>

          <section className="mt-6">
            <h2 className="text-[19px] font-bold">Soluções para sua empresa</h2>
            <Link to="/app/pix" className="mt-3 block w-full overflow-hidden rounded-[24px] bg-card shadow-card">
              <img src={pixMulher} alt="Pix: pague, receba e transfira a qualquer hora do dia" className="block h-auto w-full" loading="eager" decoding="sync" />
            </Link>
            <div className="mt-3 flex justify-center"><span className="h-1.5 w-[48px] rounded-full bg-[#2745bd]" /></div>
          </section>

          <QuickAccessRail title="Acesso rápido" className="-mx-4 px-5">
            {quick.map((item) => (
              <Link key={item.slug} to={item.to} className="flex min-h-[94px] w-[108px] shrink-0 snap-start flex-col items-start justify-center overflow-hidden rounded-[16px] bg-card px-3.5 shadow-card">
                <ServiceGlyph slug={item.slug} className="size-7 shrink-0" />
                <span className={`mt-2.5 block w-full font-medium leading-tight ${item.slug === "transferencias" ? "whitespace-nowrap text-[11px]" : "text-[12px]"}`}>{item.label}</span>
              </Link>
            ))}
          </QuickAccessRail>

          <section className="mt-6">
            <h2 className="text-[19px] font-bold">Benefícios e parcerias</h2>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <Link to="/app/shop" className="flex min-h-[90px] items-center gap-3 rounded-2xl bg-gradient-to-br from-[#2638a8] to-[#5b2aa0] px-4 text-white shadow-lg"><ShoppingBag className="size-8" /><span className="text-sm font-bold">Oferta com cashback</span></Link>
              <Link to="/app/shop" className="flex min-h-[90px] items-center gap-3 rounded-2xl bg-brand-red px-4 text-white shadow-lg"><ShoppingBag className="size-8" /><span className="text-sm font-bold">Superoferta no shop</span></Link>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
