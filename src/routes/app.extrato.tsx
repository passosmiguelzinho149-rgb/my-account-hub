import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, ChevronDown, Download, Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { SubHeader } from "@/components/app/SubHeader";
import { BalanceCard } from "@/components/app/BalanceCard";
import { formatBRL } from "@/lib/mock-data";
import { useBank, useBalance, type Tx } from "@/lib/bank";
import { useSession } from "@/lib/session";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/extrato")({
  head: () => ({ meta: [{ title: "Extrato — Conta Empresas (simulado)" }, { name: "description", content: "Extrato da conta empresarial em ambiente simulado." }] }),
  component: ExtratoScreen,
});

const periods = ["Todos", "7 dias", "15 dias", "30 dias", "90 dias"] as const;
const tabs = ["Todos", "Entradas", "Saídas", "Futuros"] as const;
const PIX_VALUE = 132_500;
const pixEmitido: Tx = { id: "pix-emitido-outra-if-mesma-tit-20261002", category: "pix", kind: "out", status: "Concluído", title: "PIX EMITIDO OUTRA IF-MESMA TIT.", counterpart: "OUTRA IF-MESMA TIT.", amount: PIX_VALUE, createdAt: "2026-10-02T13:42:00-04:00", channel: "App Empresas", receipt: { authentication: "DEMONSTRACAO", rows: [{ label: "Data e hora", value: "02/10/2026 às 13:42:00" }, { label: "Valor", value: "R$ 132.500,00" }, { label: "Descrição", value: "PIX EMITIDO OUTRA IF-MESMA TIT." }, { label: "Origem/Destino", value: "OUTRA IF-MESMA TIT." }] } };

function ExtratoScreen() {
  const { balanceHidden } = useSession();
  const [period, setPeriod] = useState<string>("Todos");
  const [tab, setTab] = useState<string>("Todos");
  const [query, setQuery] = useState("");
  const { transactions } = useBank();
  const balance = useBalance() - PIX_VALUE;
  const days = Number.parseInt(period, 10);
  const since = period === "Todos" ? null : Date.now() - days * 86_400_000;
  const allTransactions = transactions.some((t) => t.id === pixEmitido.id) ? transactions : [pixEmitido, ...transactions];
  const filtered = allTransactions.filter((t) => {
    if (tab === "Entradas" && t.kind !== "in") return false;
    if (tab === "Saídas" && t.kind !== "out") return false;
    if (tab === "Futuros") return t.status === "Agendado";
    if (t.status === "Agendado") return false;
    if (since !== null && new Date(t.createdAt).getTime() < since) return false;
    if (!query.trim()) return true;
    const q = query.trim().toLowerCase();
    return t.title.toLowerCase().includes(q) || t.counterpart.toLowerCase().includes(q);
  });
  const sorted = [...filtered].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const grouped = sorted.reduce<Record<string, typeof sorted>>((groups, transaction) => {
    const key = transaction.createdAt.slice(0, 10);
    (groups[key] ??= []).push(transaction);
    return groups;
  }, {});

  return <>
    <SubHeader title="Extrato" variant="deep" compactActions>
      <div className="px-4 pb-7 pt-1">
        <p className="mb-2 text-[11px] font-bold uppercase tracking-[.14em] text-white/70">Conta corrente · ambiente simulado</p>
        <BalanceCard hideDetailsLink />
      </div>
    </SubHeader>

    <main className="-mt-4 overflow-hidden rounded-t-[26px] bg-[#f7f7f8] pb-5 shadow-[0_-8px_30px_rgba(20,25,60,.10)]">
      <div className="bg-white px-4 pb-4 pt-5">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[#d4d4d8]" />
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Saldo disponível</p>
            <p className="mt-1 text-[21px] font-bold tracking-tight tabular-nums">{balanceHidden ? "R$ ••••••••" : formatBRL(balance)}</p>
          </div>
          <button type="button" onClick={() => window.print()} className="flex size-11 items-center justify-center rounded-full border border-border bg-white text-primary shadow-sm print:hidden" aria-label="Exportar extrato"><Download className="size-5" /></button>
        </div>
      </div>

      <div className="border-y border-border/70 bg-white px-4 py-4 print:hidden">
        <label className="flex items-center gap-3 rounded-lg bg-[#f2f2f4] px-3.5 py-3"><Search className="size-5 shrink-0 text-[#555a69]"/><input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Buscar lançamento" className="min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-[#737783]" aria-label="Buscar lançamentos"/></label>
        <div className="mt-3 flex gap-2 overflow-x-auto [scrollbar-width:none]">
          <button type="button" className="flex shrink-0 items-center gap-2 rounded-lg border border-border bg-white px-3.5 py-2.5 text-sm font-semibold text-[#35394b]"><SlidersHorizontal className="size-4 text-primary"/> Filtrar</button>
          <button type="button" className="flex shrink-0 items-center gap-2 rounded-lg border border-border bg-white px-3.5 py-2.5 text-sm font-semibold text-[#35394b]"><CalendarDays className="size-4 text-primary"/>{period}<ChevronDown className="size-4"/></button>
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto [scrollbar-width:none]">{periods.map((p)=><button key={p} type="button" onClick={()=>setPeriod(p)} className={cn("shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold",period===p?"border-primary bg-primary text-white":"border-border bg-white text-muted-foreground")}>{p}</button>)}</div>
      </div>

      <div className="grid grid-cols-4 border-b border-border bg-white px-2 print:hidden">{tabs.map((t)=><button key={t} type="button" onClick={()=>setTab(t)} className={cn("relative py-3.5 text-sm",tab===t?"font-bold text-primary":"font-medium text-muted-foreground")}>{t}{tab===t&&<span className="absolute inset-x-2 bottom-0 h-[3px] rounded-t-full bg-primary"/>}</button>)}</div>

      <div className="pb-2">{Object.entries(grouped).map(([date,items])=>{
        const dateLabel=new Date(`${date}T12:00:00`).toLocaleDateString("pt-BR",{weekday:"long",day:"2-digit",month:"long"});
        return <section key={date} className="mt-3 border-y border-border/60 bg-white">
          <div className="flex items-center justify-between bg-[#f7f7f8] px-4 py-2.5"><p className="text-xs font-bold capitalize text-[#575b68]">{dateLabel}</p><p className="text-[10px] font-bold uppercase tracking-[.1em] text-muted-foreground">Simulado</p></div>
          <ul className="divide-y divide-border/60">{items.map((t)=><li key={t.id}>{t.id===pixEmitido.id?<div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-4"><TxText t={t}/><Amount t={t} hidden={balanceHidden}/></div>:<Link to="/app/comprovante/$id" params={{id:t.id}} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-4 active:bg-[#f6f6f7]"><TxText t={t}/><Amount t={t} hidden={balanceHidden}/></Link>}</li>)}</ul>
        </section>;
      })}{sorted.length===0&&<div className="mx-4 mt-4 rounded-xl bg-white py-12 text-center shadow-sm"><Search className="mx-auto size-7 text-muted-foreground"/><p className="mt-3 text-sm font-semibold">Nenhum lançamento encontrado</p><p className="mt-1 text-xs text-muted-foreground">Tente outro período ou filtro.</p></div>}</div>

      <div className="mx-4 mt-3 rounded-lg border border-dashed border-border bg-white px-4 py-3 text-center text-[11px] font-medium leading-relaxed text-muted-foreground">Extrato de demonstração. Não representa uma conta ou movimentação bancária real.</div>
    </main>
  </>;
}

function TxText({t}:{t:Tx}) {
  return <div className="min-w-0"><p className="text-[14px] font-bold leading-snug text-[#292d3a]">{t.title}</p><p className="mt-1 truncate text-[13px] text-[#606472]">{t.counterpart}</p><p className="mt-1.5 text-[11px] font-medium text-[#858894]">{new Date(t.createdAt).toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})} · {t.status}</p></div>;
}
function Amount({t,hidden}:{t:Tx;hidden:boolean}) {
  return <div className="shrink-0 text-right"><p className={cn("text-[14px] font-bold tabular-nums",t.kind==="in"?"text-[#188552]":"text-[#303441]")}>{hidden?"R$ ••••":`${t.kind==="in"?"+ ":"- "}${formatBRL(t.amount)}`}</p><p className="mt-1 text-[10px] font-medium text-muted-foreground">{t.kind==="in"?"Crédito":"Débito"}</p></div>;
}
