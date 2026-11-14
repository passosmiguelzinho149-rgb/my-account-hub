import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowDownLeft, ArrowUpRight, ClipboardCopy, KeyRound, QrCode, ScanLine, X, History, SlidersHorizontal } from "lucide-react";
import { SubHeader } from "@/components/app/SubHeader";

export const Route = createFileRoute("/app/pix/")({ head: () => ({ meta: [{ title: "Pix — Bradesco Empresas" }] }), component: PixHub });

function PixHub() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [scanMessage, setScanMessage] = useState("");
  const detectorRef = useRef<{ detect: (source: CanvasImageSource) => Promise<Array<{ rawValue?: string }>> } | null>(null);
  const scanningRef = useRef(false);
  const closeScanner = () => { streamRef.current?.getTracks().forEach((track) => track.stop()); streamRef.current = null; scanningRef.current = false; setScannerOpen(false); };
  const openScanner = async () => {
    setCameraError(""); setScanMessage(""); setScannerOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" } }, audio: false });
      streamRef.current = stream;
      const Ctor = (window as unknown as { BarcodeDetector?: new (options: { formats: string[] }) => { detect: (source: CanvasImageSource) => Promise<Array<{ rawValue?: string }>> } }).BarcodeDetector;
      detectorRef.current = Ctor ? new Ctor({ formats: ["qr_code"] }) : null;
      requestAnimationFrame(() => { if (videoRef.current) { videoRef.current.srcObject = stream; void videoRef.current.play(); } });
    } catch { setCameraError("Não foi possível abrir a câmera. Verifique a permissão no navegador."); }
  };
  useEffect(() => {
    if (!scannerOpen || !detectorRef.current) return;
    scanningRef.current = true; let timer = 0;
    const scan = async () => { if (!scanningRef.current) return; const video = videoRef.current; if (video && video.readyState >= 2 && detectorRef.current) { try { const codes = await detectorRef.current.detect(video); if (codes[0]?.rawValue) { setScanMessage("QR Code identificado. Confira os dados antes de continuar."); scanningRef.current = false; return; } } catch {} } timer = window.setTimeout(scan, 350); };
    void scan(); return () => { scanningRef.current = false; window.clearTimeout(timer); };
  }, [scannerOpen]);
  useEffect(() => () => streamRef.current?.getTracks().forEach((track) => track.stop()), []);
  const actions = [
    { title: "Enviar Pix", desc: "Transferir por chave", icon: ArrowUpRight, to: "/app/pix/enviar" as const },
    { title: "Receber Pix", desc: "Gerar cobrança", icon: ArrowDownLeft, to: "/app/pix/receber" as const },
    { title: "Ler QR Code", desc: "Pagar com a câmera", icon: ScanLine, action: () => void openScanner() },
    { title: "Minhas chaves", desc: "Gerenciar chaves", icon: KeyRound, to: "/app/pix/chaves" as const },
    { title: "Copia e Cola", desc: "Usar código Pix", icon: ClipboardCopy, to: "/app/pix/enviar" as const },
  ];
  return <>
    <SubHeader title="Pix" variant="deep" compactActions/>
    <main className="mx-auto min-h-[70vh] w-full max-w-[430px] bg-white px-4 pb-10 pt-5 text-[#292A30]">
      <div className="mb-5"><p className="text-xl font-bold">O que você deseja fazer?</p><p className="mt-1 text-sm text-[#777982]">Escolha uma opção para continuar.</p></div>
      <div className="grid grid-cols-2 gap-3">
        {actions.map(({title,desc,icon:Icon,to,action}) => {
          const content = <><span className="grid size-12 place-items-center rounded-full bg-[#F1F1F3] text-[#CC092F]"><Icon className="size-6" strokeWidth={1.8}/></span><span className="block text-sm font-bold">{title}</span><span className="block text-xs text-[#777982]">{desc}</span></>;
          return to ? <Link key={title} to={to} className="flex min-h-[142px] flex-col items-start justify-center gap-2 rounded-2xl border border-[#ECECEF] bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,.035)]">{content}</Link> : <button key={title} type="button" onClick={action} className="flex min-h-[142px] flex-col items-start justify-center gap-2 rounded-2xl border border-[#ECECEF] bg-white p-4 text-left shadow-[0_2px_8px_rgba(0,0,0,.035)]">{content}</button>;
        })}
      </div>
      <div className="mt-6 space-y-2">
        <Link to="/app/pix/historico" className="flex items-center justify-between rounded-xl border border-[#ECECEF] p-4 text-sm font-semibold"><span className="flex items-center gap-3"><History className="size-5 text-[#CC092F]"/>Extrato Pix</span><span className="text-[#85868D]">›</span></Link>
        <Link to="/app/pix/limites" className="flex items-center justify-between rounded-xl border border-[#ECECEF] p-4 text-sm font-semibold"><span className="flex items-center gap-3"><SlidersHorizontal className="size-5 text-[#CC092F]"/>Limites Pix</span><span className="text-[#85868D]">›</span></Link>
      </div>
    </main>
    {scannerOpen && <div className="fixed inset-0 z-[100] bg-black text-white"><video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 h-full w-full object-cover"/><div className="absolute inset-x-0 top-0 flex items-center justify-between px-5 pt-8"><button type="button" onClick={closeScanner} className="grid size-11 place-items-center rounded-full bg-black/40" aria-label="Fechar câmera"><X className="size-6"/></button><p className="font-semibold">Ler QR Code Pix</p><span className="size-11"/></div><div className="absolute inset-0 grid place-items-center"><div className="relative size-[280px] rounded-3xl border-2 border-white/80"><span className="absolute inset-x-4 top-1/2 h-0.5 bg-[#CC092F]"/></div></div><div className="absolute inset-x-0 bottom-0 bg-black/70 px-5 pb-10 pt-6 text-center"><QrCode className="mx-auto size-7"/><p className="mt-2 font-semibold">Aponte a câmera para o QR Code</p>{cameraError && <p className="mt-3 text-sm text-red-200">{cameraError}</p>}{scanMessage && <p className="mt-3 text-sm">{scanMessage}</p>}</div></div>}
  </>;
}
