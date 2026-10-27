import {
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type QuickAccessRailProps = {
  /** Título exibido acima da régua. */
  title: string;
  /** Cards (Links) que entram na régua, na ordem desejada. */
  children: ReactNode;
  /** Classes extras do trilho rolável (ex.: sangria -mx-4 px-4). */
  className?: string;
};

/**
 * Régua de acesso rápido: os cards ficam lado a lado e podem ser puxados para a
  * esquerda (arrastando com o dedo ou com o mouse). As setas e a barra de
 * progresso só aparecem quando existe mais conteúdo para os lados.
 */
export function QuickAccessRail({ title, children, className }: QuickAccessRailProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, startX: 0, startScroll: 0, moved: 0 });
  const [rail, setRail] = useState({ atStart: true, atEnd: true, progress: 0 });

  // Public: sync position state from the DOM node.
  const sync = () => {
    const el = railRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setRail({
      atStart: max <= 4 || el.scrollLeft <= 4,
      atEnd: max <= 4 || el.scrollLeft >= max - 4,
      progress: max <= 4 ? 1 : Math.min(1, Math.max(0, el.scrollLeft / max)),
    });
  };

  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    sync();
    el.addEventListener("scroll", sync, { passive: true });
    const observer = new ResizeObserver(sync);
    observer.observe(el);
    return () => {
      el.removeEventListener("scroll", sync);
      observer.disconnect();
    };
  }, []);

  const nudge = (direction: -1 | 1) => {
    railRef.current?.scrollBy({ left: direction * 148, behavior: "smooth" });
  };

  // Mouse/pen drag: touch keeps the browser's native swipe.
  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch") return;
    const el = railRef.current;
    if (!el) return;
    drag.current = { active: true, startX: event.clientX, startScroll: el.scrollLeft, moved: 0 };
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const current = drag.current;
    const el = railRef.current;
    if (!current.active || !el) return;
    const delta = event.clientX - current.startX;
    current.moved = Math.max(current.moved, Math.abs(delta));
    el.scrollLeft = current.startScroll - delta;
  };

  const onPointerEnd = () => {
    drag.current.active = false;
  };

  // After a real drag, don't let the release open the card underneath.
  const onClickCapture = (event: MouseEvent<HTMLDivElement>) => {
    if (drag.current.moved > 8) {
      event.preventDefault();
      event.stopPropagation();
      drag.current.moved = 0;
    }
  };

  return (
    <section className="mt-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[19px] font-bold">{title}</h2>
        {!rail.atStart || !rail.atEnd ? (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => nudge(-1)}
              disabled={rail.atStart}
              aria-label={`Puxar ${title} para a direita`}
              className="rounded-full border border-border bg-card p-1.5 text-foreground shadow-sm transition-opacity disabled:opacity-35"
            >
              <ChevronLeft className="size-4" strokeWidth={2.2} />
            </button>
            <button
              type="button"
              onClick={() => nudge(1)}
              disabled={rail.atEnd}
              aria-label={`Puxar ${title} para a esquerda`}
              className="rounded-full border border-border bg-card p-1.5 text-foreground shadow-sm transition-opacity disabled:opacity-35"
            >
              <ChevronRight className="size-4" strokeWidth={2.2} />
            </button>
          </div>
        ) : null}
      </div>

      <div className="relative mt-3">
        <div
          ref={railRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerEnd}
          onPointerCancel={onPointerEnd}
          onPointerLeave={onPointerEnd}
          onClickCapture={onClickCapture}
          className={cn(
            "flex cursor-grab snap-x snap-proximity gap-3 overflow-x-auto overscroll-x-contain pb-3 [scrollbar-width:none] active:cursor-grabbing [&::-webkit-scrollbar]:hidden",
            className,
          )}
        >
          {children}
        </div>
        {!rail.atEnd ? (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-background to-transparent"
          />
        ) : null}
      </div>

      <div
        aria-hidden
        className="mt-1 h-1 w-full overflow-hidden rounded-full bg-muted"
      >
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-200"
          style={{ width: `${Math.round(24 + rail.progress * 76)}%` }}
        />
      </div>
    </section>
  );
}
