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
    <>
      <SubHeader title="Notas fiscais" variant="deep" compactActions>
        <div className="px-4 pb-8 pt-4">
          <h1 className="max-w-[360px] text-[21px] font-semibold leading-snug">Aqui, você emite e gerencia as notas fiscais da empresa</h1>
        </div>
      </SubHeader>

      <main className="mx-auto w-full max-w-[430px] px-4 pb-10">
        <div className="-mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {tipos.map(({ label, icon: Icon }) => (
            <button key={label} type="button" onClick={() => abrir(label)} className="flex min-h-[108px] flex-col items-center justify-center gap-2 rounded-xl bg-white px-2 text-center shadow-[0_6px_16px_rgba(25,35,70,.14)]">
              <Icon className="size-7 text-[#313878]" strokeWidth={1.5} />
              <span className="text-[12px] font-semibold leading-tight">{label}</span>
            </button>
          ))}
        </div>

        <div className="mt-7 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Últimas notas</h2>
          <button type="button" onClick={() => abrir("Todas as notas")} className="text-sm font-semibold text-[#31588f]">Ver mais</button>
        </div>
        <button type="button" onClick={() => abrir("Detalhes da nota")} className="mt-3 flex w-full items-start gap-3 rounded-xl bg-white p-4 text-left shadow-[0_5px_15px_rgba(25,35,70,.12)]">
          <PackageOpen className="mt-1 size-6 shrink-0 text-[#313878]" />
          <span className="min-w-0 flex-1"><span className="block font-medium">Nota fiscal de demonstração</span><span className="mt-1 block text-sm text-muted-foreground">Documento fictício · sem valor fiscal</span></span>
          <ChevronRight className="size-5 text-[#31588f]" />
        </button>

        <h2 className="mt-8 text-lg font-semibold">Outras notas</h2>
        <div className="mt-3 overflow-hidden rounded-xl bg-white shadow-[0_5px_15px_rgba(25,35,70,.10)]">
          <button type="button" onClick={() => abrir("Notas em rascunho")} className="flex w-full items-center gap-3 border-b border-border px-4 py-5 text-left"><FileClock className="size-6 text-[#313878]"/><span className="flex-1 font-medium">Notas em rascunho</span><ChevronRight className="size-5 text-[#31588f]"/></button>
          <button type="button" onClick={() => abrir("Notas canceladas")} className="flex w-full items-center gap-3 px-4 py-5 text-left"><FileX2 className="size-6 text-[#313878]"/><span className="flex-1 font-medium">Notas canceladas</span><ChevronRight className="size-5 text-[#31588f]"/></button>
        </div>

        <div className="mt-6 flex items-start gap-3 rounded-xl border border-border bg-white p-4 text-sm text-muted-foreground">
          <ScrollText className="size-5 shrink-0 text-[#313878]" />
          <p>Portal fiscal em modo demonstração. Os botões funcionam dentro do protótipo, mas não enviam documentos para órgãos fiscais.</p>
        </div>
      </main>

      {painel && <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/40 p-3" onClick={() => setPainel(null)}>
        <section onClick={(e) => e.stopPropagation()} className="w-full max-w-[430px] rounded-[24px] bg-white p-5 shadow-2xl">
          <div className="flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-wide text-[#5b63a6]">Demonstração</p><h2 className="mt-1 text-xl font-bold">{painel}</h2></div><button type="button" aria-label="Fechar" onClick={() => setPainel(null)} className="rounded-full bg-slate-100 p-2"><X className="size-5"/></button></div>
          <div className="mt-5 rounded-xl bg-[#f5f6fb] p-4"><div className="flex gap-3"><CheckCircle2 className="size-6 shrink-0 text-[#4054b2]"/><p className="text-sm leading-relaxed">Esta função está ativa para navegação e testes do projeto. Nenhuma nota fiscal real será emitida, transmitida ou cancelada.</p></div></div>
          <label className="mt-5 flex items-start gap-3 text-sm"><input type="checkbox" checked={aceite} onChange={(e) => setAceite(e.target.checked)} className="mt-1 size-4"/><span>Entendi que este ambiente é apenas uma demonstração.</span></label>
          <button type="button" disabled={!aceite} onClick={() => setPainel(null)} className="mt-5 w-full rounded-xl bg-[#273b91] px-4 py-3.5 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40">Continuar</button>
        </section>
      </div>}
    </>
  );
}
