import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SubHeader } from "@/components/app/SubHeader";
import { formatBRL } from "@/lib/mock-data";
import { parseAmount } from "@/lib/pix";

export const Route = createFileRoute("/app/pix/limites")({
  head: () => ({ meta: [{ title: "Meus limites Pix — Conta Empresas" }] }),
  component: LimitesPix,
});

const STORAGE_KEY = "pix-limites";
type AccountType = "corrente" | "poupanca";
type LimitKey = "day" | "night" | "withdraw";

const defaults: Record<AccountType, Record<LimitKey, number>> = {
  corrente: { day: 10000, night: 1000, withdraw: 1000 },
  poupanca: { day: 5000, night: 1000, withdraw: 500 },
};

function readLimits(): typeof defaults {
  if (typeof window === "undefined") return defaults;
  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null");
    return saved ? { corrente: { ...defaults.corrente, ...saved.corrente }, poupanca: { ...defaults.poupanca, ...saved.poupanca } } : defaults;
  } catch { return defaults; }
}

function LimitesPix() {
  const [account, setAccount] = useState<AccountType>("corrente");
  const [tab, setTab] = useState<"pay" | "withdraw">("pay");
  const [limits, setLimits] = useState(readLimits);
  const [editing, setEditing] = useState<LimitKey | null>(null);
  const [draft, setDraft] = useState("");

  const save = () => {
    if (!editing) return;
    const value = parseAmount(draft);
    if (!Number.isFinite(value) || value <= 0) return;
    const next = { ...limits, [account]: { ...limits[account], [editing]: value } };
    setLimits(next);
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
    setEditing(null);
  };

  const LimitCard = ({ id, title, hours }: { id: LimitKey; title: string; hours?: string }) => {
    const value = limits[account][id];
    return (
      <section className="border-b border-border py-5 last:border-0">
        <div className="flex items-end justify-between gap-3">
          <h3 className="font-semibold">{title} {hours && <span className="font-normal text-muted-foreground">{hours}</span>}</h3>
          <span className="text-[11px] text-muted-foreground">Disponível: {formatBRL(value)}</span>
        </div>
        <div className="mt-4 space-y-1 text-sm">
          <p><span className="mr-2 text-[#7b278b]">●</span>Utilizado: R$ 0,00</p>
          <p><span className="mr-2 text-[#7b278b]">●</span>Total: {formatBRL(value)}</p>
        </div>
        {editing === id ? (
          <div className="mt-4 flex gap-2">
            <input value={draft} onChange={(e) => setDraft(e.target.value)} inputMode="decimal" className="min-w-0 flex-1 rounded-lg border border-border px-3 py-2" />
            <button type="button" onClick={save} className="rounded-lg bg-[#313fa8] px-4 font-semibold text-white">Salvar</button>
          </div>
        ) : (
          <button type="button" onClick={() => { setEditing(id); setDraft(String(value)); }} className="mt-4 text-sm font-semibold text-[#31588f]">Alterar limite {id === "day" ? "diurno" : id === "night" ? "noturno" : "de saque"}</button>
        )}
      </section>
    );
  };

  return (
    <>
      <SubHeader title="Pix" variant="deep" fallbackTo="/app/pix" compactActions />
      <main className="mx-auto w-full max-w-[430px] pb-10">
        <div className="border-b border-border bg-white px-4 py-4 text-sm font-semibold text-[#31588f]">ⓘ Pix pelo Open Finance</div>
        <section className="bg-white px-4 pb-4 pt-6">
          <h1 className="text-[24px] font-bold">Meus limites Pix</h1>
          <button type="button" className="mt-4 text-sm font-semibold text-[#31588f]">◷ Alterar horário noturno</button>
        </section>

        <div className="grid grid-cols-2 border-y border-border bg-white">
          <button type="button" onClick={() => setTab("pay")} className={`border-b-2 px-3 py-4 font-semibold ${tab === "pay" ? "border-[#d31345] text-[#b80f3b]" : "border-transparent text-muted-foreground"}`}>Transferir e pagar</button>
          <button type="button" onClick={() => setTab("withdraw")} className={`border-b-2 px-3 py-4 font-semibold ${tab === "withdraw" ? "border-[#d31345] text-[#b80f3b]" : "border-transparent text-muted-foreground"}`}>Sacar</button>
        </div>

        <div className="bg-white px-4 py-5">
          <div className="grid grid-cols-2 gap-3">
            <button type="button" onClick={() => setAccount("corrente")} className={`rounded-full border px-4 py-2 text-sm font-semibold ${account === "corrente" ? "border-[#3985dc] bg-[#3985dc] text-white" : "border-[#3985dc] text-[#31588f]"}`}>Conta-corrente</button>
            <button type="button" onClick={() => setAccount("poupanca")} className={`rounded-full border px-4 py-2 text-sm font-semibold ${account === "poupanca" ? "border-[#3985dc] bg-[#3985dc] text-white" : "border-[#3985dc] text-[#31588f]"}`}>Conta-poupança</button>
          </div>

          <section className="mt-5 rounded-2xl border border-border bg-white p-5 shadow-[0_5px_16px_rgba(25,35,70,.10)]">
            <p className="text-[11px] font-semibold text-[#7b278b]">Pix para Pessoas</p>
            <h2 className="mt-4 text-lg font-bold">{tab === "pay" ? "Contas e chaves não cadastradas e QR Code" : "Limites para saque Pix"}</h2>
            {tab === "pay" ? <><LimitCard id="day" title="Diurno" hours="(06h às 20h)" /><LimitCard id="night" title="Noturno" hours="(20h às 06h)" /></> : <LimitCard id="withdraw" title="Saque Pix" />}
          </section>
        </div>
      </main>
    </>
  );
}
