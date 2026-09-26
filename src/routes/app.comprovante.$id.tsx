import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Home, Printer, Share2 } from "lucide-react";
import { useState } from "react";
import { account, formatBRL } from "@/lib/mock-data";
import { formatDateTime, useBank } from "@/lib/bank";

export const Route = createFileRoute("/app/comprovante/$id")({
  head: () => ({
    meta: [
      { title: "Comprovante de recebimento — Pix (demo)" },
      { name: "description", content: "Comprovante fictício de recebimento Pix." },
    ],
  }),
  component: ComprovanteScreen,
});

function ComprovanteScreen() {
  const { id } = Route.useParams();
  const { transactions } = useBank();
  const [feedback, setFeedback] = useState<string | null>(null);
  const tx = transactions.find((item) => item.id === id);

  if (!tx) {
    return (
      <div className="min-h-screen bg-slate-50 px-5 py-12 text-center">
        <p className="font-semibold text-slate-900">Comprovante não encontrado</p>
        <Link to="/app/comprovantes" className="mt-5 inline-block rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground">
          Ver comprovantes
        </Link>
      </div>
    );
  }

  const isPixReceived = tx.category === "pix" && tx.kind === "in";
  const displayDate = isPixReceived ? "18/06/2026 às 10:32" : formatDateTime(tx.createdAt);
  const displayDateTime = isPixReceived ? "18/06/2026 10:32" : formatDateTime(tx.createdAt).replace(" às ", " ");
  const payer = "MARCOS NUNES DE MIRANDA";
  const payerDoc = "**.529.644/0001-47";
  const payerBank = "ITAÚ UNIBANCO S.A.";
  const payerBranch = "0001";
  const payerAccount = "12345-6";
  const transactionId = tx.receipt.e2e ?? "E60746948202606181032BMH4RMH0BQD";
  const authentication = tx.receipt.authentication || "400000.001014.000001.000000";

  const share = async () => {
    const text = [
      "Comprovante de recebimento Pix (demonstração)",
      `Valor: ${formatBRL(tx.amount)}`,
      `Quem pagou: ${isPixReceived ? payer : tx.counterpart}`,
      `Quem recebeu: ${account.holder}`,
      `Data/Hora: ${displayDateTime}`,
      `ID: ${transactionId}`,
    ].join("\n");

    try {
      if (typeof navigator.share === "function") {
        await navigator.share({ title: "Comprovante de recebimento", text });
      } else {
        await navigator.clipboard.writeText(text);
        setFeedback("Comprovante copiado para a área de transferência.");
      }
    } catch {
      setFeedback("Não foi possível compartilhar neste aparelho.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <header className="relative overflow-hidden bg-gradient-to-br from-[#b8002c] via-[#d6003d] to-[#f01750] px-5 pb-9 pt-3 text-white">
        <div aria-hidden className="absolute -bottom-20 -left-10 h-36 w-[120%] rotate-[-8deg] rounded-[50%] bg-white/10" />
        <div className="relative flex items-center justify-between">
          <Link to="/app/comprovantes" aria-label="Voltar" className="grid size-10 place-items-center rounded-full hover:bg-white/10">
            <ArrowLeft className="size-6" />
          </Link>
          <div className="flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-full bg-white text-sm font-black text-[#c60036]">B</span>
            <span className="text-xl font-bold">bradesco</span>
          </div>
          <Link to="/app" aria-label="Início" className="grid size-10 place-items-center rounded-full hover:bg-white/10">
            <Home className="size-6" />
          </Link>
        </div>
        <p className="relative mt-4 text-center text-xs font-medium text-white/85">{displayDate}</p>
      </header>

      <main className="mx-auto -mt-5 max-w-lg px-3">
        <article className="overflow-hidden rounded-t-3xl bg-white shadow-xl">
          <div className="px-5 pb-4 pt-6">
            <div className="text-center">
              <p className="text-[13px] font-bold uppercase tracking-wide text-slate-500">Comprovante de recebimento</p>
              <p className="mt-1 text-sm text-slate-500">Pix recebido</p>
              <div className="my-5 border-t border-dashed border-slate-200" />
              <p className="text-sm font-semibold text-slate-500">Valor recebido</p>
              <p className="mt-1 text-[31px] font-extrabold tracking-tight text-slate-900">{formatBRL(tx.amount)}</p>
            </div>
          </div>

          {isPixReceived && (
            <>
              <ReceiptSection title="QUEM PAGOU">
                <ReceiptRow label="Nome" value={payer} />
                <ReceiptRow label="CPF/CNPJ" value={payerDoc} />
                <ReceiptRow label="Instituição" value={payerBank} />
                <ReceiptRow label="Agência" value={payerBranch} />
                <ReceiptRow label="Conta" value={payerAccount} />
                <ReceiptRow label="Tipo de conta" value="Conta corrente" />
              </ReceiptSection>

              <ReceiptSection title="QUEM RECEBEU">
                <ReceiptRow label="Nome" value={account.holder} />
                <ReceiptRow label="CPF/CNPJ" value={account.cnpj} />
                <ReceiptRow label="Instituição" value="BRADESCO S.A." />
                <ReceiptRow label="Agência" value={account.branch} />
                <ReceiptRow label="Conta" value={account.number} />
                <ReceiptRow label="Tipo de conta" value="Conta corrente" />
              </ReceiptSection>

              <ReceiptSection title="DADOS DA TRANSAÇÃO">
                <ReceiptRow label="Tipo de transferência" value="Pix" />
                <ReceiptRow label="Tipo de chave" value="CNPJ" />
                <ReceiptRow label="Descrição" value="Pix recebido" />
                <ReceiptRow label="Data/Hora" value={displayDateTime} />
              </ReceiptSection>

              <ReceiptSection title="ID DA TRANSAÇÃO">
                <p className="break-all text-[14px] font-medium text-slate-800">{transactionId}</p>
                <p className="mt-5 text-[14px] font-medium tracking-wide text-slate-500">AUTENTICAÇÃO BRADESCO</p>
                <p className="mt-1 break-all text-[14px] font-medium text-slate-800">{authentication}</p>
              </ReceiptSection>
            </>
          )}

          {!isPixReceived && (
            <ReceiptSection title="DADOS DA TRANSAÇÃO">
              {tx.receipt.rows.map((row, index) => (
                <ReceiptRow key={`${row.label}-${index}`} label={row.label} value={row.value} />
              ))}
              <ReceiptRow label="ID da transação" value={transactionId} />
              <ReceiptRow label="Autenticação" value={authentication} />
            </ReceiptSection>
          )}

          <div className="border-t border-slate-100 bg-slate-50 px-5 py-4 text-center text-xs text-slate-500">
            Banco Bradesco S.A. — CNPJ 60.746.948/0001-12
          </div>
        </article>

        <div className="mt-3 grid grid-cols-2 overflow-hidden rounded-2xl bg-white shadow-lg">
          <button type="button" onClick={() => void share()} className="flex min-h-16 items-center justify-center gap-2 border-r border-slate-200 text-sm font-bold text-[#d6003d]">
            <Share2 className="size-5" /> Compartilhar
          </button>
          <button type="button" onClick={() => window.print()} className="flex min-h-16 items-center justify-center gap-2 text-sm font-bold text-[#d6003d]">
            <Printer className="size-5" /> Imprimir
          </button>
        </div>

        <p className="mt-4 text-center text-[11px] text-slate-400">
          Demonstração fictícia — nenhuma transação bancária real foi realizada.
        </p>
        {feedback && <p className="mt-3 text-center text-sm text-slate-500">{feedback}</p>}
      </main>
    </div>
  );
}

function ReceiptSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-dashed border-slate-200 px-5 py-4">
      <h2 className="mb-2 text-[14px] font-bold tracking-wide text-slate-500">{title}</h2>
      {children}
    </section>
  );
}

function ReceiptRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.7fr)] gap-4 py-1.5">
      <span className="text-[15px] text-slate-500">{label}</span>
      <span className="break-words text-right text-[15px] font-semibold leading-snug text-slate-900">{value}</span>
    </div>
  );
}
