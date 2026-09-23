import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { SubHeader } from "@/components/app/SubHeader";
import { formatBRL } from "@/lib/mock-data";
import { postTx, pixReceiptRows, useBank } from "@/lib/bank";
import { buildBrCode, ownParty, parseAmount } from "@/lib/pix";

export const Route = createFileRoute("/app/pix/receber")({
  head: () => ({
    meta: [
      { title: "Receber Pix — Conta Empresas (demo)" },
      {
        name: "description",
        content: "Gere um QR Code e o código copia e cola para receber Pix nesta demonstração.",
      },
      { property: "og:title", content: "Receber Pix — Conta Empresas (demo)" },
      {
        property: "og:description",
        content: "Gere um código copia e cola para receber Pix na conta empresarial.",
      },
    ],
  }),
  component: ReceberPix,
});

function ReceberPix() {
  const navigate = useNavigate();
  const { pixKeys } = useBank();
  const [keyValue, setKeyValue] = useState(pixKeys[0]?.value ?? ownParty.doc);
  const [amount, setAmount] = useState("");
  const [copied, setCopied] = useState(false);

  const value = parseAmount(amount);
  const parsedValue = Number.isFinite(value) && value > 0 ? value : 0;
  const brCode = buildBrCode(keyValue, parsedValue, ownParty.name);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(brCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  /** Simula o pagamento da cobrança para demonstrar o crédito na conta. */
  const simulatePayment = () => {
    const payer = {
      ...ownParty,
      name: "PAGADOR DA DEMONSTRAÇÃO",
      doc: "123.456.789-00",
      bank: "260 — Nu Pagamentos S.A.",
      branch: "0001",
      account: "77120034-8",
    };
    const tx = postTx({
      category: "pix",
      kind: "in",
      title: "PIX QR CODE STATIC",
      counterpart: `REM: ${payer.name}`,
      amount: parsedValue > 0 ? parsedValue : 1000,
      channel: "Pix QR Code",
      pix: true,
      extraRows: pixReceiptRows({ ...ownParty, key: keyValue }, payer),
      notify: {
        kind: "pix",
        title: "Pix recebido",
        body: `Você recebeu ${formatBRL(parsedValue > 0 ? parsedValue : 1000)}.`,
      },
    });
    void navigate({ to: "/app/comprovante/$id", params: { id: tx.id } });
  };

  return (
    <>
      <SubHeader title="Receber ou cobrar" fallbackTo="/app/pix" compactActions />
      <main className="px-4 py-5">
        <label className="block">
          <span className="text-sm font-medium">Chave que vai receber</span>
          <select
            value={keyValue}
            onChange={(e) => setKeyValue(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-border bg-card px-3 py-3 text-base outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {pixKeys.map((k) => (
              <option key={k.id} value={k.value}>
                {k.type} — {k.value}
              </option>
            ))}
          </select>
        </label>

        <label className="mt-4 block">
          <span className="text-sm font-medium">Valor (opcional)</span>
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            inputMode="decimal"
            placeholder="0,00"
            className="mt-1.5 w-full rounded-lg border border-border bg-card px-3 py-3 text-base tabular-nums outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
        </label>

        <section className="mt-6 rounded-xl border border-border bg-card p-4 text-center shadow-card">
          <p className="text-sm font-semibold">QR Code para pagamento</p>
          <div
            className="mx-auto mt-3 grid size-44 grid-cols-11 gap-0.5 rounded-lg bg-background p-2"
            role="img"
            aria-label="QR Code de demonstração"
          >
            {Array.from({ length: 121 }, (_, i) => (
              <span
                key={i}
                className={
                  brCode.charCodeAt(i % brCode.length) % 2 === 0 ? "bg-foreground" : "bg-background"
                }
              />
            ))}
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            {parsedValue > 0 ? formatBRL(parsedValue) : "Valor livre"} · {ownParty.name}
          </p>
        </section>

        <p className="mt-4 text-sm font-medium">Pix copia e cola</p>
        <p className="mt-1.5 rounded-lg border border-border bg-card p-3 text-xs break-all text-muted-foreground">
          {brCode}
        </p>
        <button
          type="button"
          onClick={() => void copy()}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-base font-semibold text-primary-foreground transition-transform active:scale-95"
        >
          {copied ? <Check className="size-5" aria-hidden /> : <Copy className="size-5" aria-hidden />}
          {copied ? "Código copiado" : "Copiar código"}
        </button>
        <button
          type="button"
          onClick={simulatePayment}
          className="mt-3 w-full rounded-full border border-border py-3.5 text-base font-medium"
        >
          Simular pagamento recebido
        </button>

        <p className="mt-6 text-xs text-muted-foreground">
          QR Code ilustrativo desta demonstração: não pode ser lido por outros aplicativos.
        </p>
      </main>
    </>
  );
}
