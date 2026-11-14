import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowUpRight, Check, Copy, Eye, EyeOff, FileText, Lock, LockOpen, Settings2, SlidersHorizontal, WalletCards } from "lucide-react";
import { SubHeader } from "@/components/app/SubHeader";
import { ErrorNote, Field, PrimaryButton } from "@/components/app/OpKit";
import { setCardLimit, toggleCardBlock, useBank, type Card } from "@/lib/bank";
import { formatBRL } from "@/lib/mock-data";

export const Route = createFileRoute("/app/cartoes")({ head: () => ({ meta: [{ title: "Cartões — Bradesco Empresas" }] }), component: CartoesScreen });

const demoNumbers = ["5321 6600 1234 5678", "5488 2100 9876 4321"] as const;
function CartoesScreen() {
  const { cards } = useBank();
  const physical = cards.find((c) => c.type === "Físico") ?? cards[0];
  const virtual = cards.find((c) => c.type === "Virtual");
  const [showPhysical, setShowPhysical] = useState(false);
  const [showVirtual, setShowVirtual] = useState(false);
  const [copied, setCopied] = useState(false);
  const [panel, setPanel] = useState<"none" | "limit">("none");
  const [limitInput, setLimitInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  if (!physical) return <><SubHeader title="Cartões" compactActions /><main className="p-5 text-sm text-muted-foreground">Nenhum cartão cadastrado.</main></>;
  const numberFor = (c: Card) => demoNumbers[Math.max(0, cards.findIndex((item) => item.id === c.id)) % demoNumbers.length];
  const saveLimit = () => {
    const value = Number(limitInput.replace(/\\./g, "").replace(",", "."));
    if (!Number.isFinite(value) || value <= 0) { setError("Informe um limite válido."); return; }
    if (value > 1_000_000) { setError("O limite máximo é R$ 1.000.000,00."); return; }
    setCardLimit(physical.id, value); setLimitInput(""); setPanel("none"); setError(null);
  };
  const copyVirtual = async () => {
    if (!virtual) return;
    try { await navigator.clipboard.writeText(numberFor(virtual)); setCopied(true); window.setTimeout(() => setCopied(false), 1800); } catch { setCopied(false); }
  };
  const CardFace = ({ card, isVirtual = false }: { card: Card; isVirtual?: boolean }) => (
    <div className={`relative overflow-hidden rounded-[22px] p-5 text-white shadow-sm ${isVirtual ? "bg-[#303238]" : "bg-[#CC092F]"}`}>
      <div className="absolute -right-10 -top-14 size-44 rounded-full border border-white/10" />
      <div className="absolute -right-2 -top-7 size-32 rounded-full border border-white/10" />
      <div className="relative flex items-start justify-between">
        <div><p className="text-[11px] font-semibold tracking-[.18em] text-white/80">BRADESCO</p><p className="mt-1 text-xs text-white/75">{isVirtual ? "CARTÃO VIRTUAL" : "EMPRESARIAL"}</p></div>
        <span className="rounded-md border border-white/50 px-2 py-1 text-sm font-black italic">elo</span>
      </div>
      <p className="relative mt-8 font-mono text-[19px] tracking-[.12em]">•••• •••• •••• {card.last4}</p>
      <div className="relative mt-5 flex items-end justify-between gap-3">
        <div className="min-w-0"><p className="text-[9px] uppercase tracking-wider text-white/70">Titular</p><p className="truncate text-[12px] font-semibold">CLEITON OLIVEIRA DOS PASSOS</p></div>
        <div className="shrink-0"><p className="text-[9px] uppercase text-white/70">Validade</p><p className="text-sm font-semibold">{card.expiry}</p></div>
      </div>
      {card.blocked && <span className="absolute right-4 top-[4.6rem] rounded-full bg-black/35 px-3 py-1 text-[10px] font-bold tracking-wider">BLOQUEADO</span>}
    </div>
  );
  const CardActions = ({ card }: { card: Card }) => (
    <div className="mt-4 grid grid-cols-2 gap-3">
      <button type="button" onClick={() => { setError(null); setPanel("limit"); }} className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#E6E6E9] bg-white px-3 text-sm font-semibold text-[#33343A]"><SlidersHorizontal className="size-4 text-[#CC092F]"/>Ajustar limite</button>
      <button type="button" onClick={() => toggleCardBlock(card.id)} className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#E6E6E9] bg-white px-3 text-sm font-semibold text-[#33343A]">{card.blocked ? <LockOpen className="size-4 text-[#CC092F]"/> : <Lock className="size-4 text-[#CC092F]"/>}{card.blocked ? "Desbloquear" : "Bloquear"}</button>
      <Link to="/app/fatura" className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#E6E6E9] bg-white px-3 text-sm font-semibold text-[#33343A]"><FileText className="size-4 text-[#CC092F]"/>Ver fatura</Link>
      <button type="button" onClick={() => setShowPhysical((v) => !v)} className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#E6E6E9] bg-white px-3 text-sm font-semibold text-[#33343A]">{showPhysical ? <EyeOff className="size-4"/> : <Eye className="size-4"/>}{showPhysical ? "Ocultar dados" : "Dados do cartão"}</button>
    </div>
  );
  return <>
    <SubHeader title="Cartões" variant="deep" compactActions />
    <main className="mx-auto w-full max-w-[430px] space-y-5 bg-white px-4 pb-10 pt-5 text-[#292A30]">
      <section>
        <div className="mb-3 flex items-center justify-between"><h2 className="text-lg font-bold">Cartão físico</h2><span className="text-xs font-medium text-[#777982]">Elo Empresas</span></div>
        <CardFace card={physical}/>
        <div className="mt-4 flex items-center justify-between rounded-xl border border-[#ECECEF] px-4 py-3">
          <div><p className="text-sm font-semibold">Bloquear cartão</p><p className="text-xs text-[#777982]">Bloqueio temporário para compras</p></div>
          <button type="button" role="switch" aria-checked={physical.blocked} onClick={() => toggleCardBlock(physical.id)} className={`relative h-7 w-12 rounded-full transition ${physical.blocked ? "bg-[#CC092F]" : "bg-[#D7D8DC]"}`}><span className={`absolute top-1 size-5 rounded-full bg-white shadow transition-all ${physical.blocked ? "left-6" : "left-1"}`}/></button>
        </div>
        <CardActions card={physical}/>
        {showPhysical && <div className="mt-3 rounded-xl bg-[#F6F6F8] p-4 text-sm"><p className="font-semibold">Dados fictícios do cartão</p><p className="mt-2 font-mono">{numberFor(physical)}</p><p className="mt-1 text-[#777982]">CVV ••• · Validade {physical.expiry}</p></div>}
      </section>
      <section className="rounded-2xl border border-[#ECECEF] p-4">
        <div className="mb-3 flex items-center justify-between"><div><h2 className="font-bold">Limite do cartão</h2><p className="mt-1 text-xs text-[#777982]">Valores atuais cadastrados</p></div><WalletCards className="size-5 text-[#CC092F]"/></div>
        <div className="flex items-baseline justify-between gap-2"><span className="text-2xl font-bold tabular-nums">{formatBRL(physical.limit)}</span><span className="text-xs text-[#777982]">Limite total</span></div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#ECECEF]"><div className="h-full rounded-full bg-[#CC092F]" style={{width:`${Math.min(100, physical.limit > 0 ? physical.used / physical.limit * 100 : 0)}%`}}/></div>
        <div className="mt-2 flex justify-between text-xs text-[#777982]"><span>Usado: {formatBRL(physical.used)}</span><span>Disponível: {formatBRL(Math.max(0, physical.limit - physical.used))}</span></div>
      </section>
      {panel === "limit" && <section className="rounded-xl border border-[#ECECEF] p-4"><h3 className="font-bold">Ajustar limite do cartão físico</h3><Field label="Novo limite (R$)" inputMode="decimal" value={limitInput} onChange={(e) => setLimitInput(e.target.value)}/>{error && <ErrorNote>{error}</ErrorNote>}<PrimaryButton onClick={saveLimit}>Salvar limite</PrimaryButton></section>}
      <section>
        <div className="mb-3"><h2 className="text-lg font-bold">Cartão virtual</h2><p className="text-xs text-[#777982]">Para compras pela internet com mais segurança</p></div>
        {virtual ? <>
          <CardFace card={virtual} isVirtual/>
          <div className="mt-3 flex items-center justify-between rounded-xl border border-[#ECECEF] px-4 py-3"><div><p className="text-sm font-semibold">Bloquear cartão virtual</p><p className="text-xs text-[#777982]">Controle independente do cartão físico</p></div><button type="button" role="switch" aria-checked={virtual.blocked} onClick={() => toggleCardBlock(virtual.id)} className={`relative h-7 w-12 rounded-full ${virtual.blocked ? "bg-[#CC092F]" : "bg-[#D7D8DC]"}`}><span className={`absolute top-1 size-5 rounded-full bg-white shadow ${virtual.blocked ? "left-6" : "left-1"}`}/></button></div>
          <button type="button" onClick={() => setShowVirtual((v) => !v)} className="mt-3 w-full rounded-xl border border-[#E6E6E9] py-3 text-sm font-semibold">{showVirtual ? "Ocultar dados" : "Exibir dados fictícios"}</button>
          {showVirtual && <div className="mt-2 rounded-xl bg-[#F6F6F8] p-3 font-mono text-sm">{numberFor(virtual)}<p className="mt-1 font-sans text-xs text-[#777982]">Validade {virtual.expiry} · CVV •••</p></div>}
          <button type="button" onClick={() => void copyVirtual()} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#CC092F] py-3 text-sm font-semibold text-white">{copied ? <Check className="size-4"/> : <Copy className="size-4"/>}{copied ? "Dados copiados" : "Copiar dados fictícios"}</button>
        </> : <p className="rounded-xl bg-[#F6F6F8] p-4 text-sm text-[#777982]">Nenhum cartão virtual cadastrado.</p>}
      </section>
      <Link to="/app/fatura" className="flex items-center justify-between rounded-xl border border-[#ECECEF] p-4 text-sm font-semibold"><span className="flex items-center gap-2"><FileText className="size-5 text-[#CC092F]"/>Segunda via da fatura</span><ArrowUpRight className="size-4"/></Link>
      <div className="flex items-center gap-2 text-xs text-[#85868D]"><Settings2 className="size-4"/>Cartões e dados demonstrativos do aplicativo.</div>
    </main>
  </>;
}
