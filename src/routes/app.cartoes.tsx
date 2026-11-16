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
    <div className={`relative isolate aspect-[1.586/1] w-full overflow-hidden rounded-[20px] p-5 text-white shadow-[0_12px_26px_rgba(18,22,45,.20)] ${isVirtual ? "bg-gradient-to-br from-[#343943] via-[#202630] to-[#111820]" : "bg-gradient-to-br from-[#e51b3e] via-[#c8102e] to-[#8f0926]"}`}>
      <div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-16 -z-10 size-56 rounded-full border border-white/[.12]"/>
      <div aria-hidden="true" className="pointer-events-none absolute -right-5 -top-9 -z-10 size-40 rounded-full border border-white/[.10]"/>
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 left-12 -z-10 size-52 rounded-full border border-white/[.09]"/>
      <div className="relative flex items-start justify-between">
        <div className="leading-none">
          <p className="text-[13px] font-bold tracking-[.13em]">bradesco</p>
          <p className="mt-1.5 text-[9px] font-medium tracking-[.12em] text-white/75">{isVirtual ? "CARTÃO VIRTUAL" : "EMPRESAS E NEGÓCIOS"}</p>
        </div>
        <span className="rounded-md border border-white/70 px-2.5 py-1 text-[17px] font-black italic leading-none tracking-[-.08em]">elo</span>
      </div>
      <div className="relative mt-5 flex items-center gap-3">
        <div className="relative h-[31px] w-[42px] overflow-hidden rounded-[6px] border border-[#f4df9a]/80 bg-gradient-to-br from-[#f8e7b2] via-[#c9a75c] to-[#8d7139] shadow-inner">
          <span className="absolute left-1/3 top-0 h-full w-px bg-[#8e7546]/70"/>
          <span className="absolute left-2/3 top-0 h-full w-px bg-[#8e7546]/70"/>
          <span className="absolute left-0 top-1/3 h-px w-full bg-[#8e7546]/70"/>
          <span className="absolute left-0 top-2/3 h-px w-full bg-[#8e7546]/70"/>
          <span className="absolute inset-[8px] rounded-[2px] border border-[#8e7546]/65"/>
        </div>
        <span className="text-[10px] tracking-[.08em] text-white/80">••</span>
      </div>
      <p className="relative mt-4 whitespace-nowrap font-mono text-[clamp(14px,4.1vw,18px)] tracking-[.13em] tabular-nums">••••  ••••  ••••  {card.last4}</p>
      <div className="relative mt-4 flex items-end justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[8px] font-medium uppercase tracking-[.16em] text-white/65">Titular do cartão</p>
          <p className="mt-1 whitespace-nowrap text-[11px] font-semibold tracking-[.09em]">CLEITON PASSOS</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-[8px] font-medium uppercase tracking-[.14em] text-white/65">Validade</p>
          <p className="mt-1 text-[11px] font-semibold tracking-[.08em]">{card.expiry}</p>
        </div>
      </div>
      {card.blocked && <span className="absolute right-4 top-[4.6rem] rounded-full bg-black/40 px-3 py-1 text-[9px] font-bold tracking-wider">BLOQUEADO</span>}
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
