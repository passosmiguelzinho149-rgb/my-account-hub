import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronDown, ChevronRight, FileText, HelpCircle } from "lucide-react";
import { SubHeader } from "@/components/app/SubHeader";
import { formatBRL } from "@/lib/mock-data";
import { useBalance } from "@/lib/bank";
import { useSession } from "@/lib/session";

export const Route = createFileRoute("/app/saldo")({ component: SaldoScreen });
const PIX_VALUE = 132_500;

function SaldoScreen() {
  const { balanceHidden } = useSession();
  const balance = useBalance() - PIX_VALUE;
  const value = balanceHidden ? "R$ ••••••••" : formatBRL(balance);
  return <div className="min-h-full bg-[#f5f5f6]">
    <SubHeader title="Detalhes do saldo" compactActions />
    <main className="mx-auto w-full max-w-[430px] px-4 pb-12 pt-5">
      <div className="mb-5 flex justify-end"><HelpCircle className="size-7 text-[#315ed0]" /></div>
      <Link to="/app/extrato" className="flex items-center justify-between rounded-xl bg-white px-5 py-5 shadow-card"><span className="flex items-center gap-3 text-[17px] font-bold"><FileText className="size-6 text-[#566cc2]"/>Consultar extrato</span><ChevronRight className="size-6 text-[#315ed0]"/></Link>
      <section className="mt-7 rounded-xl bg-white p-5 shadow-card"><h2 className="text-[21px] font-bold">Total de recursos</h2><p className="mt-2 text-[16px] leading-snug">É a soma de todos os saldos e investimentos da conta.</p><p className="mt-6 text-[25px] font-medium tabular-nums">{value}</p></section>
      <section className="mt-4 overflow-hidden rounded-xl bg-white shadow-card"><div className="flex items-center justify-between px-5 py-5"><h2 className="text-[22px] font-medium">Saldo disponível</h2><ChevronDown className="size-7 text-[#315ed0]"/></div><div className="mx-5 border-t border-[#dedfe3]"/><div className="flex items-center justify-between px-5 py-5"><span className="text-[17px]">Total disponível</span><strong className="text-[18px] font-medium tabular-nums">{value}</strong></div></section>
      <section className="mt-4 overflow-hidden rounded-xl bg-white shadow-card"><div className="flex items-center justify-between px-5 py-5"><h2 className="text-[22px] font-medium">Saldo bloqueado</h2><ChevronDown className="size-7 text-[#315ed0]"/></div><div className="mx-5 border-t border-[#dedfe3]"/><div className="flex items-center justify-between px-5 py-5"><span className="text-[17px]">Total bloqueado</span><strong className="text-[18px] font-medium">R$ 0,00</strong></div></section>
      <section className="mt-4 rounded-xl bg-white p-5 shadow-card"><h2 className="text-[22px] font-medium">Investimento sem baixa automática</h2><div className="mt-5 border-t border-[#dedfe3] pt-5 flex items-center justify-between"><span className="text-[17px]">Total disponível</span><strong className="text-[18px] font-medium">R$ 0,00</strong></div></section>
      <section className="mt-4 rounded-xl bg-white p-5 shadow-card"><h2 className="text-[22px] font-medium">Investimento com carência</h2><div className="mt-5 border-t border-[#dedfe3] pt-5 flex items-center justify-between"><span className="text-[17px]">Total disponível</span><strong className="text-[18px] font-medium">R$ 0,00</strong></div></section>
    </main>
  </div>;
}
