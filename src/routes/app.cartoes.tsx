import { createFileRoute } from "@tanstack/react-router";
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
  return (
    <>
      <SubHeader title="Cartões" />
      <main className="px-4 py-5 pb-10">
        <h2 className="text-xl font-bold">Meus cartões</h2>
        <p className="mt-1 text-sm text-muted-foreground">Cartões vinculados à sua conta empresarial.</p>

        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          {cards.map((card) => (
            <section key={card.name}>
              <div className={`relative min-h-[220px] overflow-hidden rounded-[26px] bg-gradient-to-br ${card.theme} p-6 text-white shadow-xl`}>
                <div className="absolute -right-12 -top-16 size-52 rotate-12 rounded-[40%] border-[30px] border-white/5" />
                <div className="relative flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <img src="/bradesco-symbol.svg" alt="" className="size-9 object-contain" />
                      <span className="text-xl font-bold">bradesco</span>
                    </div>
                    <p className="ml-11 -mt-1 text-xs text-white/85">empresas e negócios</p>
                  </div>
                  <span className="text-sm font-semibold">Empresarial</span>
                </div>

                <div className="relative mt-7 flex items-center gap-3">
                  <span className="h-10 w-14 rounded-md border border-white/40 bg-gradient-to-br from-[#f2e3b0] to-[#bda766]" />
                  <Wifi className="size-7 rotate-90" />
                </div>
                <p className="relative mt-4 font-mono text-[19px] tracking-[0.12em]">{card.number}</p>

                <div className="relative mt-3 flex items-end justify-between gap-3">
                  <div>
                    <p className="text-[9px] uppercase text-white/70">Validade</p>
                    <p className="font-mono text-sm">12/28</p>
                    <p className="mt-2 text-xs font-semibold">{account.holder}</p>
                    <p className="text-[10px] text-white/80">CNPJ {account.cnpj}</p>
                  </div>
                  <div className="text-right">
                    <p className={card.brand === "VISA" ? "text-3xl font-black italic" : "text-lg font-bold"}>{card.brand}</p>
                    {card.brand === "mastercard" && (
                      <div className="mt-1 flex justify-end">
                        <span className="size-8 rounded-full bg-red-500" />
                        <span className="-ml-3 size-8 rounded-full bg-amber-400/90" />
                      </div>
                    )}
                    {card.brand === "VISA" && <p className="text-xs">Business</p>}
                  </div>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2">
                <button type="button" className="flex flex-col items-center gap-1.5 rounded-xl border border-border bg-card px-2 py-3 text-xs font-semibold shadow-card">
                  <Eye className="size-5 text-primary" />Ver dados
                </button>
                <button type="button" className="flex flex-col items-center gap-1.5 rounded-xl border border-border bg-card px-2 py-3 text-xs font-semibold shadow-card">
                  <Settings className="size-5 text-primary" />Gerenciar
                </button>
                <button type="button" className="flex flex-col items-center gap-1.5 rounded-xl border border-border bg-card px-2 py-3 text-xs font-semibold shadow-card">
                  <Lock className="size-5 text-primary" />Bloquear
                </button>
              </div>
            </section>
          ))}
        </div>

        <section className="mt-6 rounded-2xl border border-border bg-card p-4 shadow-card">
          <div className="flex items-center gap-3">
            <CreditCard className="size-5 text-primary" />
            <div>
              <p className="font-semibold">Conta vinculada</p>
              <p className="text-sm text-muted-foreground">Agência {account.branch} · Conta {account.number}</p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
