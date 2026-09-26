import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { SubHeader } from "@/components/app/SubHeader";
import { ConfirmPanel, ErrorNote, Field, PrimaryButton, SelectField } from "@/components/app/OpKit";
import { formatBRL } from "@/lib/mock-data";
import { addBeneficiary, formatDay, postTx, removeBeneficiary, useBalance, useBank } from "@/lib/bank";
import { parseAmount } from "@/lib/pix";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/transferencias")({
  head: () => ({
    meta: [
      { title: "Transferências — Conta Empresas (demo)" },
      { name: "description", content: "Transfira entre contas Bradesco ou para outros bancos, agende e salve favorecidos." },
      { property: "og:title", content: "Transferências — Conta Empresas (demo)" },
      { property: "og:description", content: "Transferências imediatas ou agendadas com comprovante." },
    ],
  }),
  component: Transferencias,
});

const banks = [
  "237 — Banco Bradesco S.A.",
  "001 — Banco do Brasil S.A.",
  "341 — Itaú Unibanco S.A.",
  "033 — Banco Santander (Brasil) S.A.",
  "104 — Caixa Econômica Federal",
  "260 — Nu Pagamentos S.A.",
] as const;

function Transferencias() {
  const navigate = useNavigate();
  const balance = useBalance();
  const { beneficiaries } = useBank();
  const [name, setName] = useState("");
  const [doc, setDoc] = useState("");
  const [bank, setBank] = useState<string>(banks[0]);
  const [branch, setBranch] = useState("");
  const [acc, setAcc] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [save, setSave] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [review, setReview] = useState(false);

  const value = parseAmount(amount);
  const internal = bank.startsWith("237");
  const type = internal ? "Entre contas Bradesco" : "TED para outro banco";

  const check = () => {
    if (name.trim().length < 3) return setError("Informe o nome do favorecido.");
    if (doc.replace(/\D/g, "").length < 11) return setError("Informe um CPF ou CNPJ válido.");
    if (!/^\d{4}$/.test(branch)) return setError("A agência deve ter 4 números.");
    if (acc.replace(/\D/g, "").length < 4) return setError("Informe a conta com dígito.");
    if (!Number.isFinite(value) || value <= 0) return setError("Informe um valor maior que zero.");
    if (!date && value > balance) return setError("Saldo insuficiente.");
    setError(null);
    setReview(true);
  };

  const rows = [
    { label: "Tipo", value: type },
    { label: "Favorecido", value: name.trim().toUpperCase() },
    { label: "CPF/CNPJ", value: doc },
    { label: "Instituição", value: bank },
    { label: "Agência / Conta", value: `${branch} / ${acc}` },
    { label: "Quando", value: date ? `Agendado para ${new Date(`${date}T12:00`).toLocaleDateString("pt-BR")}` : "Agora" },
  ];

  const confirm = () => {
    if (save) addBeneficiary({ name: name.trim().toUpperCase(), doc, bank, branch, account: acc });
    const tx = postTx({
      category: "transferencia",
      kind: "out",
      title: date ? "TRANSFERÊNCIA AGENDADA" : internal ? "TRANSF. ENTRE CONTAS" : "TED ENVIADA",
      counterpart: `PARA: ${name.trim().toUpperCase()}`,
      amount: value,
      channel: "App Empresas",
      status: date ? "Agendado" : "Concluído",
      ...(date ? { scheduledFor: new Date(`${date}T12:00`).toISOString() } : {}),
      extraRows: rows,
      notify: { kind: "transferencia", title: date ? "Transferência agendada" : "Transferência enviada", body: `${formatBRL(value)} para ${name.trim().toUpperCase()}.` },
    });
    void navigate({ to: "/app/comprovante/$id", params: { id: tx.id }, replace: true });
  };

  if (review) {
    return (
      <>
        <SubHeader title="Confirmar transferência" compactActions />
        <ConfirmPanel verb="transferência" amount={value} rows={rows} onConfirm={confirm} onBack={() => setReview(false)} />
      </>
    );
  }

  return (
    <>
      <SubHeader title="Transferências" compactActions />
      <main className="px-4 py-5">
        <p className="text-sm text-muted-foreground">
          Saldo disponível: <strong className="text-foreground">{formatBRL(balance)}</strong>
        </p>

        {beneficiaries.length > 0 && (
          <>
            <h2 className="mt-4 text-sm font-semibold">Pix salvos</h2>
            <ul className="mt-2 space-y-2">
              {beneficiaries.map((b) => (
                <li key={b.id} className="flex items-center gap-2 rounded-xl border border-border bg-card p-3 shadow-card">
                  <button
                    type="button"
                    className="min-w-0 flex-1 text-left"
                    onClick={() => {
                      setName(b.name);
                      setDoc(b.doc);
                      setBank(banks.find((x) => x === b.bank) ?? banks[0]);
                      setBranch(b.branch);
                      setAcc(b.account);
                    }}
                  >
                    <span className="block truncate text-sm font-semibold">{b.name}</span>
                  </button>
                  <button type="button" onClick={() => removeBeneficiary(b.id)} aria-label={`Excluir ${b.name}`} className="rounded-full p-2 text-brand-red">
                    <Trash2 className="size-4" aria-hidden />
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}

        <Field label="Nome do favorecido" value={name} onChange={(e) => setName(e.target.value)} />
        <Field label="CPF ou CNPJ" value={doc} onChange={(e) => setDoc(e.target.value)} inputMode="numeric" />
        <SelectField label="Banco" options={banks} value={bank} onChange={(e) => setBank(e.target.value)} />
        <div className="grid grid-cols-2 gap-3">
          <Field label="Agência" value={branch} maxLength={4} onChange={(e) => setBranch(e.target.value.replace(/\D/g, ""))} inputMode="numeric" />
          <Field label="Conta com dígito" value={acc} onChange={(e) => setAcc(e.target.value)} />
        </div>
        <Field label="Valor (R$)" value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="decimal" placeholder="0,00" />
        <Field label="Agendar para (opcional)" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <label className="mt-4 flex items-center gap-2 text-sm">
          <input type="checkbox" checked={save} onChange={(e) => setSave(e.target.checked)} className="size-4 accent-primary" />
          Salvar como favorecido
        </label>
        {error && <ErrorNote>{error}</ErrorNote>}
        <PrimaryButton onClick={check}>Continuar</PrimaryButton>

        <ScheduledList category="transferencia" />
      </main>
    </>
  );
}

/** Lista de agendamentos da categoria, com acesso ao comprovante para cancelar. */
export function ScheduledList({ category }: { category: "transferencia" | "pagamento" }) {
  const navigate = useNavigate();
  const { transactions } = useBank();
  const list = transactions.filter((t) => t.category === category && (t.status === "Agendado" || t.status === "Cancelado"));
  if (list.length === 0) return null;
  return (
    <section className="mt-8">
      <h2 className="font-semibold">Agendamentos</h2>
      <ul className="mt-3 divide-y divide-border rounded-xl border border-border bg-card shadow-card">
        {list.map((t) => (
          <li key={t.id}>
            <button
              type="button"
              onClick={() => void navigate({ to: "/app/comprovante/$id", params: { id: t.id } })}
              className="grid w-full grid-cols-[minmax(0,1fr)_auto] gap-3 p-4 text-left"
            >
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold">{t.counterpart}</span>
                <span className="block text-xs text-muted-foreground">
                  {t.scheduledFor ? formatDay(t.scheduledFor) : ""} · {t.status}
                </span>
              </span>
              <span className={cn("text-sm font-semibold tabular-nums", t.status === "Cancelado" && "line-through opacity-60")}>
                {formatBRL(t.amount)}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
