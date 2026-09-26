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
  return <Icon className="size-9 text-[#313878]" strokeWidth={1.65} aria-hidden />;
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
            className="shrink-0 rounded-lg border border-[#313878] px-5 py-2 text-sm font-semibold text-[#313878]"
          >
            Personalizar
          </button>
        </div>

        <ul className="mt-7 grid grid-cols-3 gap-4">
          {services.map((s) => (
            <li key={s.slug}>
              {s.route ? (
                <Link
                  to={s.route}
                  className="flex min-h-[112px] h-full flex-col items-center justify-center gap-2 rounded-2xl border border-border/40 bg-card px-2 py-3 text-center shadow-[0_7px_18px_rgba(25,35,70,0.12)] transition-transform active:scale-[0.97]"
                >
                  <ServiceIcon name={s.icon} />
                  <span className="text-[13px] font-medium leading-tight">{s.label}</span>
                </Link>
              ) : (
                <Link
                  to="/app/servico/$slug"
                  params={{ slug: s.slug }}
                  className="flex min-h-[112px] h-full flex-col items-center justify-center gap-2 rounded-2xl border border-border/40 bg-card px-2 py-3 text-center shadow-[0_7px_18px_rgba(25,35,70,0.12)] transition-transform active:scale-[0.97]"
                >
                  <ServiceIcon name={s.icon} />
                  <span className="text-[13px] font-medium leading-tight">{s.label}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}