import { createFileRoute, Link } from "@tanstack/react-router";
import { Eye, Share2 } from "lucide-react";
import { SubHeader } from "@/components/app/SubHeader";
import { formatBRL } from "@/lib/mock-data";
import { useBank, useBalance, type Tx } from "@/lib/bank";
import { useSession } from "@/lib/session";

export const Route = createFileRoute("/app/extrato")({
  head: () => ({ meta: [{ title: "Extrato — Conta Empresas" }, { name: "description", content: "Extrato da conta empresarial." }] }),
  component: ExtratoScreen,
});

const PIX_VALUE = 132_500;
const pixEmitido: Tx = { id: "pix-emitido-outra-if-mesma-tit-20261002", category: "pix", kind: "out", status: "Concluído", title: "PIX EMITIDO OUTRA IF-MESMA TIT.", counterpart: "OUTRA IF-MESMA TIT.", amount: PIX_VALUE, createdAt: "2026-10-02T13:42:00-04:00", channel: "App Empresas", receipt: { authentication: "DEMONSTRACAO", rows: [{ label: "Data e hora", value: "02/10/2026 às 13:42:00" }, { label: "Valor", value: "R$ 132.500,00" }, { label: "Descrição", value: "PIX EMITIDO OUTRA IF-MESMA TIT." }, { label: "Origem/Destino", value: "OUTRA IF-MESMA TIT." }] } };

function ExtratoScreen() {
  const { balanceHidden } = useSession();
  const { transactions } = useBank();
  const balance = useBalance() - PIX_VALUE;
  const allTransactions = transactions.some((t) => t.id === pixEmitido.id) ? transactions : [pixEmitido, ...transactions];
  const items = allTransactions.filter((t) => t.status !== "Agendado").sort((a,b)=>new Date(b.createdAt).getTime()-new Date(a.createdAt).getTime());

  return <div className="min-h-full bg-[#3d439b]">
    <SubHeader title="Extrato" variant="deep" compactActions>
      <div className="px-5 pb-10 pt-4">
        <div className="rounded-[16px] bg-white/10 px-5 py-5 shadow-[0_8px_20px_rgba(12,18,80,.16)]">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[16px] font-medium text-white/95">Saldo disponível</p>
              <div className="mt-2 flex items-center gap-3">
                <p className="text-[18px] font-bold text-white">{balanceHidden ? "R$ ••••••••" : formatBRL(balance)}</p>
                <Eye className="size-5 text-white/80" />
              </div>
            </div>
            <button type="button" className="shrink-0 text-[15px] font-semibold text-white underline underline-offset-2">Ver detalhes</button>
          </div>
        </div>
      </div>
    </SubHeader>

    <main className="-mt-1 min-h-[70vh] rounded-t-[28px] bg-white px-5 pb-28 pt-4 shadow-[0_-7px_22px_rgba(15,20,70,.16)]">
      <div className="mx-auto mb-5 h-1 w-12 rounded-full bg-[#d7d7da]" />
      <div className="relative mx-auto max-w-[390px] pl-9">
        <div className="absolute bottom-2 left-[13px] top-1 w-[2px] bg-[#b9b9bc]" />
        <ul className="space-y-0">
          {items.map((t)=><li key={t.id} className="relative min-h-[118px] pb-5">
            <span className={`absolute -left-[31px] top-[29px] z-10 size-3 rounded-full border-2 border-white ${t.kind==="in"?"bg-[#087b43]":"bg-[#555b68]"}`} />
            {t.id===pixEmitido.id ? <TransactionRow t={t} hidden={balanceHidden}/> : <Link to="/app/comprovante/$id" params={{id:t.id}} className="block rounded-lg py-2 active:bg-[#f5f5f6]"><TransactionRow t={t} hidden={balanceHidden}/></Link>}
          </li>)}
        </ul>
      </div>

      <button type="button" onClick={()=>window.print()} className="fixed bottom-[86px] left-1/2 z-20 flex -translate-x-1/2 items-center justify-center gap-2 rounded-[14px] bg-[#3d439b] px-8 py-3.5 text-[15px] font-bold text-white shadow-lg print:hidden">
        <Share2 className="size-4"/> Compartilhar extrato
      </button>
    </main>
  </div>;
}

function TransactionRow({t,hidden}:{t:Tx;hidden:boolean}) {
  const date = new Date(t.createdAt);
  const day = date.toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit"});
  const title = t.category === "pix" && t.kind === "in" ? "PIX RECEBIDO" : t.title;
  return <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 pr-1">
    <div className="min-w-0">
      <p className="text-[15px] font-extrabold leading-tight text-[#17171b]">{title}</p>
      <p className="mt-1 text-[13px] leading-[1.25] text-[#65656b]">{t.counterpart}</p>
      <p className="mt-0.5 text-[13px] text-[#65656b]">{day} · {t.status}</p>
      <p className="mt-0.5 text-[12px] text-[#77777c]">Documento {t.id.slice(-7).replace(/\D/g,"") || "0000"}</p>
    </div>
    <p className={`pt-7 text-[14px] font-semibold tabular-nums ${t.kind==="in"?"text-[#087b43]":"text-[#333640]"}`}>{hidden?"R$ ••••":`${t.kind==="in"?"":"- "}${formatBRL(t.amount)}`}</p>
  </div>;
}
