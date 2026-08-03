import { ArrowLeft, CircleHelp, Bell, MoreVertical } from "lucide-react";
import { useRouter } from "@tanstack/react-router";

interface SubHeaderProps {
  title: string;
  /** Rota usada quando não há histórico anterior (ex.: link direto). */
  fallbackTo?: string;
  variant?: "gradient" | "deep";
  compactActions?: boolean;
  children?: React.ReactNode;
}

/** Cabeçalho das telas filhas, com seta de voltar para a tela anterior. */
export function SubHeader({
  title,
  fallbackTo = "/app",
  variant = "gradient",
  compactActions = false,
  children,
}: SubHeaderProps) {
  const router = useRouter();

  const goBack = () => {
    if (router.history.canGoBack()) {
      router.history.back();
      return;
    }
    void router.navigate({ to: fallbackTo });
  };

  return (
    <header
      className={
        variant === "gradient"
          ? "bg-brand-gradient text-primary-foreground"
          : "bg-primary-deep text-primary-foreground"
      }
    >
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={goBack}
            aria-label="Voltar"
            className="shrink-0 rounded-full p-1 transition-colors hover:bg-primary-foreground/15 focus-visible:ring-2 focus-visible:ring-primary-foreground/70 focus-visible:outline-none"
          >
            <ArrowLeft className="size-6" aria-hidden />
          </button>
          <h1 className="truncate text-lg font-semibold">{title}</h1>
        </div>
        {!compactActions && (
          <div className="flex shrink-0 items-center gap-3">
            <CircleHelp className="size-5" aria-hidden />
            <span className="relative">
              <Bell className="size-5" aria-hidden />
              <span className="absolute -top-1.5 -right-1.5 grid size-4 place-items-center rounded-full bg-brand-red text-[10px] font-bold">
                3
              </span>
            </span>
            <MoreVertical className="size-5" aria-hidden />
          </div>
        )}
      </div>
      {children}
    </header>
  );
}