import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Lock, Smartphone, Trash2 } from "lucide-react";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { SubHeader } from "@/components/app/SubHeader";
import { formatDateTime } from "@/lib/bank";
import { useSession } from "@/lib/session";
import { changePin, lockAccount, removeDevice, setTwoFactor, useSecurity } from "@/lib/security";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/seguranca")({
  head: () => ({
    meta: [
      { title: "Segurança — Conta Empresas (demo)" },
      { name: "description", content: "Troca de senha, verificação em duas etapas, dispositivos e histórico de acessos." },
      { property: "og:title", content: "Segurança — Conta Empresas (demo)" },
      { property: "og:description", content: "Senha, duas etapas, dispositivos e histórico de acessos." },
    ],
  }),
  component: Seguranca,
});

const field =
  "mt-1.5 w-full rounded-lg border border-border bg-card px-3 py-3 text-base outline-none focus-visible:ring-2 focus-visible:ring-primary";

function Seguranca() {
  const s = useSecurity();
  const { signOut } = useSession();
  const navigate = useNavigate();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [confirmLock, setConfirmLock] = useState(false);

  const save = () => {
    const r = changePin(current, next);
    setMsg(r.ok ? { ok: true, text: "Senha alterada com sucesso." } : { ok: false, text: r.reason });
    if (r.ok) {
      setCurrent("");
      setNext("");
    }
  };

  return (
    <>
      <SubHeader title="Segurança" fallbackTo="/app/perfil" compactActions />
      <main className="space-y-6 px-4 py-5">
        <section className="rounded-xl border border-border bg-card p-4 shadow-card">
          <h2 className="font-semibold">Trocar senha</h2>
          <label className="mt-3 block text-sm font-medium">
            Senha atual
            <input type="password" inputMode="numeric" maxLength={6} value={current} onChange={(e) => setCurrent(e.target.value.replace(/\D/g, ""))} className={field} />
          </label>
          <label className="mt-3 block text-sm font-medium">
            Nova senha (4 a 6 números)
            <input type="password" inputMode="numeric" maxLength={6} value={next} onChange={(e) => setNext(e.target.value.replace(/\D/g, ""))} className={field} />
          </label>
          {msg && <p className={cn("mt-3 text-sm", msg.ok ? "text-income" : "text-brand-red")}>{msg.text}</p>}
          <button type="button" onClick={save} className="mt-4 w-full rounded-full bg-primary py-3 font-semibold text-primary-foreground">
            Salvar nova senha
          </button>
        </section>

        <section className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-card">
          <div className="min-w-0 flex-1">
            <h2 className="font-semibold">Verificação em duas etapas</h2>
            <p className="text-sm text-muted-foreground">Pede um código por SMS simulado a cada acesso.</p>
          </div>
          <Switch checked={s.twoFactor} onCheckedChange={setTwoFactor} aria-label="Verificação em duas etapas" />
        </section>

        <section>
          <h2 className="font-semibold">Dispositivos autorizados</h2>
          <ul className="mt-3 divide-y divide-border rounded-xl border border-border bg-card shadow-card">
            {s.devices.map((d) => (
              <li key={d.id} className="flex items-center gap-3 p-4">
                <Smartphone className="size-5 shrink-0 text-primary" aria-hidden />
                <span className="min-w-0 flex-1">
                  <span className="block font-medium">{d.name}</span>
                  <span className="block text-xs text-muted-foreground">
                    {d.place} · {formatDateTime(d.lastAccess)}
                  </span>
                </span>
                {d.current ? (
                  <span className="text-xs font-medium text-income">Atual</span>
                ) : (
                  <button type="button" onClick={() => removeDevice(d.id)} aria-label={`Remover ${d.name}`} className="rounded-full p-2 text-brand-red hover:bg-secondary">
                    <Trash2 className="size-5" aria-hidden />
                  </button>
                )}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="font-semibold">Histórico de acessos</h2>
          <ul className="mt-3 divide-y divide-border rounded-xl border border-border bg-card shadow-card">
            {s.history.slice(0, 15).map((h) => (
              <li key={h.id} className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 p-4 text-sm">
                <span>
                  <span className="block font-medium">{h.method}</span>
                  <span className="block text-muted-foreground">{formatDateTime(h.at)}</span>
                </span>
                <span className={h.result === "Sucesso" ? "text-income" : "text-brand-red"}>{h.result}</span>
              </li>
            ))}
            {s.history.length === 0 && <li className="p-4 text-sm text-muted-foreground">Nenhum acesso registrado.</li>}
          </ul>
        </section>

        <section className="rounded-xl border border-border bg-card p-4 shadow-card">
          <h2 className="flex items-center gap-2 font-semibold">
            <Lock className="size-5 text-brand-red" aria-hidden /> Bloquear conta
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Encerra a sessão e impede novos acessos até o desbloqueio com código.
          </p>
          {confirmLock ? (
            <div className="mt-4 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  lockAccount();
                  signOut();
                  void navigate({ to: "/", replace: true });
                }}
                className="flex-1 rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground"
              >
                Sim, bloquear
              </button>
              <button type="button" onClick={() => setConfirmLock(false)} className="flex-1 rounded-full border border-border py-3 text-sm">
                Cancelar
              </button>
            </div>
          ) : (
            <button type="button" onClick={() => setConfirmLock(true)} className="mt-4 w-full rounded-full border border-border py-3 font-medium text-brand-red">
              Bloquear conta
            </button>
          )}
        </section>
      </main>
    </>
  );
}
