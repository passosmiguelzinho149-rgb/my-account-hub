import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { CircleHelp, Menu, Fingerprint, Lock, RotateCw } from "lucide-react";
import { useSession } from "@/lib/session";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Acessar conta — Bradesco Empresas e Negócios (demo)" },
      {
        name: "description",
        content:
          "Protótipo de demonstração do app Bradesco Empresas e Negócios: acesso à conta, saldo, extrato e serviços.",
      },
      { property: "og:title", content: "Acessar conta — Bradesco Empresas e Negócios (demo)" },
      {
        property: "og:description",
        content: "Protótipo mobile de conta empresarial: saldo, extrato, serviços e perfil.",
      },
    ],
  }),
  component: LoginScreen,
});

function LoginScreen() {
  const { signedIn, hydrated, signIn } = useSession();
  const navigate = useNavigate();

  // Sessão simulada já ativa: vai direto para a área logada.
  useEffect(() => {
    if (hydrated && signedIn) void navigate({ to: "/app", replace: true });
  }, [hydrated, signedIn, navigate]);

  const enter = () => {
    signIn();
    void navigate({ to: "/app", replace: true });
  };

  return (
    <div className="bg-brand-gradient flex min-h-screen flex-col text-primary-foreground">
      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col px-4 pt-4 pb-6">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-card text-lg font-bold text-brand-red">
              B
            </span>
            <span className="min-w-0 leading-tight">
              <span className="block truncate text-lg font-bold">bradesco</span>
              <span className="block truncate text-xs opacity-80">empresas e negócios</span>
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-4">
            <CircleHelp className="size-6" aria-hidden />
            <Menu className="size-6" aria-hidden />
          </div>
        </div>

        <h1 className="mt-10 text-3xl leading-tight font-bold">
          Uma nova experiência
          <br />
          para o seu negócio
        </h1>

        <div className="flex-1" />

        <div className="rounded-2xl bg-card p-4 text-card-foreground shadow-card">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-secondary text-sm font-semibold text-secondary-foreground">
                CO
              </span>
              <span className="min-w-0 truncate font-medium">CPF ••• 151 •••</span>
            </div>
            <button
              type="button"
              className="flex shrink-0 items-center gap-1.5 text-sm font-medium text-primary"
            >
              Remover
              <RotateCw className="size-4" aria-hidden />
            </button>
          </div>
          <button
            type="button"
            onClick={enter}
            className="mt-4 w-full rounded-lg bg-primary py-3.5 text-base font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            Acessar conta
          </button>
        </div>

        <button
          type="button"
          onClick={enter}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border-2 border-primary bg-card py-3.5 text-base font-semibold text-primary"
        >
          <Fingerprint className="size-5" aria-hidden />
          Entrar com biometria
        </button>
        <button
          type="button"
          onClick={enter}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-card py-3.5 text-base text-card-foreground"
        >
          <Lock className="size-5" aria-hidden />
          Chave de segurança
        </button>
      </div>
    </div>
  );
}
