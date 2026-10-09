import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { UsersRound } from "lucide-react";
import { SubHeader } from "@/components/app/SubHeader";
import { useBank } from "@/lib/bank";

export const Route=createFileRoute("/app/favorecidos")({component:Favorecidos});
function Favorecidos(){const navigate=useNavigate();const{beneficiaries}=useBank();return <><SubHeader title="Meus favorecidos" compactActions/><main className="bg-[#f4f5f7] px-3 pb-8 pt-4"><section className="rounded-xl border border-[#dedfe3] bg-white p-4 shadow-sm"><div className="flex items-center justify-between"><div className="flex items-center gap-3"><UsersRound className="size-6 text-[#0057b8]"/><h1 className="font-bold">Meus favorecidos</h1></div><span className="text-xs font-semibold text-[#0057b8]">{beneficiaries.length} cadastrados</span></div><ul className="mt-3 divide-y divide-border">{beneficiaries.map(b=><li key={b.id}><button type="button" onClick={()=>void navigate({to:"/app/transferencias"})} className="w-full py-4 text-left"><span className="block text-sm font-semibold">{b.name}</span><span className="mt-1 block text-xs text-muted-foreground">{b.bank}</span></button></li>)}</ul></section><p className="mt-5 text-center text-[11px] font-medium text-muted-foreground">AMBIENTE SIMULADO · SEM OPERAÇÕES BANCÁRIAS REAIS</p></main></>}
