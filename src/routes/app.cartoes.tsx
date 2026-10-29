import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  ChevronRight,
  CreditCard,
  Eye,
  EyeOff,
  FileText,
  Lock,
  LockOpen,
  Receipt,
  Settings,
  SlidersHorizontal,
  Wifi,
} from "lucide-react";
import { SubHeader } from "@/components/app/SubHeader";
import { ErrorNote, Field, PrimaryButton } from "@/components/app/OpKit";
import { setCardLimit, toggleCardBlock, useBank, type Card } from "@/lib/bank";
import { account, formatBRL } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/cartoes")({
  head: () => ({ meta: [{ title: "Cartões — Conta Empresas Demo" }] }),
  component: CartoesScreen,
});

const tones = [
  "from-[#e3133f] via-[#c91848] to-[#3d246e]",
  "from-[#2537a6] via-[#3d348b] to-[#b01954]",
] as const;

const nameParts = account.holder.split(" ").filter(Boolean);
const cardHolder = nameParts.length > 2 ? `${nameParts[0]} ${nameParts[nameParts.length - 1]}` : account.holder;
type Panel = { name: "none" } | { name: "limite" } | { name: "bloqueio" };

function CardChip() {
  return <div className="relative h-11 w-[60px] overflow-hidden rounded-[8px] border border-[#9c7721]/70 bg-gradient-to-br from-[#f8dd82] via-[#d8ad3e] to-[#f5d978] shadow-sm"><span className="absolute left-[20px] top-0 h-full w-px bg-[#9c7721]/60"/><span className="absolute left-[40px] top-0 h-full w-px bg-[#9c7721]/60"/><span className="absolute left-0 top-[14px] h-px w-full bg-[#9c7721]/60"/><span className="absolute left-0 top-[29px] h-px w-full bg-[#9c7721]/60"/></div>;
}

function CartoesScreen() {
  const { cards } = useBank();
  const [selectedId, setSelectedId] = useState(cards[0]?.id ?? "");
  const [showData, setShowData] = useState(false);
  const [panel, setPanel] = useState<Panel>({ name: "none" });
  const [limitInput, setLimitInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const card: Card | undefined = cards.find((c) => c.id === selectedId) ?? cards[0];
  if (!card) return null;

  const submitLimit = () => {
    const value = Number(limitInput.replace(/\./g, "").replace(",", "."));
    if (!Number.isFinite(value) || value <= 0) return setError("Informe um limite válido maior que zero.");
    if (value > 1_000_000) return setError("O limite máximo é R$ 1.000.000,00.");
    setError(null); setCardLimit(card.id, value); setLimitInput(""); setPanel({ name: "none" });
  };

  return <>
    <SubHeader title="Cartões" variant="deep" compactActions><div className="h-32" /></SubHeader>
    <main className="mx-auto w-full max-w-[430px] px-4 pb-12">
      <section className="-mt-28">
        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {cards.map((c,index)=><button key={c.id} type="button" onClick={()=>setSelectedId(c.id)} className={cn("relative aspect-[1.58/1] min-w-[94%] snap-center overflow-hidden rounded-[22px] bg-gradient-to-br p-6 text-left text-white shadow-[0_16px_30px_rgba(25,25,45,.22)]",tones[index%tones.length],c.id===card.id?"opacity-100":"opacity-85")}>
            <div className="flex items-start justify-between"><div><p className="text-[22px] font-bold leading-none">Conta Empresas</p><p className="mt-1 text-[10px] font-semibold uppercase tracking-[.2em] opacity-80">cartão empresarial</p></div><Wifi className="size-8 rotate-90"/></div>
            <div className="mt-7"><CardChip/></div>
            <p className="mt-5 text-[16px] font-bold uppercase tracking-[.08em]">{cardHolder}</p>
            <div className="mt-1 flex items-end justify-between gap-3"><div><p className="text-[14px] font-semibold tracking-[.18em]">•••• •••• •••• {c.last4}</p><p className="mt-1 text-[11px] font-medium opacity-90">{c.label} · {c.brand}</p></div><span className="text-[21px] font-black italic">{c.brand}</span></div>
            {c.blocked&&<span className="absolute right-5 top-16 rounded-full bg-black/40 px-3 py-1 text-[10px] font-bold">BLOQUEADO</span>}
          </button>)}
        </div>
        <div className="flex justify-center gap-2">{cards.map(c=><span key={c.id} className={cn("h-1.5 rounded-full",c.id===card.id?"w-7 bg-primary":"w-2 bg-muted-foreground/25")}/>)}</div>
      </section>

      <section className="mt-6 rounded-[24px] bg-card p-5 shadow-card">
        <div className="flex items-center justify-between"><h2 className="text-[20px] font-bold">Limite do cartão</h2><span className="rounded-full bg-muted px-3 py-1 text-[11px] font-semibold">{card.type}</span></div>
        <p className="mt-4 text-[32px] font-extrabold tracking-[-.03em] tabular-nums">{formatBRL(card.limit)}</p>
        <p className="mt-1 text-[13px] text-muted-foreground">Limite total disponível</p>
        <div className="mt-5 h-2 overflow-hidden rounded-full bg-muted"><div className="h-full w-0 rounded-full bg-brand-red"/></div>
        <div className="mt-3 flex justify-between text-[13px] text-muted-foreground"><span>Usado: {formatBRL(0)}</span><span>0%</span></div>
        <button type="button" className="mt-6 flex w-full items-center gap-3 rounded-2xl border border-border p-4 text-left"><Receipt className="size-7 shrink-0 text-icon-ink" strokeWidth={1.6}/><div className="flex-1"><p className="text-[15px] font-bold">Fatura atual</p><p className="text-[12px] text-muted-foreground">Fechamento em 05 do mês</p></div><strong className="text-[15px]">{formatBRL(0)}</strong><ChevronRight className="size-5"/></button>
      </section>

      <section className="mt-4 grid grid-cols-4 gap-2">
        <button type="button" onClick={()=>{setError(null);setPanel(panel.name==="limite"?{name:"none"}:{name:"limite"})}} className="flex min-h-[112px] flex-col items-center justify-center gap-3 rounded-[20px] bg-card px-1 text-center shadow-card"><SlidersHorizontal className="size-7 text-icon-ink"/><span className="text-[11px] font-semibold leading-tight">Ajustar<br/>limite</span></button>
        <button type="button" onClick={()=>{setError(null);setPanel(panel.name==="bloqueio"?{name:"none"}:{name:"bloqueio"})}} className="flex min-h-[112px] flex-col items-center justify-center gap-3 rounded-[20px] bg-card px-1 text-center shadow-card">{card.blocked?<LockOpen className="size-7 text-icon-ink"/>:<Lock className="size-7 text-icon-ink"/>}<span className="text-[11px] font-semibold leading-tight">{card.blocked?"Desbloquear":"Bloquear"}<br/>cartão</span></button>
        <button type="button" onClick={()=>setShowData(v=>!v)} className="flex min-h-[112px] flex-col items-center justify-center gap-3 rounded-[20px] bg-card px-1 text-center shadow-card">{showData?<EyeOff className="size-7 text-icon-ink"/>:<Eye className="size-7 text-icon-ink"/>}<span className="text-[11px] font-semibold leading-tight">Dados do<br/>cartão</span></button>
        <button type="button" className="flex min-h-[112px] flex-col items-center justify-center gap-3 rounded-[20px] bg-card px-1 text-center shadow-card"><Settings className="size-7 text-icon-ink"/><span className="text-[11px] font-semibold leading-tight">Configurar<br/>cartão</span></button>
      </section>

      <section className="mt-4 overflow-hidden rounded-[22px] bg-card px-5 shadow-card">
        <button type="button" className="flex w-full items-center gap-4 border-b border-border py-4 text-left"><FileText className="size-7 text-icon-ink"/><div className="flex-1"><p className="text-[14px] font-bold">Movimentações do cartão</p><p className="text-[12px] text-muted-foreground">Compras e lançamentos</p></div><ChevronRight className="size-5"/></button>
        <button type="button" className="flex w-full items-center gap-4 py-4 text-left"><CreditCard className="size-7 text-brand-red"/><div className="flex-1"><p className="text-[14px] font-bold">Cartão virtual</p><p className="text-[12px] text-muted-foreground">Compras online com mais segurança</p></div><ChevronRight className="size-5"/></button>
      </section>

      {error?<ErrorNote>{error}</ErrorNote>:null}
      {panel.name==="limite"?<section className="mt-4 rounded-2xl bg-card p-5 shadow-card"><h3 className="text-[16px] font-bold">Novo limite</h3><Field label="Valor do limite (R$)" inputMode="decimal" placeholder="Ex.: 50000,00" value={limitInput} onChange={e=>setLimitInput(e.target.value)}/><PrimaryButton onClick={submitLimit}>Salvar novo limite</PrimaryButton></section>:null}
      {panel.name==="bloqueio"?<section className="mt-4 rounded-2xl bg-card p-5 shadow-card"><h3 className="text-[16px] font-bold">{card.blocked?"Desbloquear cartão":"Bloquear cartão"}</h3><p className="mt-2 text-sm text-muted-foreground">{card.blocked?`O ${card.label} final ${card.last4} voltará a poder ser usado.`:`O ${card.label} final ${card.last4} ficará impedido de novas compras. Você pode desbloquear quando quiser.`}</p><PrimaryButton onClick={()=>{toggleCardBlock(card.id);setPanel({name:"none"})}}>{card.blocked?"Sim, desbloquear":"Sim, bloquear"}</PrimaryButton></section>:null}
      {showData?<section className="mt-4 rounded-2xl bg-card p-5 shadow-card"><h3 className="text-[16px] font-bold">Dados do cartão</h3><dl className="mt-3 space-y-3 text-sm"><div className="flex justify-between"><dt className="text-muted-foreground">Número</dt><dd className="font-semibold">•••• •••• •••• {card.last4}</dd></div><div className="flex justify-between"><dt className="text-muted-foreground">Validade</dt><dd className="font-semibold">{card.expiry}</dd></div><div className="flex justify-between"><dt className="text-muted-foreground">CVV</dt><dd className="font-semibold">{card.cvv}</dd></div><div className="flex justify-between"><dt className="text-muted-foreground">Bandeira</dt><dd className="font-semibold">{card.brand}</dd></div></dl></section>:null}
    </main>
  </>;
}
