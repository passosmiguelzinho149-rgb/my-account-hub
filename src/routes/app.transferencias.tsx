import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Building2, CalendarDays, Eye, Landmark, ReceiptText, Repeat2 } from "lucide-react";
import { useMemo, useState } from "react";
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
  const [showBalance, setShowBalance] = useState(true);
  const schedule = useMemo(() => buildTransferSchedule(beneficiaries.length), [beneficiaries.length]);

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
        <section className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Saldo disponível</p>
              <p className="mt-2 text-2xl font-bold tabular-nums">{showBalance ? formatBRL(balance) : "R$ ••••••••"}</p>
            </div>
            <button type="button" onClick={() => setShowBalance((v) => !v)} aria-label="Mostrar ou ocultar saldo" className="grid size-10 place-items-center rounded-full bg-secondary text-primary">
              <Eye className="size-5" />
            </button>
          </div>
        </section>

        <section className="mt-6">
          <h2 className="text-lg font-bold">O que você deseja fazer?</h2>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {[
              { label: "Entre contas Bradesco", icon: Repeat2, action: () => setBank(banks[0]) },
              { label: "Outro banco", icon: Landmark, action: () => setBank(banks[1]) },
              { label: "Agendar", icon: CalendarDays, action: () => document.getElementById("transfer-date")?.focus() },
              { label: "Agendamentos", icon: ReceiptText, action: () => document.getElementById("scheduled-transfers")?.scrollIntoView({ behavior: "smooth" }) },
            ].map((item) => (
              <button key={item.label} type="button" onClick={item.action} className="flex min-h-28 flex-col items-start justify-between rounded-2xl border border-border bg-card p-4 text-left shadow-card transition-transform active:scale-[0.98]">
                <span className="grid size-10 place-items-center rounded-full bg-primary/10 text-primary"><item.icon className="size-5" /></span>
                <span className="text-sm font-semibold leading-tight">{item.label}</span>
              </button>
            ))}
          </div>
        </section>

        <div className="my-7 flex items-center gap-3">
          <span className="h-px flex-1 bg-border" />
          <span className="text-xs font-medium text-muted-foreground">Nova transferência</span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <Field label="Nome do favorecido" value={name} onChange={(e) => setName(e.target.value)} />
        <Field label="CPF ou CNPJ" value={doc} onChange={(e) => setDoc(e.target.value)} inputMode="numeric" />
        <SelectField label="Banco" options={banks} value={bank} onChange={(e) => setBank(e.target.value)} />
        <div className="grid grid-cols-2 gap-3">
          <Field label="Agência" value={branch} maxLength={4} onChange={(e) => setBranch(e.target.value.replace(/\D/g, ""))} inputMode="numeric" />
          <Field label="Conta com dígito" value={acc} onChange={(e) => setAcc(e.target.value)} />
        </div>
        <Field label="Valor (R$)" value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="decimal" placeholder="0,00" />
        <div id="transfer-date"><Field label="Agendar para (opcional)" type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div>
        <label className="mt-4 flex items-center gap-2 text-sm">
          <input type="checkbox" checked={save} onChange={(e) => setSave(e.target.checked)} className="size-4 accent-primary" />
          Salvar como favorecido
        </label>
        {error && <ErrorNote>{error}</ErrorNote>}
        <PrimaryButton onClick={check}>Continuar</PrimaryButton>

        <DecemberTransferSchedule
          beneficiaries={beneficiaries}
          schedule={schedule}
          onSelect={(b, scheduledDate) => {
            setName(b.name);
            setDoc(b.doc);
            setBank(banks.find((x) => x === b.bank) ?? banks[0]);
            setBranch(b.branch);
            setAcc(b.account);
            setAmount("3000000");
            setDate(scheduledDate);
          }}
        />

        <div id="scheduled-transfers"><ScheduledList category="transferencia" /></div>
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


function buildTransferSchedule(count: number) {
  const businessDays: Date[] = [];
  const cursor = new Date(2026, 11, 1);
  while (businessDays.length < Math.ceil(count / 2) * 2) {
    const weekday = cursor.getDay();
    if (weekday !== 0 && weekday !== 6) businessDays.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return businessDays;
}

function DecemberTransferSchedule({
  beneficiaries,
  schedule,
  onSelect,
}: {
  beneficiaries: ReturnType<typeof useBank>["beneficiaries"];
  schedule: Date[];
  onSelect: (
    beneficiary: ReturnType<typeof useBank>["beneficiaries"][number],
    scheduledDate: string,
  ) => void;
}) {
  return (
    <section className="mt-8">
      <h2 className="font-semibold">Agendamento de transferência</h2>
      <p className="mt-1 text-xs text-muted-foreground">
        A partir de dezembro · R$ 3.000.000,00 · 2 transferências a cada 2 dias úteis
      </p>
      <ul className="mt-3 divide-y divide-border rounded-xl border border-border bg-card shadow-card">
        {beneficiaries.map((b, index) => {
          const group = Math.floor(index / 2);
          const scheduled = schedule[group * 2];
          if (!scheduled) return null;
          const scheduledDate = `${scheduled.getFullYear()}-${String(scheduled.getMonth() + 1).padStart(2, "0")}-${String(scheduled.getDate()).padStart(2, "0")}`;
          return (
            <li key={b.id}>
              <button
                type="button"
                onClick={() => onSelect(b, scheduledDate)}
                className="flex w-full items-center justify-between gap-3 p-4 text-left"
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold">{b.name}</span>
                  <span className="block text-xs text-muted-foreground">
                    {scheduled.toLocaleDateString("pt-BR")} · Agendamento
                  </span>
                </span>
                <span className="shrink-0 text-sm font-semibold tabular-nums">
                  R$ 3.000.000,00
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
