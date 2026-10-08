import {
  ArrowLeftRight, Banknote, CalendarDays, CarFront, CreditCard,
  FileChartColumn, FilePenLine, HandCoins, Receipt,
  ScanLine, Smartphone, TrendingUp, WalletCards,
} from "lucide-react";
import type { ComponentType, ReactNode, SVGProps } from "react";

type GlyphProps = SVGProps<SVGSVGElement> & { size?: number; strokeWidth?: number };

const lucideGlyphs: Record<string, ComponentType<GlyphProps>> = {
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

export function ServiceGlyph({ slug, className }: { slug: string; className?: string }) {
  const shared = {
    className: `shrink-0 text-icon-ink ${className ?? "size-10"}`,
    "aria-hidden": true as const,
  };
  const Icon = lucideGlyphs[slug];
  if (Icon) return <Icon {...shared} strokeWidth={1.45} />;

  const paths: Record<string, ReactNode> = {
    pix: <><path d="M24 5 34 15 24 25 14 15 24 5Z"/><path d="M9 20 19 30 9 40-1 30 9 20Z" transform="translate(5 0)"/><path d="M39 20 49 30 39 40 29 30 39 20Z" transform="translate(-5 0)"/><path d="M24 25 34 35 24 45 14 35 24 25Z"/></>,
    "linhas-de-credito": <><circle cx="31" cy="12" r="6"/><path d="M10 25v14M10 30h8l6 4 11-5c2-1 4 0 5 2l-13 8H16"/><path d="M17 27c3-3 7-3 10-1l4 3"/></>,
    cartoes: <><rect x="7" y="11" width="34" height="26" rx="4"/><path d="M7 18h34"/></>,
    "open-finance": <><circle cx="24" cy="24" r="16"/><path d="M24 8v16h16"/><path d="M24 24 13 35" opacity=".35"/></>,
    saldo: <><path d="M12 5h20l5 5v26l-5 5H12a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3Z"/><path d="M15 15h17M15 21h17M15 27h10M31 33l-5 7 8-4"/></>,
    extrato: <><path d="M9 39V7a3 3 0 0 1 3-3h20l5 5v14M15 14h16M15 20h12"/><circle cx="32" cy="33" r="10"/><path d="M35 29h-4a2 2 0 0 0 0 4h2a2 2 0 0 1 0 4h-4m3-10v2m0 8v2"/></>,
    whatsapp: <><path d="M24 7a16 16 0 0 0-13.8 24.1L8 40l9.1-2.1A16 16 0 1 0 24 7Z"/><path d="M18.1 16.7c.5-1.1 1-1.1 1.5-1.1h1c.3 0 .7.1.9.7l1.4 3.4c.2.5.1.8-.2 1.2l-1.1 1.3c-.3.3-.2.7 0 1 1.2 2.1 3 3.9 5.2 5.1.4.2.7.2 1-.1l1.7-2c.3-.4.7-.5 1.1-.3l3.4 1.6c.5.2.8.4.9.7.1.3.1 1.7-.4 3.1-.5 1.4-2.8 2.7-4 2.8-1 .1-2.3.2-6.8-1.7-5.7-2.4-9.3-8.2-9.6-8.6-.3-.4-2.3-3.1-2.3-5.9 0-2.8 1.4-4.2 2-4.8.5-.6 1.1-.7 1.5-.7"/></>,
    pagamentos: <><path d="M7 14h34v20H7zM12 14v20M17 20v8M21 20v8M25 20v8M30 20v8M34 20v8M38 14v20"/><path d="M4 9v4m0-4h4M44 9v4m0-4h-4M4 39v-4m0 4h4M44 39v-4m0 4h-4"/></>,
    limites: <><path d="M8 12h32M8 21h32M8 30h32M8 38c6-6 11-8 19-8"/><rect x="18" y="9" width="7" height="6" rx="1" fill="var(--color-card)"/><rect x="29" y="18" width="7" height="6" rx="1" fill="var(--color-card)"/></>,
    comprovantes: <><path d="M10 8h28v27l-4 6-5-3-5 3-5-3-5 3-4-6V8ZM17 15h14M17 21h14M21 31h6"/><path d="M21 26h6"/></>,
    buscador: <><path d="M13 5H8a3 3 0 0 0-3 3v5M35 5h5a3 3 0 0 1 3 3v5M5 35v5a3 3 0 0 0 3 3h5M43 35v5a3 3 0 0 1-3 3h-5M8 24h32"/><path d="M14 19v10M18 19v10M23 19v10M27 19v10M32 19v10M36 19v10"/></>,
    recebiveis: <><path d="M9 15a17 17 0 0 1 29 0l3-5m0 5h-8M39 33a17 17 0 0 1-29 0l-3 5m0-5h8M27 18h-5a3 3 0 0 0 0 6h4a3 3 0 0 1 0 6h-6m4-15v3m0 12v3"/></>,
  };

  if (!paths[slug]) return <ScanLine {...shared} strokeWidth={1.45} />;
  return (
    <svg {...shared} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      {paths[slug]}
    </svg>
  );
}
