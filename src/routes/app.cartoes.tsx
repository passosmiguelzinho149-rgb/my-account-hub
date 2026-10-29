import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Eye,
  EyeOff,
  Lock,
  LockOpen,
  Receipt,
  SlidersHorizontal,
  Wifi,
} from "lucide-react";
import { SubHeader } from "@/components/app/SubHeader";
import { ErrorNote, Field, PrimaryButton } from "@/components/app/OpKit";
import {
  setCardLimit,
  toggleCardBlock,
  useBank,
  type Card,
} from "@/lib/bank";
import { account, formatBRL } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/cartoes")({
  head: () => ({
    meta: [
      { title: "Cartões — Bradesco Empresas e Negócios" },
      { name: "description", content: "Gestão de cartões empresariais: limite, bloqueio, fatura e dados do cartão." },
      { property: "og:title", content: "Cartões — Bradesco Empresas e Negócios" },
      { property: "og:description", content: "Gestão de cartões empresariais: limite, bloqueio e fatura." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
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
  return (
    <div className="relative h-10 w-14 overflow-hidden rounded-[7px] border border-[#9c7721]/70 bg-gradient-to-br from-[#f8dd82] via-[#d8ad3e] to-[#f5d978] shadow-sm">
      <span className="absolute left-[18px] top-0 h-full w-px bg-[#9c7721]/60" />
      <span className="absolute left-[36px] top-0 h-full w-px bg-[#9c7721]/60" />
      <span className="absolute left-0 top-[13px] h-px w-full bg-[#9c7721]/60" />
      <span className="absolute left-0 top-[26px] h-px w-full bg-[#9c7721]/60" />
      <span className="absolute left-[18px] top-[13px] h-[13px] w-[18px] rounded-[3px] border border-[#9c7721]/60" />
    </div>
  );
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

  const available = card.limit;
  const usedPct = 0;

  const submitLimit = () => {
    const value = Number(limitInput.replace(/\./g, "").replace(",", "."));
    if (!Number.isFinite(value) || value <= 0) return setError("Informe um limite válido maior que zero.");
    if (value > 1_000_000) return setError("O limite máximo é R$ 1.000.000,00.");
    setError(null);
    setCardLimit(card.id, value);
    setLimitInput("");
    setPanel({ name: "none" });
  };

  return (
    <>
      <SubHeader title="Cartões" variant="deep" compactActions><div className="h-28" /></SubHeader>
      <main className="mx-auto w-full max-w-[430px] px-4 pb-12">
        <section className="-mt-24">
          <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {cards.map((c, index) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedId(c.id)}
                aria-label={`Selecionar ${c.label} final ${c.last4}`}
                className={cn(
                  "relative aspect-[1.58/1] min-w-[92%] snap-center overflow-hidden rounded-[18px] bg-gradient-to-br p-5 text-left text-white shadow-xl transition-opacity",
                  tones[index % tones.length],
                  c.id === card.id ? "opacity-100" : "opacity-80",
                )}
              >
                <div className="flex items-start justify-between">
                  <span className="text-[18px] font-bold leading-tight">Conta Empresas</span>
                  <Wifi className="size-7 rotate-90 opacity-90" />
                </div>
                <div className="mt-4"><CardChip /></div>
                <div className="mt-3 whitespace-nowrap text-[13px] font-semibold tracking-[0.18em]">•••• •••• •••• {c.last4}</div>
                <div className="absolute inset-x-5 bottom-4 flex items-end justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-[15px] font-bold uppercase leading-tight">{cardHolder}</p>
                    <p className="mt-1 truncate text-[11px] font-medium opacity-90">{c.label} · {c.brand}</p>
                  </div>
                  {c.blocked && <span className="shrink-0 rounded bg-black/40 px-2 py-1 text-[10px] font-bold">BLOQUEADO</span>}
                </div>
              </button>
            ))}
          </div>
          <div className="mt-2 flex justify-center gap-1.5">
            {cards.map((c) => <span key={c.id} className={cn("h-1.5 rounded-full transition-all", c.id === card.id ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/30")} />)}
          </div>
        </section>

        <section className="mt-6 rounded-2xl bg-card p-5 shadow-card">
          <div className="flex items-center justify-between">
            <h2 className="text-[17px] font-bold">Limite do cartão</h2>
            <span className="text-xs font-semibold text-muted-foreground">{card.type}</span>
          </div>
          <p className="mt-3 text-[26px] font-extrabold tabular-nums">{formatBRL(available)}</p>
          <p className="text-xs text-muted-foreground">limite total disponível</p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-brand-red transition-[width]" style={{ width: `${usedPct}%` }} />
          </div>
          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            <span>Usado: {formatBRL(0)}</span><span>0%</span>
          </div>
          <div className="mt-5 flex items-center gap-3 rounded-xl border border-border p-3">
            <Receipt className="size-6 shrink-0 text-icon-ink" strokeWidth={1.6} />
            <div className="min-w-0 flex-1"><p className="text-sm font-bold">Fatura atual</p><p className="text-xs text-muted-foreground">Fechamento em 05 do mês</p></div>
            <p className="text-sm font-bold tabular-nums">{formatBRL(0)}</p>
          </div>
        </section>

        <section className="mt-4 grid grid-cols-3 gap-3">
          <button type="button" onClick={() => { setError(null); setPanel(panel.name === "limite" ? { name: "none" } : { name: "limite" }); }} className="flex min-h-[92px] flex-col items-center justify-center gap-2 rounded-2xl bg-card px-2 text-center shadow-card">
            <SlidersHorizontal className="size-7 text-icon-ink" strokeWidth={1.5} /><span className="text-[12px] font-semibold leading-tight">Ajustar limite</span>
          </button>
          <button type="button" onClick={() => { setError(null); setPanel(panel.name === "bloqueio" ? { name: "none" } : { name: "bloqueio" }); }} className="flex min-h-[92px] flex-col items-center justify-center gap-2 rounded-2xl bg-card px-2 text-center shadow-card">
            {card.blocked ? <LockOpen className="size-7 text-icon-ink" strokeWidth={1.5} /> : <Lock className="size-7 text-icon-ink" strokeWidth={1.5} />}
            <span className="text-[12px] font-semibold leading-tight">{card.blocked ? "Desbloquear" : "Bloquear cartão"}</span>
          </button>
          <button type="button" onClick={() => setShowData((v) => !v)} className="flex min-h-[92px] flex-col items-center justify-center gap-2 rounded-2xl bg-card px-2 text-center shadow-card">
            {showData ? <EyeOff className="size-7 text-icon-ink" strokeWidth={1.5} /> : <Eye className="size-7 text-icon-ink" strokeWidth={1.5} />}
            <span className="text-[12px] font-semibold leading-tight">Dados do cartão</span>
          </button>
        </section>

        {error ? <ErrorNote>{error}</ErrorNote> : null}
        {panel.name === "limite" ? (
          <section className="mt-4 rounded-2xl bg-card p-5 shadow-card">
            <h3 className="text-[16px] font-bold">Novo limite</h3>
            <Field label="Valor do limite (R$)" inputMode="decimal" placeholder="Ex.: 50000,00" value={limitInput} onChange={(e) => setLimitInput(e.target.value)} />
            <PrimaryButton onClick={submitLimit}>Salvar novo limite</PrimaryButton>
          </section>
        ) : null}
        {panel.name === "bloqueio" ? (
          <section className="mt-4 rounded-2xl bg-card p-5 shadow-card">
            <h3 className="text-[16px] font-bold">{card.blocked ? "Desbloquear cartão" : "Bloquear cartão"}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{card.blocked ? `O ${card.label} final ${card.last4} voltará a poder ser usado.` : `O ${card.label} final ${card.last4} ficará impedido de novas compras. Você pode desbloquear quando quiser.`}</p>
            <PrimaryButton onClick={() => { toggleCardBlock(card.id); setPanel({ name: "none" }); }}>{card.blocked ? "Sim, desbloquear" : "Sim, bloquear"}</PrimaryButton>
            <button type="button" onClick={() => setPanel({ name: "none" })} className="mt-3 w-full rounded-full border border-border py-3.5 font-medium">Cancelar</button>
          </section>
        ) : null}
        {showData ? (
          <section className="mt-4 rounded-2xl bg-card p-5 shadow-card">
            <h3 className="text-[16px] font-bold">Dados do cartão</h3>
            <dl className="mt-3 space-y-3 text-sm">
              <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Número</dt><dd className="font-semibold tabular-nums">•••• •••• •••• {card.last4}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Validade</dt><dd className="font-semibold tabular-nums">{card.expiry}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-muted-foreground">CVV</dt><dd className="font-semibold tabular-nums">{card.cvv}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Bandeira</dt><dd className="font-semibold">{card.brand}</dd></div>
            </dl>
          </section>
        ) : null}
      </main>
    </>
  );
}
