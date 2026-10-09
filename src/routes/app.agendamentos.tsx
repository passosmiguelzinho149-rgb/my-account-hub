import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CalendarDays } from "lucide-react";
import { SubHeader } from "@/components/app/SubHeader";
import { formatBRL } from "@/lib/mock-data";
import { useBank } from "@/lib/bank";

export const Route=createFileRoute("/app/agendamentos")({component:Agendamentos});
const amounts:Record<string,number>={"MARIA AUXILIADORA DE OLIVEIRA":5795202,"VIVIANI DE OLIVEIRA SOUZA":4130637,"JOSE RAUGI NETO":1894938,"KATIANE DE OLIVEIRA":4750423,"JOSÉ MARIA GOMES PEIXOTO":4130637};
const holidays=new Set(["2026-12-25"]);
function key(d:Date){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`}
function days(count:number){const out:Date[]=[];const d=new Date(2026,11,1);while(out.length<Math.ceil(count/2)){if(d.getDay()!==0&&d.getDay()!==6&&!holidays.has(key(d)))out.push(new Date(d));d.setDate(d.getDate()+2)}return out}
function Agendamentos(){const navigate=useNavigate();const{beneficiaries}=useBank();const schedule=days(beneficiaries.length);return <><SubHeader title="Agendamentos" compactActions/><main className="bg-[#f4f5f7] px-3 pb-8 pt-4"><section className="rounded-xl border border-[#dedfe3] bg-white p-4 shadow-sm"><div className="flex items-center gap-3"><CalendarDays className="size-6 text-[#0057b8]"/><div><h1 className="font-bold">Agendamentos</h1><p className="text-xs text-muted-foreground">Dezembro · ambiente simulado</p></div></div><ul className="mt-3 divide-y divide-border">{beneficiaries.map((b,i)=>{const d=schedule[Math.floor(i/2)];return <li key={b.id} className="flex items-center justify-between gap-3 py-4"><span className="min-w-0"><span className="block truncate text-sm font-semibold">{b.name}</span><span className="mt-1 block text-xs text-muted-foreground">{d?.toLocaleDateString("pt-BR")} · Pix agendado</span></span><span className="shrink-0 text-right"><span className="block text-sm font-bold tabular-nums">{formatBRL(amounts[b.name]??3000000)}</span><button type="button" onClick={()=>void navigate({to:"/app/transferencias"})} className="mt-1 text-[11px] font-semibold text-[#0057b8]">Ver comprovante</button></span></li>})}</ul></section><p className="mt-5 text-center text-[11px] font-medium text-muted-foreground">AMBIENTE SIMULADO · SEM OPERAÇÕES BANCÁRIAS REAIS</p></main></>}
