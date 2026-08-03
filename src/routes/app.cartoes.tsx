import { createFileRoute } from "@tanstack/react-router";
import { SubHeader } from "@/components/app/SubHeader";

export const Route = createFileRoute("/app/cartoes")({
  head: () => ({
    meta: [
      { title: "Cartões — Conta Empresas (demo)" },
      {
        name: "description",
        content: "Consulte, solicite e acompanhe cartões empresariais nesta tela de demonstração.",
      },
      { property: "og:title", content: "Cartões — Conta Empresas (demo)" },
      { property: "og:description", content: "Consulte, solicite e acompanhe cartões empresariais." },
    ],
  }),
  component: CartoesScreen,
});

const actions = ["Consultar", "Solicitar", "Histórico", "Ajuda"] as const;

function CartoesScreen() {
  return (
    <>
      <SubHeader title="Cartões" />
      <main className="px-4 py-5">
        <h2 className="text-xl font-bold">Cartões</h2>
        <p className="mt-2 text-muted-foreground">
          Tela de demonstração de <strong className="text-foreground">Cartões</strong>. Nenhuma
          operação real é realizada aqui.
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