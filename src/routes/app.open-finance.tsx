// ============= Open Finance (conexões e consentimentos simulados) =============

import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Building2, Link2, Plus, ShieldCheck, Trash2 } from "lucide-react";
import { SubHeader } from "@/components/app/SubHeader";
import { PrimaryButton } from "@/components/app/OpKit";
import { formatBRL } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/open-finance")({
  head: () => ({
    meta: [
      { title: "Open Finance — Bradesco Empresas e Negócios (demo)" },
      {
        name: "description",
        content:
          "Conexões e consentimentos de Open Finance em um só lugar.",
      },
      { property: "og:title", content: "Open Finance — Bradesco Empresas e Negócios (demo)" },
      {
        property: "og:description",
        content: "Conexões e consentimentos de Open Finance.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: OpenFinance,
});

interface Connection {
  id: string;
  institution: string;
  connectedAt: string;
  expiresAt: string;
  balance: number;
}

const STORAGE_KEY = "conta-empresas-open-finance-v1";

const AVAILABLE = [
  { name: "Banco Horizonte", balance: 18_420.9 },
  { name: "Cooperativa Serrana", balance: 7_905.12 },
  { name: "Banco Digital Prisma", balance: 132_500 },
  { name: "Financeira Vetor", balance: 3_250.75 },
] as const;

function loadConnections(): Connection[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Connection[]) : [];
  } catch {
    return [];
  }
}

function OpenFinance() {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [picking, setPicking] = useState(false);
  const [consentFor, setConsentFor] = useState<(typeof AVAILABLE)[number] | null>(null);

  useEffect(() => {
    setConnections(loadConnections());
  }, []);

  const save = (next: Connection[]) => {
    setConnections(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* armazenamento indisponível */
    }
  };

  const confirmConsent = () => {
    if (!consentFor) return;
    const now = new Date();
    const expires = new Date(now);
    expires.setFullYear(expires.getFullYear() + 1);
    save([
      ...connections,
      {
        id: `of_${Date.now().toString(36)}`,
        institution: consentFor.name,
        connectedAt: now.toISOString(),
        expiresAt: expires.toISOString(),
        balance: consentFor.balance,
      },
    ]);
    setConsentFor(null);
    setPicking(false);
  };

  const revoke = (id: string) => save(connections.filter((c) => c.id !== id));

  const total = connections.reduce((s, c) => s + c.balance, 0);
  const remaining = AVAILABLE.filter((a) => !connections.some((c) => c.institution === a.name));

  return (
    <>
      <SubHeader title="Open Finance" />
      <main className="mx-auto w-full max-w-[430px] bg-[#f4f5f7] px-4 py-5 pb-12">
        <section className="rounded-2xl bg-card p-5 shadow-sm">
          <span className="grid size-12 place-items-center rounded-full bg-secondary">
            <Link2 className="size-6 text-icon-ink" strokeWidth={1.6} />
          </span>
          <h2 className="mt-4 text-xl font-bold">Suas finanças em um só lugar</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Visualize suas contas conectadas e consentimentos em um só lugar.
          </p>
          {connections.length > 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">
              Saldo somado das contas conectadas:{" "}
              <strong className="text-foreground tabular-nums">{formatBRL(total)}</strong>
            </p>
          ) : null}
        </section>

        <section className="mt-3 rounded-2xl bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Building2 className="size-6 text-icon-ink" strokeWidth={1.6} />
              <div>
                <p className="font-bold">Instituições conectadas</p>
                <p className="text-xs text-muted-foreground">Gerencie seus consentimentos</p>
              </div>
            </div>
            <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold text-primary">
              {connections.length}
            </span>
          </div>

          {connections.length > 0 ? (
            <ul className="mt-4 space-y-3">
              {connections.map((c) => (
                <li key={c.id} className="rounded-xl border border-border p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold">{c.institution}</p>
                      <p className="text-xs text-muted-foreground">
                        Consentimento até {new Date(c.expiresAt).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <p className="text-sm font-bold tabular-nums">{formatBRL(c.balance)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => revoke(c.id)}
                    className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-red"
                  >
                    <Trash2 className="size-3.5" />
                    Revogar consentimento
                  </button>
                </li>
              ))}
            </ul>
          ) : null}

          {remaining.length > 0 ? (
            <button
              type="button"
              onClick={() => setPicking((v) => !v)}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 font-bold text-primary-foreground"
            >
              <Plus className="size-5" />
              Conectar instituição
            </button>
          ) : null}
        </section>

        {picking && !consentFor ? (
          <section className="mt-3 rounded-2xl bg-card p-4 shadow-sm">
            <h3 className="text-[16px] font-bold">Escolha uma instituição</h3>
            <div className="mt-3 space-y-2">
              {remaining.map((a) => (
                <button
                  key={a.name}
                  type="button"
                  onClick={() => setConsentFor(a)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl border border-border p-3 text-left",
                    "transition-colors hover:bg-secondary",
                  )}
                >
                  <Building2 className="size-6 shrink-0 text-icon-ink" strokeWidth={1.6} />
                  <span className="text-sm font-semibold">{a.name}</span>
                </button>
              ))}
            </div>
          </section>
        ) : null}

        {consentFor ? (
          <section className="mt-3 rounded-2xl bg-card p-5 shadow-sm">
            <h3 className="text-[16px] font-bold">Consentimento</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Você autoriza <strong>{consentFor.name}</strong> a compartilhar, por 12 meses:
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              <li>Saldo e movimentações da conta</li>
              <li>Dados cadastrais da empresa</li>
            </ul>
            <PrimaryButton onClick={confirmConsent}>Autorizar compartilhamento</PrimaryButton>
            <button
              type="button"
              onClick={() => setConsentFor(null)}
              className="mt-3 w-full rounded-full border border-border py-3.5 font-medium"
            >
              Voltar
            </button>
          </section>
        ) : null}

      </main>
    </>
  );
}
