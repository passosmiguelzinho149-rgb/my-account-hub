import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BottomNav } from "@/components/app/BottomNav";
import { useSession } from "@/lib/session";

export const Route = createFileRoute("/app")({
  component: AppLayout,
});

function AppLayout() {
  const { hydrated, signedIn } = useSession();
  const navigate = useNavigate();
  const [privacyHidden, setPrivacyHidden] = useState(false);

  useEffect(() => {
    if (hydrated && !signedIn) void navigate({ to: "/", replace: true });
  }, [hydrated, signedIn, navigate]);

  useEffect(() => {
    const hideForPrivacy = () => setPrivacyHidden(true);
    const restoreAfterFocus = () => setPrivacyHidden(false);

    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (
        (event.ctrlKey || event.metaKey) &&
        ["c", "x", "s", "p", "u"].includes(key)
      ) {
        event.preventDefault();
      }
      if (event.key === "PrintScreen") {
        setPrivacyHidden(true);
        window.setTimeout(() => setPrivacyHidden(false), 1200);
      }
    };

    const handleContextMenu = (event: MouseEvent) => event.preventDefault();
    const handleDragStart = (event: DragEvent) => event.preventDefault();

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) hideForPrivacy();
      else restoreAfterFocus();
    });
    window.addEventListener("blur", hideForPrivacy);
    window.addEventListener("focus", restoreAfterFocus);
    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("dragstart", handleDragStart);

    return () => {
      window.removeEventListener("blur", hideForPrivacy);
      window.removeEventListener("focus", restoreAfterFocus);
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("dragstart", handleDragStart);
    };
  }, []);

  if (!hydrated || !signedIn) {
    return <div className="min-h-screen bg-background" aria-busy="true" />;
  }

  return (
    <div className="min-h-screen bg-background mobile-bottom-space">
      <div className="mobile-shell">
        <Outlet />
      </div>
      <BottomNav />
      {privacyHidden && (
        <div
          className="privacy-screen fixed inset-0 z-[9999] grid place-items-center bg-[#11131d]"
          aria-hidden="true"
        >
          <div className="text-center text-white/90">
            <div className="mx-auto mb-3 grid size-14 place-items-center rounded-full border border-white/20 bg-white/10 text-2xl">
              🔒
            </div>
            <p className="text-base font-semibold">Tela protegida</p>
            <p className="mt-1 text-xs text-white/60">O conteúdo fica oculto fora da tela.</p>
          </div>
        </div>
      )}
    </div>
  );
}
