import { createFileRoute } from "@tanstack/react-router";
import { SubHeader } from "@/components/app/SubHeader";
import { ServiceGlyph } from "@/components/app/ServiceGlyph";
import { formatBRL } from "@/lib/mock-data";
import investMulher from "@/assets/invest-mulher.jpg";

export const Route = createFileRoute("/app/investimentos")({
  component: Investimentos,
  head: () => ({
    meta: [
      { title: "Investimentos · Bradesco Empresas (simulação)" },
      { name: "description", content: "Visão consolidada da carteira de investimentos empresariais em ambiente simulado." },
      { property: "og:title", content: "Investimentos · Bradesco Empresas (simulação)" },
      { property: "og:description", content: "Visão consolidada da carteira de investimentos empresariais em ambiente simulado." },
    ],
  }),
});

const items = [
  { name: "Renda fixa", value: 1250000, slug: "renda-fixa" },
  { name: "Fundos", value: 780000, slug: "fundos" },
  { name: "Reserva empresarial", value: 420000, slug: "reserva" },
] as const;

function Investimentos() {
  const total = items.reduce((s, i) => s + i.value, 0);
  return (
    <>
      <SubHeader title="Investimentos" />
      <main className="app-surface mx-auto w-full max-w-[430px] px-4 py-5 pb-10">
        <section className="overflow-hidden rounded-lg bg-card shadow-card">
          <img
            src={investMulher}
            alt="Empresária acompanhando investimentos no notebook"
            className="h-44 w-full object-cover"
            width={768}
            height={1024}
          />
          <div className="p-5">
            <p className="text-sm text-muted-foreground">Patrimônio simulado</p>
            <p className="mt-1 text-3xl font-extrabold">{formatBRL(total)}</p>
            <div className="mt-3 flex items-center gap-2 text-sm text-icon-ink">
              <ServiceGlyph slug="investimentos" className="size-5" />
              Visão consolidada da carteira
            </div>
          </div>
        </section>

        <section className="mt-3 overflow-hidden rounded-lg bg-card shadow-card">
          {items.map(({ name, value, slug }) => (
            <div key={name} className="flex items-center justify-between border-b p-4 last:border-0">
              <div className="flex items-center gap-3">
                <ServiceGlyph slug={slug} className="size-9" />
                <span className="font-semibold">{name}</span>
              </div>
              <span className="font-bold">{formatBRL(value)}</span>
            </div>
          ))}
        </section>

        <p className="mt-5 rounded-lg border border-dashed bg-card p-3 text-center text-[11px] font-medium text-muted-foreground">
          SIMULAÇÃO · VALORES ILUSTRATIVOS · SEM INVESTIMENTOS REAIS
        </p>
      </main>
    </>
  );
}
