import { createFileRoute } from "@tanstack/react-router";
import { BadgeDollarSign, Banknote, CalendarDays, ChevronDown, ChevronRight, HandCoins, WalletCards } from "lucide-react";
import { useState } from "react";
import { SubHeader } from "@/components/app/SubHeader";
import { creditLines } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/credito")({
  head: () => ({
    meta: [
      { title: "Linhas de Crédito — Conta Empresas" },
      { name: "description", content: "Capital de giro, giro empresarial, cheque empresarial e microcrédito." },
    ],
  }),
  component: CreditoScreen,
});

const creditIcons = { WalletCards, Banknote, HandCoins, BadgeDollarSign } as const;

function CreditoScreen() {
  const [open, setOpen] = useState<string | null>(null);
  const [contracting, setContracting] = useState<string | null>(null);
  const [amount, setAmount] = useState(30000);
  const [dueDate, setDueDate] = useState("2026-10-30");

  if (contracting) {
    return (
      <>
        <SubHeader title={`Contratar ${contracting.toLowerCase()}`} compactActions />
        <main className="mx-auto w-full max-w-[430px] px-5 pb-8 pt-5">
          <div className="h-1.5 overflow-hidden rounded-full bg-[#dce5f7]"><div className="h-full w-1/2 rounded-full bg-[#1685e6]" /></div>
          <p className="mt-2 text-right text-[11px] text-muted-foreground">Passo 1 de 2</p>
          <div className="mt-6 rounded-lg bg-[#eef3ff] px-4 py-3 text-center text-sm">Valor disponível: <strong>R$ 30.000,00</strong></div>
          <label className="mt-6 block text-sm font-medium text-[#31588f]">Digite ou escolha um valor</label>
          <div className="mt-1 rounded-lg border-2 border-[#4795d8] bg-white px-3 py-2 text-lg">{amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</div>
          <input aria-label="Valor do crédito" type="range" min="1000" max="30000" step="500" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="mt-6 w-full accent-[#1685e6]" />
          <div className="mt-1 flex justify-between text-xs"><span>R$ 1.000,00</span><span>R$ 30.000,00</span></div>
          <label className="mt-8 block text-sm font-medium">Vencimento da primeira parcela</label>
          <div className="mt-1 flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-3"><CalendarDays className="size-5 text-[#313878]" /><input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="min-w-0 flex-1 bg-transparent outline-none" /></div>
          <p className="mt-2 text-xs text-muted-foreground">Escolha uma data disponível para a primeira parcela.</p>
          <div className="mt-24">
            <button type="button" className="w-full rounded-xl bg-[#313fa8] py-4 font-semibold text-white">Continuar</button>
            <button type="button" onClick={() => setContracting(null)} className="mt-3 w-full py-3 font-semibold text-[#31588f]">Cancelar</button>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <SubHeader title="Linhas de crédito" variant="deep" compactActions>
        <div className="px-4 pb-8 pt-5">
          <h1 className="max-w-[360px] text-[22px] font-semibold leading-snug">
            Confira as soluções de crédito para sua empresa
          </h1>
        </div>
      </SubHeader>

      <main className="mx-auto w-full max-w-[430px] px-4 pb-8 pt-4">
        <ul className="space-y-3">
          {creditLines.map((line) => {
            const isOpen = open === line.title;
            const Icon = creditIcons[line.icon as keyof typeof creditIcons] ?? WalletCards;
            return (
              <li key={line.title} className="overflow-hidden rounded-xl bg-white shadow-[0_5px_16px_rgba(25,35,70,0.14)]">
                <button
                  type="button"
                  onClick={() => { setOpen(isOpen ? null : line.title); if (!isOpen && line.title === "Capital de giro") setContracting(line.title); }}
                  aria-expanded={isOpen}
                  className="grid min-h-[88px] w-full grid-cols-[40px_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 text-left"
                >
                  <Icon className="size-7 text-[#313878]" strokeWidth={1.5} aria-hidden />
                  <span className="min-w-0">
                    <span className="block text-[16px] font-semibold leading-tight">{line.title}</span>
                    {"badge" in line && line.badge && (
                      <span className="mt-1 inline-block rounded-full bg-[#eef3ff] px-2 py-0.5 text-[11px] font-medium text-[#31588f]">{line.badge}</span>
                    )}
                    <span className="mt-1 block text-[13px] leading-snug text-muted-foreground">{line.body}</span>
                  </span>
                  <ChevronRight className={cn("size-6 text-[#4775ad] transition-transform", isOpen && "rotate-90")} aria-hidden />
                </button>
                {isOpen && (
                  <div className="border-t border-border/60 px-4 py-4">
                    <p className="text-sm leading-relaxed text-muted-foreground">{line.body}</p>
                    <button type="button" className="mt-3 inline-flex items-center gap-2 font-semibold text-[#313878]">
                      Ver detalhes <ChevronDown className="size-4" />
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </main>
    </>
  );
}
