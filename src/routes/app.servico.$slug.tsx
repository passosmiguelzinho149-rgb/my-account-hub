import { createFileRoute, notFound } from "@tanstack/react-router";
import { SubHeader } from "@/components/app/SubHeader";
import { findService } from "@/lib/mock-data";

export const Route = createFileRoute("/app/servico/$slug")({
  loader: ({ params }) => {
    if (!findService(params.slug)) throw notFound();
    return null;
  },
  head: () => ({
    meta: [
      { title: "Serviço — Conta Empresas (demo)" },
      {
        name: "description",
        content: "Tela de demonstração de serviço da conta empresarial. Nenhuma operação real é realizada.",
      },
      { property: "og:title", content: "Serviço — Conta Empresas (demo)" },
      {
        property: "og:description",
        content: "Tela de demonstração de serviço da conta empresarial.",
      },
    ],
  }),
  component: ServicoScreen,
});

const actions = ["Consultar", "Solicitar", "Histórico", "Ajuda"] as const;

function ServicoScreen() {
  const { slug } = Route.useParams();
  const service = findService(slug);
  if (!service) return null;

  return (
    <>
      <SubHeader title={service.label} fallbackTo="/app/servicos" />
      <main className="px-4 py-5">
        <h2 className="text-xl font-bold break-words">{service.label}</h2>
        <p className="mt-2 text-muted-foreground">
          Tela de demonstração de <strong className="text-foreground">{service.label}</strong>.
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