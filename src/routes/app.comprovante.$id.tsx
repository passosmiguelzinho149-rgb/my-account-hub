import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { CheckCircle2, Share2, XCircle } from "lucide-react";
import { useState } from "react";
import { SubHeader } from "@/components/app/SubHeader";
import { account, formatBRL } from "@/lib/mock-data";
import { cancelTx, formatDateTime, useBank, type Tx } from "@/lib/bank";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/comprovante/$id")({
  head: () => ({
    meta: [
      { title: "Comprovante — Conta Empresas (demo)" },
      {
        name: "description",
        content: "Comprovante detalhado da operação: valor, data, origem, destino e autenticação.",
      },
      { property: "og:title", content: "Comprovante — Conta Empresas (demo)" },
      {
        property: "og:description",
        content: "Comprovante detalhado com valor, data, origem, destino e autenticação.",
      },
    ],
  }),
  component: ComprovanteScreen,
});

function receiptText(tx: Tx): string {
  const rows = tx.receipt.rows
    .filter((r) => r.value)
    .map((r) => `${r.label}: ${r.value}`)
    .join("\n");
  return [
    "Comprovante (demonstração)",
    tx.title,
    rows,
    tx.receipt.e2e ? `ID da transação: ${tx.receipt.e2e}` : "",
    `Autenticação: ${tx.receipt.authentication}`,
  ]
    .filter(Boolean)
    .join("\n");
}

function ComprovanteScreen() {
  const { id } = Route.useParams();
  const { transactions } = useBank();
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState<string | null>(null);
  const [askCancel, setAskCancel] = useState(false);

  const tx = transactions.find((t) => t.id === id);

  if (!tx) {
    return (
      <>
        <SubHeader title="Comprovante" fallbackTo="/app/pix" compactActions />
        <main className="px-4 py-8 text-center">
          <p className="font-semibold">Comprovante não encontrado</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Esta operação não existe mais nesta demonstração.
          </p>
          <Link
            to="/app/comprovantes"
            className="mt-5 inline-block rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground"
          >
            Ver comprovantes
          </Link>
        </main>
      </>
    );
  }

  const share = async () => {
    const text = receiptText(tx);
    try {
      if (typeof navigator.share === "function") {
        await navigator.share({ title: "Comprovante (demonstração)", text });
        return;
      }
      await navigator.clipboard.writeText(text);
      setFeedback("Comprovante copiado para a área de transferência.");
    } catch {
      setFeedback("Não foi possível compartilhar neste aparelho.");
    }
  };

  const cancelable = tx.status === "Agendado";
  const ok = tx.status === "Concluído" || tx.status === "Agendado";

  return (
    <>
      <SubHeader title="Comprovante" fallbackTo="/app/comprovantes" compactActions />
      <main className="px-4 py-5">
        <section className="rounded-xl border border-border bg-card p-5 shadow-card">
          <div className="flex items-center gap-3">
            {ok ? (
              <CheckCircle2 className="size-8 shrink-0 text-income" aria-hidden />
            ) : (
              <XCircle className="size-8 shrink-0 text-brand-red" aria-hidden />
            )}
            <div className="min-w-0">
              <p className="font-semibold break-words">{tx.title}</p>
              <p className="text-sm text-muted-foreground">{tx.status}</p>
            </div>
          </div>

          <p className="mt-4 text-sm text-muted-foreground">Valor</p>
          <p
            className={cn(
              "text-3xl font-bold tabular-nums",
              tx.kind === "in" ? "text-income" : "text-foreground",
            )}
          >
            {formatBRL(tx.amount)}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">{formatDateTime(tx.createdAt)}</p>

          <dl className="mt-5 divide-y divide-border">
            {tx.receipt.rows.map((row, index) =>
              row.value ? (
                <div
                  key={`${row.label}-${index}`}
                  className="grid grid-cols-[auto_minmax(0,1fr)] gap-3 py-2.5"
                >
                  <dt className="text-sm text-muted-foreground">{row.label}</dt>
                  <dd className="text-right text-sm font-medium break-words">{row.value}</dd>
                </div>
              ) : (
                <p key={`${row.label}-${index}`} className="pt-4 pb-2 text-sm font-semibold">
                  {row.label.replaceAll("—", "").trim()}
                </p>
              ),
            )}
          </dl>

          <div className="mt-5 space-y-2 border-t border-border pt-4">
            <p className="text-sm text-muted-foreground">Instituição</p>
            <p className="text-sm font-medium">
              237 — Banco Bradesco S.A. · Agência {account.branch} · Conta {account.number}
            </p>
            {tx.receipt.e2e && (
              <>
                <p className="mt-3 text-sm text-muted-foreground">ID da transação (E2E)</p>
                <p className="text-sm font-medium break-all">{tx.receipt.e2e}</p>
              </>
            )}
            <p className="mt-3 text-sm text-muted-foreground">Autenticação</p>
            <p className="text-sm font-medium break-all">{tx.receipt.authentication}</p>
          </div>
        </section>

        <p className="mt-4 text-xs text-muted-foreground">
          Documento de demonstração, sem validade bancária. Nenhum valor real foi movimentado.
        </p>

        <div className="mt-5 space-y-3">
          <button
            type="button"
            onClick={() => void share()}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-base font-semibold text-primary-foreground transition-transform active:scale-95"
          >
            <Share2 className="size-5" aria-hidden />
            Compartilhar comprovante
          </button>

          {cancelable && !askCancel && (
            <button
              type="button"
              onClick={() => setAskCancel(true)}
              className="w-full rounded-full border border-border py-3.5 text-base font-medium text-brand-red"
            >
              Cancelar agendamento
            </button>
          )}

          {cancelable && askCancel && (
            <div className="rounded-xl border border-border bg-card p-4 shadow-card">
              <p className="font-semibold">Cancelar este agendamento?</p>
              <p className="mt-1 text-sm text-muted-foreground">
                A operação deixa de ser executada nesta demonstração.
              </p>
              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    cancelTx(tx.id);
                    setAskCancel(false);
                  }}
                  className="flex-1 rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground"
                >
                  Sim, cancelar
                </button>
                <button
                  type="button"
                  onClick={() => setAskCancel(false)}
                  className="flex-1 rounded-full border border-border py-3 text-sm font-medium"
                >
                  Manter
                </button>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={() => void navigate({ to: "/app" })}
            className="w-full rounded-full border border-border py-3.5 text-base font-medium"
          >
            Voltar ao início
          </button>
        </div>

        {feedback && <p className="mt-4 text-sm text-muted-foreground">{feedback}</p>}
      </main>
    </>
  );
}
