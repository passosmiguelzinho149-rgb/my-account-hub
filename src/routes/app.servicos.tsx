import { createFileRoute, Link } from "@tanstack/react-router";
import { BrandHeader } from "@/components/app/BrandHeader";
import { ServiceGlyph } from "@/components/app/ServiceGlyph";
import { services } from "@/lib/mock-data";

export const Route = createFileRoute("/app/servicos")({
  head: () => ({
    meta: [
      { title: "Serviços — Conta Empresas" },
      {
        name: "description",
        content: "Pix, extrato, cartões, limites, investimentos e demais serviços da conta empresarial.",
      },
      { property: "og:title", content: "Serviços — Conta Empresas" },
      {
        property: "og:description",
        content: "Pix, extrato, cartões, limites e demais serviços da conta empresarial.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ServicosScreen,
});

function ServicosScreen() {
  return (
    <>
      <BrandHeader />
      <main className="mx-auto w-full max-w-[430px] px-4 py-5">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <h1 className="truncate text-[28px] font-medium">Serviços</h1>
          <button
            type="button"
            className="shrink-0 rounded-lg border border-[#313878] px-5 py-2 text-[16px] font-semibold text-[#313878]"
          >
            Personalizar
          </button>
        </div>

        <ul className="mt-6 grid grid-cols-3 gap-x-4 gap-y-5">
          {services.map((s) => (
            <li key={s.slug}>
              {s.route ? (
                <Link
                  to={s.route}
                   className="flex h-[108px] w-full flex-col items-center justify-center gap-1.5 rounded-[14px] border border-black/5 bg-white px-1.5 py-2 text-center shadow-[0_4px_10px_rgba(0,0,0,0.13)] transition-transform active:scale-[0.97]"
                >
                   <ServiceGlyph slug={s.slug} className="size-11" />
                  <span className="max-w-[110px] text-[15px] font-medium leading-[1.05] text-[#242424]">{s.label}</span>
                </Link>
              ) : (
                <Link
                  to="/app/servico/$slug"
                  params={{ slug: s.slug }}
                   className="flex h-[108px] w-full flex-col items-center justify-center gap-1.5 rounded-[14px] border border-black/5 bg-white px-1.5 py-2 text-center shadow-[0_4px_10px_rgba(0,0,0,0.13)] transition-transform active:scale-[0.97]"
                >
                   <ServiceGlyph slug={s.slug} className="size-11" />
                  <span className="max-w-[110px] text-[15px] font-medium leading-[1.05] text-[#242424]">{s.label}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}