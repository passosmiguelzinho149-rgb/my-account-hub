import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CreditCard, Eye, Lock, Settings, Wifi } from "lucide-react";
import { SubHeader } from "@/components/app/SubHeader";
import { account } from "@/lib/mock-data";

export const Route = createFileRoute("/app/cartoes")({
  head: () => ({ meta: [{ title: "Cartões — Conta Empresas" }] }),
  component: CartoesScreen,
});

const cards = [
  { name: "Mastercard", number: "5367 1234 5678 9012", theme: "from-[#080808] via-[#202020] to-[#090909]", brand: "mastercard" },
  { name: "Visa Business", number: "4096 1234 5678 9010", theme: "from-[#8f001d] via-[#d00035] to-[#9d001f]", brand: "VISA" },
] as const;

function CartoesScreen() {
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [blocked, setBlocked] = useState<Record<string, boolean>>({});
  const [managed, setManaged] = useState<string | null>(null);

  return (
    <>
      <SubHeader title="Cartões" />
      <main className="mx-auto w-full max-w-[430px] px-4 py-5 pb-10">
        <div className="flex items-end justify-between gap-3">
          <div><h2 className="text-xl font-bold">Meus cartões</h2><p className="mt-1 text-sm text-muted-foreground">Cartões vinculados à sua conta empresarial.</p></div>
          <span className="shrink-0 rounded-full border border-border bg-card px-2.5 py-1 text-[10px] font-bold tracking-wide text-muted-foreground">SIMULADO</span>
        </div>

        <div className="mx-auto mt-5 grid max-w-md gap-6">
          {cards.map((card) => (
            <section key={card.name}>
              <div className={`relative aspect-[1.586/1] w-full overflow-hidden rounded-[22px] bg-gradient-to-br ${card.theme} p-5 text-white shadow-xl ${blocked[card.name] ? "grayscale opacity-75" : ""}`}>
                <div className="absolute -right-12 -top-16 size-52 rotate-12 rounded-[40%] border-[30px] border-white/5" />
                <div className="absolute inset-x-0 top-0 h-px bg-white/30" />
                <div className="relative flex items-start justify-between gap-3">
                  <div><div className="flex items-center gap-2"><span className="grid size-9 place-items-center rounded-xl border border-white/25 bg-white/10 text-sm font-black">CE</span><span className="text-lg font-bold tracking-tight">Conta Empresas</span></div><p className="ml-11 -mt-1 text-[10px] font-semibold uppercase tracking-[.16em] text-white/70">ambiente simulado</p></div>
                  <span className="rounded-full border border-white/20 bg-black/10 px-2 py-1 text-[10px] font-semibold">Empresarial</span>
                </div>

                <div className="relative mt-6 flex items-center gap-3"><span className="h-10 w-14 rounded-md border border-white/40 bg-gradient-to-br from-[#f2e3b0] to-[#bda766] shadow-inner" /><Wifi className="size-7 rotate-90 text-white/90" /></div>
                <p className="relative mt-4 font-mono text-[clamp(15px,4.4vw,19px)] tracking-[0.1em]">{revealed[card.name] ? card.number : `•••• •••• •••• ${card.number.slice(-4)}`}</p>

                <div className="relative mt-3 flex items-end justify-between gap-3">
                  <div className="min-w-0"><p className="text-[9px] uppercase text-white/70">Validade</p><p className="font-mono text-sm">12/28</p><p className="mt-2 truncate text-xs font-semibold">{account.holder}</p><p className="truncate text-[10px] text-white/80">CNPJ {account.cnpj}</p></div>
                  <div className="shrink-0 text-right"><p className={card.brand === "VISA" ? "text-3xl font-black italic" : "text-lg font-bold"}>{card.brand}</p>{card.brand === "mastercard" && <div className="mt-1 flex justify-end"><span className="size-8 rounded-full bg-red-500" /><span className="-ml-3 size-8 rounded-full bg-amber-400/90" /></div>}{card.brand === "VISA" && <p className="text-xs">Business</p>}</div>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2">
                <button type="button" onClick={() => setRevealed((v) => ({ ...v, [card.name]: !v[card.name] }))} className="flex min-h-[70px] flex-col items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-2 py-3 text-xs font-semibold shadow-card"><Eye className="size-5 text-primary" />{revealed[card.name] ? "Ocultar" : "Ver dados"}</button>
                <button type="button" onClick={() => setManaged(managed === card.name ? null : card.name)} className="flex min-h-[70px] flex-col items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-2 py-3 text-xs font-semibold shadow-card"><Settings className="size-5 text-primary" />Gerenciar</button>
                <button type="button" onClick={() => setBlocked((v) => ({ ...v, [card.name]: !v[card.name] }))} className="flex min-h-[70px] flex-col items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-2 py-3 text-xs font-semibold shadow-card"><Lock className="size-5 text-primary" />{blocked[card.name] ? "Desbloquear" : "Bloquear"}</button>
              </div>
              {managed === card.name && <div className="mt-3 rounded-xl border border-border bg-card p-4 text-sm shadow-card"><div className="flex items-center justify-between gap-3"><p className="font-bold">Gerenciar {card.name}</p><span className={`size-2.5 rounded-full ${blocked[card.name] ? "bg-brand-red" : "bg-income"}`} /></div><p className="mt-1 text-muted-foreground">Cartão {blocked[card.name] ? "bloqueado" : "ativo"} · final {card.number.slice(-4)}</p><p className="mt-1 text-muted-foreground">Vencimento 12/28 · Conta {account.number}</p></div>}
            </section>
          ))}
        </div>

        <section className="mt-6 rounded-2xl border border-border bg-card p-4 shadow-card"><div className="flex items-center gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-full bg-secondary"><CreditCard className="size-5 text-primary" /></span><div className="min-w-0"><p className="font-semibold">Conta vinculada</p><p className="truncate text-sm text-muted-foreground">Agência {account.branch} · Conta {account.number}</p></div></div></section>
      </main>
    </>
  );
}
