import { createFileRoute, Link } from "@tanstack/react-router";
import { icons } from "lucide-react";
import { BrandHeader } from "@/components/app/BrandHeader";
import { services } from "@/lib/mock-data";

export const Route = createFileRoute("/app/servicos")({
  head: () => ({
    meta: [
      { title: "Serviços — Conta Empresas (demo)" },
      {
        name: "description",
        content: "Pix, extrato, cartões, limites, investimentos e demais serviços da conta empresarial.",
      },
      { property: "og:title", content: "Serviços — Conta Empresas (demo)" },
      {
        property: "og:description",
        content: "Pix, extrato, cartões, limites e demais serviços da conta empresarial.",
      },
    ],
  }),
  component: ServicosScreen,
});

function ServiceIcon({ name }: { name: string }) {
  const Icon = icons[name as keyof typeof icons] ?? icons.Circle;
  return <Icon className="size-6 text-primary" aria-hidden />;
}

function ServicosScreen() {
  return (
    <>
      <BrandHeader />
      <main className="px-4 py-5">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <h1 className="truncate text-2xl font-bold">Serviços</h1>
          <button
            type="button"
            className="shrink-0 rounded-full border border-primary px-4 py-2 text-sm font-medium text-primary"
          >
            Personalizar
          </button>
        </div>

        <ul className="mt-5 grid grid-cols-3 gap-3">
          {services.map((s) => (
            <li key={s.slug}>
              {s.route ? (
                <Link
                  to={s.route}
                  className="flex h-full flex-col items-center justify-center gap-2 rounded-xl border border-border bg-card px-2 py-5 text-center shadow-card"
                >
                  <ServiceIcon name={s.icon} />
                  <span className="text-xs font-medium">{s.label}</span>
                </Link>
              ) : (
                <Link
                  to="/app/servico/$slug"
                  params={{ slug: s.slug }}
                  className="flex h-full flex-col items-center justify-center gap-2 rounded-xl border border-border bg-card px-2 py-5 text-center shadow-card"
                >
                  <ServiceIcon name={s.icon} />
                  <span className="text-xs font-medium">{s.label}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}