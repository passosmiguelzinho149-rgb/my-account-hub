import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CalendarDays, ShoppingBag, Utensils, Car, ShoppingCart, ReceiptText, CircleDollarSign } from "lucide-react";
import { SubHeader } from "@/components/app/SubHeader";
import { useBank } from "@/lib/bank";
import { formatBRL } from "@/lib/mock-data";

export const Route = createFileRoute("/app/fatura")({ head: () => ({ meta: [{ title: "Fatura do cartão — Bradesco Empresas" }] }), component: FaturaScreen });
const monthLabel = (value: string) => { const [year, month] = value.split("-").map(Number); return new Date(year, month - 1, 1).toLocaleDateString("pt-BR", { month: "long", year: "numeric" }); };
function FaturaScreen() {
  const { transactions, cards } = useBank();
  const [month, setMonth] = useState(() => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`; });
  const [showPayInfo, setShowPayInfo] = useState(false);
  const purchases = useMemo(() => transactions.filter((tx) => tx.category === "compra" && tx.createdAt.slice(0,7) === month).sort((a,b) => b.createdAt.localeCompare(a.createdAt)), [transactions, month]);
  const total = purchases.reduce((sum, tx) => sum + tx.amount, 0);
  const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
  const iconFor = (title: string) => { const s = title.toLowerCase(); if (/restaurante|café|ifood|lanche/.test(s)) return Utensils; if (/posto|uber|combustível/.test(s)) return Car; if (/mercado|supermercado/.test(s)) return ShoppingCart; return ShoppingBag; };
  return <>
    <SubHeader title="Fatura" fallbackTo="/app/cartoes" compactActions/>
    <main className="mx-auto min-h-[70vh] w-full max-w-[430px] bg-white px-4 pb-10 pt-5 text-[#292A30]">
      <label className="flex items-center gap-3 rounded-xl border border-[#E7E7EA] px-4 py-3"><CalendarDays className="size-5 text-[#777982]"/><span className="flex-1 text-sm font-semibold">Mês da fatura</span><input aria-label="Mês da fatura" type="month" value={month} onChange={(e) => setMonth(e.target.value)} className="max-w-[150px] bg-transparent text-sm font-semibold outline-none"/></label>
      <section className="mt-4 rounded-2xl bg-[#F6F6F8] p-5">
        <p className="text-sm text-[#777982]">Total das compras registradas</p><p className="mt-2 text-3xl font-bold tabular-nums">{formatBRL(total)}</p>
        <div className="mt-4 flex justify-between text-xs text-[#777982]"><span>{purchases.length} lançamento(s)</span><span>Cartão final {cards.find(c => c.type === "Físico")?.last4 ?? "—"}</span></div>
      </section>
      <div className="mt-6 flex items-center justify-between"><h2 className="text-lg font-bold">Compras da fatura</h2><span className="text-xs text-[#777982]">{monthLabel(month)}</span></div>
      <div className="mt-3 divide-y divide-[#ECECEF] rounded-2xl border border-[#ECECEF]">
        {purchases.map((tx) => { const Icon = iconFor(tx.title + " " + tx.counterpart); return <div key={tx.id} className="flex items-center gap-3 p-4"><span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#F1F1F3] text-[#666872]"><Icon className="size-5"/></span><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{tx.counterpart || tx.title}</p><p className="mt-1 text-xs text-[#777982]">{fmtDate(tx.createdAt)}</p></div><strong className="shrink-0 text-sm tabular-nums">{formatBRL(tx.amount)}</strong></div>; })}
        {purchases.length === 0 && <div className="px-4 py-10 text-center"><ReceiptText className="mx-auto size-8 text-[#A0A1A7]"/><p className="mt-3 text-sm font-semibold">Nenhuma compra registrada</p><p className="mt-1 text-xs text-[#777982]">Não há lançamentos de cartão para este mês.</p></div>}
      </div>
      <button type="button" onClick={() => setShowPayInfo((v) => !v)} className="mt-6 w-full rounded-xl bg-[#CC092F] py-3.5 text-sm font-bold text-white">Pagar fatura</button>
      {showPayInfo && <p className="mt-3 rounded-xl bg-[#F6F6F8] p-4 text-sm text-[#666872]">A área de pagamento está disponível apenas como visualização neste protótipo. Nenhum valor foi debitado da conta.</p>}
      <p className="mt-5 flex items-start gap-2 text-xs leading-relaxed text-[#85868D]"><CircleDollarSign className="size-4 shrink-0"/>Os valores exibidos são os lançamentos existentes no aplicativo. Esta tela não altera compras, limites ou saldo.</p>
    </main>
  </>;
}
