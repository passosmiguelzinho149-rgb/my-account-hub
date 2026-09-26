import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SubHeader } from "@/components/app/SubHeader";
import { ConfirmPanel, ErrorNote, Field, PrimaryButton } from "@/components/app/OpKit";
import { formatBRL } from "@/lib/mock-data";
import { postTx, useBalance } from "@/lib/bank";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/recargas")({
  head: () => ({
    meta: [
      { title: "Recarga de celular — Conta Empresas (demo)" },
      { name: "description", content: "Recarregue celulares de operadoras fictícias com confirmação e comprovante." },
      { property: "og:title", content: "Recarga de celular — Conta Empresas (demo)" },
      { property: "og:description", content: "Recarga de celular com confirmação e comprovante." },
    ],
  }),
  component: Recargas,
});

const operators = ["Vivaz Móvel", "Clarinet", "TIMbre", "Oiá Celular"] as const;
const values = [15, 20, 30, 50, 100] as const;

function Recargas() {
  const navigate = useNavigate();
  const balance = useBalance();
  const [op, setOp] = useState<string>(operators[0]);
  const [phone, setPhone] = useState("");
  const [value, setValue] = useState<number>(20);
  const [error, setError] = useState<string | null>(null);
  const [review, setReview] = useState(false);

  const rows = [
    { label: "Operadora", value: op },
    { label: "Número", value: phone },
  ];

  const check = () => {
    if (phone.replace(/\D/g, "").length !== 11) return setError("Informe DDD + número (11 dígitos).");
    if (value > balance) return setError("Saldo insuficiente.");
    setError(null);
    setReview(true);
  };

  const confirm = () => {
    const tx = postTx({
      category: "recarga",
      kind: "out",
      title: "RECARGA DE CELULAR",
      counterpart: `${op.toUpperCase()} · ${phone}`,
      amount: value,
      channel: "App Empresas",
      extraRows: rows,
      notify: { kind: "pagamento", title: "Recarga realizada", body: `${formatBRL(value)} para ${phone}.` },
    });
    void navigate({ to: "/app/comprovante/$id", params: { id: tx.id }, replace: true });
  };

  if (review) {
    return (
      <>
        <SubHeader title="Confirmar recarga" compactActions />
        <ConfirmPanel verb="recarga" amount={value} rows={rows} onConfirm={confirm} onBack={() => setReview(false)} />
      </>
    );
  }

  const chip = (active: boolean) =>
    cn(
      "rounded-full px-4 py-2 text-sm font-medium transition-colors",
      active ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground",
    );

  return (
    <>
      <SubHeader title="Recarga de celular" compactActions />
      <main className="px-4 py-5">
        <p className="text-sm font-medium">Operadora</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {operators.map((o) => (
            <button key={o} type="button" onClick={() => setOp(o)} className={chip(op === o)}>
              {o}
            </button>
          ))}
        </div>
        <Field label="Número com DDD" value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" placeholder="(65) 99999-0000" />
        <p className="mt-4 text-sm font-medium">Valor</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {values.map((v) => (
            <button key={v} type="button" onClick={() => setValue(v)} className={chip(value === v)}>
              {formatBRL(v)}
            </button>
          ))}
        </div>
        {error && <ErrorNote>{error}</ErrorNote>}
        <PrimaryButton onClick={check}>Continuar</PrimaryButton>
        <p className="mt-6 text-xs text-muted-foreground">Operadoras fictícias: nenhuma recarga real é feita.</p>
      </main>
    </>
  );
}
