import type { ComponentProps, ReactNode } from "react";
import { formatBRL } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

/** Campo de formulário padrão das operações. */
export function Field({ label, className, ...props }: ComponentProps<"input"> & { label: string }) {
  return (
    <label className="mt-4 block">
      <span className="text-sm font-medium">{label}</span>
      <input
        {...props}
        className={cn(
          "mt-1.5 w-full rounded-lg border border-border bg-card px-3 py-3 text-base outline-none focus-visible:ring-2 focus-visible:ring-primary",
          className,
        )}
      />
    </label>
  );
}

export function SelectField({
  label,
  options,
  ...props
}: ComponentProps<"select"> & { label: string; options: readonly string[] }) {
  return (
    <label className="mt-4 block">
      <span className="text-sm font-medium">{label}</span>
      <select
        {...props}
        className="mt-1.5 w-full rounded-lg border border-border bg-card px-3 py-3 text-base outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

export function PrimaryButton({ className, ...props }: ComponentProps<"button">) {
  return (
    <button
      type="button"
      {...props}
      className={cn(
        "mt-6 w-full rounded-full bg-primary py-3.5 text-base font-semibold text-primary-foreground transition-transform active:scale-95",
        className,
      )}
    />
  );
}

export function ErrorNote({ children }: { children: ReactNode }) {
  return (
    <p role="alert" className="mt-4 rounded-lg bg-secondary px-3 py-2 text-sm text-brand-red">
      {children}
    </p>
  );
}

interface ConfirmProps {
  verb: string;
  amount: number;
  rows: { label: string; value: string }[];
  onConfirm: () => void;
  onBack: () => void;
}

/** Tela de confirmação exibida antes de concluir qualquer operação. */
export function ConfirmPanel({ verb, amount, rows, onConfirm, onBack }: ConfirmProps) {
  return (
    <main className="px-4 py-5">
      <p className="text-sm text-muted-foreground">Confira antes de confirmar</p>
      <p className="text-3xl font-bold tabular-nums">{formatBRL(amount)}</p>
      <dl className="mt-5 divide-y divide-border rounded-xl border border-border bg-card px-4 shadow-card">
        {rows.map((r) => (
          <div key={r.label} className="grid grid-cols-[auto_minmax(0,1fr)] gap-3 py-3">
            <dt className="text-sm text-muted-foreground">{r.label}</dt>
            <dd className="text-right text-sm font-medium break-words">{r.value}</dd>
          </div>
        ))}
      </dl>
      <PrimaryButton onClick={onConfirm}>Confirmar {verb}</PrimaryButton>
      <button type="button" onClick={onBack} className="mt-3 w-full rounded-full border border-border py-3.5 font-medium">
        Voltar e corrigir
      </button>
    </main>
  );
}
