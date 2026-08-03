import { createFileRoute } from "@tanstack/react-router";
import { CircleAlert, ChevronDown } from "lucide-react";
import { useState } from "react";
import { SubHeader } from "@/components/app/SubHeader";
import { creditLines } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/credito")({
  head: () => ({
    meta: [
      { title: "Linhas de Crédito — Conta Empresas (demo)" },
      {
        name: "description",
        content: "Capital de giro, cheque empresarial e microcrédito para a sua empresa.",
      },
      { property: "og:title", content: "Linhas de Crédito — Conta Empresas (demo)" },
      {
        property: "og:description",
        content: "Capital de giro, cheque empresarial e microcrédito para a sua empresa.",
      },
    ],
  }),
  component: CreditoScreen,
});

function CreditoScreen() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <>
      <SubHeader title="Linhas de Crédito">
        <div className="px-4 pb-5">
          <h2 className="text-2xl font-bold break-words">Crédito para empresa</h2>
        </div>
      </SubHeader>

      <main className="px-4 py-5">
        <section className="rounded-xl border border-border bg-card p-4 shadow-card">
          <div className="flex gap-2">
            <CircleAlert className="mt-0.5 size-4 shrink-0 text-brand-red" aria-hidden />
            <div className="min-w-0">
              <h3 className="font-semibold">Procura por uma linha de crédito?</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Confira com nossa Agência Digital se há opções para sua empresa — das 8h às 20h, em
                dias úteis, horário de Brasília.
              </p>
              <button type="button" className="mt-3 font-semibold text-brand-red">
                Falar com Agência Digital
              </button>
            </div>
          </div>
        </section>

        <h3 className="mt-6 font-semibold">Saiba mais sobre as linhas de crédito</h3>
        <ul className="mt-2 divide-y divide-border border-t border-border">
          {creditLines.map((line) => {
            const isOpen = open === line.title;
            return (
              <li key={line.title}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : line.title)}
                  aria-expanded={isOpen}
                  className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-4 text-left"
                >
                  <span className="min-w-0 break-words">{line.title}</span>
                  <ChevronDown
                    className={cn(
                      "size-5 shrink-0 text-brand-red transition-transform",
                      isOpen && "rotate-180",
                    )}
                    aria-hidden
                  />
                </button>
                {isOpen && <p className="pb-4 text-sm text-muted-foreground">{line.body}</p>}
              </li>
            );
          })}
        </ul>
      </main>
    </>
  );
}