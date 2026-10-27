import { createFileRoute, Link } from "@tanstack/react-router";
import { Eye, Search, Share2, ShieldCheck, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { SubHeader } from "@/components/app/SubHeader";
import { formatBRL } from "@/lib/mock-data";
import { useBank, useBalance, type Tx } from "@/lib/bank";
import { useSession } from "@/lib/session";

export const Route = createFileRoute("/app/extrato")({
  head: () => ({ meta: [{ title: "Extrato — Conta Empresas" }, { name: "description", content: "Extrato da conta empresarial." }] }),
  component: ExtratoScreen,
});

const PIX_VALUE = 132_500;
const pixEmitido: Tx = { id: "pix-emitido-outra-if-mesma-tit-20261002", category: "pix", kind: "out", status: "Concluído", title: "PIX EMITIDO OUTRA IF-MESMA TIT.", counterpart: "OUTRA IF-MESMA TIT.", amount: PIX_VALUE, createdAt: "2026-10-02T13:42:00-04:00", channel: "App Empresas", receipt: { authentication: "DEMONSTRACAO", rows: [{ label: "Data e hora", value: "02/10/2026 às 13:42:00" }, { label: "Valor", value: "R$ 132.500,00" }, { label: "Descrição", value: "PIX EMITIDO OUTRA IF-MESMA TIT." }, { label: "Origem/Destino", value: "OUTRA IF-MESMA TIT." }] } };
type Tab = "todos" | "entradas" | "saidas" | "futuros";

function ExtratoScreen() {
  const { balanceHidden } = useSession();
  const { transactions } = useBank();
  const balance = useBalance() - PIX_VALUE;
  const [period, setPeriod] = useState<number | null>(null);
  const [tab, setTab] = useState<Tab>("todos");
  const [query, setQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const allTransactions = transactions.some((t) => t.id === pixEmitido.id) ? transactions : [pixEmitido, ...transactions];
  const newestTime = Math.max(...allTransactions.map(t => new Date(t.createdAt).getTime()), Date.now());
  const items = useMemo(() => allTransactions.filter((t) => {
    const scheduled = t.status === "Agendado";
    if (tab === "futuros" && !scheduled) return false;
    if (tab !== "futuros" && scheduled) return false;
    if (tab === "entradas" && t.kind !== "in") return false;
    if (tab === "saidas" && t.kind !== "out") return false;
    if (period) {
      const age = newestTime - new Date(t.createdAt).getTime();
      if (age > period * 24 * 60 * 60 * 1000) return false;
    }
    const q = query.trim().toLocaleLowerCase("pt-BR");
    if (q && !`${t.title} ${t.counterpart} ${t.amount}`.toLocaleLowerCase("pt-BR").includes(q)) return false;
    return true;
  }).sort((a,b)=>new Date(b.createdAt).getTime()-new Date(a.createdAt).getTime()), [allTransactions, newestTime, period, tab, query]);

  return <div className="min-h-full bg-[#151f70]">
    <div className="bg-[radial-gradient(circle_at_82%_15%,rgba(69,75,176,.48),transparent_35%),linear-gradient(145deg,#101a61_0%,#17247d_52%,#111958_100%)]">
      <SubHeader title="Extrato" variant="deep" compactActions><div className="px-5 pb-10 pt-4"><div className="rounded-[16px] border border-white/[.04] bg-[#29327f]/80 px-5 py-5 shadow-[0_10px_26px_rgba(5,10,55,.24)]"><div className="flex items-center justify-between gap-4"><div className="min-w-0"><p className="text-[16px] font-medium text-white/95">Saldo disponível</p><div className="mt-2 flex items-center gap-3"><p className="text-[18px] font-bold text-white">{balanceHidden ? "R$ ••••••••" : formatBRL(balance)}</p><Eye className="size-5 text-white/85" /></div></div><button type="button" className="shrink-0 text-[15px] font-semibold text-white underline underline-offset-2">Ver detalhes</button></div></div><div className="mt-4 rounded-[16px] border border-white/[.04] bg-[#263078]/75 px-5 py-5 shadow-[0_10px_26px_rgba(5,10,55,.20)]"><p className="text-[17px] font-bold leading-snug text-white">O que achou dessa experiência?</p><p className="mt-1 text-[16px] font-semibold text-white/95">Sua opinião é importante.</p><button type="button" className="mt-4 text-[17px] font-bold text-white underline underline-offset-4">Avaliar ›</button></div></div></SubHeader>
    </div>
    <main className="-mt-1 min-h-[70vh] rounded-t-[28px] bg-white px-4 pb-28 pt-4 shadow-[0_-7px_22px_rgba(15,20,70,.16)]">
      <div className="mx-auto mb-5 h-1 w-12 rounded-full bg-[#d7d7da]" />
      <section className="mx-auto max-w-[410px]">
        <div className="flex h-[58px] items-center rounded-[16px] border border-[#bfc1c8] bg-white pl-5 shadow-sm"><input value={query} onChange={e=>setQuery(e.target.value)} aria-label="Buscar lançamentos" placeholder="Buscar lançamentos" className="min-w-0 flex-1 bg-transparent text-[17px] outline-none placeholder:text-[#33353b]"/><button type="button" className="grid h-full w-16 place-items-center border-l border-[#d6d7db]"><Search className="size-6 text-[#4d535e]"/></button></div>
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1 text-[15px] font-semibold text-[#315ec9] [scrollbar-width:none]"><button onClick={()=>setFilterOpen(v=>!v)} className={`flex shrink-0 items-center gap-2 rounded-[18px] px-4 py-2 ${filterOpen?"bg-[#273896] text-white":"bg-[#3565d5] text-white"}`}><SlidersHorizontal className="size-4"/>Filtrar{period ? <span className="grid size-5 place-items-center rounded-full bg-white text-[11px] text-[#273896]">1</span>:null}</button>{[7,15,30,60].map(d=><button key={d} onClick={()=>setPeriod(period===d?null:d)} className={`shrink-0 rounded-[18px] px-5 py-2 ${period===d?"bg-[#3565d5] text-white":"bg-[#f1f3f7] text-[#315ec9]"}`}>{d} dias</button>)}</div>
        {filterOpen && <div className="mt-3 rounded-xl border border-[#e0e2e8] bg-[#f7f8fb] p-3 text-sm text-[#555b68]"><p className="font-semibold text-[#273896]">Filtrar período</p><p className="mt-1">Escolha 7, 15, 30 ou 60 dias. Toque novamente no período selecionado para mostrar todos.</p></div>}
        <div className="mt-5 grid grid-cols-4 border-b border-[#dedfe3] text-center text-[16px]">{([['todos','Todos'],['entradas','Entradas'],['saidas','Saídas'],['futuros','Futuros']] as [Tab,string][]).map(([key,label])=><button key={key} onClick={()=>setTab(key)} className={`${tab===key?"border-b-[3px] border-[#273896] font-semibold text-[#273896]":""} pb-3`}>{label}</button>)}</div>
      </section>
      <section className="mx-auto mt-5 max-w-[410px] divide-y divide-[#dedfe3]">{items.length===0?<div className="rounded-xl bg-[#fff8dc] px-4 py-5 text-[15px] text-[#655b38]">Não há lançamentos para este filtro.</div>:items.map((t)=><div key={t.id}>{t.id===pixEmitido.id ? <TransactionRow t={t} hidden={balanceHidden}/> : <Link to="/app/comprovante/$id" params={{id:t.id}} className="block active:bg-[#f5f5f6]"><TransactionRow t={t} hidden={balanceHidden}/></Link>}</div>)}</section>
      <section className="mx-auto mt-7 max-w-[390px]"><div className="relative overflow-hidden rounded-[22px] bg-[linear-gradient(120deg,#050817_0%,#11166d_48%,#651147_100%)] px-6 py-7 text-white shadow-[0_12px_30px_rgba(21,25,93,.22)]"><div className="absolute -right-8 -top-10 size-36 rounded-full bg-[#d51c70]/25 blur-2xl"/><div className="relative flex items-start gap-3"><ShieldCheck className="mt-1 size-7 shrink-0 text-white/90"/><div><h2 className="text-[22px] font-extrabold leading-tight">Atenção às transferências!</h2><p className="mt-3 text-[17px] font-semibold leading-snug text-white/95">Antes de transferir, confira os dados e valide o destinatário.</p></div></div></div></section>
      <button type="button" onClick={()=>window.print()} className="fixed bottom-[86px] left-1/2 z-20 flex -translate-x-1/2 items-center justify-center gap-2 rounded-[14px] bg-[#273896] px-8 py-3.5 text-[15px] font-bold text-white shadow-lg print:hidden"><Share2 className="size-4"/> Compartilhar extrato</button>
    </main>
  </div>;
}

function TransactionRow({t,hidden}:{t:Tx;hidden:boolean}) { const date=new Date(t.createdAt); const day=date.toLocaleDateString("pt-BR",{day:"2-digit"}); const month=date.toLocaleDateString("pt-BR",{month:"short"}).replace(".","").toUpperCase(); const fullDate=date.toLocaleDateString("pt-BR"); const title=t.category==="pix"&&t.kind==="in"?"PIX RECEBIDO":t.title; return <div className="grid grid-cols-[58px_minmax(0,1fr)_auto] gap-3 py-5"><div className="pt-1 text-center"><span className="block text-[23px] font-bold leading-none text-[#34363b]">{day}</span><span className="mt-1 block text-[14px] font-semibold text-[#555860]">{month}</span></div><div className="relative min-w-0 pl-5"><span className={`absolute left-0 top-2 size-2.5 rounded-full ${t.kind==="in"?"bg-[#438a58]":"bg-[#696d75]"}`}/><p className="text-[15px] font-bold leading-tight text-[#25272c]">{title}</p><p className="mt-1 text-[14px] leading-snug text-[#696b72]">{t.counterpart}</p><p className="text-[13px] text-[#777980]">Do dia {fullDate}</p><p className="text-[13px] text-[#777980]">Documento {t.id.slice(-7).replace(/\D/g,"") || "0000"}</p></div><p className={`self-center whitespace-nowrap text-[16px] font-medium tabular-nums ${t.kind==="in"?"text-[#438a58]":"text-[#34363b]"}`}>{hidden?"R$ ••••":`${t.kind==="in"?"":"- "}${formatBRL(t.amount)}`}</p></div>; }
