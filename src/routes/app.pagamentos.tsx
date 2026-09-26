import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Barcode, FileText, Keyboard, ScanLine, ClipboardCopy, X } from "lucide-react";
import { useRef, useState } from "react";
import { SubHeader } from "@/components/app/SubHeader";
import { ConfirmPanel, ErrorNote, Field, PrimaryButton } from "@/components/app/OpKit";
import { Switch } from "@/components/ui/switch";
import { formatBRL } from "@/lib/mock-data";
import { postTx, useBalance } from "@/lib/bank";
import { ScheduledList } from "./app.transferencias";

export const Route = createFileRoute("/app/pagamentos")({
  head: () => ({ meta: [{ title: "Pagamentos — Conta Empresas" }] }),
  component: Pagamentos,
});

const sampleBills = [
  { code: "836600000010000000000000000000000000000000000000", payee: "DAF DO GOVERNO", amount: 100.00 },
  { code: "34191790010104351004791020150008291070026000", payee: "VIVO EMPRESAS", amount: 389.9 },
  { code: "00190500954014481606906809350314337370000125000", payee: "PREFEITURA DE CUIABÁ — ISS", amount: 1250 },
];

function describe(code: string) {
  const digits = code.replace(/\D/g, "");
  const known = sampleBills.find((b) => b.code === digits);
  if (known) return known;
  const cents = Number(digits.slice(-10));
  return { code: digits, payee: "BENEFICIÁRIO DO BOLETO LTDA", amount: cents > 0 ? cents / 100 : 0 };
}

function Pagamentos() {
  const navigate = useNavigate();
  const balance = useBalance();
  const fileRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<"menu" | "form">("menu");
  const [code, setCode] = useState("");
  const [date, setDate] = useState("");
  const [auto, setAuto] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [review, setReview] = useState(false);
  const digits = code.replace(/\D/g, "");
  const bill = describe(code);

  const scan = () => {
    const pick = sampleBills[Math.floor(Math.random() * sampleBills.length)]!;
    setCode(pick.code); setError(null); setMode("form");
  };

  const check = () => {
    if (digits.length < 44 || digits.length > 48) return setError("O código deve ter de 44 a 48 números.");
    if (bill.amount <= 0) return setError("Não foi possível identificar o valor deste boleto.");
    if (!date && bill.amount > balance) return setError("Saldo insuficiente.");
    setError(null); setReview(true);
  };

  const rows = [
    { label: "Beneficiário", value: bill.payee },
    { label: "Código de barras", value: digits.replace(/(\d{5})(?=\d)/g, "$1 ") },
    { label: "Quando", value: date ? `Agendado para ${new Date(`${date}T12:00`).toLocaleDateString("pt-BR")}` : "Hoje" },
    { label: "Débito automático", value: auto ? "Ativado" : "Não" },
  ];

  const confirm = () => {
    const tx = postTx({ category: "pagamento", kind: "out", title: date ? "PAGAMENTO AGENDADO" : "PAGAMENTO DE BOLETO", counterpart: bill.payee, amount: bill.amount, channel: "App Empresas", status: date ? "Agendado" : "Concluído", ...(date ? { scheduledFor: new Date(`${date}T12:00`).toISOString() } : {}), extraRows: rows, notify: { kind: "pagamento", title: date ? "Pagamento agendado" : "Boleto pago", body: `${formatBRL(bill.amount)} para ${bill.payee}.` } });
    void navigate({ to: "/app/comprovante/$id", params: { id: tx.id }, replace: true });
  };

  if (review) return <><SubHeader title="Confirmar pagamento" compactActions /><ConfirmPanel verb="pagamento" amount={bill.amount} rows={rows} onConfirm={confirm} onBack={() => setReview(false)} /></>;

  if (mode === "menu") return (
    <>
      <SubHeader title="Pagamentos" variant="deep" compactActions>
        <div className="px-4 pb-5 pt-2"><p className="text-sm font-medium text-white/90">Pagar com código de barras</p></div>
      </SubHeader>
      <main className="mx-auto w-full max-w-[430px] px-4 pb-10 pt-4">
        <div className="grid grid-cols-3 gap-3">
          <button type="button" onClick={scan} className="flex min-h-[126px] flex-col items-start justify-center gap-3 rounded-xl bg-white p-4 text-left shadow-[0_6px_16px_rgba(25,35,70,.14)]"><ScanLine className="size-8 text-[#313878]" /><span className="font-medium leading-tight">Ler código<br/>de barras</span></button>
          <button type="button" onClick={() => setMode("form")} className="flex min-h-[126px] flex-col items-start justify-center gap-3 rounded-xl bg-white p-4 text-left shadow-[0_6px_16px_rgba(25,35,70,.14)]"><Keyboard className="size-8 text-[#313878]" /><span className="font-medium leading-tight">Digitar<br/>código</span></button>
          <button type="button" onClick={() => fileRef.current?.click()} className="flex min-h-[126px] flex-col items-start justify-center gap-3 rounded-xl bg-white p-4 text-left shadow-[0_6px_16px_rgba(25,35,70,.14)]"><FileText className="size-8 text-[#313878]" /><span className="font-medium leading-tight">Abrir<br/>PDF</span></button>
          <input ref={fileRef} type="file" accept="application/pdf" className="hidden" />
        </div>
        <h2 className="mt-8 text-lg font-semibold">Pagar Pix</h2>
        <div className="mt-3 grid grid-cols-3 gap-3">
          <Link to="/app/pix/enviar" className="flex min-h-[126px] flex-col items-start justify-center gap-3 rounded-xl bg-white p-4 shadow-[0_6px_16px_rgba(25,35,70,.14)]"><ClipboardCopy className="size-8 text-[#313878]" /><span className="font-medium leading-tight">Pix Copia<br/>e Cola</span></Link>
        </div>
      </main>
    </>
  );

  return (
    <>
      <SubHeader title="Pagar código" compactActions />
      <main className="mx-auto w-full max-w-[430px] px-4 py-5">
        <button type="button" onClick={() => setMode("menu")} className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-primary"><X className="size-4"/> Fechar</button>
        <p className="text-sm text-muted-foreground">Saldo disponível: <strong className="text-foreground">{formatBRL(balance)}</strong></p>
        <Field label="Código de barras" value={code} onChange={(e) => setCode(e.target.value)} inputMode="numeric" placeholder="Somente números" />
        {digits.length >= 44 && bill.amount > 0 && <p className="mt-3 rounded-lg bg-secondary px-3 py-2 text-sm">{bill.payee} · <strong>{formatBRL(bill.amount)}</strong></p>}
        <Field label="Agendar para (opcional)" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <div className="mt-4 flex items-center gap-3 rounded-xl border border-border bg-card p-4"><span className="min-w-0 flex-1 text-sm"><span className="block font-medium">Débito automático</span><span className="block text-muted-foreground">Pagar próximas contas automaticamente.</span></span><Switch checked={auto} onCheckedChange={setAuto} /></div>
        {error && <ErrorNote>{error}</ErrorNote>}
        <PrimaryButton onClick={check}>Continuar</PrimaryButton>
        <ScheduledList category="pagamento" />
      </main>
    </>
  );
}
