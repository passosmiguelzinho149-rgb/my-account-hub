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
      <main className="mx-auto w-full max-w-[430px] bg-[#f7f9fc] px-3 pb-5 pt-4">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <h1 className="text-[27px] font-bold tracking-[-0.03em] text-[#13264b]">Serviços</h1>
            <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[.12em] text-[#66758d]">Ambiente simulado</p>
          </div>
          <button type="button" onClick={() => setCustomizing((value) => !value)} className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-[#8ba9d0] bg-white px-2.5 text-[12px] font-semibold text-[#0b4fa8] shadow-[0_2px_7px_rgba(25,63,111,.08)]">
            {customizing ? <Check className="size-4" /> : <Settings2 className="size-4" />}
            {customizing ? "Concluir" : "Personalizar"}
          </button>
        </div>

        {customizing && <section className="mt-3 rounded-xl border border-[#dce6f2] bg-white p-3 shadow-[0_4px_12px_rgba(31,61,100,.07)]"><div className="flex items-start gap-2"><span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#eaf2ff] text-[#0b4fa8]"><Check className="size-4"/></span><div><p className="text-sm font-semibold text-[#13264b]">Escolha seus atalhos</p><p className="mt-0.5 text-xs leading-snug text-[#66758d]">Toque nos serviços para marcar ou desmarcar favoritos.</p></div></div></section>}

        <ul className="mt-4 grid grid-cols-4 gap-2">
          {services.map((s) => {
            const card = <><ServiceGlyph slug={s.slug} className="size-8 text-[#0b4fa8]" /><div className="mt-auto flex w-full items-end justify-between gap-0.5"><span className="min-w-0 text-left text-[10px] font-semibold leading-[1.08] text-[#13264b] break-words">{s.label}</span>{!customizing && <ChevronRight className="size-3.5 shrink-0 text-[#315c91]" />}</div>{customizing && <span className={`absolute right-1.5 top-1.5 grid size-4 place-items-center rounded-full ${favorites.includes(s.slug) ? "bg-[#0b4fa8] text-white" : "bg-[#eef2f7] text-[#718096]"}`}>{favorites.includes(s.slug) ? <Check className="size-2.5"/> : <X className="size-2.5"/>}</span>}</>;
            const className = "relative flex h-[91px] min-w-0 w-full flex-col items-start rounded-xl border border-[#e8eef5] bg-white p-2.5 text-left shadow-[0_4px_12px_rgba(31,61,100,.08)] transition-transform active:scale-[0.97]";
            return <li key={s.slug} className="min-w-0">{customizing ? <button type="button" onClick={() => toggleFavorite(s.slug)} className={className}>{card}</button> : s.route ? <Link to={s.route} className={className}>{card}</Link> : <Link to="/app/servico/$slug" params={{ slug: s.slug }} className={className}>{card}</Link>}</li>;
          })}
        </ul>
      </main>
    </>
  );
}