import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BottomNav } from "@/components/app/BottomNav";
import { PrivacyLock } from "@/components/app/PrivacyLock";
import { usePrivacyMode } from "@/lib/privacy-mode";
import { useSession } from "@/lib/session";

export const Route = createFileRoute("/app")({
  component: AppLayout,
});

function AppLayout() {
  const { hydrated, signedIn } = useSession();
  const privacyMode = usePrivacyMode();
  const navigate = useNavigate();
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    if (hydrated && !signedIn) void navigate({ to: "/", replace: true });
  }, [hydrated, signedIn, navigate]);

  // O bloqueio só existe para quem ligou o modo privacidade em
  // “Gerenciar dados e privacidade”. Desligado, o app nunca esconde a tela.
  useEffect(() => {
    if (!privacyMode) {
      setLocked(false);
      return;
    }
    const lock = () => setLocked(true);
    const onVisibilityChange = () => {
      if (document.hidden) lock();
    };
    const onBlur = () => {
      if (!document.hasFocus()) lock();
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("blur", onBlur);

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("blur", onBlur);
    };
  }, [privacyMode]);

  if (!hydrated || !signedIn) return <div className="min-h-screen bg-background" aria-busy="true" />;

  return (
    <div className="min-h-screen bg-background mobile-bottom-space">
      <div className="simulation-ribbon" role="status" aria-label="Ambiente simulado">AMBIENTE SIMULADO · SEM OPERAÇÕES REAIS</div>
      <div className="mobile-shell app-surface"><Outlet /></div>
      <BottomNav />
      {locked && <PrivacyLock onUnlock={() => setLocked(false)} />}
    </div>
  );
}
