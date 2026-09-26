import { createFileRoute } from "@tanstack/react-router";
import { BadgeDollarSign, Banknote, ChevronDown, ChevronRight, HandCoins, WalletCards } from "lucide-react";
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
                  onClick={() => setOpen(isOpen ? null : line.title)}
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
