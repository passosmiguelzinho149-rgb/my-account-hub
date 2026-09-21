import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ChevronRight, Camera, LogOut } from "lucide-react";
import { BrandHeader } from "@/components/app/BrandHeader";
import { account } from "@/lib/mock-data";
import { useSession } from "@/lib/session";

export const Route = createFileRoute("/app/perfil")({
  head: () => ({
    meta: [
      { title: "Perfil — Conta Empresas (demo)" },
      {
        name: "description",
        content: "Dados pessoais, dados da empresa, dados da conta e preferências de privacidade.",
      },
      { property: "og:title", content: "Perfil — Conta Empresas (demo)" },
      {
        property: "og:description",
        content: "Dados pessoais, da empresa, da conta e preferências de privacidade.",
      },
    ],
  }),
  component: PerfilScreen,
});

const dataCards = [
  { slug: "dados-pessoais", label: "Dados pessoais" },
  { slug: "dados-da-empresa", label: "Dados da empresa" },
  { slug: "dados-da-conta", label: "Dados da conta" },
] as const;

const menuItems = [
  { slug: "falar-com-o-gerente", label: "Falar com o Gerente" },
  { slug: "sobre-o-app", label: "Sobre o App" },
  { slug: "privacidade", label: "Gerenciar dados e privacidade", dedicated: true },
  { slug: "propostas-da-empresa", label: "Propostas da empresa" },
] as const;

function PerfilScreen() {
  const { signOut } = useSession();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    void navigate({ to: "/", replace: true });
  };

  return (
    <>
      <BrandHeader>
        <div className="px-4 pb-14">
          <div className="flex items-center gap-3">
            <span className="relative shrink-0">
              <span className="grid size-14 place-items-center rounded-full bg-primary-foreground/20 text-lg font-bold">
                CO
              </span>
              <span className="absolute -right-1 -bottom-1 grid size-6 place-items-center rounded-full bg-card text-brand-red">
                <Camera className="size-3.5" aria-hidden />
              </span>
            </span>
            <div className="min-w-0">
              <h1 className="text-base font-bold break-words">{account.holder}</h1>
              <p className="text-sm break-words opacity-90">{account.company}</p>
              <p className="text-sm opacity-90">CNPJ: {account.cnpj}</p>
            </div>
          </div>
        </div>
      </BrandHeader>

      <main className="-mt-10 px-4 pb-6">
        <ul className="grid grid-cols-3 gap-3">
          {dataCards.map((c) => (
            <li key={c.slug}>
              <Link
                to="/app/conta/$slug"
                params={{ slug: c.slug }}
                className="flex h-full items-center justify-center rounded-xl bg-card px-2 py-5 text-center text-sm font-medium shadow-card"
              >
                {c.label}
              </Link>
            </li>
          ))}
        </ul>

        <nav className="mt-5 overflow-hidden rounded-xl bg-card shadow-card">
          <ul className="divide-y divide-border">
            {menuItems.map((item) => (
              <li key={item.slug}>
                {"dedicated" in item ? (
                  <Link
                    to="/app/privacidade"
                    className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-4"
                  >
                    <span className="min-w-0 break-words">{item.label}</span>
                    <ChevronRight className="size-5 shrink-0 text-brand-red" aria-hidden />
                  </Link>
                ) : (
                  <Link
                    to="/app/conta/$slug"
                    params={{ slug: item.slug }}
                    className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-4"
                  >
                    <span className="min-w-0 break-words">{item.label}</span>
                    <ChevronRight className="size-5 shrink-0 text-brand-red" aria-hidden />
                  </Link>
                )}
              </li>
            ))}
            <li>
              <button
                type="button"
                onClick={handleSignOut}
                className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-4 text-left"
              >
                <span className="flex min-w-0 items-center gap-2 font-medium text-brand-red">
                  <LogOut className="size-5 shrink-0" aria-hidden />
                  Sair
                </span>
                <ChevronRight className="size-5 shrink-0 text-brand-red" aria-hidden />
              </button>
            </li>
          </ul>
        </nav>
      </main>
    </>
  );
}