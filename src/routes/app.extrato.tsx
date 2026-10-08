import { createFileRoute, Link } from "@tanstack/react-router";
import { Download, Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { SubHeader } from "@/components/app/SubHeader";
import { BalanceCard } from "@/components/app/BalanceCard";
import { formatBRL } from "@/lib/mock-data";
import { useBank, useBalance, type Tx } from "@/lib/bank";
import { useSession } from "@/lib/session";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/extrato")({ head: () => ({ meta: [{ title: "Extrato — Conta Empresas (demo)" }, { name: "description", content: "Lançamentos, entradas e saídas da conta empresarial nesta demonstração." }] }), component: ExtratoScreen });

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
  const exportPdf = () => window.print();
  const filtered = allTransactions.filter((t) => { if (tab === "Entradas" && t.kind !== "in") return false; if (tab === "Saídas" && t.kind !== "out") return false; if (tab === "Futuros") return t.status === "Agendado"; if (t.status === "Agendado") return false; if (since !== null && new Date(t.createdAt).getTime() < since) return false; if (!query.trim()) return true; const q = query.trim().toLowerCase(); return t.title.toLowerCase().includes(q) || t.counterpart.toLowerCase().includes(q); });
  const sorted = [...filtered].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const grouped = sorted.reduce<Record<string, typeof sorted>>((groups, transaction) => { const key = transaction.createdAt.slice(0, 10); (groups[key] ??= []).push(transaction); return groups; }, {});

  return <>
    <SubHeader title="Extrato" variant="deep" compactActions><div className="px-4 pb-6"><BalanceCard hideDetailsLink /></div></SubHeader>
    <main className="-mt-4 rounded-t-[24px] bg-card px-4 pb-5 pt-4 shadow-[0_-8px_30px_rgba(20,25,60,.08)]">
      <div className="mx-auto h-1 w-10 rounded-full bg-border" />
      <div className="mt-4 grid grid-cols-[minmax(0,1fr)_auto] gap-2 print:hidden">
        <label className="flex min-w-0 items-center gap-2 rounded-xl border border-border bg-background px-3 py-3 shadow-sm"><Search className="size-5 shrink-0 text-muted-foreground"/><input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Buscar no extrato" className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground" aria-label="Buscar lançamentos"/></label>
        <button type="button" onClick={exportPdf} aria-label="Exportar extrato em PDF" className="grid size-[50px] place-items-center rounded-xl border border-border bg-background text-primary shadow-sm"><Download className="size-5"/></button>
      </div>
      <div className="mt-4 flex gap-2 overflow-x-auto pb-1 print:hidden [scrollbar-width:none]">
        <button type="button" className="flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold"><SlidersHorizontal className="size-4"/> Período</button>
        {periods.map((p)=><button key={p} type="button" onClick={()=>setPeriod(p)} className={cn("shrink-0 rounded-full px-4 py-2 text-sm font-medium",period===p?"bg-primary-deep text-primary-foreground shadow-sm":"bg-secondary text-secondary-foreground")}>{p}</button>)}
      </div>
      <div className="mt-4 grid grid-cols-4 border-b border-border print:hidden">{tabs.map((t)=><button key={t} type="button" onClick={()=>setTab(t)} className={cn("-mb-px min-w-0 border-b-2 px-1 pb-2.5 text-sm transition-colors",tab===t?"border-primary font-bold text-primary":"border-transparent text-muted-foreground")}>{t}</button>)}</div>

      <div className="mt-1">{Object.entries(grouped).map(([date,items])=>{const dateLabel=new Date(`${date}T12:00:00`).toLocaleDateString("pt-BR",{day:"2-digit",month:"long",year:"numeric"});return <section key={date} className="border-b border-border/80"><div className="sticky top-[25px] z-10 -mx-4 border-y border-border/50 bg-background/95 px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-muted-foreground backdrop-blur">{dateLabel}</div><ul className="divide-y divide-border/70">{items.map((t)=><li key={t.id}>{t.id===pixEmitido.id?<div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-4"><TxText t={t}/><Amount t={t} hidden={balanceHidden}/></div>:<Link to="/app/comprovante/$id" params={{id:t.id}} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-4"><TxText t={t}/><Amount t={t} hidden={balanceHidden}/></Link>}</li>)}</ul></section>})}{sorted.length===0&&<div className="py-10 text-center"><Search className="mx-auto size-7 text-muted-foreground"/><p className="mt-2 text-sm font-medium">Nenhum lançamento encontrado</p><p className="mt-1 text-xs text-muted-foreground">Altere o período, a categoria ou a busca.</p></div>}</div>
      <div className="sticky bottom-[calc(68px+env(safe-area-inset-bottom))] -mx-4 mt-2 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-t border-border bg-card/95 px-4 py-4 backdrop-blur"><p className="truncate text-sm font-semibold text-muted-foreground">Saldo disponível</p><p className="shrink-0 text-base font-bold tabular-nums">{balanceHidden?"R$ ••••••••":formatBRL(balance)}</p></div>
    </main>
  </>;
}

function TxText({t}:{t:Tx}) { return <div className="min-w-0"><p className="flex items-start gap-2 font-semibold leading-snug"><span className={cn("mt-1.5 size-2 shrink-0 rounded-full",t.kind==="in"?"bg-income":"bg-brand-red")}/><span className="min-w-0 break-words">{t.title}</span></p><p className="ml-4 mt-1 truncate text-sm text-muted-foreground">{t.counterpart}</p><p className="ml-4 mt-1 text-xs text-muted-foreground">{new Date(t.createdAt).toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})} · {t.status}</p></div>; }
function Amount({t,hidden}:{t:Tx;hidden:boolean}) { return <p className={cn("shrink-0 text-right text-sm font-bold tabular-nums",t.kind==="in"?"text-income":"text-brand-red")}>{hidden?"R$ ••••":`${t.kind==="in"?"+ ":"- "}${formatBRL(t.amount)}`}</p>; }
