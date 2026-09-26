import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export function PwaInstallPrompt() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    const register = () => {
      navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {});
    };

    if (document.readyState === "complete") register();
    else window.addEventListener("load", register, { once: true });

    const handleInstall = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
      setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handleInstall);

    return () => {
      window.removeEventListener("load", register);
      window.removeEventListener("beforeinstallprompt", handleInstall);
    };
  }, []);

  if (!visible || !installEvent) return null;

  return (
    <div className="fixed inset-x-3 bottom-[calc(76px+env(safe-area-inset-bottom))] z-[100] mx-auto max-w-[430px] rounded-2xl border border-white/20 bg-[#171a3a]/95 p-4 text-white shadow-2xl backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/10 text-xl">
          📲
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-bold">Instalar Conta Empresas</p>
          <p className="mt-0.5 text-xs text-white/70">
            Adicione o app à tela inicial para abrir como aplicativo.
          </p>
        </div>
      </div>

      <div className="mt-3 flex gap-2">
        <button
          type="button"
          className="flex-1 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-[#29258e]"
          onClick={async () => {
            await installEvent.prompt();
            await installEvent.userChoice;
            setInstallEvent(null);
            setVisible(false);
          }}
        >
          Instalar
        </button>
        <button
          type="button"
          className="rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-white"
          onClick={() => setVisible(false)}
        >
          Agora não
        </button>
      </div>
    </div>
  );
}
