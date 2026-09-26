import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Copy, Eye, EyeOff, Lock, Plus, ShieldCheck, Sparkles, Unlock } from "lucide-react";
import { SubHeader } from "@/components/app/SubHeader";
import { account } from "@/lib/mock-data";

type VirtualCard = {
  number: string;
  holder: string;
  expires: string;
  cvv: string;
  active: boolean;
  createdAt: string;
};

const STORAGE_KEY = "bradesco-demo-virtual-card-v1";

function generateCard(): VirtualCard {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = String((now.getFullYear() + 5) % 100).padStart(2, "0");

  // Números deliberadamente fictícios para a demonstração; não são cartões válidos.
  const suffix = String(Math.floor(1000000000 + Math.random() * 8999999999));
  const number = `9999 00${suffix.slice(0, 10)}`.slice(0, 19);

  return {
    number,
    holder: account.holder.toUpperCase(),
    expires: `${month}/${year}`,
    cvv: String(Math.floor(100 + Math.random() * 900)),
    active: true,
    createdAt: now.toISOString(),
  };
}

function loadCard(): VirtualCard | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as VirtualCard) : null;
  } catch {
    return null;
  }
}

function saveCard(card: VirtualCard) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(card));
}

export const Route = createFileRoute("/app/cartoes")({
  head: () => ({
    meta: [
      { title: "Cartões — Conta Empresas (demo)" },
      {
        name: "description",
        content: "Cartão virtual empresarial fictício para demonstração.",
      },
    ],
  }),
  component: CartoesScreen,
});

function CartoesScreen() {
  const [card, setCard] = useState<VirtualCard | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    setCard(loadCard());
  }, []);

  function createVirtualCard() {
    const next = generateCard();
    saveCard(next);
    setCard(next);
    setRevealed(false);
    setCopied(null);
  }

  function toggleCard() {
    if (!card) return;
    const next = { ...card, active: !card.active };
    saveCard(next);
    setCard(next);
  }

  async function copyValue(value: string, label: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      window.setTimeout(() => setCopied(null), 1800);
    } catch {
      setCopied("erro");
    }
  }

  return (
    <>
      <SubHeader title="Cartões" />
      <main className="px-4 py-5 pb-10">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">Cartão empresarial</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Gerencie seu cartão virtual de demonstração.
            </p>
          </div>
          <div className="grid size-11 shrink-0 place-items-center rounded-full bg-red-50 text-primary">
            <Sparkles className="size-5" />
          </div>
        </div>

        {!card ? (
          <section className="mt-6 rounded-3xl border border-border bg-card p-6 text-center shadow-card">
            <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-primary/10 text-primary">
              <Plus className="size-8" />
            </div>
            <h3 className="mt-4 text-lg font-bold">Crie seu cartão virtual</h3>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Gere agora um cartão empresarial fictício para testar a interface e o fluxo de pagamentos.
            </p>
            <button
              type="button"
              onClick={createVirtualCard}
              className="mt-5 w-full rounded-xl bg-primary px-5 py-3.5 font-bold text-primary-foreground shadow-lg"
            >
              Gerar cartão virtual
            </button>
          </section>
        ) : (
          <>
            <section
              className={`relative mt-6 min-h-[215px] overflow-hidden rounded-[26px] p-6 text-white shadow-xl transition-opacity ${card.active ? "bg-gradient-to-br from-[#b40000] via-[#d00000] to-[#8d0000]" : "bg-gradient-to-br from-gray-600 to-gray-800 opacity-80"}`}
            >
              <div className="absolute -right-16 -top-16 size-48 rounded-full border-[28px] border-white/10" />
              <div className="absolute -bottom-24 -left-10 size-52 rounded-full border-[30px] border-white/10" />
              <div className="relative flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/75">
                    Empresas e negócios
                  </p>
                  <p className="mt-2 text-lg font-bold">CARTÃO VIRTUAL</p>
                </div>
                <ShieldCheck className="size-8 text-white/85" />
              </div>
              <div className="relative mt-8">
                <p className="font-mono text-xl tracking-[0.13em]">
                  {revealed ? card.number : "9999 •••• •••• ••••"}
                </p>
              </div>
              <div className="relative mt-5 flex items-end justify-between">
                <div>
                  <p className="text-[9px] uppercase text-white/65">Titular</p>
                  <p className="mt-0.5 text-xs font-semibold">{card.holder}</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase text-white/65">Validade</p>
                  <p className="mt-0.5 font-mono text-xs font-semibold">{card.expires}</p>
                </div>
              </div>
              {!card.active && (
                <div className="absolute inset-0 grid place-items-center bg-black/25">
                  <span className="rounded-full bg-black/55 px-4 py-2 text-sm font-bold">CARTÃO BLOQUEADO</span>
                </div>
              )}
            </section>

            <section className="mt-4 rounded-2xl border border-border bg-card p-4 shadow-card">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Número do cartão</span>
                <button
                  type="button"
                  onClick={() => setRevealed((v) => !v)}
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-primary"
                >
                  {revealed ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  {revealed ? "Ocultar" : "Mostrar"}
                </button>
              </div>
              <p className="mt-2 font-mono text-base font-semibold">
                {revealed ? card.number : "9999 •••• •••• ••••"}
              </p>

              {revealed && (
                <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-4">
                  <div>
                    <p className="text-xs text-muted-foreground">CVV</p>
                    <p className="mt-1 font-mono font-bold">{card.cvv}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Validade</p>
                    <p className="mt-1 font-mono font-bold">{card.expires}</p>
                  </div>
                </div>
              )}

              <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => copyValue(card.number, "número")}
                  disabled={!revealed}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-3 py-3 text-sm font-bold disabled:opacity-40"
                >
                  <Copy className="size-4" />
                  {copied === "número" ? "Copiado!" : "Copiar número"}
                </button>
                <button
                  type="button"
                  onClick={toggleCard}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-secondary px-3 py-3 text-sm font-bold"
                >
                  {card.active ? <Lock className="size-4" /> : <Unlock className="size-4" />}
                  {card.active ? "Bloquear" : "Desbloquear"}
                </button>
              </div>
            </section>

            <button
              type="button"
              onClick={createVirtualCard}
              className="mt-4 w-full rounded-xl border border-primary px-5 py-3.5 font-bold text-primary"
            >
              Gerar novo cartão virtual
            </button>
          </>
        )}

        <div className="mt-5 rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-4 text-sm leading-relaxed text-muted-foreground">
          <strong className="text-foreground">Demonstração fictícia:</strong> este cartão não possui
          validade financeira, não pode realizar compras e não está conectado a nenhuma instituição
          financeira ou conta real.
        </div>
      </main>
    </>
  );
}
