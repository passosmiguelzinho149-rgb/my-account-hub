import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDownLeft, ArrowLeftRight, ArrowUpRight, Barcode, Bell, ChevronRight, CircleHelp, Diamond, Eye, EyeOff, QrCode } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import pixMulher from "@/assets/pix-mulher.jpg.jpg";
import { account, formatBRL } from "@/lib/mock-data";
import { useBank, useBalance } from "@/lib/bank";
import { useSession } from "@/lib/session";

export const Route = createFileRoute("/app/")({
  head: () => ({ meta: [
    { title: "Início — Bradesco Empresas e Negócios" },
    { name: "description", content: "Saldo, resumo diário e serviços da sua conta empresarial." },
  ] }),
  component: HomeScreen,
});

function HomeScreen() {
  const { transactions } = useBank();
  const balance = useBalance();
  const { balanceHidden, toggleBalance } = useSession();
  const [now, setNow] = useState(() => new Date());
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const touchStartY = useRef<number | null>(null);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60000);
    return () => window.clearInterval(timer);
  }, []);

  const today = now.toDateString();
  const dayTx = transactions.filter((t) => t.status === "Concluído" && new Date(t.createdAt).toDateString() === today);
  const inflow = dayTx.filter((t) => t.kind === "in").reduce((sum, t) => sum + t.amount, 0);
  const outflow = dayTx.filter((t) => t.kind === "out").reduce((sum, t) => sum + t.amount, 0);
  const hiddenValue = "R$ ••••••••";

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

  const shortcuts = [
    { label: "Pix", to: "/app/pix", Icon: Diamond },
    { label: "Transferir", to: "/app/transferencias", Icon: ArrowLeftRight },
    { label: "Boletos", to: "/app/pagamentos", Icon: Barcode },
    { label: "QR Code", to: "/app/pix/receber", Icon: QrCode },
  ];

  return (
    <div className="relative min-h-full bg-[#f2f2f5] text-[#111111]" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd} onTouchCancel={handleTouchEnd}>
      <div aria-live="polite" className="pointer-events-none absolute inset-x-0 top-0 z-50 flex justify-center overflow-hidden transition-[height] duration-150" style={{ height: `${pullDistance}px` }}><div className="mt-2 flex h-9 items-center gap-2 rounded-full bg-white px-3 text-[12px] font-semibold text-[#2a2a7a] shadow-md"><span className={refreshing ? "animate-spin" : ""}>↻</span>{refreshing ? "Atualizando..." : pullDistance >= 52 ? "Solte para atualizar" : "Puxe para atualizar"}</div></div>
      <div className="transition-transform duration-150" style={{ transform: `translateY(${refreshing ? 54 : pullDistance}px)` }}>
      <header className="bg-[linear-gradient(115deg,#2a2a7a_0%,#3b2e8f_100%)] text-white">
        <div className="mobile-safe-top flex items-center justify-between gap-3 px-5 pb-3 pt-3">
          <div className="flex min-w-0 items-center gap-2">
            <img src="/bradesco-symbol.svg?v=white-1" alt="" aria-hidden className="h-7 w-7 shrink-0 object-contain" />
            <div className="min-w-0 leading-none">
              <span className="block text-[17px] font-bold tracking-[-.04em]">bradesco</span>
              <span className="mt-1 block text-[9px] font-normal">empresas e negócios</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button type="button" aria-label="Ajuda" className="grid size-9 place-items-center rounded-full hover:bg-white/10"><CircleHelp className="size-5" strokeWidth={1.6}/></button>
            <Link to="/app/notificacoes" aria-label="Notificações" className="grid size-9 place-items-center rounded-full hover:bg-white/10"><Bell className="size-5" strokeWidth={1.6}/></Link>
          </div>
        </div>

        <div className="px-5 pb-6 pt-4">
          <h1 className="text-[19px] font-semibold leading-tight">Olá, Cleiton</h1>
          <p className="mt-1 text-[12px] leading-snug text-white/95">{account.company}</p>
          <p className="mt-1 text-[12px] leading-snug text-white/90">CNPJ: 63.031.988/0001-00</p>

          <section className="mt-4 rounded-2xl border border-white/10 bg-white/10 px-4 py-4 text-white">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-[12px] text-white/95">
              <span>Agência: <strong className="font-semibold">0002</strong></span>
              <span>Conta: <strong className="font-semibold">0123-9</strong></span>
            </div>
            <p className="mt-4 text-[13px] text-white/90">Saldo disponível</p>
            <div className="mt-1 flex items-center justify-between gap-3">
              <p className="min-w-0 break-words text-[27px] font-semibold leading-tight tabular-nums text-white">{balanceHidden ? hiddenValue : formatBRL(balance)}</p>
              <button type="button" onClick={toggleBalance} aria-label={balanceHidden ? "Mostrar saldo" : "Ocultar saldo"} aria-pressed={balanceHidden} className="grid size-9 shrink-0 place-items-center rounded-full text-white/95 hover:bg-white/10">
                {balanceHidden ? <EyeOff className="size-5"/> : <Eye className="size-5"/>}
              </button>
            </div>
            <div className="mt-2 flex justify-end">
              <Link to="/app/saldo" className="inline-flex items-center gap-1 text-[12px] font-medium text-white underline underline-offset-4">Ver detalhes <ChevronRight className="size-3.5"/></Link>
            </div>
          </section>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[430px] space-y-5 px-4 pb-10 pt-4">
        <section aria-label="Destaques" className="overflow-hidden">
          <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <Link to="/app/pix" className="relative block h-[150px] w-[88%] shrink-0 snap-start overflow-hidden rounded-2xl bg-[#171b68]">
              <img src={pixMulher} alt="Destaque de soluções para sua empresa" className="absolute inset-0 h-full w-full object-cover object-center" loading="eager"/>
              <span className="absolute inset-0 bg-gradient-to-r from-[#171b68]/95 via-[#202b83]/65 to-transparent"/>
              <span className="absolute left-4 top-5 max-w-[62%] text-[18px] font-semibold leading-tight text-white">Soluções para impulsionar o seu negócio</span>
              <span className="absolute bottom-4 left-4 inline-flex items-center gap-1 rounded-full border border-white/75 px-3 py-1.5 text-[11px] font-medium text-white">Conheça nossas soluções <ChevronRight className="size-3.5"/></span>
            </Link>
            <Link to="/app/pagamentos" className="flex h-[150px] w-[88%] shrink-0 snap-start flex-col justify-between rounded-2xl bg-[#302879] p-4 text-white">
              <span className="text-[10px] font-semibold uppercase tracking-[.12em] text-white/75">Gestão financeira</span>
              <span className="max-w-[220px] text-[18px] font-semibold leading-snug">Pagamentos e boletos em um só lugar</span>
              <span className="inline-flex items-center gap-1 text-[12px] font-medium">Saiba mais <ChevronRight className="size-4"/></span>
            </Link>
          </div>
          <div className="mt-2 flex justify-center gap-1.5" aria-hidden="true">
            <span className="size-1.5 rounded-full bg-[#3b2e8f]"/>
            <span className="size-1.5 rounded-full bg-[#c9cad2]"/>
          </div>
        </section>

        <section className="rounded-2xl border border-black/[.035] bg-white p-4 shadow-[0_2px_8px_rgba(20,25,50,.045)]">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[#f0effb] text-[#3b2e8f]"><ArrowUpRight className="size-5"/></span>
              <h2 className="text-[17px] font-semibold tracking-[-.02em]">Resumo diário</h2>
            </div>
            <span className="shrink-0 text-[11px] tabular-nums text-[#6e6e76]">{now.toLocaleDateString("pt-BR")}</span>
          </div>
          <dl className="mt-4 grid grid-cols-2">
            <div className="min-w-0 border-r border-[#e7e7ed] pr-3">
              <dt className="flex items-center gap-2 text-[12px] text-[#6e6e76]">
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#e8f5ec]"><ArrowUpRight className="size-4 text-[#218447]" strokeWidth={1.8}/></span>
                Entradas
              </dt>
              <dd className="mt-2 break-words pl-9 text-[14px] font-semibold leading-tight tabular-nums text-[#111]">{balanceHidden ? hiddenValue : formatBRL(inflow)}</dd>
            </div>
            <div className="min-w-0 pl-3">
              <dt className="flex items-center gap-2 text-[12px] text-[#6e6e76]">
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#fbeaec]"><ArrowDownLeft className="size-4 text-[#c43d4a]" strokeWidth={1.8}/></span>
                Saídas
              </dt>
              <dd className="mt-2 break-words pl-9 text-[14px] font-semibold leading-tight tabular-nums text-[#111]">{balanceHidden ? hiddenValue : formatBRL(outflow)}</dd>
            </div>
          </dl>
          <div className="my-4 border-t border-[#e7e7ed]"/>
          <div className="flex items-center justify-between gap-3">
            <span className="text-[12px] text-[#6e6e76]">Saldo da conta</span>
            <span className="min-w-0 break-words text-right text-[15px] font-semibold tabular-nums text-[#111]">{balanceHidden ? hiddenValue : formatBRL(balance)}</span>
          </div>
          <Link to="/app/extrato" className="mt-4 inline-flex items-center gap-1 text-[12px] font-medium text-[#1b4fd8]">Consultar extrato <ChevronRight className="size-4"/></Link>
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between gap-2">
            <h2 className="text-[17px] font-semibold tracking-[-.02em]">Acesso rápido</h2>
            <Link to="/app/servicos" className="inline-flex shrink-0 items-center gap-1 text-[12px] font-medium text-[#1b4fd8]">Ver todos <ChevronRight className="size-4"/></Link>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {shortcuts.map(({ label, to, Icon }) => (
              <Link key={label} to={to} className="flex min-h-[88px] min-w-0 flex-col items-center justify-center gap-2 rounded-xl border border-black/[.035] bg-white px-1 py-3 text-center active:bg-[#f7f8fc]">
                <Icon className="size-[22px] text-[#1b4fd8]" strokeWidth={1.6}/>
                <span className="text-[10px] font-medium leading-tight text-[#25252b]">{label}</span>
              </Link>
            ))}
          </div>
        </section>
      </main>
      </div>
    </div>
  );
}
