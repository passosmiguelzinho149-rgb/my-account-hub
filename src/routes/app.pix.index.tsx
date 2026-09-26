import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Bell, ClipboardCopy, FileText, KeyRound, QrCode, ScanLine,
  SlidersHorizontal, Star, UserRound, Hand, ArrowLeftRight,
} from "lucide-react";
import { SubHeader } from "@/components/app/SubHeader";

export const Route = createFileRoute("/app/pix/")({
  head: () => ({ meta: [{ title: "Pix — Conta Empresas" }] }),
  component: PixHub,
});

function PixHub() {
  const card = "flex items-center gap-3 rounded-2xl border border-border/30 bg-white p-4 text-left shadow-[0_6px_16px_rgba(25,35,70,0.10)]";
  const tile = "flex min-h-[150px] flex-col items-start justify-center gap-3 rounded-2xl border border-border/30 bg-white p-4 shadow-[0_6px_16px_rgba(25,35,70,0.10)]";
  return (
    <>
      <SubHeader title="Pix" variant="deep" compactActions />
      <main className="mx-auto w-full max-w-[430px] bg-background px-4 pb-8 pt-4">
        <Link to="/app/pix/enviar" className="block rounded-2xl border border-border/30 bg-white p-5 shadow-[0_6px_16px_rgba(25,35,70,0.10)]">
          <p className="text-lg font-semibold">Para quem você quer transferir?</p>
          <p className="mt-2 text-base leading-relaxed text-muted-foreground">Pode ser o nome do contato ou uma chave Pix</p>
        </Link>

        <div className="mt-3 grid grid-cols-2 divide-x divide-border rounded-2xl border border-border/30 bg-white shadow-[0_6px_16px_rgba(25,35,70,0.10)]">
          <Link to="/app/pix/enviar" className="flex min-h-[132px] items-center gap-3 p-5">
            <Star className="size-10 shrink-0 text-[#313878]" strokeWidth={1.5} />
            <span className="text-lg font-medium leading-tight">Escolher um contato</span>
          </Link>
          <Link to="/app/pix/enviar" className="flex min-h-[132px] items-center gap-3 p-5">
            <UserRound className="size-10 shrink-0 text-[#313878]" strokeWidth={1.5} />
            <span className="text-lg font-medium leading-tight">Digitar agência e conta</span>
          </Link>
        </div>

        <h2 className="mt-8 text-[22px] font-medium">Transferir, pagar e receber</h2>
        <div className="mt-3 grid grid-cols-3 gap-3">
          <Link to="/app/pix/enviar" className={tile}><ClipboardCopy className="size-9 text-[#313878]" strokeWidth={1.5}/><span className="text-base font-medium leading-snug">Pix Copia e Cola</span></Link>
          <Link to="/app/pix/enviar" className={tile}><ScanLine className="size-9 text-[#313878]" strokeWidth={1.5}/><span className="text-base font-medium leading-snug">Ler um QR Code</span></Link>
          <Link to="/app/pix/receber" className={tile}><ArrowLeftRight className="size-9 text-[#313878]" strokeWidth={1.5}/><span className="text-base font-medium leading-snug">Receber por QR Code</span></Link>
        </div>

        <h2 className="mt-8 text-[22px] font-medium">Mais serviços</h2>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <Link to="/app/pix/historico" className={card}><FileText className="size-6 text-[#313878]"/><span className="font-medium">Extrato Pix</span></Link>
          <Link to="/app/pix/limites" className={card}><SlidersHorizontal className="size-6 text-[#313878]"/><span className="font-medium">Limites Pix</span></Link>
          <Link to="/app/pix/chaves" className={card}><KeyRound className="size-6 text-[#313878]"/><span className="font-medium">Chaves Pix</span></Link>
          <Link to="/app/pix/enviar" className={card}><Star className="size-6 text-[#313878]"/><span className="font-medium">Gerenciar contatos</span></Link>
          <Link to="/app/pix/historico" className={card}><Hand className="size-6 text-[#313878]"/><span className="font-medium">Contestações</span></Link>
          <Link to="/app/pix/historico" className={card}><Bell className="size-6 text-[#313878]"/><span className="font-medium">Notificações Pix</span></Link>
        </div>
      </main>
    </>
  );
}
