import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SubHeader } from "@/components/app/SubHeader";
import { formatBRL } from "@/lib/mock-data";
import { postTx, pixReceiptRows, useBalance } from "@/lib/bank";
import {
  favorites,
  maskDoc,
  parseAmount,
  parseBrCode,
  resolvePayee,
  type PixParty,
} from "@/lib/pix";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/pix/enviar")({
  head: () => ({
    meta: [
      { title: "Pagar ou enviar Pix — Conta Empresas (demo)" },
      {
        name: "description",
        content: "Envie Pix por chave ou copia e cola, com confirmação e agendamento nesta demonstração.",
      },
      { property: "og:title", content: "Pagar ou enviar Pix — Conta Empresas (demo)" },
      {
        property: "og:description",
        content: "Envie Pix por chave ou copia e cola, com confirmação e agendamento.",
      },
    ],
  }),
  component: EnviarPix,
});

type Mode = "chave" | "copia";

function EnviarPix() {
  const navigate = useNavigate();
  const balance = useBalance();

  const [mode, setMode] = useState<Mode>("chave");
  const [sourceConfirmed, setSourceConfirmed] = useState(false);
  const [key, setKey] = useState("");
  const [code, setCode] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [scheduledFor, setScheduledFor] = useState("");
  const [error, setError] = useState<string | null>(null);
  /** Quando preenchido, a tela mostra a confirmação antes de concluir. */
  const [pending, setPending] = useState<{ payee: PixParty; value: number } | null>(null);

  const review = () => {
    setError(null);
    let targetKey = key.trim();
    let value = parseAmount(amount);

    if (mode === "copia") {
      const parsed = parseBrCode(code);
      if (!parsed) {
        setError("Não conseguimos ler este código Pix. Confira e cole novamente.");
        return;
      }
      targetKey = parsed.key;
      if (!Number.isFinite(value) || value <= 0) value = parsed.amount;
    }

    if (!targetKey) {
      setError("Informe a chave Pix de quem vai receber.");
      return;
    }
    if (!Number.isFinite(value) || value <= 0) {
      setError("Informe um valor maior que zero.");
      return;
    }
    if (!scheduledFor && value > balance) {
      setError("Saldo insuficiente para este Pix.");
      return;
    }
    setPending({ payee: resolvePayee(targetKey), value });
  };

  const confirm = () => {
    if (!pending) return;
    const scheduled = Boolean(scheduledFor);
    const tx = postTx({
      category: "pix",
      kind: "out",
      title: scheduled ? "PIX AGENDADO" : "PIX ENVIADO",
      counterpart: `PARA: ${pending.payee.name}`,
      amount: pending.value,
      channel: mode === "copia" ? "Pix copia e cola" : "Pix chave",
      status: scheduled ? "Agendado" : "Concluído",
      pix: true,
      ...(scheduledFor ? { scheduledFor: new Date(scheduledFor).toISOString() } : {}),
      ...(description.trim() ? { description: description.trim() } : {}),
      extraRows: pixReceiptRows(pending.payee),
      notify: {
        kind: "pix",
        title: scheduled ? "Pix agendado" : "Pix enviado",
        body: `${formatBRL(pending.value)} para ${pending.payee.name}.`,
      },
    });
    void navigate({ to: "/app/comprovante/$id", params: { id: tx.id }, replace: true });
  };

  if (!sourceConfirmed) {
    return (
      <>
        <SubHeader title="Pix" fallbackTo="/app/pix" compactActions />
        <main className="px-4 py-6">
          <h1 className="text-2xl font-bold leading-tight">De onde o valor será debitado?</h1>
          <p className="mt-4 text-right text-sm font-semibold text-primary">Ver saldo</p>

          <div className="mt-4 rounded-2xl border-2 border-primary bg-card p-4 shadow-card">
            <div className="flex items-start gap-3">
              <span className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full border-2 border-primary">
                <span className="size-3 rounded-full bg-primary" />
              </span>
              <div>
                <p className="font-semibold">Bradesco</p>
                <p className="mt-1 text-sm">Ag.: 2491 | C/C: 23062-6</p>
                <p className="mt-2 text-sm">Saldo disponível: <strong>{formatBRL(balance)}</strong></p>
              </div>
            </div>
          </div>

          <div className="mt-3 rounded-2xl border border-border bg-card p-4 opacity-70 shadow-card">
            <div className="flex items-start gap-3">
              <span className="mt-1 size-6 shrink-0 rounded-full border-2 border-muted-foreground" />
              <div>
                <p className="font-semibold">Bradesco</p>
                <p className="mt-1 text-sm">Ag.: 2491 | C/Poup.: 23062-6</p>
                <p className="mt-2 text-sm text-muted-foreground">Conta demonstrativa</p>
              </div>
            </div>
          </div>

          <div className="mt-3 rounded-2xl border border-border bg-card p-4 opacity-70 shadow-card">
            <div className="flex items-start gap-3">
              <span className="mt-1 size-6 shrink-0 rounded-full border-2 border-muted-foreground" />
              <div>
                <p className="font-semibold">Conta de outra instituição</p>
                <p className="mt-1 text-sm text-muted-foreground">Opção ilustrativa nesta demonstração.</p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setSourceConfirmed(true)}
            className="mt-10 w-full rounded-full bg-primary py-3.5 text-base font-semibold text-primary-foreground transition-transform active:scale-95"
          >
            Continuar
          </button>
        </main>
      </>
    );
  }

  if (pending) {
    return (
      <>
        <SubHeader title="Confirmar Pix" fallbackTo="/app/pix" compactActions />
        <main className="px-4 py-5">
          <p className="text-sm text-muted-foreground">Você está enviando</p>
          <p className="text-3xl font-bold tabular-nums">{formatBRL(pending.value)}</p>

          <dl className="mt-5 divide-y divide-border rounded-xl border border-border bg-card px-4 shadow-card">
            {[
              { label: "Nome", value: pending.payee.name },
              { label: "CPF/CNPJ", value: maskDoc(pending.payee.doc) },
              { label: "Instituição", value: pending.payee.bank },
              {
                label: "Agência / Conta",
                value: `${pending.payee.branch} / ${pending.payee.account}`,
              },
              { label: "Chave Pix", value: pending.payee.key ?? "—" },
              ...(scheduledFor
                ? [{ label: "Agendado para", value: new Date(scheduledFor).toLocaleDateString("pt-BR") }]
                : []),
              ...(description.trim() ? [{ label: "Descrição", value: description.trim() }] : []),
            ].map((row) => (
              <div key={row.label} className="grid grid-cols-[auto_minmax(0,1fr)] gap-3 py-3">
                <dt className="text-sm text-muted-foreground">{row.label}</dt>
                <dd className="text-right text-sm font-medium break-words">{row.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-6 space-y-3">
            <button
              type="button"
              onClick={confirm}
              className="w-full rounded-full bg-primary py-3.5 text-base font-semibold text-primary-foreground transition-transform active:scale-95"
            >
              Confirmar e enviar
            </button>
            <button
              type="button"
              onClick={() => setPending(null)}
              className="w-full rounded-full border border-border py-3.5 text-base font-medium"
            >
              Voltar e corrigir
            </button>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <SubHeader title="Pagar ou enviar" fallbackTo="/app/pix" compactActions />
      <main className="px-4 py-5">
        <div className="flex gap-2">
          {(["chave", "copia"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={cn(
                "flex-1 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                mode === m
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground",
              )}
            >
              {m === "chave" ? "Por chave" : "Copia e cola"}
            </button>
          ))}
        </div>

        <p className="mt-4 text-sm text-muted-foreground">
          Saldo disponível: <strong className="text-foreground">{formatBRL(balance)}</strong>
        </p>

        {mode === "chave" ? (
          <>
            <label className="mt-4 block">
              <span className="text-sm font-medium">Chave Pix de quem recebe</span>
              <input
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="CPF, CNPJ, e-mail, celular ou aleatória"
                className="mt-1.5 w-full rounded-lg border border-border bg-card px-3 py-3 text-base outline-none focus-visible:ring-2 focus-visible:ring-primary"
              />
            </label>

            <h2 className="mt-5 text-sm font-semibold">Favorecidos</h2>
            <ul className="mt-2 flex gap-2 overflow-x-auto pb-1">
              {favorites.map((f) => (
                <li key={f.key}>
                  <button
                    type="button"
                    onClick={() => setKey(f.key)}
                    className="w-40 shrink-0 rounded-xl border border-border bg-card p-3 text-left shadow-card"
                  >
                    <span className="block truncate text-sm font-semibold">{f.name}</span>
                    <span className="block truncate text-xs text-muted-foreground">{f.bank}</span>
                  </button>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <label className="mt-4 block">
            <span className="text-sm font-medium">Pix copia e cola</span>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows={4}
              placeholder="Cole aqui o código Pix recebido"
              className="mt-1.5 w-full rounded-lg border border-border bg-card px-3 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
          </label>
        )}

        <label className="mt-4 block">
          <span className="text-sm font-medium">Valor (R$)</span>
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            inputMode="decimal"
            placeholder="0,00"
            className="mt-1.5 w-full rounded-lg border border-border bg-card px-3 py-3 text-base tabular-nums outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
        </label>

        <label className="mt-4 block">
          <span className="text-sm font-medium">Descrição (opcional)</span>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ex.: pagamento de nota 1234"
            className="mt-1.5 w-full rounded-lg border border-border bg-card px-3 py-3 text-base outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
        </label>

        <label className="mt-4 block">
          <span className="text-sm font-medium">Agendar para (opcional)</span>
          <input
            type="date"
            value={scheduledFor}
            onChange={(e) => setScheduledFor(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-border bg-card px-3 py-3 text-base outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
        </label>

        {error && (
          <p role="alert" className="mt-4 rounded-lg bg-secondary px-3 py-2 text-sm text-brand-red">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={review}
          className="mt-6 w-full rounded-full bg-primary py-3.5 text-base font-semibold text-primary-foreground transition-transform active:scale-95"
        >
          Continuar
        </button>
      </main>
    </>
  );
}
