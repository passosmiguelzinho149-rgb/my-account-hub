import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Box, CheckCircle2, ChevronRight, FileClock, FileX2, PackageOpen, ReceiptText, ScrollText, Truck, X } from "lucide-react";
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
  const [painel, setPainel] = useState<string | null>(null);
  const [aceite, setAceite] = useState(false);
  const abrir = (nome: string) => setPainel(nome);

  return (
    <div className="min-h-screen bg-[#f7f7f8]">
      <SubHeader title="Notas fiscais" variant="deep" compactActions>
        <div className="px-4 pb-8 pt-4">
          <h1 className="max-w-[360px] text-[21px] font-semibold leading-snug text-white">Emita notas fiscais de forma simples e rápida pelo app</h1>
          <p className="mt-2 max-w-[360px] text-sm leading-relaxed text-white/85">Gerencie as notas fiscais da empresa com agilidade, sem burocracia e em um só lugar.</p>
        </div>
      </SubHeader>

      <main className="mx-auto w-full max-w-[430px] px-4 pb-10">
        <div className="-mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {tipos.map(({ label, icon: Icon }) => (
            <button key={label} type="button" onClick={() => abrir(label)} className="flex min-h-[108px] flex-col items-center justify-center gap-2 rounded-xl border border-[#e7e7ec] bg-white px-2 text-center shadow-[0_5px_14px_rgba(35,42,85,.10)]">
              <Icon className="size-7 text-[#45468f]" strokeWidth={1.5} />
              <span className="text-[12px] font-semibold leading-tight text-[#272b45]">{label}</span>
            </button>
          ))}
        </div>

        <div className="mt-7 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#292b3f]">Últimas notas</h2>
          <button type="button" onClick={() => abrir("Todas as notas")} className="text-sm font-semibold text-[#3f5fc7]">Ver mais</button>
        </div>
        <button type="button" onClick={() => abrir("Detalhes da nota")} className="mt-3 flex w-full items-start gap-3 rounded-xl border border-[#ececf0] bg-white p-4 text-left shadow-[0_4px_13px_rgba(35,42,85,.08)]">
          <PackageOpen className="mt-1 size-6 shrink-0 text-[#4a4b91]" />
          <span className="min-w-0 flex-1"><span className="block font-medium text-[#292b3f]">Nota fiscal de demonstração</span><span className="mt-1 block text-sm text-[#77798a]">Documento fictício · sem valor fiscal</span></span>
          <ChevronRight className="size-5 text-[#5369bd]" />
        </button>

        <h2 className="mt-8 text-lg font-semibold text-[#292b3f]">Outras notas</h2>
        <div className="mt-3 overflow-hidden rounded-xl border border-[#ececf0] bg-white shadow-[0_4px_13px_rgba(35,42,85,.07)]">
          <button type="button" onClick={() => abrir("Notas em rascunho")} className="flex w-full items-center gap-3 border-b border-[#eeeeF2] px-4 py-5 text-left"><FileClock className="size-6 text-[#4a4b91]"/><span className="flex-1 font-medium text-[#292b3f]">Notas em rascunho</span><ChevronRight className="size-5 text-[#5369bd]"/></button>
          <button type="button" onClick={() => abrir("Notas canceladas")} className="flex w-full items-center gap-3 px-4 py-5 text-left"><FileX2 className="size-6 text-[#4a4b91]"/><span className="flex-1 font-medium text-[#292b3f]">Notas canceladas</span><ChevronRight className="size-5 text-[#5369bd]"/></button>
        </div>

        <div className="mt-6 flex items-start gap-3 rounded-xl border border-[#e5e5eb] bg-white p-4 text-sm text-[#737586]">
          <ScrollText className="size-5 shrink-0 text-[#4a4b91]" />
          <p>Portal fiscal em modo demonstração. Os botões funcionam dentro do protótipo, mas não enviam documentos para órgãos fiscais.</p>
        </div>
      </main>

      {painel && <div className="fixed inset-0 z-[80] flex items-end justify-center bg-[#17172b]/45 p-3" onClick={() => setPainel(null)}>
        <section onClick={(e) => e.stopPropagation()} className="w-full max-w-[430px] rounded-[24px] bg-white p-5 shadow-2xl">
          <div className="flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-wide text-[#55569b]">Demonstração</p><h2 className="mt-1 text-xl font-bold text-[#292b3f]">{painel}</h2></div><button type="button" aria-label="Fechar" onClick={() => setPainel(null)} className="rounded-full bg-[#f0f0f4] p-2"><X className="size-5 text-[#41435c]"/></button></div>
          <div className="mt-5 rounded-xl bg-[#f1f2f8] p-4"><div className="flex gap-3"><CheckCircle2 className="size-6 shrink-0 text-[#4a55a7]"/><p className="text-sm leading-relaxed text-[#55586b]">Esta função está ativa para navegação e testes do projeto. Nenhuma nota fiscal real será emitida, transmitida ou cancelada.</p></div></div>
          <label className="mt-5 flex items-start gap-3 text-sm text-[#3b3d50]"><input type="checkbox" checked={aceite} onChange={(e) => setAceite(e.target.checked)} className="mt-1 size-4 accent-[#343f9b]"/><span>Entendi que este ambiente é apenas uma demonstração.</span></label>
          <button type="button" disabled={!aceite} onClick={() => setPainel(null)} className="mt-5 w-full rounded-xl bg-[#303b94] px-4 py-3.5 font-semibold text-white disabled:cursor-not-allowed disabled:bg-[#d7d8df] disabled:text-[#8a8b96]">Continuar</button>
        </section>
      </div>}
    </div>
  );
}
