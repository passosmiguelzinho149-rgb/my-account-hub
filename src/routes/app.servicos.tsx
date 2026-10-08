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
      <main className="mx-auto w-full max-w-[1180px] bg-[#f7f9fc] px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-[32px] font-bold tracking-[-0.03em] text-[#13264b] sm:text-[40px]">Serviços</h1>
            <p className="mt-1 text-xs font-bold uppercase tracking-[.14em] text-[#66758d]">Ambiente simulado</p>
          </div>
          <button type="button" onClick={() => setCustomizing((value) => !value)} className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-[#8ba9d0] bg-white px-3 py-2.5 text-sm font-semibold text-[#0b4fa8] shadow-[0_3px_10px_rgba(25,63,111,.08)] sm:px-5 sm:text-base">
            {customizing ? <Check className="size-5" /> : <Settings2 className="size-5" />}
            {customizing ? "Concluir" : "Personalizar"}
          </button>
        </div>

        {customizing && <section className="mt-5 rounded-2xl border border-[#dce6f2] bg-white p-4 shadow-[0_6px_18px_rgba(31,61,100,.08)]"><div className="flex items-start gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#eaf2ff] text-[#0b4fa8]"><Check className="size-5"/></span><div><p className="font-semibold text-[#13264b]">Escolha seus atalhos</p><p className="mt-1 text-sm text-[#66758d]">Toque nos serviços para marcar ou desmarcar favoritos. Isso altera somente a organização visual do simulador.</p></div></div></section>}

        <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4">
          {services.map((s) => {
            const card = <><ServiceGlyph slug={s.slug} className="size-11 text-[#0b4fa8] sm:size-12" /><div className="mt-auto flex w-full items-end justify-between gap-2"><span className="text-left text-[14px] font-semibold leading-tight text-[#13264b] sm:text-[15px]">{s.label}</span>{!customizing && <ChevronRight className="size-5 shrink-0 text-[#315c91]" />}</div>{customizing && <span className={`absolute right-3 top-3 grid size-6 place-items-center rounded-full ${favorites.includes(s.slug) ? "bg-[#0b4fa8] text-white" : "bg-[#eef2f7] text-[#718096]"}`}>{favorites.includes(s.slug) ? <Check className="size-4"/> : <X className="size-4"/>}</span>}</>;
            const className = "relative flex h-[138px] w-full flex-col items-start rounded-2xl border border-[#e8eef5] bg-white p-4 text-left shadow-[0_7px_20px_rgba(31,61,100,.08)] transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(31,61,100,.12)] active:scale-[0.98] sm:h-[150px] sm:p-5";
            return <li key={s.slug}>{customizing ? <button type="button" onClick={() => toggleFavorite(s.slug)} className={className}>{card}</button> : s.route ? <Link to={s.route} className={className}>{card}</Link> : <Link to="/app/servico/$slug" params={{ slug: s.slug }} className={className}>{card}</Link>}</li>;
          })}
        </ul>
      </main>
    </>
  );
}