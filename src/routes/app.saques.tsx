import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SubHeader } from "@/components/app/SubHeader";
import { ConfirmPanel, ErrorNote, Field, PrimaryButton, SelectField } from "@/components/app/OpKit";
import { formatBRL } from "@/lib/mock-data";
import { formatDateTime, postTx, useBalance, useBank } from "@/lib/bank";
import { parseAmount } from "@/lib/pix";

export const Route = createFileRoute("/app/saques")({
  head: () => ({
    meta: [
      { title: "Saque — Conta Empresas (demo)" },
      { name: "description", content: "Gere um código de saque simulado, consulte o histórico e os comprovantes." },
      { property: "og:title", content: "Saque — Conta Empresas (demo)" },
      { property: "og:description", content: "Saque simulado com código, histórico e comprovante." },
    ],
  }),
  component: Saques,
});

const places = ["Caixa 24 Horas", "Agência Bradesco", "Banco24Horas — Shopping"] as const;
const LIMIT = 5000;

function Saques() {
  const navigate = useNavigate();
  const balance = useBalance();
  const { transactions } = useBank();
  const [amount, setAmount] = useState("");
  const [place, setPlace] = useState<string>(places[0]);
  const [error, setError] = useState<string | null>(null);
  const [review, setReview] = useState(false);
  const value = parseAmount(amount);
  const history = transactions.filter((t) => t.category === "saque");

  const check = () => {
    if (!Number.isFinite(value) || value < 20) return setError("O valor mínimo é R$ 20,00.");
    if (value % 10 !== 0) return setError("O valor deve ser múltiplo de R$ 10,00 (notas disponíveis).");
    if (value > LIMIT) return setError(`O limite por saque é ${formatBRL(LIMIT)}.`);
    if (value > balance) return setError("Saldo insuficiente.");
    setError(null);
    setReview(true);
  };

  const confirm = () => {
    const code = String(Math.floor(10_000_000 + Math.random() * 90_000_000));
    const tx = postTx({
      category: "saque",
      kind: "out",
      title: "SAQUE COM CÓDIGO",
      counterpart: place.toUpperCase(),
      amount: value,
      channel: "App Empresas",
      extraRows: [
        { label: "Local", value: place },
        { label: "Código do saque", value: code.replace(/(\d{4})(\d{4})/, "$1 $2") },
        { label: "Validade do código", value: "30 minutos" },
      ],
      notify: { kind: "seguranca", title: "Saque gerado", body: `${formatBRL(value)} disponível em ${place}.` },
    });
    void navigate({ to: "/app/comprovante/$id", params: { id: tx.id }, replace: true });
  };

  if (review) {
    return (
      <>
        <SubHeader title="Confirmar saque" compactActions />
        <ConfirmPanel verb="saque" amount={value} rows={[{ label: "Local", value: place }]} onConfirm={confirm} onBack={() => setReview(false)} />
      </>
    );
  }

  return (
    <>
      <SubHeader title="Saque" compactActions />
      <main className="px-4 py-5">
        <p className="text-sm text-muted-foreground">
          Saldo: <strong className="text-foreground">{formatBRL(balance)}</strong> · Limite por saque {formatBRL(LIMIT)}
        </p>
        <Field label="Valor (R$)" value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="decimal" placeholder="Ex.: 200" />
        <SelectField label="Onde vai sacar" options={places} value={place} onChange={(e) => setPlace(e.target.value)} />
        {error && <ErrorNote>{error}</ErrorNote>}
        <PrimaryButton onClick={check}>Gerar código de saque</PrimaryButton>

        <h2 className="mt-8 font-semibold">Histórico de saques</h2>
        <ul className="mt-3 divide-y divide-border rounded-xl border border-border bg-card shadow-card">
          {history.map((t) => (
            <li key={t.id}>
              <Link to="/app/comprovante/$id" params={{ id: t.id }} className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 p-4">
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold">{t.counterpart}</span>
                  <span className="block text-xs text-muted-foreground">{formatDateTime(t.createdAt)}</span>
                </span>
                <span className="text-sm font-semibold tabular-nums text-brand-red">{formatBRL(t.amount)}</span>
              </Link>
            </li>
          ))}
          {history.length === 0 && <li className="p-4 text-sm text-muted-foreground">Nenhum saque ainda.</li>}
        </ul>
      </main>
    </>
  );
}
