import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDownLeft, ArrowLeftRight, ArrowUpRight, Barcode, Bell, ChevronRight, CircleHelp, Diamond, Eye, EyeOff, QrCode } from "lucide-react";
import { useEffect, useState } from "react";
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

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60000);
    return () => window.clearInterval(timer);
  }, []);

  const today = now.toDateString();
  const dayTx = transactions.filter((t) => t.status === "Concluído" && new Date(t.createdAt).toDateString() === today);
  const inflow = dayTx.filter((t) => t.kind === "in").reduce((sum, t) => sum + t.amount, 0);
  const outflow = dayTx.filter((t) => t.kind === "out").reduce((sum, t) => sum + t.amount, 0);
  const hiddenValue = "R$ ••••••••";

  const shortcuts = [
    { label: "Pix", to: "/app/pix", Icon: Diamond },
    { label: "Transferir", to: "/app/transferencias", Icon: ArrowLeftRight },
    { label: "Boletos", to: "/app/pagamentos", Icon: Barcode },
    { label: "QR Code", to: "/app/pix/receber", Icon: QrCode },
  ];

  return (
    <div className="min-h-full bg-[#f2f2f5] text-[#111111]">
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

      <main className="mx-auto w-full max-w-[430px] space-y-6 px-4 pb-10 pt-4">
        <section className="rounded-2xl border border-black/[.035] bg-white p-4 shadow-[0_2px_8px_rgba(20,25,50,.04)]">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-[16px] font-semibold">Resumo diário</h2>
            <span className="shrink-0 text-[12px] tabular-nums text-[#6e6e76]">{now.toLocaleDateString("pt-BR")}</span>
          </div>
          <dl className="mt-4 grid grid-cols-2">
            <div className="min-w-0 border-r border-[#ececf0] pr-3">
              <dt className="flex items-center gap-2 text-[12px] text-[#6e6e76]">
                <span className="grid size-8 shrink-0 place-items-center rounded-md bg-[#e8f5ec]"><ArrowUpRight className="size-[18px] text-[#218447]" strokeWidth={1.8}/></span>
                Entradas
              </dt>
              <dd className="mt-2 pl-10 text-[14px] font-semibold tabular-nums text-[#111]">{balanceHidden ? hiddenValue : formatBRL(inflow)}</dd>
            </div>
            <div className="min-w-0 pl-3">
              <dt className="flex items-center gap-2 text-[12px] text-[#6e6e76]">
                <span className="grid size-8 shrink-0 place-items-center rounded-md bg-[#fbeaec]"><ArrowDownLeft className="size-[18px] text-[#c43d4a]" strokeWidth={1.8}/></span>
                Saídas
              </dt>
              <dd className="mt-2 pl-10 text-[14px] font-semibold tabular-nums text-[#111]">{balanceHidden ? hiddenValue : formatBRL(outflow)}</dd>
            </div>
          </dl>
          <Link to="/app/extrato" className="mt-4 inline-flex items-center gap-1 text-[13px] font-medium text-[#1b4fd8]">Consultar extrato <ChevronRight className="size-4"/></Link>
        </section>

        <section>
          <h2 className="mb-3 text-[18px] font-semibold">Acesso rápido</h2>
          <div className="grid grid-cols-4 gap-2.5">
            {shortcuts.map(({ label, to, Icon }) => (
              <Link key={label} to={to} className="flex min-h-[91px] min-w-0 flex-col items-center justify-center gap-2 rounded-xl border border-black/[.035] bg-white px-1.5 py-3 text-center shadow-[0_2px_7px_rgba(20,25,50,.035)] active:bg-[#f7f8fc]">
                <Icon className="size-6 text-[#1b4fd8]" strokeWidth={1.55}/>
                <span className="text-[11px] font-medium leading-tight text-[#25252b]">{label}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="overflow-hidden">
          <h2 className="mb-3 text-[18px] font-semibold">Soluções para sua empresa</h2>
          <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <Link to="/app/pix" className="relative block h-[154px] w-[86%] shrink-0 snap-start overflow-hidden rounded-2xl bg-white">
              <img src={pixMulher} alt="Mulher sorrindo segurando cartão" className="absolute inset-0 h-full w-full object-cover object-center" loading="eager"/>
              <span className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/65 to-transparent px-4 pb-3 pt-9 text-[15px] font-semibold text-white">Pix para facilitar seu dia</span>
            </Link>
            <Link to="/app/pagamentos" className="flex h-[154px] w-[86%] shrink-0 snap-start flex-col justify-between rounded-2xl bg-[#e9edf8] p-4 text-[#24265f]">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-[#4c5590]">Gestão financeira</span>
              <span className="max-w-[210px] text-[17px] font-semibold leading-snug">Pagamentos e boletos em um só lugar</span>
              <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#1b4fd8]">Conheça <ChevronRight className="size-4"/></span>
            </Link>
          </div>
          <div className="mt-2 flex justify-center gap-1.5" aria-hidden="true">
            <span className="size-1.5 rounded-full bg-[#3b2e8f]"/>
            <span className="size-1.5 rounded-full bg-[#c9cad2]"/>
          </div>
        </section>
      </main>
    </div>
  );
}
