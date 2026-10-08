import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, X } from "lucide-react";
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
      <main className="mx-auto w-full max-w-[430px] px-4 py-5">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <div><h1 className="truncate text-[28px] font-medium">Serviços</h1><p className="mt-1 text-xs font-semibold uppercase tracking-[.1em] text-muted-foreground">Ambiente simulado</p></div>
          <button type="button" onClick={() => setCustomizing((value) => !value)} className="shrink-0 rounded-lg border border-[#313878] px-4 py-2 text-[15px] font-semibold text-[#313878]">{customizing ? "Concluir" : "Personalizar"}</button>
        </div>

        {customizing && <section className="mt-4 rounded-xl border border-border bg-card p-4 shadow-card"><div className="flex items-start gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/10 text-primary"><Check className="size-5"/></span><div><p className="font-semibold">Escolha seus atalhos</p><p className="mt-1 text-sm text-muted-foreground">Toque nos serviços para marcar ou desmarcar favoritos. Isso altera somente a organização visual do simulador.</p></div></div></section>}

        <ul className="mt-6 grid grid-cols-3 gap-x-4 gap-y-5">
          {services.map((s) => {
            const card = <><ServiceGlyph slug={s.slug} className="size-11" /><span className="max-w-[110px] text-[15px] font-medium leading-[1.05] text-[#242424]">{s.label}</span>{customizing && <span className={`absolute right-2 top-2 grid size-5 place-items-center rounded-full ${favorites.includes(s.slug) ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>{favorites.includes(s.slug) ? <Check className="size-3.5"/> : <X className="size-3.5"/>}</span>}</>;
            return <li key={s.slug}>{customizing ? <button type="button" onClick={() => toggleFavorite(s.slug)} className="relative flex h-[108px] w-full flex-col items-center justify-center gap-1.5 rounded-[14px] border border-black/5 bg-white px-1.5 py-2 text-center shadow-[0_4px_10px_rgba(0,0,0,0.13)]">{card}</button> : s.route ? <Link to={s.route} className="relative flex h-[108px] w-full flex-col items-center justify-center gap-1.5 rounded-[14px] border border-black/5 bg-white px-1.5 py-2 text-center shadow-[0_4px_10px_rgba(0,0,0,0.13)] transition-transform active:scale-[0.97]">{card}</Link> : <Link to="/app/servico/$slug" params={{ slug: s.slug }} className="relative flex h-[108px] w-full flex-col items-center justify-center gap-1.5 rounded-[14px] border border-black/5 bg-white px-1.5 py-2 text-center shadow-[0_4px_10px_rgba(0,0,0,0.13)] transition-transform active:scale-[0.97]">{card}</Link>}</li>;
          })}
        </ul>
      </main>
    </>
  );
}