import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CalendarDays, Eye, Landmark, ReceiptText, Repeat2 } from "lucide-react";
import { useMemo, useState } from "react";
import { SubHeader } from "@/components/app/SubHeader";
import { ConfirmPanel, ErrorNote, Field, SelectField } from "@/components/app/OpKit";
import { account, formatBRL } from "@/lib/mock-data";
import { addBeneficiary, formatDay, postTx, useBalance, useBank } from "@/lib/bank";
import { parseAmount } from "@/lib/pix";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/transferencias")({
  head: () => ({ meta: [{ title: "Transferências — Conta Empresas (simulado)" }, { name: "description", content: "Transferências em ambiente de demonstração, sem operações bancárias reais." }] }),
  component: Transferencias,
});

const scheduledAmounts: Record<string, number> = { "MARIA AUXILIADORA DE OLIVEIRA": 5795202, "VIVIANI DE OLIVEIRA SOUZA": 4130637, "JOSE RAUGI NETO": 1894938, "KATIANE DE OLIVEIRA": 4750423, "JOSÉ MARIA GOMES PEIXOTO": 4130637 };
function scheduledAmount(name: string) { return scheduledAmounts[name] ?? 3000000; }
const banks = ["237 — Banco Bradesco S.A.", "001 — Banco do Brasil S.A.", "341 — Itaú Unibanco S.A.", "033 — Banco Santander (Brasil) S.A.", "104 — Caixa Econômica Federal", "260 — Nu Pagamentos S.A."] as const;

function formatDocument(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 14);
  if (digits.length <= 11) return digits.replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  return digits.replace(/(\d{2})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1/$2").replace(/(\d{4})(\d{1,2})$/, "$1-$2");
}

function Transferencias() {
  const navigate = useNavigate();
  const balance = useBalance();
  const { beneficiaries, transactions } = useBank();
  const [name, setName] = useState(""); const [doc, setDoc] = useState(""); const [bank, setBank] = useState<string>(banks[0]); const [branch, setBranch] = useState(""); const [acc, setAcc] = useState(""); const [amount, setAmount] = useState(""); const [date, setDate] = useState(""); const [save, setSave] = useState(false); const [error, setError] = useState<string | null>(null); const [review, setReview] = useState(false); const [showBalance, setShowBalance] = useState(true);
  const schedule = useMemo(() => buildTransferSchedule(beneficiaries.length), [beneficiaries.length]);
  const value = parseAmount(amount); const internal = bank.startsWith("237"); const type = internal ? "Entre contas Bradesco" : "TED para outro banco";

  const openScheduledReceipt = (beneficiary: (typeof beneficiaries)[number], scheduled: Date) => {
    const scheduledDate = `${scheduled.getFullYear()}-${String(scheduled.getMonth()+1).padStart(2,"0")}-${String(scheduled.getDate()).padStart(2,"0")}`; const counterpart=`PARA: ${beneficiary.name}`; const beneficiaryAmount=scheduledAmount(beneficiary.name);
    let tx=transactions.find((item)=>item.category==="transferencia"&&item.status==="Agendado"&&item.counterpart===counterpart&&item.amount===beneficiaryAmount&&item.scheduledFor?.startsWith(scheduledDate));
    if(!tx) tx=postTx({category:"transferencia",kind:"out",title:"TRANSFERÊNCIA AGENDADA",counterpart,amount:beneficiaryAmount,channel:"App Empresas",status:"Agendado",scheduledFor:new Date(`${scheduledDate}T12:00`).toISOString(),extraRows:[{label:"Tipo",value:beneficiary.bank.startsWith("237")?"Entre contas Bradesco":"Transferência para outro banco"},{label:"Favorecido",value:beneficiary.name},{label:"CPF/CNPJ",value:beneficiary.doc},{label:"Instituição",value:beneficiary.bank},{label:"Agência / Conta",value:`${beneficiary.branch} / ${beneficiary.account}`}]});
    void navigate({to:"/app/comprovante/$id",params:{id:tx.id}});
  };

  const check=()=>{ if(date&&!isBusinessDay(new Date(`${date}T12:00:00`))) return setError("Escolha um dia útil. Transferências agendadas não podem cair em finais de semana ou feriados."); if(name.trim().length<3)return setError("Informe o nome do favorecido."); if(doc.replace(/\D/g,"").length<11)return setError("Informe um CPF ou CNPJ válido."); if(!/^\d{4}$/.test(branch))return setError("A agência deve ter 4 números."); if(acc.replace(/\D/g,"").length<4)return setError("Informe a conta com dígito."); if(!Number.isFinite(value)||value<=0)return setError("Informe um valor maior que zero."); if(!date&&value>balance)return setError("Saldo insuficiente."); setError(null);setReview(true); };
  const rows=[{label:"Tipo",value:type},{label:"Favorecido",value:name.trim().toUpperCase()},{label:"CPF/CNPJ",value:doc},{label:"Instituição",value:bank},{label:"Agência / Conta",value:`${branch} / ${acc}`},{label:"Quando",value:date?`Agendado para ${new Date(`${date}T12:00`).toLocaleDateString("pt-BR")}`:"Agora"}];
  const confirm=()=>{if(save)addBeneficiary({name:name.trim().toUpperCase(),doc,bank,branch,account:acc});const tx=postTx({category:"transferencia",kind:"out",title:date?"TRANSFERÊNCIA AGENDADA":internal?"TRANSF. ENTRE CONTAS":"TED ENVIADA",counterpart:`PARA: ${name.trim().toUpperCase()}`,amount:value,channel:"App Empresas",status:date?"Agendado":"Concluído",...(date?{scheduledFor:new Date(`${date}T12:00`).toISOString()}:{}),extraRows:rows,notify:{kind:"transferencia",title:date?"Transferência agendada":"Transferência enviada",body:`${formatBRL(value)} para ${name.trim().toUpperCase()}.`}});void navigate({to:"/app/comprovante/$id",params:{id:tx.id},replace:true});};

  if(review)return <><SubHeader title="Revisar transferência" compactActions/><ConfirmPanel verb="transferência" amount={value} rows={rows} onConfirm={confirm} onBack={()=>setReview(false)}/></>;

  return <><SubHeader title="Transferências" variant="deep" compactActions/><main className="bg-[#f7f7f8] px-4 py-5">
    <div className="mb-4 text-xs text-muted-foreground"><span>Início</span><span className="mx-1.5">›</span><strong className="text-foreground">Transferências</strong></div>
    <section className="rounded-xl border border-border/70 bg-white p-4 shadow-sm"><p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Conta de origem · ambiente simulado</p><p className="mt-2 text-sm font-semibold">{account.company}</p><p className="mt-1 text-xs text-muted-foreground">CNPJ {account.cnpj}</p><div className="mt-3 rounded-lg bg-[#f5f5f6] px-3 py-2 text-sm font-medium">Conta Corrente {account.number} · Agência {account.branch}</div><div className="mt-4 flex items-end justify-between gap-3 border-t border-border pt-4"><div><p className="text-xs text-muted-foreground">Saldo disponível</p><p className="mt-1 text-[26px] font-bold tabular-nums">{showBalance?formatBRL(balance):"R$ ••••••••"}</p></div><button type="button" onClick={()=>setShowBalance(v=>!v)} className="grid size-10 place-items-center rounded-full bg-secondary text-primary" aria-label="Mostrar ou ocultar saldo"><Eye className="size-5"/></button></div></section>

    <section className="mt-6"><h2 className="text-lg font-bold">O que você deseja fazer?</h2><div className="mt-3 grid grid-cols-2 gap-3">{[
      {label:"Entre contas",icon:Repeat2,selected:internal,action:()=>setBank(banks[0])},{label:"Outro banco",icon:Landmark,selected:!internal,action:()=>setBank(banks[1])},{label:"Agendar",icon:CalendarDays,selected:Boolean(date),action:()=>document.getElementById("transfer-date")?.scrollIntoView({behavior:"smooth",block:"center"})},{label:"Agendamentos",icon:ReceiptText,selected:false,action:()=>document.getElementById("scheduled-transfers")?.scrollIntoView({behavior:"smooth"})}
    ].map(item=><button key={item.label} type="button" onClick={item.action} className={cn("flex min-h-24 flex-col items-start justify-between rounded-xl border bg-white p-4 text-left shadow-sm",item.selected?"border-[#cc092f] bg-[#fff7f8]":"border-border")}><item.icon className={cn("size-6",item.selected?"text-[#cc092f]":"text-[#34394c]")}/><span className="text-sm font-semibold">{item.label}</span></button>)}</div></section>

    <section className="mt-7 rounded-xl border border-border bg-white p-4 shadow-sm"><h2 className="text-lg font-bold">Nova transferência</h2><p className="mt-1 text-xs text-muted-foreground">Preencha os dados do favorecido para continuar.</p>
      <div className="mt-4"><Field label="Nome do favorecido" value={name} onChange={e=>setName(e.target.value)} placeholder="Digite o nome completo"/><Field label="CPF ou CNPJ" value={doc} onChange={e=>setDoc(formatDocument(e.target.value))} inputMode="numeric" placeholder="000.000.000-00"/><SelectField label="Banco" options={banks} value={bank} onChange={e=>setBank(e.target.value)}/><div className="grid grid-cols-2 gap-3"><Field label="Agência" value={branch} maxLength={4} onChange={e=>setBranch(e.target.value.replace(/\D/g,""))} inputMode="numeric" placeholder="0000"/><Field label="Conta com dígito" value={acc} onChange={e=>setAcc(e.target.value)} placeholder="00000-0"/></div><Field label="Valor (R$)" value={amount} onChange={e=>setAmount(e.target.value)} inputMode="decimal" placeholder="0,00"/><div id="transfer-date"><Field label="Agendar para (opcional)" type="date" value={date} onChange={e=>setDate(e.target.value)}/></div><label className="mt-4 flex items-center gap-2 text-sm"><input type="checkbox" checked={save} onChange={e=>setSave(e.target.checked)} className="size-4 accent-[#cc092f]"/>Salvar como favorecido</label>{error&&<ErrorNote>{error}</ErrorNote>}<button type="button" onClick={check} className="mt-5 w-full rounded-lg bg-[#cc092f] px-4 py-3.5 font-bold text-white shadow-sm active:scale-[.99]">Continuar</button></div>
    </section>
    <DecemberTransferSchedule beneficiaries={beneficiaries} schedule={schedule} onSelect={(b,scheduled)=>openScheduledReceipt(b,scheduled)}/><div id="scheduled-transfers"><ScheduledList category="transferencia"/></div><p className="mt-7 rounded-lg border border-dashed border-border bg-white p-3 text-center text-[11px] text-muted-foreground">Conta Empresas · ambiente de simulação. Nenhuma transferência bancária real é executada.</p>
  </main></>;
}

export function ScheduledList({category}:{category:"transferencia"|"pagamento"}){const navigate=useNavigate();const{transactions}=useBank();const list=transactions.filter(t=>t.category===category&&(t.status==="Agendado"||t.status==="Cancelado"));if(!list.length)return null;return <section className="mt-8"><div className="flex items-end justify-between"><div><h2 className="font-bold">Agendamentos</h2><p className="mt-1 text-xs text-muted-foreground">Próximas movimentações</p></div><span className="text-xs font-semibold text-primary">Todos</span></div><ul className="mt-3 divide-y divide-border rounded-xl border border-border bg-white shadow-sm">{list.map(t=><li key={t.id}><button type="button" onClick={()=>void navigate({to:"/app/comprovante/$id",params:{id:t.id}})} className="grid w-full grid-cols-[minmax(0,1fr)_auto] gap-3 p-4 text-left"><span className="min-w-0"><span className="block truncate text-sm font-semibold">{t.counterpart}</span><span className="mt-1 block text-xs text-muted-foreground">{t.scheduledFor?formatDay(t.scheduledFor):""}</span><span className={cn("mt-2 inline-block rounded-full px-2 py-1 text-[10px] font-bold",t.status==="Cancelado"?"bg-muted text-muted-foreground":"bg-amber-50 text-amber-700")}>{t.status}</span></span><span className="text-right"><span className={cn("block text-sm font-semibold tabular-nums",t.status==="Cancelado"&&"line-through opacity-60")}>{formatBRL(t.amount)}</span><span className="mt-2 block text-[11px] font-semibold text-primary">Ver comprovante</span></span></button></li>)}</ul></section>}

const nationalHolidays2026=new Set(["2026-01-01","2026-04-21","2026-05-01","2026-09-07","2026-10-12","2026-11-02","2026-11-15","2026-11-20","2026-12-25"]);
function dateKey(date:Date){return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`}
function isBusinessDay(date:Date){const weekday=date.getDay();return weekday!==0&&weekday!==6&&!nationalHolidays2026.has(dateKey(date))}
function buildTransferSchedule(count:number){const businessDays:Date[]=[];const cursor=new Date(2026,11,1);while(businessDays.length<Math.ceil(count/2)*2){if(isBusinessDay(cursor))businessDays.push(new Date(cursor));cursor.setDate(cursor.getDate()+1)}return businessDays}
function DecemberTransferSchedule({beneficiaries,schedule,onSelect}:{beneficiaries:ReturnType<typeof useBank>["beneficiaries"];schedule:Date[];onSelect:(beneficiary:ReturnType<typeof useBank>["beneficiaries"][number],scheduledDate:Date)=>void}){return <section className="mt-8"><h2 className="font-bold">Agendamento de transferência</h2><ul className="mt-3 divide-y divide-border rounded-xl border border-border bg-white shadow-sm">{beneficiaries.map((b,index)=>{const group=Math.floor(index/2);const scheduled=schedule[group*2];if(!scheduled)return null;return <li key={b.id}><button type="button" onClick={()=>onSelect(b,scheduled)} className="flex w-full items-center justify-between gap-3 p-4 text-left"><span className="min-w-0"><span className="block truncate text-sm font-semibold">{b.name}</span><span className="block text-xs text-muted-foreground">{scheduled.toLocaleDateString("pt-BR")} · Agendado</span></span><span className="shrink-0 text-right text-sm font-semibold tabular-nums">{formatBRL(scheduledAmount(b.name))}<span className="mt-1 block text-[11px] font-medium text-primary">Ver comprovante</span></span></button></li>})}</ul></section>}
