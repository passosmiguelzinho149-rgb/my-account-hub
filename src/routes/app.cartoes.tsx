import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Wifi } from "lucide-react";
import { SubHeader } from "@/components/app/SubHeader";
import { ServiceGlyph } from "@/components/app/ServiceGlyph";
import { account, formatBRL } from "@/lib/mock-data";

export const Route = createFileRoute("/app/cartoes")({
  component: CartoesScreen,
  head: () => ({ meta: [{ title: "Cartões · Conta Empresas" }, { name: "description", content: "Controle de cartões empresariais." }] }),
});

const cards = [
  { name: "Mastercard", number: "5367 1234 5678 9012", limit: 50000, used: 12480.35 },
  { name: "Visa Business", number: "4096 1234 5678 9010", limit: 80000, used: 21930.9 },
] as const;

function CartoesScreen() {
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [blocked, setBlocked] = useState<Record<string, boolean>>({});
  const [managed, setManaged] = useState<string | null>(null);

  return <><SubHeader title="Cartões" /><main className="app-surface mx-auto w-full max-w-[430px] px-4 py-5 pb-10"><div className="flex items-end justify-between"><div><h2 className="text-xl font-bold">Meus cartões</h2></div></div>{cards.map((card)=>{const available=card.limit-card.used;return <section key={card.name} className="mt-5"><div className="rounded-[22px] bg-gradient-to-br from-primary-deep to-[#334155] p-5 text-primary-foreground shadow-xl"><div className="flex justify-between"><span className="font-bold">Conta Empresas</span><span className="text-xs">{card.name}</span></div><div className="mt-7 flex items-center gap-3"><span className="h-9 w-12 rounded bg-[#d9c58a]"/><Wifi className="size-6 rotate-90"/></div><p className="mt-5 font-mono tracking-wider">{revealed[card.name]?card.number:`•••• •••• •••• ${card.number.slice(-4)}`}</p><p className="mt-4 text-xs">{account.holder}</p></div><div className="mt-3 rounded-lg bg-card p-4 shadow-card"><div className="flex justify-between"><span className="text-sm text-muted-foreground">Limite disponível</span><strong>{formatBRL(available)}</strong></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-muted"><div className="h-full bg-primary" style={{width:`${Math.min(100,(card.used/card.limit)*100)}%`}}/></div><div className="mt-3 grid grid-cols-2 gap-2 text-sm"><div><span className="text-muted-foreground">Fatura atual</span><p className="font-bold">{formatBRL(card.used)}</p></div><div><span className="text-muted-foreground">Limite total</span><p className="font-bold">{formatBRL(card.limit)}</p></div></div></div><div className="mt-2 grid grid-cols-3 gap-2"><button onClick={()=>setRevealed(v=>({...v,[card.name]:!v[card.name]}))} className="rounded-lg bg-card p-3 text-xs font-semibold shadow-card"><ServiceGlyph slug="saldo" className="mx-auto mb-1 size-7"/>Ver dados</button><button onClick={()=>setManaged(managed===card.name?null:card.name)} className="rounded-lg bg-card p-3 text-xs font-semibold shadow-card"><ServiceGlyph slug="limites" className="mx-auto mb-1 size-7"/>Gerenciar</button><button onClick={()=>setBlocked(v=>({...v,[card.name]:!v[card.name]}))} className="rounded-lg bg-card p-3 text-xs font-semibold shadow-card"><ServiceGlyph slug="cartoes" className="mx-auto mb-1 size-7"/>{blocked[card.name]?"Desbloquear":"Bloquear"}</button></div>{managed===card.name&&<div className="mt-2 grid grid-cols-3 gap-2 rounded-lg bg-card p-3 text-center text-xs shadow-card"><div><ServiceGlyph slug="agendamentos" className="mx-auto size-7"/><b>Dia 10</b><p>Vencimento</p></div><div><ServiceGlyph slug="ofertas" className="mx-auto size-7"/><b>Dia 2</b><p>Melhor compra</p></div><div><ServiceGlyph slug="recargas" className="mx-auto size-7"/><b>Virtual</b><p>Cartão virtual</p></div></div>}</section>})}<section className="mt-6 rounded-lg bg-card p-4 shadow-card"><div className="flex items-center gap-3"><ServiceGlyph slug="cartoes" className="size-8"/><div><p className="font-semibold">Conta vinculada</p><p className="text-sm text-muted-foreground">Agência {account.branch} · Conta {account.number}</p></div></div></section></main></>;
}
