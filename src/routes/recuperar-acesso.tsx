import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { makeCode, resetPin } from "@/lib/security";

export const Route = createFileRoute("/recuperar-acesso")({
  head: () => ({
    meta: [
      { title: "Recuperar acesso — Bradesco Empresas (demo)" },
      { name: "description", content: "Redefina a senha da conta de demonstração com um código simulado." },
      { property: "og:title", content: "Recuperar acesso — Bradesco Empresas (demo)" },
      { property: "og:description", content: "Redefina a senha da conta de demonstração." },
    ],
  }),
  component: Recuperar,
});

function Recuperar() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"doc" | "code" | "pin" | "done">("doc");
  const [doc, setDoc] = useState("");
  const [code] = useState(makeCode);
  const [typed, setTyped] = useState("");
  const [pin, setPin] = useState("");
  const [pin2, setPin2] = useState("");
  const [error, setError] = useState<string | null>(null);

  const field =
    "mt-1.5 w-full rounded-lg border border-border bg-card px-3 py-3 text-base outline-none focus-visible:ring-2 focus-visible:ring-primary";
  const btn = "mt-5 w-full rounded-full bg-primary py-3.5 font-semibold text-primary-foreground";

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-brand-gradient text-primary-foreground">
        <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-3">
          <Link to="/" aria-label="Voltar" className="rounded-full p-1">
            <ArrowLeft className="size-6" aria-hidden />
          </Link>
          <h1 className="text-lg font-semibold">Recuperar acesso</h1>
        </div>
      </header>
      <main className="mx-auto max-w-lg px-4 py-5">
        {step === "doc" && (
          <>
            <label className="block text-sm font-medium">
              CPF do titular (somente os 3 dígitos do meio: 151)
              <input value={doc} onChange={(e) => setDoc(e.target.value)} inputMode="numeric" className={field} />
            </label>
            <button
              type="button"
              className={btn}
              onClick={() => (doc.includes("151") ? (setError(null), setStep("code")) : setError("CPF não confere com a conta de demonstração."))}
            >
              Enviar código
            </button>
          </>
        )}
        {step === "code" && (
          <>
            <p className="rounded-lg bg-secondary px-3 py-2 text-sm text-secondary-foreground">
              SMS simulado: seu código de recuperação é <strong>{code}</strong>
            </p>
            <label className="mt-4 block text-sm font-medium">
              Código recebido
              <input value={typed} onChange={(e) => setTyped(e.target.value)} inputMode="numeric" maxLength={6} className={field} />
            </label>
            <button
              type="button"
              className={btn}
              onClick={() => (typed === code ? (setError(null), setStep("pin")) : setError("Código incorreto."))}
            >
              Validar código
            </button>
          </>
        )}
        {step === "pin" && (
          <>
            <label className="block text-sm font-medium">
              Nova senha (4 a 6 números)
              <input type="password" inputMode="numeric" maxLength={6} value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))} className={field} />
            </label>
            <label className="mt-4 block text-sm font-medium">
              Repita a nova senha
              <input type="password" inputMode="numeric" maxLength={6} value={pin2} onChange={(e) => setPin2(e.target.value.replace(/\D/g, ""))} className={field} />
            </label>
            <button
              type="button"
              className={btn}
              onClick={() => {
                if (pin !== pin2) return setError("As senhas não conferem.");
                const r = resetPin(pin);
                if (!r.ok) return setError(r.reason);
                setError(null);
                setStep("done");
              }}
            >
              Salvar nova senha
            </button>
          </>
        )}
        {step === "done" && (
          <>
            <p className="font-semibold">Senha redefinida e conta desbloqueada.</p>
            <button type="button" className={btn} onClick={() => void navigate({ to: "/" })}>
              Ir para o login
            </button>
          </>
        )}
        {error && (
          <p role="alert" className="mt-3 text-sm text-brand-red">
            {error}
          </p>
        )}
      </main>
    </div>
  );
}
