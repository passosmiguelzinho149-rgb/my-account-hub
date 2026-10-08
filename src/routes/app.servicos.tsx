import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, ChevronRight, Settings2, X } from "lucide-react";
import { useState } from "react";
import { BrandHeader } from "@/components/app/BrandHeader";
import { ServiceGlyph } from "@/components/app/ServiceGlyph";
import { services } from "@/lib/mock-data";

export const Route = createFileRoute("/app/servicos")({
  head: () => ({
    meta: [
      { title: "Serviços — Conta Empresas" },
      { name: "description", content: "Pix, extrato, cartões, limites, investimentos e demais serviços da conta empresarial." },
      { property: "og:title", content: "Serviços — Conta Empresas" },
      { property: "og:description", content: "Pix, extrato, cartões, limites e demais serviços da conta empresarial." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
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
      <main className="mx-auto w-full max-w-[1100px] bg-[#f7f9fc] px-4 pb-7 pt-5 sm:px-6">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-[30px] font-bold tracking-[-0.03em] text-[#13264b] sm:text-[36px]">Serviços</h1>
            <p className="mt-1 text-[11px] font-bold uppercase tracking-[.13em] text-[#66758d]">Ambiente simulado</p>
          </div>
          <button type="button" onClick={() => setCustomizing((value) => !value)} className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-xl border border-[#8ba9d0] bg-white px-3 text-[12px] font-semibold text-[#0b4fa8] shadow-[0_3px_10px_rgba(25,63,111,.08)] sm:h-11 sm:px-4 sm:text-sm">
            {customizing ? <Check className="size-4" /> : <Settings2 className="size-4" />}
            {customizing ? "Concluir" : "Personalizar"}
          </button>
        </div>

        {customizing && <section className="mt-4 rounded-xl border border-[#dce6f2] bg-white p-3 shadow-[0_4px_12px_rgba(31,61,100,.07)]"><div className="flex items-start gap-2"><span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#eaf2ff] text-[#0b4fa8]"><Check className="size-4"/></span><div><p className="text-sm font-semibold text-[#13264b]">Escolha seus atalhos</p><p className="mt-0.5 text-xs leading-snug text-[#66758d]">Toque nos serviços para marcar ou desmarcar favoritos.</p></div></div></section>}

        <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4">
          {services.map((s) => {
            const card = <><ServiceGlyph slug={s.slug} className="size-10 text-[#0b4fa8] sm:size-11" /><div className="mt-auto flex w-full items-end justify-between gap-1"><span className="min-w-0 text-left text-[13px] font-semibold leading-[1.12] text-[#13264b] sm:text-[14px]">{s.label}</span>{!customizing && <ChevronRight className="size-4 shrink-0 text-[#315c91]" />}</div>{customizing && <span className={`absolute right-2 top-2 grid size-5 place-items-center rounded-full ${favorites.includes(s.slug) ? "bg-[#0b4fa8] text-white" : "bg-[#eef2f7] text-[#718096]"}`}>{favorites.includes(s.slug) ? <Check className="size-3"/> : <X className="size-3"/>}</span>}</>;
            const className = "relative flex h-[118px] min-w-0 w-full flex-col items-start rounded-2xl border border-[#e5edf6] bg-white p-3.5 text-left shadow-[0_6px_18px_rgba(31,61,100,.09)] transition-all hover:-translate-y-0.5 active:scale-[0.98] sm:h-[128px] sm:p-4";
            return <li key={s.slug} className="min-w-0">{customizing ? <button type="button" onClick={() => toggleFavorite(s.slug)} className={className}>{card}</button> : s.route ? <Link to={s.route} className={className}>{card}</Link> : <Link to="/app/servico/$slug" params={{ slug: s.slug }} className={className}>{card}</Link>}</li>;
          })}
        </ul>
      </main>
    </>
  );
}