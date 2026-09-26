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
                name: account.holder.toLowerCase().replace(/\s+/g, "."),
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
    <div className="min-h-[100dvh] bg-[#f4f4f4] text-foreground">
      <section className="relative min-h-[62dvh] overflow-hidden bg-brand-gradient px-6 pb-24 pt-[calc(1.25rem+env(safe-area-inset-top))] text-white">
        <div aria-hidden className="absolute inset-0 opacity-30">
          <div className="absolute left-[10%] top-[30%] size-72 rounded-full border-[42px] border-white/10" />
          <div className="absolute -bottom-24 -right-16 size-80 rounded-full border-[50px] border-[#e81f4f]/40" />
        </div>

        <header className="relative flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/bradesco-symbol.svg" alt="" className="size-10 object-contain" />
            <div className="leading-tight">
              <p className="text-xl font-bold">bradesco</p>
              <p className="text-sm">empresas e negócios</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button type="button" aria-label="Ajuda" className="grid size-10 place-items-center rounded-full hover:bg-white/10">
              <span className="grid size-7 place-items-center rounded border border-white text-lg">?</span>
            </button>
            <button type="button" aria-label="Menu" className="grid size-10 place-items-center rounded-full hover:bg-white/10">
              <Menu className="size-7" />
            </button>
          </div>
        </header>

        <h1 className="relative mt-[clamp(7rem,23dvh,11rem)] max-w-[280px] text-[30px] font-extrabold leading-[1.08]">
          Uma nova experiência para o seu negócio
        </h1>
      </section>

      <main className="relative z-10 mx-auto -mt-16 w-full max-w-md px-5 pb-[calc(2rem+env(safe-area-inset-bottom))]">
        {step.name === "home" && (
          <section className="rounded-sm bg-white p-5 shadow-[0_5px_18px_rgba(0,0,0,0.18)]">
            <div className="flex flex-wrap items-center gap-2 text-[20px]">
              <span className="font-medium">CPF</span>
              <strong>••• 151 •••</strong>
              <button type="button" onClick={() => setError("Conta mantida neste acesso.")} className="ml-auto text-base text-muted-foreground">
                Remover ↻
              </button>
            </div>
            <button type="button" onClick={startPin} className="mt-5 w-full rounded-md bg-[#3f3ba5] py-3.5 text-lg font-bold text-white shadow">
              Acessar conta
            </button>
          </section>
        )}

        {step.name === "pin" && (
          <form className="rounded-xl bg-white p-5 shadow-xl" onSubmit={(e) => { e.preventDefault(); submitPin(); }}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Digite sua senha</h2>
              <button type="button" onClick={() => setStep({ name: "home" })}><X className="size-5" /></button>
            </div>
            <input type="password" inputMode="numeric" autoFocus maxLength={6} value={pin} onChange={(e) => setPin(e.target.value.replace(/\\D/g, ""))} className={input} />
            <button type="submit" className="mt-4 w-full rounded-md bg-[#3f3ba5] py-3.5 font-bold text-white">Continuar</button>
          </form>
        )}

        {step.name === "bio" && (
          <div className="rounded-xl bg-white p-7 text-center shadow-xl">
            <Fingerprint className="mx-auto size-14 animate-pulse text-primary" />
            <p className="mt-3 font-semibold">Lendo biometria…</p>
          </div>
        )}

        {step.name === "code" && (
          <form className="rounded-xl bg-white p-5 shadow-xl" onSubmit={(e) => { e.preventDefault(); submitCode(); }}>
            <h2 className="text-lg font-bold">{step.purpose === "unlock" ? "Desbloquear conta" : "Chave de segurança"}</h2>
            <p className="mt-2 rounded-lg bg-secondary p-3 text-sm">Código simulado: <strong>{step.code}</strong></p>
            <input inputMode="numeric" autoFocus maxLength={6} value={typed} onChange={(e) => setTyped(e.target.value.replace(/\\D/g, ""))} className={input} />
            <button type="submit" className="mt-4 w-full rounded-md bg-[#3f3ba5] py-3.5 font-bold text-white">Confirmar</button>
          </form>
        )}

        {error && <p role="alert" className="mt-4 text-center text-sm font-medium text-destructive">{error}</p>}

        <button type="button" onClick={securityAction} className="mt-[clamp(9rem,24dvh,14rem)] flex w-full items-center justify-center gap-3 rounded-lg border border-[#3f3ba5] bg-white py-4 font-semibold text-[#3f3ba5]">
          {security.locked ? <LockOpen className="size-6" /> : <Lock className="size-6" />}
          Chave de segurança
        </button>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <button type="button" onClick={() => void biometric()} className="rounded-lg border bg-white py-3 text-sm font-semibold text-[#3f3ba5]">
            {faceRegistered ? "Entrar com facial" : "Cadastrar facial"}
          </button>
          <button type="button" onClick={() => setError("Pix será acessado depois da entrada na conta.")} className="rounded-lg border bg-white py-3 text-sm font-semibold text-[#3f3ba5]">
            PIX
          </button>
        </div>
      </main>
    </div>
  );}
