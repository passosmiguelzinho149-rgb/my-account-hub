import { createFileRoute, notFound } from "@tanstack/react-router";
import { SubHeader } from "@/components/app/SubHeader";
import { account, findService, formatBRL } from "@/lib/mock-data";
import { Eye, EyeOff, WalletCards } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/app/servico/$slug")({
  loader: ({ params }) => {
    if (!findService(params.slug)) throw notFound();
    return null;
  },
  head: () => ({
    meta: [
      { title: "Serviço — Conta Empresas" },
      {
        name: "description",
        content: "Serviço da conta empresarial.",
      },
      { property: "og:title", content: "Serviço — Conta Empresas" },
      {
        property: "og:description",
        content: "Serviço da conta empresarial.",
      },
    ],
  }),
  component: ServicoScreen,
});

const actions = ["Consultar", "Solicitar", "Histórico", "Ajuda"] as const;

function ServicoScreen() {
  const { slug } = Route.useParams();
  const service = findService(slug);
  const [showBalance, setShowBalance] = useState(true);
  if (!service) return null;

  if (slug === "saldo") {
    return (
      <>
        <SubHeader title="Saldo" fallbackTo="/app/servicos" />
        <main className="px-4 py-5">
          <section className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-full bg-primary/10 text-primary">
                  <WalletCards className="size-6" aria-hidden />
                </span>
                <div>
                  <p className="text-sm text-muted-foreground">Saldo disponível</p>
                  <p className="mt-1 text-2xl font-bold">{showBalance ? formatBRL(account.balance) : "R$ ••••••••"}</p>
                </div>
              </div>
              <button type="button" onClick={() => setShowBalance((value) => !value)} aria-label={showBalance ? "Ocultar saldo" : "Mostrar saldo"} className="grid size-11 place-items-center rounded-full border border-border">
                {showBalance ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
              </button>
            </div>
            <div className="mt-5 border-t border-border pt-4 text-sm text-muted-foreground">
              <p>Agência {account.branch} · Conta {account.number}</p>
            </div>
          </section>
        </main>
      </>
    );
  }

  return (
    <>
      <SubHeader title={service.label} fallbackTo="/app/servicos" />
      <main className="px-4 py-5">
        <h2 className="text-xl font-bold break-words">{service.label}</h2>
        <p className="mt-2 text-muted-foreground">
          Serviço <strong className="text-foreground">{service.label}</strong>.
          Nenhuma operação real é realizada aqui.
        </p>
        <ul className="mt-5 grid grid-cols-2 gap-4">
          {actions.map((a) => (
            <li key={a}>
              <button
                type="button"
                className="w-full rounded-xl border border-border bg-card py-6 text-base font-medium shadow-card transition-colors hover:bg-secondary"
              >
                {a}
              </button>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}