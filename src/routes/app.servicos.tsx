import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Settings2, X } from "lucide-react";
import { useState } from "react";
import { BrandHeader } from "@/components/app/BrandHeader";
import { ServiceGlyph } from "@/components/app/ServiceGlyph";
import { services } from "@/lib/mock-data";

export const Route = createFileRoute("/app/servicos")({
  head: () => ({
    meta: [
      { title: "Serviços — Conta Empresas" },
      { name: "description", content: "Pix, extrato, cartões, limites, investimentos e demais serviços da conta empresarial." },
    ],
  }),
  component: ServicosScreen,
});

function ServicosScreen() {
  const [customizing, setCustomizing] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(() => services.slice(0, 6).map((service) => service.slug));
  const toggleFavorite = (slug: string) => setFavorites((current) => current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug]);

  return (
    <>
      <BrandHeader />
      <main className="mx-auto w-full max-w-[1180px] bg-white px-3 pb-7 pt-4 sm:px-5">
        <div className="flex items-center justify-between gap-3 px-1">
          <div className="min-w-0">
            <h1 className="text-[24px] font-bold tracking-[-0.02em] text-[#30343b] sm:text-[30px]">Serviços</h1>
            <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-[.12em] text-[#7b8492]">Ambiente simulado</p>
          </div>
          <button type="button" onClick={() => setCustomizing((value) => !value)} className="inline-flex h-8 shrink-0 items-center gap-1 rounded-full border border-[#d7e0eb] bg-white px-2.5 text-[11px] font-semibold text-[#315c91] shadow-sm sm:h-9 sm:px-3 sm:text-xs">
            {customizing ? <Check className="size-3.5" /> : <Settings2 className="size-3.5" />}
            {customizing ? "Concluir" : "Personalizar"}
          </button>
        </div>

        {customizing && <section className="mt-3 rounded-xl border border-[#dce6f2] bg-[#f8fbff] p-2.5"><p className="text-xs text-[#5d6c7e]">Toque nos serviços para marcar ou desmarcar favoritos.</p></section>}

        <ul className="mt-4 grid grid-cols-4 gap-2 sm:gap-3">
          {services.map((s) => {
            const selected = favorites.includes(s.slug);
            const card = <>
              <ServiceGlyph slug={s.slug} className="size-7 text-[#4f7eaa] sm:size-9" />
              <span className="mt-2 w-full text-center text-[9px] font-medium leading-[1.12] text-[#424a55] sm:text-[12px]">{s.label}</span>
              {customizing && <span className={`absolute right-1.5 top-1.5 grid size-4 place-items-center rounded-full ${selected ? "bg-[#2764a5] text-white" : "bg-[#edf1f5] text-[#788595]"}`}>{selected ? <Check className="size-2.5" /> : <X className="size-2.5" />}</span>}
            </>;
            const className = "relative flex h-[78px] min-w-0 w-full flex-col items-center justify-center overflow-hidden rounded-xl border border-[#e7edf3] bg-white px-1.5 py-2 text-center shadow-[0_3px_10px_rgba(39,73,109,.07)] active:scale-[0.97] sm:h-[104px] sm:px-2";
            return <li key={s.slug} className="min-w-0">{customizing ? <button type="button" onClick={() => toggleFavorite(s.slug)} className={className}>{card}</button> : s.route ? <Link to={s.route} className={className}>{card}</Link> : <Link to="/app/servico/$slug" params={{ slug: s.slug }} className={className}>{card}</Link>}</li>;
          })}
        </ul>
      </main>
    </>
  );
}