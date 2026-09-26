import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Bell, Fingerprint, Grid2X2, Lock, LockOpen, Menu, MessageCircle, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useSession } from "@/lib/session";
import {
  checkPin,
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
          "Protótipo de demonstração do app Bradesco Empresas e Negócios: tela de acesso inspirada no aplicativo móvel.",
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

function maskedBranch(value: string) {
  return value.length > 2 ? `**${value.slice(-2)}` : value;
}

function maskedAccount(value: string) {
  return value.length > 3 ? `***${value.slice(-3)}` : value;
}

function LoginScreen() {
  const { signedIn, hydrated, signIn } = useSession();
  const security = useSecurity();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>({ name: "home" });
  const [pin, setPin] = useState("");
  const [typed, setTyped] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [faceRegistered, setFaceRegistered] = useState(false);

  useEffect(() => {
    setFaceRegistered(window.localStorage.getItem("bradesco-demo-face-credential") === "1");
  }, []);

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
    const result = checkPin(pin);
    setPin("");
    if (!result.ok) return setError(result.reason);
    setError(null);
    finish("Senha");
  };

  const biometric = async () => {
    if (security.locked) return setError("Conta bloqueada. Desbloqueie para entrar.");
    if (!window.PublicKeyCredential || !navigator.credentials) {
      return setError("A biometria facial não está disponível neste navegador ou aparelho.");
    }

    try {
      setError(null);
      setStep({ name: "bio" });

      const credential = faceRegistered
        ? await navigator.credentials.get({
            publicKey: {
              challenge: crypto.getRandomValues(new Uint8Array(32)),
              userVerification: "required",
              timeout: 60000,
            },
          })
        : await navigator.credentials.create({
            publicKey: {
              challenge: crypto.getRandomValues(new Uint8Array(32)),
              rp: { name: "Conta Empresas — Demonstração" },
              user: {
                id: crypto.getRandomValues(new Uint8Array(16)),
                name: account.holder.toLowerCase().replace(/\\s+/g, "."),
                displayName: account.holder,
              },
              pubKeyCredParams: [
                { type: "public-key", alg: -7 },
                { type: "public-key", alg: -257 },
              ],
              authenticatorSelection: {
                authenticatorAttachment: "platform",
                residentKey: "required",
                userVerification: "required",
              },
              timeout: 60000,
              attestation: "none",
            },
          });

      if (!credential) throw new Error("Biometria não concluída.");

      if (!faceRegistered) {
        window.localStorage.setItem("bradesco-demo-face-credential", "1");
        setFaceRegistered(true);
      }

      finish("Biometria");
    } catch {
      setStep({ name: "home" });
      setError("Não foi possível concluir a biometria. Tente novamente ou use sua senha.");
    }
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

  const startPin = () => {
    setError(null);
    if (security.locked) {
      setError("Desbloqueie a conta para entrar.");
      return;
    }
    setStep({ name: "pin" });
  };

  const securityAction = () => {
    setTyped("");
    setError(null);
    setStep({
      name: "code",
      code: makeCode(),
      method: "Chave de segurança",
      purpose: security.locked ? "unlock" : "login",
    });
  };

  const input =
    "mt-2 w-full rounded-xl border border-border bg-card px-3 py-3 text-center text-2xl tracking-[0.5em] text-card-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary";

  return (
    <div className="relative min-h-screen overflow-hidden bg-brand-gradient text-primary-foreground">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -bottom-24 -left-20 h-72 w-[125%] rotate-[-12deg] rounded-[50%] bg-white/10" />
        <div className="absolute -bottom-16 -right-28 h-64 w-[120%] rotate-[-16deg] rounded-[50%] border-t border-white/10 bg-white/[0.04]" />
        <div className="absolute bottom-[-120px] left-[-18%] h-72 w-[115%] rotate-[-18deg] rounded-[50%] bg-white/[0.06]" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-lg flex-col px-6 pb-7 pt-4">
        <header className="flex items-center justify-between">
          <button
            type="button"
            aria-label="Abrir menu"
            onClick={() => setError("Menu da demonstração.")}
            className="grid size-10 place-items-center rounded-full text-white/95 transition-colors hover:bg-white/10"
          >
            <Menu className="size-7" strokeWidth={1.8} />
          </button>

          <div className="flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-full bg-white text-sm font-black text-brand-red shadow-sm">
              B
            </span>
            <span className="text-xl font-bold tracking-tight">bradesco</span>
          </div>

          <button
            type="button"
            aria-label="Notificações"
            onClick={() => setError("Não há novas notificações na demonstração.")}
            className="relative grid size-10 place-items-center rounded-full transition-colors hover:bg-white/10"
          >
            <Bell className="size-6" strokeWidth={1.8} />
            <span className="absolute right-1 top-1 size-2.5 rounded-full bg-[#58c85a] ring-2 ring-brand-red" />
          </button>
        </header>

        <div className="mt-2 text-center text-[11px] font-medium tracking-wide text-white/80">
          empresas e negócios
        </div>

        <section className="mt-28">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <h1 className="truncate text-[24px] font-bold leading-tight">{account.holder}</h1>
              <div className="mt-4 flex items-center gap-7 text-[16px] font-semibold">
                <span>Agência {maskedBranch(account.branch)}</span>
                <span>Conta {maskedAccount(account.number)}</span>
              </div>
            </div>
            <button
              type="button"
              aria-label="Selecionar conta"
              onClick={() => setError("Esta é a única conta cadastrada na demonstração.")}
              className="shrink-0 p-2 text-white/95"
            >
              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m7 10 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {step.name === "home" && (
            <>
              <button
                type="button"
                onClick={startPin}
                className="mt-40 w-full rounded-full bg-white py-4 text-base font-bold text-brand-red shadow-[0_8px_25px_rgba(0,0,0,0.16)] transition-transform active:scale-[0.99]"
              >
                Entrar
              </button>

              <button
                type="button"
                onClick={() => setError("Nenhuma outra conta está cadastrada nesta demonstração.")}
                className="mx-auto mt-7 block text-[16px] font-semibold text-white underline underline-offset-4"
              >
                Acessar outra conta
              </button>
            </>
          )}

          {step.name === "pin" && (
            <form
              autoComplete="off"
              className="mt-12 rounded-3xl bg-white p-5 text-card-foreground shadow-2xl"
              onSubmit={(event) => {
                event.preventDefault();
                submitPin();
              }}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">Digite sua senha</h2>
                <button type="button" onClick={() => setStep({ name: "home" })} aria-label="Voltar">
                  <X className="size-5 text-muted-foreground" />
                </button>
              </div>
              <input
                type="password"
                name="demo-access-pin"
                autoComplete="new-password"
                inputMode="numeric"
                autoFocus
                maxLength={6}
                value={pin}
                onChange={(event) => setPin(event.target.value.replace(/\D/g, ""))}
                className={input}
                aria-label="Senha"
              />
              <button
                type="submit"
                className="mt-4 w-full rounded-full bg-primary py-3.5 font-bold text-primary-foreground"
              >
                Continuar
              </button>
            </form>
          )}

          {step.name === "bio" && (
            <div className="mt-12 flex flex-col items-center rounded-3xl bg-white p-7 text-card-foreground shadow-2xl">
              <Fingerprint className="size-14 animate-pulse text-primary" aria-hidden />
              <p className="mt-3 font-semibold">Lendo biometria…</p>
            </div>
          )}

          {step.name === "code" && (
            <form
              className="mt-12 rounded-3xl bg-white p-5 text-card-foreground shadow-2xl"
              onSubmit={(event) => {
                event.preventDefault();
                submitCode();
              }}
            >
              <h2 className="text-lg font-bold">
                {step.purpose === "unlock" ? "Desbloquear conta" : "Chave de segurança"}
              </h2>
              <p className="mt-2 rounded-xl bg-secondary px-3 py-3 text-sm text-secondary-foreground">
                Código simulado: <strong>{step.code}</strong>
              </p>
              <input
                inputMode="numeric"
                autoFocus
                maxLength={6}
                value={typed}
                onChange={(event) => setTyped(event.target.value.replace(/\D/g, ""))}
                className={input}
                aria-label="Código de verificação"
              />
              <button
                type="submit"
                className="mt-4 w-full rounded-full bg-primary py-3.5 font-bold text-primary-foreground"
              >
                Confirmar
              </button>
            </form>
          )}

          {error && (
            <p role="alert" className="mx-auto mt-5 max-w-sm text-center text-sm font-medium text-white/95">
              {error}
            </p>
          )}
        </section>

        <div className="mt-auto">
          {step.name === "home" && (
            <div className="mb-3 grid grid-cols-4 border-t border-white/30 pt-4">
              <button
                type="button"
                onClick={securityAction}
                className="flex min-h-[96px] flex-col items-center justify-center gap-2 border-r border-white/30 text-center"
              >
                {security.locked ? <LockOpen className="size-8" strokeWidth={1.8} /> : <Lock className="size-8" strokeWidth={1.8} />}
                <span className="text-[15px] font-semibold leading-tight">
                  Chave de<br />segurança
                </span>
              </button>

              <button
                type="button"
                onClick={() => void biometric()}
                className="flex min-h-[96px] flex-col items-center justify-center gap-2 border-r border-white/30 text-center"
              >
                <Fingerprint className="size-8" strokeWidth={1.8} />
                <span className="text-[15px] font-semibold leading-tight">
                  {faceRegistered ? <>Entrar com<br />facial</> : <>Cadastrar<br />facial</>}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setError("BIA está disponível como demonstração visual.")}
                className="flex min-h-[96px] flex-col items-center justify-center gap-2 border-r border-white/30 text-center"
              >
                <MessageCircle className="size-8" strokeWidth={1.8} />
                <span className="text-[15px] font-semibold">BIA</span>
              </button>

              <button
                type="button"
                onClick={() => setError("Pix será acessado depois da entrada na conta.")}
                className="flex min-h-[96px] flex-col items-center justify-center gap-2 text-center"
              >
                <Grid2X2 className="size-8" strokeWidth={1.8} />
                <span className="text-[15px] font-semibold">PIX</span>
              </button>
            </div>
          )}

          <div className="mx-auto mt-2 h-1.5 w-28 rounded-full bg-white/80" />
        </div>
      </div>
    </div>
  );
}
