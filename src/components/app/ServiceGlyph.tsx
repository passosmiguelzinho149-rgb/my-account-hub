import {
  ArrowLeftRight, Banknote, CalendarDays, CarFront, CreditCard,
  FileChartColumn, FilePenLine, HandCoins, MessageCircle, Receipt,
  ScanLine, Smartphone, TrendingUp, WalletCards,
} from "lucide-react";
import type { ComponentType, ReactNode, SVGProps } from "react";

type GlyphProps = SVGProps<SVGSVGElement> & { size?: number; strokeWidth?: number };

const lucideGlyphs: Record<string, ComponentType<GlyphProps>> = {
  "linhas-de-credito": HandCoins,
  cartoes: CreditCard,
  agendamentos: CalendarDays,
  investimentos: TrendingUp,
  debitos: CarFront,
  transferencias: ArrowLeftRight,
  "notas-fiscais": Receipt,
  "informe-rendimentos": FileChartColumn,
  "debito-automatico": FilePenLine,
  recargas: Smartphone,
  saques: Banknote,
  solucoes: WalletCards,
};

/** Traços finos e azuis, como os pictogramas do menu de serviços da referência. */
export function ServiceGlyph({ slug, className }: { slug: string; className?: string }) {
  const shared = {
    className: `shrink-0 text-icon-ink ${className ?? "size-10"}`,
    "aria-hidden": true as const,
  };
  const Icon = lucideGlyphs[slug];
  if (Icon) return <Icon {...shared} strokeWidth={1.45} />;

  const paths: Record<string, ReactNode> = {
    pix: <><path d="m24 6 7.5 7.5a5 5 0 0 0 7 0l2-2M24 6l-7.5 7.5a5 5 0 0 1-7 0l-2-2M24 42l7.5-7.5a5 5 0 0 1 7 0l2 2M24 42l-7.5-7.5a5 5 0 0 0-7 0l-2 2"/><path d="m6 24 7.5-7.5a5 5 0 0 1 7 0L24 20l3.5-3.5a5 5 0 0 1 7 0L42 24l-7.5 7.5a5 5 0 0 1-7 0L24 28l-3.5 3.5a5 5 0 0 1-7 0Z"/></>,
    saldo: <><path d="M12 5h20l5 5v26l-5 5H12a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3Z"/><path d="M15 15h17M15 21h17M15 27h10M31 33l-5 7 8-4"/></>,
    extrato: <><path d="M9 39V7a3 3 0 0 1 3-3h20l5 5v14M15 14h16M15 20h12"/><circle cx="32" cy="33" r="10"/><path d="M35 29h-4a2 2 0 0 0 0 4h2a2 2 0 0 1 0 4h-4m3-10v2m0 8v2"/></>,
    whatsapp: <><path d="M24 7a16 16 0 0 0-13.8 24.1L8 40l9.1-2.1A16 16 0 1 0 24 7Z"/><path d="M18.1 16.7c.5-1.1 1-1.1 1.5-1.1h1c.3 0 .7.1.9.7l1.4 3.4c.2.5.1.8-.2 1.2l-1.1 1.3c-.3.3-.2.7 0 1 1.2 2.1 3 3.9 5.2 5.1.4.2.7.2 1-.1l1.7-2c.3-.4.7-.5 1.1-.3l3.4 1.6c.5.2.8.4.9.7.1.3.1 1.7-.4 3.1-.5 1.4-2.8 2.7-4 2.8-1 .1-2.3.2-6.8-1.7-5.7-2.4-9.3-8.2-9.6-8.6-.3-.4-2.3-3.1-2.3-5.9 0-2.8 1.4-4.2 2-4.8.5-.6 1.1-.7 1.5-.7"/></>,
    pagamentos: <><path d="M7 14h34v20H7zM12 14v20M17 20v8M21 20v8M25 20v8M30 20v8M34 20v8M38 14v20"/><path d="M4 9v4m0-4h4M44 9v4m0-4h-4M4 39v-4m0 4h4M44 39v-4m0 4h-4"/></>,
    "open-finance": <><circle cx="24" cy="24" r="16" strokeDasharray="5 2"/><path d="M24 8v16H8" fill="currentColor" stroke="none"/></>,
    limites: <><path d="M8 12h32M8 21h32M8 30h32M8 38c6-6 11-8 19-8"/><rect x="18" y="9" width="7" height="6" rx="1" fill="var(--color-card)"/><rect x="29" y="18" width="7" height="6" rx="1" fill="var(--color-card)"/></>,
    comprovantes: <><path d="M10 8h28v27l-4 6-5-3-5 3-5-3-5 3-4-6V8ZM17 15h14M17 21h14M21 31h6"/><path d="M21 26h6"/></>,
    buscador: <><path d="M13 5H8a3 3 0 0 0-3 3v5M35 5h5a3 3 0 0 1 3 3v5M5 35v5a3 3 0 0 0 3 3h5M43 35v5a3 3 0 0 1-3 3h-5M8 24h32"/><path d="M14 19v10M18 19v10M23 19v10M27 19v10M32 19v10M36 19v10"/></>,
    recebiveis: <><path d="M9 15a17 17 0 0 1 29 0l3-5m0 5h-8M39 33a17 17 0 0 1-29 0l-3 5m0-5h8M27 18h-5a3 3 0 0 0 0 6h4a3 3 0 0 1 0 6h-6m4-15v3m0 12v3"/></>,
  };

  if (!paths[slug]) return <ScanLine {...shared} strokeWidth={1.45} />;
  return (
    <svg {...shared} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      {paths[slug]}
    </svg>
  );
}