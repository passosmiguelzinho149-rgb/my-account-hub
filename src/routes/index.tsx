import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Fingerprint, HelpCircle, Lock, LockOpen, Menu, X } from "lucide-react";
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
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#2638a8] via-[#4a2aa0] to-[#df202f] text-white">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-[34%] h-[42%] overflow-hidden">
        <div className="absolute -left-[15%] top-0 h-44 w-[130%] rotate-[9deg] rounded-[50%] bg-white/[0.055]" />
        <div className="absolute -left-[10%] top-20 h-48 w-[120%] rotate-[7deg] rounded-[50%] border-t border-white/[0.08]" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-lg flex-col px-5 pb-5 pt-4">
        <header className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <span className="grid size-10 place-items-center rounded-full bg-white text-base font-black text-[#2638a8] shadow-sm">B</span>
            <div className="leading-tight">
              <div className="text-xl font-bold tracking-tight">bradesco</div>
              <div className="text-xs font-medium text-white/85">empresas e negócios</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button type="button" aria-label="Ajuda" onClick={() => setError("Ajuda da demonstração.")} className="grid size-10 place-items-center rounded-full">
              <HelpCircle className="size-7" strokeWidth={1.8} />
            </button>
            <button type="button" aria-label="Notificações" onClick={() => setError("Não há novas notificações na demonstração.")} className="relative grid size-10 place-items-center rounded-full">
              <Bell className="size-7" strokeWidth={1.8} />
              <span className="absolute right-1 top-1 size-2.5 rounded-full bg-[#e22] ring-2 ring-[#4a2aa0]" />
            </button>
          </div>
        </header>

        <section className="mt-12">
          <h1 className="max-w-[360px] text-[26px] font-bold leading-tight">Olá, {account.holder}</h1>
          <p className="mt-2 text-[15px] font-medium text-white/90">{account.company}</p>
          <p className="mt-1 text-[15px] text-white/90">CNPJ: {account.cnpj}</p>

          <div className="mt-5 rounded-[22px] bg-gradient-to-r from-white/15 to-white/25 p-5 shadow-xl backdrop-blur-sm">
            <div className="flex flex-wrap items-center gap-x-8 gap-y-1 text-[16px] font-semibold">
              <span>Agência: {account.branch}</span>
              <span>Conta: {account.number}</span>
            </div>
            <BalanceCard showAccount={false} className="mt-4 bg-transparent p-0 shadow-none" />
          </div>
        </section>

        <main className="relative mt-5 flex-1 rounded-t-[30px] bg-[#f7f7f8] px-0 pt-5 text-[#202124] shadow-[0_-12px_40px_rgba(0,0,0,.08)]">
          <section className="px-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[20px] font-bold">Resumo diário</h2>
              <span className="text-sm text-gray-500">{now.toLocaleDateString("pt-BR")}</span>
            </div>
            <div className="mt-3 rounded-2xl bg-white p-4 shadow-[0_5px_18px_rgba(20,30,60,.08)]">
              <dl className="grid grid-cols-2 gap-5">
                <div>
                  <dt className="text-sm text-gray-500">Entradas</dt>
                  <dd className="mt-1 text-lg font-bold">{formatBRL(inflow)}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Saídas</dt>
                  <dd className="mt-1 text-lg font-bold">{formatBRL(outflow)}</dd>
                </div>
              </dl>
              <Link to="/app/extrato" className="mt-3 inline-flex items-center font-bold text-[#2638a8]">Consultar extrato <span className="ml-1">›</span></Link>
            </div>
          </section>

          <section className="mt-5 px-4">
            <h2 className="text-[20px] font-bold">Soluções para sua empresa</h2>
            <Link to="/app/pix" className="mt-3 flex min-h-[142px] overflow-hidden rounded-[22px] bg-white shadow-[0_5px_18px_rgba(20,30,60,.08)]">
              <div className="w-[34%] bg-gradient-to-br from-[#e6edf4] via-[#dce5e1] to-[#f1ddd8]">
                <div className="flex h-full items-center justify-center text-[#2a3bb0]">
                  <span className="text-5xl font-black">✦</span>
                </div>
              </div>
              <div className="flex flex-1 flex-col justify-center p-4">
                <div className="flex items-center gap-2">
                  <span className="grid size-8 place-items-center rounded-lg bg-[#18b88b]/15 text-[#159d78] font-black">◆</span>
                  <h3 className="text-xl font-bold">Pix</h3>
                </div>
                <p className="mt-2 text-sm leading-snug text-gray-600">Pague, receba e transfira a qualquer hora do dia.</p>
              </div>
            </Link>
          </section>

          <section className="mt-6 px-4 pb-28">
            <h2 className="text-[20px] font-bold">Acesso rápido</h2>
            <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
              {favorites.slice(0, 6).map(({ label, Icon, to, ...rest }) => (
                <Link
                  key={label}
                  to={to}
                  params={"slug" in rest ? { slug: rest.slug } : {}}
                  className="flex min-w-[92px] flex-col items-center rounded-2xl bg-white p-4 shadow-[0_5px_18px_rgba(20,30,60,.08)]"
                >
                  <Icon className="size-8 text-[#2638a8]" strokeWidth={1.7} />
                  <span className="mt-2 text-center text-xs font-semibold leading-tight">{label}</span>
                </Link>
              ))}
            </div>
          </section>
        </main>

        <div className="fixed bottom-0 left-1/2 z-20 w-full max-w-lg -translate-x-1/2 border-t border-gray-200 bg-white/95 px-2 py-2 text-gray-700 backdrop-blur">
          <div className="grid grid-cols-4">
            <Link to="/app" className="flex flex-col items-center gap-1 py-1 text-[#2638a8]"><span className="text-xl">⌂</span><span className="text-[11px] font-semibold">Início</span></Link>
            <Link to="/app/servicos" className="flex flex-col items-center gap-1 py-1"><span className="text-xl">◌</span><span className="text-[11px] font-semibold">Chat</span></Link>
            <Link to="/app/servicos" className="flex flex-col items-center gap-1 py-1"><span className="text-xl">◉</span><span className="text-[11px] font-semibold">Serviços</span></Link>
            <Link to="/app/perfil" className="flex flex-col items-center gap-1 py-1"><span className="text-xl">♙</span><span className="text-[11px] font-semibold">Perfil</span></Link>
          </div>
        </div>
      </div>
    </div>
  );t { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Bell, Fingerprint, HelpCircle, Lock, LockOpen, Menu, X } from "lucide-react";
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
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#2638a8] via-[#4a2aa0] to-[#df202f] text-primary-foreground">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -bottom-24 -left-20 h-72 w-[125%] rotate-[-12deg] rounded-[50%] bg-white/10" />
        <div className="absolute -bottom-16 -right-28 h-64 w-[120%] rotate-[-16deg] rounded-[50%] border-t border-white/10 bg-white/[0.04]" />
        <div className="absolute bottom-[-120px] left-[-18%] h-72 w-[115%] rotate-[-18deg] rounded-[50%] bg-white/[0.06]" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-lg flex-col px-5 pb-5 pt-5">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="grid size-10 place-items-center rounded-full bg-white text-sm font-black text-[#2638a8] shadow-sm">B</span>
            <div className="leading-tight">
              <span className="block text-xl font-bold tracking-tight">bradesco</span>
              <span className="block text-xs font-medium text-white/85">empresas e negócios</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" aria-label="Ajuda" onClick={() => setError("Ajuda da demonstração.")} className="grid size-10 place-items-center rounded-full">
              <HelpCircle className="size-7" strokeWidth={1.8} />
            </button>
            <button type="button" aria-label="Menu" onClick={() => setError("Menu da demonstração.")} className="grid size-10 place-items-center rounded-full">
              <Menu className="size-7" strokeWidth={1.8} />
            </button>
          </div>
        </header>

        <section className="mt-28">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-[25px] font-bold leading-tight">Uma nova experiência<br />para o seu negócio</h1>
            </div>
            <button type="button" aria-label="Selecionar conta" onClick={() => setError("Esta é a única conta cadastrada na demonstração.")} className="shrink-0 p-2 text-white/95">
              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="m7 10 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </div>

          {step.name === "home" && (
            <div className="mt-28 rounded-[22px] bg-white p-5 text-gray-800 shadow-2xl">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[20px] font-medium">CNPJ •••/••••-98</p>
                  <p className="mt-1 text-sm text-gray-500">{account.holder}</p>
                </div>
                <button type="button" aria-label="Remover conta" onClick={() => setError("Esta conta é a única cadastrada na demonstração.")} className="text-sm font-medium text-gray-600">Remover ↻</button>
              </div>
              <button type="button" onClick={startPin} className="mt-4 w-full rounded-xl bg-[#2f35ad] py-3.5 text-base font-bold text-white shadow-md">
                Acessar conta
              </button>
              {faceRegistered && (
                <button type="button" onClick={() => void biometric()} className="mt-3 w-full rounded-xl border border-[#2f35ad] py-3 text-sm font-bold text-[#2f35ad]">
                  Entrar com facial
                </button>
              )}
            </div>
          )}

          {step.name === "pin" && (
            <form
              autoComplete="off"
              className="mt-10 rounded-3xl bg-white p-5 text-card-foreground shadow-2xl"
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
            <div className="mb-2 border-t border-white/30 pt-4">
              <button type="button" onClick={securityAction} className="mx-auto flex w-full max-w-md items-center justify-center gap-3 rounded-xl border border-white/70 bg-white/10 py-3.5 text-base font-semibold">
                {security.locked ? <LockOpen className="size-6" strokeWidth={1.8} /> : <Lock className="size-6" strokeWidth={1.8} />}
                Chave de segurança
              </button>
              {!faceRegistered && (
                <button type="button" onClick={() => void biometric()} className="mx-auto mt-2 block text-sm font-semibold text-white underline underline-offset-4">
                  Cadastrar acesso facial
                </button>
              )}
            </div>
          )}

          <div className="mx-auto mt-2 h-1.5 w-28 rounded-full bg-white/80" />
        </div>
      </div>
    </div>
  );
}
