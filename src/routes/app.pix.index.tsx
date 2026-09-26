import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Bell, ClipboardCopy, FileText, KeyRound, QrCode, ScanLine, X, Zap,
  SlidersHorizontal, Star, UserRound, Hand, ArrowLeftRight,
} from "lucide-react";
import { SubHeader } from "@/components/app/SubHeader";

export const Route = createFileRoute("/app/pix/")({
  head: () => ({ meta: [{ title: "Pix — Conta Empresas" }] }),
  component: PixHub,
});

function PixHub() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [cameraError, setCameraError] = useState("");

  const closeScanner = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setScannerOpen(false);
  };

  const openScanner = async () => {
    setCameraError("");
    setScannerOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" } }, audio: false });
      streamRef.current = stream;
      requestAnimationFrame(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          void videoRef.current.play();
        }
      });
    } catch {
      setCameraError("Não foi possível abrir a câmera. Autorize o acesso à câmera no navegador.");
    }
  };

  useEffect(() => () => streamRef.current?.getTracks().forEach((track) => track.stop()), []);
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
          <button type="button" onClick={() => void openScanner()} className={tile}><ScanLine className="size-9 text-[#313878]" strokeWidth={1.5}/><span className="text-base font-medium leading-snug">Ler um QR Code</span></button>
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

      {scannerOpen && (
        <div className="fixed inset-0 z-[100] bg-black text-white">
          <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-x-0 top-0 flex items-center justify-between bg-gradient-to-b from-black/70 to-transparent px-5 pb-12 pt-[calc(1rem+env(safe-area-inset-top))]">
            <button type="button" onClick={closeScanner} aria-label="Fechar câmera" className="grid size-11 place-items-center rounded-full bg-black/35"><X className="size-7" /></button>
            <p className="font-semibold">Ler QR Code Pix</p>
            <span className="size-11" />
          </div>
          <div className="absolute inset-0 grid place-items-center px-10">
            <div className="relative aspect-square w-full max-w-[290px]">
              <span className="absolute left-0 top-0 size-14 rounded-tl-3xl border-l-4 border-t-4 border-white" />
              <span className="absolute right-0 top-0 size-14 rounded-tr-3xl border-r-4 border-t-4 border-white" />
              <span className="absolute bottom-0 left-0 size-14 rounded-bl-3xl border-b-4 border-l-4 border-white" />
              <span className="absolute bottom-0 right-0 size-14 rounded-br-3xl border-b-4 border-r-4 border-white" />
              <span className="absolute left-4 right-4 top-1/2 h-0.5 bg-red-500 shadow-[0_0_10px_rgba(239,68,68,.9)]" />
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-6 pb-[calc(2rem+env(safe-area-inset-bottom))] pt-20 text-center">
            <QrCode className="mx-auto size-7" />
            <p className="mt-3 font-semibold">Aponte a câmera para o QR Code</p>
            <p className="mt-1 text-sm text-white/80">Mantenha o código dentro da área indicada.</p>
            {cameraError && <p className="mx-auto mt-4 max-w-sm rounded-xl bg-red-600/90 p-3 text-sm">{cameraError}</p>}
          </div>
        </div>
      )}
    </>
  );
}
