import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
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
  { slug: "privacidade", label: "Gerenciar dados e privacidade", dedicated: "/app/privacidade" },
  { slug: "seguranca", label: "Segurança, senha e dispositivos", dedicated: "/app/seguranca" },
  { slug: "propostas-da-empresa", label: "Propostas da empresa" },
] as const;

function PerfilScreen() {
  const { signOut } = useSession();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

  useEffect(() => {
    setProfilePhoto(window.localStorage.getItem("profile-photo"));
  }, []);

  const handlePhoto = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      const value = typeof reader.result === "string" ? reader.result : null;
      if (!value) return;
      setProfilePhoto(value);
      try { window.localStorage.setItem("profile-photo", value); } catch {}
    };
    reader.readAsDataURL(file);
  };

  const handleSignOut = () => {
    signOut();
    void navigate({ to: "/", replace: true });
  };

  return (
    <>
      <BrandHeader>
        <div className="px-4 pb-14">
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => fileInputRef.current?.click()} className="relative shrink-0" aria-label="Alterar foto do perfil">
              {profilePhoto ? (
                <img src={profilePhoto} alt="Foto do perfil" className="size-16 rounded-full border-2 border-white/70 object-cover" />
              ) : (
                <span className="grid size-16 place-items-center rounded-full bg-primary-foreground/20 text-lg font-bold">CO</span>
              )}
              <span className="absolute -right-1 -bottom-1 grid size-7 place-items-center rounded-full bg-card text-brand-red shadow">
                <Camera className="size-4" aria-hidden />
              </span>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
            </button>
            <div className="min-w-0">
              <h1 className="text-base font-bold break-words">{account.holder}</h1>
              <p className="text-sm break-words opacity-90">{account.company}</p>
              <p className="text-sm opacity-90">CNPJ: {account.cnpj}</p>
            </div>
          </div>
        </div>
      </BrandHeader>

      <main className="px-4 pb-6 pt-2">
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {dataCards.map((c) => (
            <li key={c.slug}>
              <Link
                to="/app/conta/$slug"
                params={{ slug: c.slug }}
                className="flex min-h-16 w-full items-center justify-center rounded-xl bg-card px-4 py-4 text-center text-sm font-medium leading-snug shadow-card"
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
                    to={item.dedicated}
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