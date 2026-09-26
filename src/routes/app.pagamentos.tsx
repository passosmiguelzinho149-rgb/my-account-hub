import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ScanLine } from "lucide-react";
import { useState } from "react";
import { SubHeader } from "@/components/app/SubHeader";
import { ConfirmPanel, ErrorNote, Field, PrimaryButton } from "@/components/app/OpKit";
import { Switch } from "@/components/ui/switch";
import { formatBRL } from "@/lib/mock-data";
import { postTx, useBalance } from "@/lib/bank";
import { ScheduledList } from "./app.transferencias";

export const Route = createFileRoute("/app/pagamentos")({
  head: () => ({
    meta: [
      { title: "Pagamentos — Conta Empresas (demo)" },
      { name: "description", content: "Pague boletos pelo código de barras ou leitor simulado, agende e ative débito automático." },
      { property: "og:title", content: "Pagamentos — Conta Empresas (demo)" },
      { property: "og:description", content: "Pague boletos, agende e ative débito automático." },
    ],
  }),
  component: Pagamentos,
});

/** Boletos fictícios reconhecidos pela leitura simulada. */
const sampleBills = [
  { code: "23793381286000000123456789012345678900000428055", payee: "ENERGISA MATO GROSSO", amount: 4280.55 },
  { code: "34191790010104351004791020150008291070026000", payee: "VIVO EMPRESAS", amount: 389.9 },
  { code: "00190500954014481606906809350314337370000125000", payee: "PREFEITURA DE CUIABÁ — ISS", amount: 1250 },
];

function describe(code: string) {
  const digits = code.replace(/\D/g, "");
  const known = sampleBills.find((b) => b.code === digits);
  if (known) return known;
  // Valor embutido nos 10 últimos dígitos, como nos boletos reais.
  const cents = Number(digits.slice(-10));
  return { code: digits, payee: "BENEFICIÁRIO DO BOLETO LTDA", amount: cents > 0 ? cents / 100 : 0 };
}

function Pagamentos() {
  const navigate = useNavigate();
  const balance = useBalance();
  const [code, setCode] = useState("");
  const [date, setDate] = useState("");
  const [auto, setAuto] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [review, setReview] = useState(false);

  const digits = code.replace(/\D/g, "");
  const bill = describe(code);

  const scan = () => {
    const pick = sampleBills[Math.floor(Math.random() * sampleBills.length)]!;
    setCode(pick.code);
    setError(null);
  };

  const check = () => {
    if (digits.length < 44 || digits.length > 48) return setError("O código deve ter de 44 a 48 números.");
    if (bill.amount <= 0) return setError("Não foi possível identificar o valor deste boleto.");
    if (!date && bill.amount > balance) return setError("Saldo insuficiente.");
    setError(null);
    setReview(true);
  };

  const rows = [
    { label: "Beneficiário", value: bill.payee },
    { label: "Código de barras", value: digits.replace(/(\d{5})(?=\d)/g, "$1 ") },
    { label: "Quando", value: date ? `Agendado para ${new Date(`${date}T12:00`).toLocaleDateString("pt-BR")}` : "Hoje" },
    { label: "Débito automático", value: auto ? "Ativado" : "Não" },
  ];

  const confirm = () => {
    const tx = postTx({
      category: "pagamento",
      kind: "out",
      title: date ? "PAGAMENTO AGENDADO" : "PAGAMENTO DE BOLETO",
      counterpart: bill.payee,
      amount: bill.amount,
      channel: "App Empresas",
      status: date ? "Agendado" : "Concluído",
      ...(date ? { scheduledFor: new Date(`${date}T12:00`).toISOString() } : {}),
      extraRows: rows,
      notify: { kind: "pagamento", title: date ? "Pagamento agendado" : "Boleto pago", body: `${formatBRL(bill.amount)} para ${bill.payee}.` },
    });
    void navigate({ to: "/app/comprovante/$id", params: { id: tx.id }, replace: true });
  };

  if (review) {
    return (
      <>
        <SubHeader title="Confirmar pagamento" compactActions />
        <ConfirmPanel verb="pagamento" amount={bill.amount} rows={rows} onConfirm={confirm} onBack={() => setReview(false)} />
      </>
    );
  }

  return (
    <>
      <SubHeader title="Pagamentos" compactActions />
      <main className="px-4 py-5">
        <p className="text-sm text-muted-foreground">
          Saldo disponível: <strong className="text-foreground">{formatBRL(balance)}</strong>
        </p>
        <button
          type="button"
          onClick={scan}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-primary bg-card py-6 font-semibold text-primary"
        >
          <ScanLine className="size-6" aria-hidden /> Ler código de barras (simulado)
        </button>
        <Field label="Ou digite o código de barras" value={code} onChange={(e) => setCode(e.target.value)} inputMode="numeric" placeholder="Somente números" />
        {digits.length >= 44 && bill.amount > 0 && (
          <p className="mt-3 rounded-lg bg-secondary px-3 py-2 text-sm text-secondary-foreground">
            {bill.payee} · <strong>{formatBRL(bill.amount)}</strong>
          </p>
        )}
        <Field label="Agendar para (opcional)" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <div className="mt-4 flex items-center gap-3 rounded-xl border border-border bg-card p-4">
          <span className="min-w-0 flex-1 text-sm">
            <span className="block font-medium">Débito automático</span>
            <span className="block text-muted-foreground">Pagar as próximas contas deste beneficiário automaticamente.</span>
          </span>
          <Switch checked={auto} onCheckedChange={setAuto} aria-label="Débito automático" />
        </div>
        {error && <ErrorNote>{error}</ErrorNote>}
        <PrimaryButton onClick={check}>Continuar</PrimaryButton>
        <ScheduledList category="pagamento" />
      </main>
    </>
  );
}
