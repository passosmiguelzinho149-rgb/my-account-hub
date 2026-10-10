import { createFileRoute } from "@tanstack/react-router";
import { SubHeader } from "@/components/app/SubHeader";
import { ServiceGlyph } from "@/components/app/ServiceGlyph";
import shopMulher from "@/assets/shop-mulher.jpg";

export const Route = createFileRoute("/app/shop")({
  component: Shop,
  head: () => ({
    meta: [
      { title: "SHOP · Bradesco Empresas (simulação)" },
      { name: "description", content: "Vitrine demonstrativa de ofertas e benefícios para empresas." },
      { property: "og:title", content: "SHOP · Bradesco Empresas (simulação)" },
      { property: "og:description", content: "Vitrine demonstrativa de ofertas e benefícios para empresas." },
    ],
  }),
});

const offers = [
  { title: "Ofertas para sua empresa", text: "Benefícios demonstrativos para compras empresariais.", slug: "ofertas" },
  { title: "Cashback", text: "Veja exemplos de campanhas e vantagens.", slug: "cashback" },
  { title: "Parceiros", text: "Conheça uma vitrine simulada de parceiros.", slug: "parceiros" },
] as const;

function Shop() {
  return (
    <>
      <SubHeader title="SHOP" />
      <main className="app-surface mx-auto w-full max-w-[430px] px-4 py-5 pb-10">
        <section className="overflow-hidden rounded-lg bg-card shadow-card">
          <img
            src={shopMulher}
            alt="Empresária com sacolas de compras usando o celular"
            className="h-44 w-full object-cover"
            width={768}
            height={1024}
          />
          <div className="p-5">
            <div className="flex items-center gap-3">
              <ServiceGlyph slug="shop" className="size-9" />
              <h2 className="text-2xl font-bold">SHOP Empresas</h2>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Ofertas e benefícios em uma vitrine demonstrativa.
            </p>
          </div>
        </section>

        <div className="mt-3 grid gap-3">
          {offers.map(({ title, text, slug }) => (
            <section key={title} className="flex items-center gap-3 rounded-lg bg-card p-4 shadow-card">
              <ServiceGlyph slug={slug} className="size-9" />
              <div>
                <h3 className="font-bold">{title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{text}</p>
              </div>
            </section>
          ))}
        </div>

        <p className="mt-5 rounded-lg border border-dashed bg-card p-3 text-center text-[11px] font-medium text-muted-foreground">
          SHOP SIMULADO · SEM COMPRAS OU OFERTAS REAIS
        </p>
      </main>
    </>
  );
}
