import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SubHeader } from "@/components/app/SubHeader";
import { formatBRL } from "@/lib/mock-data";
import { parseAmount, pixLimits } from "@/lib/pix";

export const Route = createFileRoute("/app/pix/limites")({
  head: () => ({
    meta: [
      { title: "Limites do Pix — Conta Empresas (demo)" },
      {
        name: "description",
        content: "Consulte e ajuste os limites de Pix por transação, diário e noturno nesta demonstração.",
      },
      { property: "og:title", content: "Limites do Pix — Conta Empresas (demo)" },
      { property: "og:description", content: "Consulte e ajuste os limites de Pix da conta." },
    ],
  }),
  component: LimitesPix,
});

const STORAGE_KEY = "bradesco-demo-pix-limites";

function readLimits(): Record<string, number> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}") as Record<string, number>;
  } catch {
    return {};
  }
}

function LimitesPix() {
  const [limits, setLimits] = useState<Record<string, number>>(readLimits);
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const save = (label: string) => {
    const value = parseAmount(draft);
    if (!Number.isFinite(value) || value <= 0) {
      setMessage("Informe um valor maior que zero.");
      return;
    }
    const next = { ...limits, [label]: value };
    setLimits(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* armazenamento indisponível: mantém apenas na tela */
    }
    setEditing(null);
    setMessage("Novo limite registrado nesta demonstração.");
  };

  return (
    <>
      <SubHeader title="Limites do Pix" fallbackTo="/app/pix" compactActions />
      <main className="px-4 py-5">
        <p className="text-sm text-muted-foreground">
          Ajuste os limites desta demonstração. Alterações valem apenas neste aparelho.
        </p>

        <ul className="mt-4 space-y-3">
          {pixLimits.map((limit) => {
            const current = limits[limit.label] ?? limit.value;
            return (
              <li key={limit.label} className="rounded-xl border border-border bg-card p-4 shadow-card">
                <p className="font-semibold">{limit.label}</p>
                <p className="mt-1 text-lg font-bold tabular-nums">{formatBRL(current)}</p>

                {editing === limit.label ? (
                  <div className="mt-3 space-y-3">
                    <input
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      inputMode="decimal"
                      placeholder="Novo limite"
                      className="w-full rounded-lg border border-border px-3 py-3 text-base tabular-nums outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    />
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => save(limit.label)}
                        className="flex-1 rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground"
                      >
                        Salvar
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditing(null)}
                        className="flex-1 rounded-full border border-border py-3 text-sm font-medium"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(limit.label);
                      setDraft(String(current));
                      setMessage(null);
                    }}
                    className="mt-3 font-medium text-primary underline underline-offset-4"
                  >
                    Alterar limite
                  </button>
                )}
              </li>
            );
          })}
        </ul>

        {message && <p className="mt-4 text-sm text-muted-foreground">{message}</p>}
      </main>
    </>
  );
}
