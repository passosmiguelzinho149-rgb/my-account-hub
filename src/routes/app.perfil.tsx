import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { Building2, Camera, ChevronRight, FileText, LogOut, UserRound, WalletCards } from "lucide-react";
import { BrandHeader } from "@/components/app/BrandHeader";
import { account } from "@/lib/mock-data";
import { useSession } from "@/lib/session";

export const Route = createFileRoute("/app/perfil")({
  head: () => ({
    meta: [
      { title: "Perfil — Conta Empresas" },
      { name: "description", content: "Dados pessoais, dados da empresa, dados da conta e preferências de privacidade." },
      { property: "og:title", content: "Perfil — Conta Empresas" },
      { property: "og:description", content: "Dados pessoais, da empresa, da conta e preferências de privacidade." },
    ],
  }),
  component: PerfilScreen,
});

const dataCards = [
  { slug: "dados-pessoais", label: "Dados pessoais", icon: UserRound },
  { slug: "dados-da-empresa", label: "Dados da empresa", icon: FileText },
  { slug: "dados-da-conta", label: "Dados da conta", icon: WalletCards },
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

  useEffect(() => { setProfilePhoto(window.localStorage.getItem("profile-photo")); }, []);

  const handlePhoto = (event: ChangeEvent<HTMLInputElement>) => {
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

  const handleSignOut = () => { signOut(); void navigate({ to: "/", replace: true }); };

  return (
    <div className="min-h-full bg-[#f4f4f2]">
      <BrandHeader>
        <div className="px-5 pb-16 pt-2">
          <div className="flex items-center gap-4 border-b border-white/25 pb-6">
            <button type="button" onClick={() => fileInputRef.current?.click()} className="relative shrink-0" aria-label="Alterar foto do perfil">
              {profilePhoto ? <img src={profilePhoto} alt="Foto do perfil" className="size-14 rounded-xl border border-white/30 object-cover" /> : <span className="grid size-14 place-items-center rounded-xl border border-white/25 bg-white/10"><UserRound className="size-7 text-white/80" /></span>}
              <span className="absolute -bottom-1 -right-1 grid size-6 place-items-center rounded-full bg-white text-[#293d91] shadow"><Camera className="size-3.5" aria-hidden /></span>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
            </button>
            <div className="min-w-0 text-white">
              <h1 className="truncate text-[17px] font-bold uppercase tracking-wide">{account.holder}</h1>
              <p className="mt-1 truncate text-[13px] font-medium text-white/85">{account.company}</p>
              <p className="mt-1 text-[12px] text-white/75">CNPJ: {account.cnpj}</p>
            </div>
          </div>
        </div>
      </BrandHeader>

      <main className="mx-auto w-full max-w-[430px] px-4 pb-8">
        <ul className="-mt-11 grid grid-cols-3 gap-2.5">
          {dataCards.map((c) => {
            const Icon = c.icon;
            return <li key={c.slug}>
              <Link to="/app/conta/$slug" params={{ slug: c.slug }} className="flex min-h-[142px] w-full flex-col items-start justify-center rounded-[14px] bg-white px-4 py-4 text-left shadow-[0_7px_18px_rgba(20,30,60,.16)]">
                <Icon className="mb-4 size-7 text-[#6c7182]" strokeWidth={1.35} />
                <span className="text-[16px] leading-tight text-[#33343a]">{c.label}</span>
              </Link>
            </li>;
          })}
        </ul>

        <nav className="mt-10 overflow-hidden rounded-[18px] bg-white px-5 shadow-[0_7px_22px_rgba(30,35,55,.12)]">
          <ul className="divide-y divide-[#e5e5e5]">
            {menuItems.map((item) => (
              <li key={item.slug}>
                {"dedicated" in item ? (
                  <Link to={item.dedicated} className="grid min-h-[84px] grid-cols-[minmax(0,1fr)_auto] items-center gap-3 text-[17px] text-[#292a2f]">
                    <span className="min-w-0">{item.label}</span><ChevronRight className="size-6 shrink-0 text-[#365ac8]" strokeWidth={1.7} />
                  </Link>
                ) : (
                  <Link to="/app/conta/$slug" params={{ slug: item.slug }} className="grid min-h-[84px] grid-cols-[minmax(0,1fr)_auto] items-center gap-3 text-[17px] text-[#292a2f]">
                    <span className="min-w-0">{item.label}</span><ChevronRight className="size-6 shrink-0 text-[#365ac8]" strokeWidth={1.7} />
                  </Link>
                )}
              </li>
            ))}
            <li>
              <button type="button" onClick={handleSignOut} className="grid min-h-[84px] w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-3 text-left text-[17px] text-[#292a2f]">
                <span>Sair</span><ChevronRight className="size-6 shrink-0 text-[#365ac8]" strokeWidth={1.7} />
              </button>
            </li>
          </ul>
        </nav>
      </main>
    </div>
  );
}
