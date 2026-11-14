import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ReceiptText } from "lucide-react";
import { SubHeader } from "@/components/app/SubHeader";
import { formatBRL } from "@/lib/mock-data";
import { postTx, useBank } from "@/lib/bank";

export const Route = createFileRoute("/app/agendamentos")({ component: Agendamentos });

const amounts: Record<string, number> = {
  "MARIA AUXILIADORA DE OLIVEIRA": 5795202,
  "VIVIANI DE OLIVEIRA SOUZA": 4130637,
  "JOSE RAUGI NETO": 1894938,
  "KATIANE DE OLIVEIRA": 4750423,
  "JOSÉ MARIA GOMES PEIXOTO": 4130637,
};
const holidays = new Set(["2026-12-25"]);
function key(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function scheduleDays(count: number) {
  const out: Date[] = [];
  const d = new Date(2026, 11, 1);
  while (out.length < count) {
    if (d.getDay() !== 0 && d.getDay() !== 6 && !holidays.has(key(d))) out.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
  return out;
}

function Agendamentos() {
  const navigate = useNavigate();
  const { beneficiaries, transactions } = useBank();
  const scheduledBeneficiaries = beneficiaries.slice(0, 5);
  const dates = scheduleDays(scheduledBeneficiaries.length);
  const total = scheduledBeneficiaries.reduce((sum, b) => sum + (amounts[b.name] ?? 3000000), 0);

  const openReceipt = (name: string, date: Date | undefined) => {
    if (!date) return;
    const amount = amounts[name] ?? 3000000;
    const scheduled = key(date);
    const counterpart = `PARA: ${name}`;
    let tx = transactions.find(t =>
      t.category === "transferencia" &&
      t.status === "Agendado" &&
      t.counterpart === counterpart &&
      t.amount === amount &&
      t.scheduledFor?.startsWith(scheduled)
    );
    if (!tx) {
      tx = postTx({
        category: "transferencia",
        kind: "out",
        title: "PIX AGENDADO",
        counterpart,
        amount,
        channel: "App Empresas",
        status: "Agendado",
        scheduledFor: new Date(`${scheduled}T12:00:00`).toISOString(),
        extraRows: [{ label: "Tipo", value: "Pix agendado" }, { label: "Favorecido", value: name }],
      });
    }
    void navigate({ to: "/app/comprovante/$id", params: { id: tx.id } });
  };

  return (
    <>
      <SubHeader title="Transferências agendadas" variant="deep" compactActions />
      <main className="min-h-[calc(100vh-90px)] bg-[#f5f6f8] px-4 pb-10 pt-6">
        <section className="mx-auto w-full max-w-[430px] overflow-hidden rounded-2xl bg-white shadow-[0_4px_18px_rgba(20,30,80,.08)]">
          <header className="flex items-center justify-between gap-3 border-b border-[#e8e9ed] px-5 py-5">
            <h2 className="text-[19px] font-bold text-[#252936]">Dezembro 2026</h2>
            <span className="shrink-0 rounded-full bg-[#eceef2] px-3 py-1 text-[12px] font-semibold text-[#646b78]">Agendadas</span>
          </header>
          <ul className="divide-y divide-[#eceef1] px-5">
            {scheduledBeneficiaries.map((b, i) => {
              const date = dates[i];
              const dateLabel = date?.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" }) ?? "01/12/2026";
              const amount = amounts[b.name] ?? 3000000;
              return (
                <li key={b.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-3 gap-y-2 py-4">
                  <div className="min-w-0">
                    <p className="text-[13px] font-medium tabular-nums text-[#737987]">{dateLabel}</p>
                    <p className="mt-1 break-words text-[14px] font-semibold leading-snug text-[#292d38]">{b.name}</p>
                    {i === 0 || i === 2 ? (
                      <button type="button" onClick={() => openReceipt(b.name, date)} className="mt-2 inline-flex items-center gap-1 text-[12px] font-semibold text-[#2860c8] hover:underline">
                        <ReceiptText className="size-3.5" /> Ver comprovante
                      </button>
                    ) : null}
                  </div>
                  <p className="pt-5 text-right text-[14px] font-bold tabular-nums text-[#292d38]">{formatBRL(amount)}</p>
                </li>
              );
            })}
          </ul>
          <footer className="flex items-center justify-between gap-3 border-t border-[#e4e6eb] bg-[#fafbfc] px-5 py-5">
            <p className="text-[13px] font-medium text-[#626977]">Total agendado no mês</p>
            <p className="text-[16px] font-extrabold tabular-nums text-[#252936]">{formatBRL(total)}</p>
          </footer>
        </section>
      </main>
    </>
  );
}
