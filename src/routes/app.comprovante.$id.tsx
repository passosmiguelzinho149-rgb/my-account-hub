import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Printer, Share2 } from "lucide-react";
import { useState } from "react";
import { account, formatBRL } from "@/lib/mock-data";
import { formatDateTime, useBank } from "@/lib/bank";

export const Route = createFileRoute("/app/comprovante/$id")({
  head: () => ({ meta: [{ title: "Comprovante de Transação — Conta Empresas" }] }),
  component: ComprovanteScreen,
});

function ComprovanteScreen() {
  const { id } = Route.useParams();
  const { transactions } = useBank();
  const [feedback, setFeedback] = useState<string | null>(null);
  const tx = transactions.find((item) => item.id === id);

  if (!tx) return <div className="min-h-screen bg-slate-100 px-5 py-12 text-center"><p className="font-semibold">Comprovante não encontrado</p><Link to="/app/comprovantes" className="mt-5 inline-block underline">Ver comprovantes</Link></div>;

  const dateTime = formatDateTime(tx.createdAt).replace(" às ", " ");
  const transactionId = tx.receipt.e2e ?? tx.id;
  const authentication = tx.receipt.authentication || "000000.000000.000000.000000";

  const share = async () => {
    const text = [`Comprovante de Transação Bancária`, `Valor: ${formatBRL(tx.amount)}`, `Favorecido: ${tx.counterpart}`, `Data/Hora: ${dateTime}`, `ID: ${transactionId}`].join("\n");
    try {
      if (typeof navigator.share === "function") await navigator.share({ title: "Comprovante de Transação", text });
      else { await navigator.clipboard.writeText(text); setFeedback("Comprovante copiado."); }
    } catch { setFeedback("Não foi possível compartilhar."); }
  };

  return (
    <div className="min-h-screen bg-[#e9eaee] px-2 pb-24 pt-3 sm:px-4">
      <main className="mx-auto max-w-[760px]">
        <article className="bg-white px-5 py-5 text-[11px] leading-relaxed text-slate-800 shadow-sm sm:px-9 sm:py-7 sm:text-[12px]">
          <header className="flex items-start gap-4 border-b border-slate-200 pb-5">
            <div className="grid size-14 shrink-0 place-items-center rounded-full border-2 border-[#c7003d] text-xl font-black text-[#c7003d]">B</div>
            <div>
              <h1 className="text-[16px] font-bold text-slate-950">Comprovante de Transação Bancária</h1>
              <p>Boleto de Cobrança / Pagamento / Pix</p>
              <p>Data da operação: <strong>{dateTime}</strong></p>
              <p>Nº de controle: <strong>{transactionId}</strong></p>
            </div>
          </header>

          <ReceiptBlock>
            <ReceiptLine label="Conta de débito" value={`Agência: ${account.branch} | Conta: ${account.number} | Tipo: Conta-Corrente`} />
            <ReceiptLine label="Empresa" value={account.company} />
          </ReceiptBlock>

          <ReceiptBlock>
            {tx.receipt.rows.map((row, index) => <ReceiptLine key={`${row.label}-${index}`} label={row.label} value={row.value} />)}
            <ReceiptLine label="Beneficiário" value={tx.counterpart} />
            <ReceiptLine label="Instituição" value={tx.category === "pix" ? "Transferência Pix" : "Pagamento"} />
            <ReceiptLine label="Nome do pagador" value={account.holder} />
            <ReceiptLine label="CPF/CNPJ do pagador" value={account.cnpj} />
            <ReceiptLine label="Data do débito" value={dateTime} />
            <ReceiptLine label="Valor" value={formatBRL(tx.amount)} />
            <ReceiptLine label="Desconto" value="R$ 0,00" />
            <ReceiptLine label="Abatimento" value="R$ 0,00" />
            <ReceiptLine label="Bonificação" value="R$ 0,00" />
            <ReceiptLine label="Multa" value="R$ 0,00" />
            <ReceiptLine label="Juros" value="R$ 0,00" />
            <ReceiptLine label="Valor total" value={formatBRL(tx.amount)} />
          </ReceiptBlock>

          <p className="border-b border-slate-200 py-4">A transação acima foi registrada pelo aplicativo.</p>

          <section className="py-6 text-center">
            <h2 className="text-sm font-bold">Autenticação</h2>
            <p className="mx-auto mt-5 max-w-xl break-all font-mono text-[10px] tracking-wide">{authentication} {transactionId}</p>
          </section>

          <footer className="border-t border-slate-200 pt-4 text-[10px] text-slate-500">
            <p>Documento gerado pelo aplicativo. Não é comprovante bancário oficial e não confirma transação bancária real.</p>
          </footer>
        </article>

        <div className="mt-3 grid grid-cols-2 gap-3 print:hidden">
          <button type="button" onClick={() => void share()} className="flex min-h-14 items-center justify-center gap-2 rounded-xl bg-white font-semibold text-[#313878] shadow-sm"><Share2 className="size-5"/> Compartilhar</button>
          <button type="button" onClick={() => window.print()} className="flex min-h-14 items-center justify-center gap-2 rounded-xl bg-white font-semibold text-[#313878] shadow-sm"><Printer className="size-5"/> Imprimir</button>
        </div>
        <Link to="/app/comprovantes" className="mt-4 flex items-center justify-center gap-2 text-sm font-semibold text-[#313878] print:hidden"><ArrowLeft className="size-4"/> Voltar aos comprovantes</Link>
        {feedback && <p className="mt-3 text-center text-sm">{feedback}</p>}
      </main>
    </div>
  );
}

function ReceiptBlock({ children }: { children: React.ReactNode }) {
  return <section className="border-b border-slate-200 py-5">{children}</section>;
}

function ReceiptLine({ label, value }: { label: string; value: string }) {
  return <div className="grid grid-cols-[120px_minmax(0,1fr)] gap-3 py-1 sm:grid-cols-[170px_minmax(0,1fr)]"><span className="text-slate-500">{label}:</span><strong className="break-words font-semibold text-slate-900">{value}</strong></div>;
}
