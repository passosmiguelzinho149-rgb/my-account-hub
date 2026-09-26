import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { BottomNav } from "@/components/app/BottomNav";
import { useSession } from "@/lib/session";

export const Route = createFileRoute("/app")({
  component: AppLayout,
});

function AppLayout() {
  const { hydrated, signedIn } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (hydrated && !signedIn) void navigate({ to: "/", replace: true });
  }, [hydrated, signedIn, navigate]);

  if (!hydrated || !signedIn) {
    return <div className="min-h-screen bg-background" aria-busy="true" />;
  }

  return (
    <div className="min-h-screen bg-background mobile-bottom-space">
      <div className="mobile-shell">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  );
}
