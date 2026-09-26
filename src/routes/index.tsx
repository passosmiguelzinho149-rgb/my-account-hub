import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Fingerprint, Lock, LockOpen, ShieldCheck } from "lucide-react";
import { useSession } from "@/lib/session";
import {
  checkPin,
  DEMO_PIN,
  makeCode,
  registerSuccess,
  unlockAccount,
  useSecurity,
  type AccessEntry,
} from "@/lib/security";
import { account } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Acessar conta — Bradesco Empresas e Negócios (demo)" },
      {
        name: "description",
        content:
          "Protótipo de demonstração do app Bradesco Empresas e Negócios: acesso com senha, biometria simulada e verificação em duas etapas.",
      },
      { property: "og:title", content: "Acessar conta — Bradesco Empresas e Negócios (demo)" },
      {
        property: "og:description",
        content: "Protótipo mobile de conta empresarial com acesso seguro simulado.",
      },
    ],
  }),
  component: LoginScreen,
});

type Step =
  | { name: "home" }
  | { name: "pin" }
  | { name: "bio" }
  | { name: "code"; code: string; method: AccessEntry["method"]; purpose: "login" | "unlock" };

function LoginScreen() {
  const { signedIn, hydrated, signIn } = useSession();
  const security = useSecurity();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>({ name: "home" });
  const [pin, setPin] = useState("");
  const [typed, setTyped] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (hydrated && signedIn) void navigate({ to: "/app", replace: true });
  }, [hydrated, signedIn, navigate]);

  const finish = (method: AccessEntry["method"]) => {
    if (security.twoFactor && step.name !== "code") {
      setTyped("");
      setStep({ name: "code", code: makeCode(), method, purpose: "login" });
      return;
    }
    registerSuccess(method);
    signIn();
    void navigate({ to: "/app", replace: true });
  };

  const submitPin = () => {
    const r = checkPin(pin);
    setPin("");
    if (!r.ok) return setError(r.reason);
    setError(null);
    finish("Senha");
  };

  const biometric = () => {
    if (security.locked) return setError("Conta bloqueada. Desbloqueie para entrar.");
    setError(null);
    setStep({ name: "bio" });
    window.setTimeout(() => finish("Biometria"), 1200);
  };

  const submitCode = () => {
    if (step.name !== "code") return;
    if (typed !== step.code) return setError("Código incorreto. Confira e tente novamente.");
    setError(null);
    if (step.purpose === "unlock") {
      unlockAccount();
      setStep({ name: "home" });
      return;
    }
    registerSuccess(step.method);
    signIn();
    void navigate({ to: "/app", replace: true });
  };

  const input =
    "mt-1.5 w-full rounded-lg border border-border bg-card px-3 py-3 text-center text-2xl tracking-[0.5em] text-card-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary";

  return (
    <div className="bg-brand-gradient flex min-h-screen flex-col text-primary-foreground">
      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col px-4 pt-4 pb-6">
        <div className="flex items-center gap-2.5">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-card text-lg font-bold text-brand-red">
            B
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-lg font-bold">bradesco</span>
            <span className="block truncate text-xs opacity-80">empresas e negócios</span>
          </span>
        </div>

        <h1 className="mt-10 text-3xl leading-tight font-bold">
          Uma nova experiência
          <br />
          para o seu negócio
        </h1>
        <div className="flex-1" />

        <div className="rounded-2xl bg-card p-4 text-card-foreground shadow-card">
          <div className="flex items-center gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-secondary text-sm font-semibold text-secondary-foreground">
              CO
            </span>
            <span className="min-w-0">
              <span className="block truncate font-medium">CPF ••• 151 •••</span>
              <span className="block text-xs text-muted-foreground">
                Agência {account.branch} · Conta {account.number}
              </span>
            </span>
          </div>

          {security.locked && step.name === "home" && (
            <p className="mt-4 flex items-center gap-2 rounded-lg bg-secondary px-3 py-2 text-sm text-brand-red">
              <Lock className="size-4 shrink-0" aria-hidden /> Conta de demonstração bloqueada.
            </p>
          )}

          {step.name === "home" && (
            <button
              type="button"
              onClick={() => (security.locked ? setError("Desbloqueie a conta para entrar.") : setStep({ name: "pin" }))}
              className="mt-4 w-full rounded-lg bg-primary py-3.5 text-base font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Acessar conta
            </button>
          )}

          {step.name === "pin" && (
            <form
              className="mt-4"
              onSubmit={(e) => {
                e.preventDefault();
                submitPin();
              }}
            >
              <label className="block text-sm font-medium">
                Senha / PIN
                <input
                  type="password"
                  inputMode="numeric"
                  autoFocus
                  maxLength={6}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                  className={input}
                  aria-label="Senha"
                />
              </label>
              <p className="mt-2 text-xs text-muted-foreground">
                Senha da demonstração: {DEMO_PIN} (se você não trocou).
              </p>
              <button
                type="submit"
                className="mt-3 w-full rounded-lg bg-primary py-3.5 font-semibold text-primary-foreground"
              >
                Entrar
              </button>
              <button
                type="button"
                onClick={() => setStep({ name: "home" })}
                className="mt-2 w-full py-2 text-sm font-medium text-primary"
              >
                Cancelar
              </button>
            </form>
          )}

          {step.name === "bio" && (
            <div className="mt-4 flex flex-col items-center gap-2 py-4" aria-live="polite">
              <Fingerprint className="size-14 animate-pulse text-primary" aria-hidden />
              <p className="text-sm font-medium">Lendo biometria…</p>
            </div>
          )}

          {step.name === "code" && (
            <form
              className="mt-4"
              onSubmit={(e) => {
                e.preventDefault();
                submitCode();
              }}
            >
              <p className="flex items-center gap-2 text-sm font-semibold">
                <ShieldCheck className="size-5 text-primary" aria-hidden />
                {step.purpose === "unlock" ? "Desbloquear conta" : "Verificação em duas etapas"}
              </p>
              <p className="mt-2 rounded-lg bg-secondary px-3 py-2 text-sm text-secondary-foreground">
                SMS simulado para (65) 9••••-••51: seu código é <strong>{step.code}</strong>
              </p>
              <input
                inputMode="numeric"
                autoFocus
                maxLength={6}
                value={typed}
                onChange={(e) => setTyped(e.target.value.replace(/\D/g, ""))}
                className={input}
                aria-label="Código de verificação"
              />
              <button type="submit" className="mt-3 w-full rounded-lg bg-primary py-3.5 font-semibold text-primary-foreground">
                Confirmar código
              </button>
              <button
                type="button"
                onClick={() => setStep({ name: "home" })}
                className="mt-2 w-full py-2 text-sm font-medium text-primary"
              >
                Cancelar
              </button>
            </form>
          )}

          {error && (
            <p role="alert" className="mt-3 text-sm text-brand-red">
              {error}
            </p>
          )}
        </div>

        {step.name === "home" && (
          <>
            <button
              type="button"
              onClick={biometric}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border-2 border-primary bg-card py-3.5 text-base font-semibold text-primary"
            >
              <Fingerprint className="size-5" aria-hidden />
              Entrar com biometria
            </button>
            {security.locked ? (
              <button
                type="button"
                onClick={() => {
                  setTyped("");
                  setError(null);
                  setStep({ name: "code", code: makeCode(), method: "Chave de segurança", purpose: "unlock" });
                }}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-card py-3.5 text-base text-card-foreground"
              >
                <LockOpen className="size-5" aria-hidden />
                Desbloquear conta
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setTyped("");
                  setError(null);
                  setStep({ name: "code", code: makeCode(), method: "Chave de segurança", purpose: "login" });
                }}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-card py-3.5 text-base text-card-foreground"
              >
                <Lock className="size-5" aria-hidden />
                Chave de segurança
              </button>
            )}
            <Link
              to="/recuperar-acesso"
              className="mt-4 block text-center text-sm font-medium underline underline-offset-4"
            >
              Esqueci minha senha
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
