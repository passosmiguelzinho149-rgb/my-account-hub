import { createFileRoute } from "@tanstack/react-router";
import { Box, ChevronRight, FileClock, FileX2, PackageOpen, ReceiptText, ScrollText, Truck } from "lucide-react";
import { SubHeader } from "@/components/app/SubHeader";

export const Route = createFileRoute("/app/notas-fiscais")({
  head: () => ({ meta: [{ title: "Notas Fiscais — Conta Empresas" }] }),
  component: NotasFiscais,
});

const tipos = [
  { label: "Emitir NF-e", icon: PackageOpen },
  { label: "Emitir NFS-e", icon: Box },
  { label: "Emitir NFC-e", icon: ReceiptText },
  { label: "Emitir CT-e", icon: Truck },
];

function NotasFiscais() {
  return (
    <>
      <SubHeader title="Notas fiscais" variant="deep" compactActions>
        <div className="px-4 pb-8 pt-4">
          <h1 className="max-w-[360px] text-[21px] font-semibold leading-snug">
            Aqui, você emite e gerencia as notas fiscais da empresa
          </h1>
        </div>
      </SubHeader>

      <main className="mx-auto w-full max-w-[430px] px-4 pb-10">
        <div className="-mt-3 grid grid-cols-4 gap-2">
          {tipos.map(({ label, icon: Icon }) => (
            <button key={label} type="button" className="flex min-h-[108px] flex-col items-center justify-center gap-2 rounded-xl bg-white px-2 text-center shadow-[0_6px_16px_rgba(25,35,70,.14)]">
              <Icon className="size-7 text-[#313878]" strokeWidth={1.5} />
              <span className="text-[12px] font-semibold leading-tight">{label}</span>
            </button>
          ))}
        </div>

        <div className="mt-7 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Últimas notas</h2>
          <button type="button" className="text-sm font-semibold text-[#31588f]">Ver mais</button>
        </div>
        <section className="mt-3 rounded-xl bg-white p-4 shadow-[0_5px_15px_rgba(25,35,70,.12)]">
          <div className="flex items-start gap-3">
            <PackageOpen className="mt-1 size-6 shrink-0 text-[#313878]" />
            <div className="min-w-0 flex-1">
              <p className="font-medium">Nota fiscal emitida</p>
              <p className="mt-1 text-sm text-muted-foreground">R$ 2.500,00 · emissão recente</p>
            </div>
            <ChevronRight className="size-5 text-[#31588f]" />
          </div>
        </section>

        <h2 className="mt-8 text-lg font-semibold">Outras notas</h2>
        <div className="mt-3 overflow-hidden rounded-xl bg-white shadow-[0_5px_15px_rgba(25,35,70,.10)]">
          <button type="button" className="flex w-full items-center gap-3 border-b border-border px-4 py-5 text-left">
            <FileClock className="size-6 text-[#313878]" /><span className="flex-1 font-medium">Notas em rascunho</span><ChevronRight className="size-5 text-[#31588f]" />
          </button>
          <button type="button" className="flex w-full items-center gap-3 px-4 py-5 text-left">
            <FileX2 className="size-6 text-[#313878]" /><span className="flex-1 font-medium">Notas canceladas</span><ChevronRight className="size-5 text-[#31588f]" />
          </button>
        </div>

        <div className="mt-6 flex items-start gap-3 rounded-xl border border-border bg-white p-4 text-sm text-muted-foreground">
          <ScrollText className="size-5 shrink-0 text-[#313878]" />
          <p>Área preparada para emissão e gerenciamento de documentos fiscais no projeto.</p>
        </div>
      </main>
    </>
  );
}
